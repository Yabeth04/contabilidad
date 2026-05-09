<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accounting extends Model
{
    protected $table = 'accounting';

    protected $fillable = [
        'date',
        'movement_type',
        'description',
        'payment_type',
        'amount',
    ];

    // para castear los datos
    protected function casts(): array
    {
        return [
            'date'   => 'date',
            'amount' => 'decimal:2',
        ];
    }
}
