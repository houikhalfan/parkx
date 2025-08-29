<?php

namespace App\Http\Controllers;

use App\Models\MaterialRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QrVerifyController extends Controller
{
    public function material(string $token, Request $request)
    {
        $req = MaterialRequest::with(['site:id,name','contractor:id,name'])
            ->where('qr_token', $token)
            ->first();

        $conforme = $req && $req->status === 'accepted';

        return Inertia::render('Public/QrResult', [
            'conforme'   => $conforme,
            'site'       => $req?->site?->name,
            'contractor' => $req?->contractor?->name,
            'decided_at' => optional($req?->decided_at)->toDateTimeString(),
            'at'         => now()->toDateTimeString(),
            // if the URL has ?print=1 we auto-open the print dialog
            'autoPrint'  => (bool) $request->boolean('print'),
        ]);
    }
}
