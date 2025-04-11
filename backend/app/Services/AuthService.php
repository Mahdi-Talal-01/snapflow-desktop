<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    /**
     * Create a new class instance.
     */
    public function __construct() {}

    public function register(Request $request)
    {
        $user = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'image_url' => $request->image_url
        ]);

        $user->save();

        $credentials = $request->only('email', 'password');
        $token = Auth::attempt($credentials);
        if ($token) {
            $user = Auth::user();
            $user->token = $token;
            return $user;
        }
        return null;
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        $token = Auth::attempt($credentials);
        if ($token) {
            $user = Auth::user();
            $user->token = $token;
            return $user;
        }
        return null;
    }
}
