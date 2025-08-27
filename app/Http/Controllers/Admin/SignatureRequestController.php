<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ApproveSignatureRequest;
use App\Http\Requests\Admin\RejectSignatureRequest;
use App\Models\SignatureRequest;
use App\Models\SignatureRequestComment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SignatureRequestController extends Controller
{
    /** ----------------------------------------------------------------
     * LIST (used by Admin/Signatures/Index.jsx)
     * --------------------------------------------------------------- */
    public function index(Request $request)
    {
        $q = trim((string) $request->get('q', ''));

        $items = SignatureRequest::with(['contractor:id,name,email'])
            ->when($q !== '', function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                      ->orWhereHas('contractor', function ($q2) use ($q) {
                          $q2->where('name', 'like', "%{$q}%")
                             ->orWhere('email', 'like', "%{$q}%");
                      });
            })
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Signatures/Index', [
            'items' => $items,
            'q'     => $q,
        ]);
    }

    /** ----------------------------------------------------------------
     * SHOW (used by Admin/Signatures/Show.jsx)
     * Also returns employees list for assignment and (optionally) events
     * --------------------------------------------------------------- */
    public function show($id)
    {
        $req = SignatureRequest::with([
            'contractor:id,name,email',
            'requestComments' => function ($q) {
                $q->with('author')->orderBy('created_at');
            },
        ])->findOrFail($id);

        // Employees list (ParkX users) to assign to
        $users = User::query()->select('id', 'name', 'email')->orderBy('name')->get();

        // Optional: history (only if the table exists)
        $events = [];
        if (Schema::hasTable('signature_events')) {
            $events = DB::table('signature_events')
                ->where('signature_request_id', $req->id)
                ->orderBy('created_at')
                ->get();
        }
$events = \DB::table('signature_events')
    ->where('signature_request_id', $req->id)
    ->orderBy('created_at', 'desc')
    ->get();

        return Inertia::render('Admin/Signatures/Show', [
            'req'         => $req,
            'users'       => $users,
            'events'      => $events,
            'csrf_token'  => csrf_token(),
        ]);
    }

    /** ----------------------------------------------------------------
     * DOWNLOAD ORIGINAL
     * 404 if original was already deleted after signing
     * --------------------------------------------------------------- */
    public function downloadOriginal($id)
    {
        $req = SignatureRequest::findOrFail($id);
        abort_unless($req->original_path, 404);

        return Storage::disk('public')->download($req->original_path);
    }

    /** ----------------------------------------------------------------
     * APPROVE (Admin uploads the signed PDF)
     * Replaces original with signed, deletes original file.
     * --------------------------------------------------------------- */
    public function approve(ApproveSignatureRequest $request, $id)
    {
        $req = SignatureRequest::findOrFail($id);

        DB::transaction(function () use ($request, $req) {
            // Remove previous signed file if any
            if ($req->signed_path && Storage::disk('public')->exists($req->signed_path)) {
                Storage::disk('public')->delete($req->signed_path);
            }

            // Store new signed PDF
            $path = $request->file('signed_file')->store('signatures/signed', 'public');

            // Replace original -> signed
            $this->replaceOriginalWithSigned($req, $path, 'Admin', session('admin_id'));

            // Optional admin comment
            if ($request->filled('comment')) {
                SignatureRequestComment::create([
                    'signature_request_id' => $req->id,
                    'author_type'          => \App\Models\Admin::class,
                    'author_id'            => session('admin_id'),
                    'body'                 => (string) $request->string('comment'),
                ]);
            }
        });

        return back()->with('success', 'Document signé et original supprimé. Le contractant peut télécharger la version signée.');
    }

    /** ----------------------------------------------------------------
     * REJECT
     * --------------------------------------------------------------- */
    public function reject(RejectSignatureRequest $request, $id)
    {
        $req = SignatureRequest::findOrFail($id);

        DB::transaction(function () use ($request, $req) {
            $req->status      = 'rejected';
            $req->rejected_at = now();
            $req->admin_id    = session('admin_id');
            $req->save();

            $this->logEvent($req->id, 'rejected', 'Admin', session('admin_id'));

            SignatureRequestComment::create([
                'signature_request_id' => $req->id,
                'author_type'          => \App\Models\Admin::class,
                'author_id'            => session('admin_id'),
                'body'                 => (string) $request->string('reason'),
            ]);
        });

        return back()->with('success', 'Demande rejetée et motif enregistré.');
    }

    /** ----------------------------------------------------------------
     * ASSIGN to employee (pure in-app, no email)
     * route: admin.signatures.assign
     * --------------------------------------------------------------- */
    public function assign(Request $request, int $id)
    {
        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $req = SignatureRequest::findOrFail($id);

        $req->assigned_user_id = $data['user_id'];
        $req->status = 'assigned';
        $req->save();

        $this->logEvent($req->id, 'assigned', 'Admin', session('admin_id'), [
            'to_user_id' => $data['user_id'],
        ]);

        return back()->with('success', 'Demande assignée à l’employé.');
    }

    /** ----------------------------------------------------------------
     * ADMIN signs now (form + submit)
     * routes: admin.signatures.sign.form / admin.signatures.sign.submit
     * --------------------------------------------------------------- */
    public function signForm(int $id)
    {
        $req = SignatureRequest::findOrFail($id);
        return Inertia::render('Sign/AdminSign', ['req' => $req]);
    }

    public function signSubmit(ApproveSignatureRequest $request, int $id)
    {
        $req = SignatureRequest::findOrFail($id);

        DB::transaction(function () use ($request, $req) {
            // Remove previous signed file if any
            if ($req->signed_path && Storage::disk('public')->exists($req->signed_path)) {
                Storage::disk('public')->delete($req->signed_path);
            }

            // Store new signed PDF
            $path = $request->file('signed_file')->store('signatures/signed', 'public');

            // Replace original -> signed
            $this->replaceOriginalWithSigned($req, $path, 'Admin', session('admin_id'));
        });

        return redirect()->route('admin.signatures.show', $req->id)
            ->with('success', 'Document signé et original supprimé.');
    }

    /** ----------------------------------------------------------------
     * Helper: replace original file with signed one
     *  - deletes original file from storage
     *  - clears original_path & sets deleted_original_at
     *  - sets signed_path/signed_at/status
     *  - logs history
     * --------------------------------------------------------------- */
    public function replaceOriginalWithSigned(SignatureRequest $req, string $signedPath, string $actorType, $actorId): void
    {
        // delete original from storage (if present)
        if ($req->original_path && Storage::disk('public')->exists($req->original_path)) {
            Storage::disk('public')->delete($req->original_path);
        }

        // also delete previous signed file (avoid orphan files)
        if ($req->signed_path && $req->signed_path !== $signedPath && Storage::disk('public')->exists($req->signed_path)) {
            Storage::disk('public')->delete($req->signed_path);
        }

        // update DB
        $req->update([
            'signed_path'        => $signedPath,
            'signed_at'          => now(),
            'status'             => 'signed',
            'original_path'      => null,
            'deleted_original_at'=> now(),
            'assigned_user_id'   => null,
            'admin_id'           => session('admin_id'),
        ]);

        $this->logEvent($req->id, 'replaced_original', $actorType, $actorId, [
            'signed_path' => $signedPath,
        ]);
        $this->logEvent($req->id, 'signed', $actorType, $actorId);
    }

    /** ----------------------------------------------------------------
     * Helper: write an event if signature_events table exists
     * --------------------------------------------------------------- */
    private function logEvent(int $reqId, string $event, ?string $actorType = null, $actorId = null, array $meta = null): void
    {
        if (!Schema::hasTable('signature_events')) {
            return;
        }
        DB::table('signature_events')->insert([
            'signature_request_id' => $reqId,
            'event'      => $event,
            'actor_type' => $actorType,
            'actor_id'   => $actorId,
            'meta'       => $meta ? json_encode($meta) : null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
