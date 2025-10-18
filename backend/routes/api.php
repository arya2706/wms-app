<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Middleware\RoleMiddleware;

// Route::prefix('v1')->group(function () {
//     Route::post('/login', [AuthController::class, 'login']);

//     Route::middleware('auth:api')->group(function () {
//         Route::get('/user', [AuthController::class, 'me']);
//         Route::post('/logout', [AuthController::class, 'logout']);

//         Route::middleware('role:admin')->group(function () {
//             Route::get('/products', [ProductController::class, 'index']);
//             Route::post('/products', [ProductController::class, 'store']);
//             Route::get('/products/{id}', [ProductController::class, 'show']);
//             Route::put('/products/{id}', [ProductController::class, 'update']);
//             Route::delete('/products/{id}', [ProductController::class, 'destroy']);
//         });

//         Route::middleware('role:staff')->group(function () {
//             Route::post('/products/{id}/transact', [ProductController::class, 'transact']);
//             Route::post('transactions', [TransactionController::class, 'store']);
//             Route::get('transactions', [TransactionController::class, 'index']);
//         });
//     });

// });

Route::prefix('v1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:api')->group(function () {
        Route::get('/user', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Manual middleware registration untuk testing
        Route::get('/products', [ProductController::class, 'index'])->middleware(RoleMiddleware::class . ':admin');
        Route::post('/products', [ProductController::class, 'store'])->middleware(RoleMiddleware::class . ':admin');
        Route::get('/products/{id}', [ProductController::class, 'show'])->middleware(RoleMiddleware::class . ':admin');
        Route::put('/products/{id}', [ProductController::class, 'update'])->middleware(RoleMiddleware::class . ':admin');
        Route::delete('/products/{id}', [ProductController::class, 'destroy'])->middleware(RoleMiddleware::class . ':admin');
        // Route::post('transactions', [TransactionController::class, 'store'])->middleware(RoleMiddleware::class . ':admin');
        // Route::get('transactions', [TransactionController::class, 'index'])->middleware(RoleMiddleware::class . ':admin');

        // Staff routes
        Route::post('/products/{id}/transact', [ProductController::class, 'transact'])->middleware(RoleMiddleware::class . ':staff','admin');
        // Route::post('transactions', [TransactionController::class, 'store'])->middleware(RoleMiddleware::class . ':staff,admin');
        Route::post('transactions', [TransactionController::class, 'store'])->middleware(RoleMiddleware::class . ':staff,admin');
        Route::get('transactions', [TransactionController::class, 'index'])->middleware(RoleMiddleware::class . ':staff,admin');
    });
});

