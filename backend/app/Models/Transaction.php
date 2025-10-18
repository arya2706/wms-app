<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $table = 'stock_transactions';

    protected $fillable = [
        'product_id',
        'type',
        'quantity',
        'note',
        'created_by',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
