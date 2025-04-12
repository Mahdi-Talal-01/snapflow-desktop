<?php

namespace App\Observers;

use App\Models\User;
use App\Models\UserLog;

class UserObserver
{
    public function created(User $user)
    {
        $log = new UserLog();
        $log->user_id = $user->id;
        $log->ip_address = request()->ip_address;
        $log->longitude = request()->longitude;
        $log->latitude = request()->latitude;
        $log->save();
    }
}
