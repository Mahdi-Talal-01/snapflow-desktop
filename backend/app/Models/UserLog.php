<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserLog extends Model
{
    protected $table = 'users_logs';

    protected $fillable = [
        'user_id',
        'ip_address',
        'longitude',
        'latitude'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
