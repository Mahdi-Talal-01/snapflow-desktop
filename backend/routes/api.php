<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::group(["prefix" => "v0.1"], function () {
    // Auth Routes
    Route::post("login", [AuthController::class, "login"]);
    Route::post("register", [AuthController::class, "register"]);

    Route::group([ "middleware" => "auth:api"], function () {
        // Route::post("profile", [UserController::class, "updateProfile"]);
    });
});
