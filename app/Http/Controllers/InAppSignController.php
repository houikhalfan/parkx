<?php
namespace App\Http\Controllers;

use App\Models\SignatureRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InAppSignController extends Controller
{
  public function inbox(Request $r) {
    $items = SignatureRequest::where('assigned_user_id', $r->user()->id)
              ->whereIn('status', ['assigned'])
              ->orderByDesc('created_at')->get(['id','title','created_at']);
    return Inertia::render('Sign/Inbox', ['items'=>$items]);
  }

  public function signForm(Request $r, int $id) {
    $req = SignatureRequest::findOrFail($id);
    abort_unless($req->assigned_user_id === $r->user()->id, 403);
    return Inertia::render('Sign/EmployeeSign', ['req'=>$req]);
  }

  public function signSubmit(Request $r, int $id) {
    $r->validate(['signed_pdf' => 'required|file|mimes:pdf|max:20480']);
    $req = SignatureRequest::findOrFail($id);
    abort_unless($req->assigned_user_id === $r->user()->id, 403);

    $signed = $r->file('signed_pdf')->store('signature/signed', 'public');

    // reuse admin helper
    app(\App\Http\Controllers\Admin\SignatureRequestController::class)
      ->replaceOriginalWithSigned($req, $signed, 'User', $r->user()->id);

    return redirect()->route('sign.inbox')->with('ok','Document signé et original supprimé.');
  }
}
