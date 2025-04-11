<?php

namespace App\Traits;
trait ResponseTrait
{
    public function successResponse($data, $code = 200)
    {
        return response()->json([
            "success" => true,
            "data" => $data
        ], $code);
    }

    public function errorResponse($error, $code)
    {
        return response()->json([
            "success" => false,
            "error" => $error
        ], $code);
    }
}
