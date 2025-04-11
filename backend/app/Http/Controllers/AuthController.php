<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;


class AuthController extends Controller
{

    public function register(RegisterRequest $request)
    {
        $authService = new AuthService();

        $user = $authService->register($request);
        if ($user) {
            return $this->successResponse($user, 201);
        }

        return $this->errorResponse("Invalid request", 400);
    }

    public function login(LoginRequest $request)
    {
        $authService = new AuthService();

        $user = $authService->login($request);
        if ($user) {
            return $this->successResponse($user, 200);
        }

        return $this->errorResponse("Invalid request", 400);
    }
}
