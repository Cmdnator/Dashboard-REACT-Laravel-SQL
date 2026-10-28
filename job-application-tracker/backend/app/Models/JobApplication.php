<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $fillable = [
    'company',
    'position',
    'status',
    'applied_at',
    'notes',
];

public function user()
{
    return $this->belongsTo(User::class);
}
}
