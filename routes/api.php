<?php

use App\Http\Controllers\AccountingController;
use Illuminate\Support\Facades\Route;

Route::apiResource('accounting', AccountingController::class);
