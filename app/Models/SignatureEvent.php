<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SignatureEvent extends Model {
  protected $fillable = ['signature_request_id','event','actor_type','actor_id','meta'];
  protected $casts = ['meta' => 'array'];
}
