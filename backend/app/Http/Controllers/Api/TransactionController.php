<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreTransactionRequest;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Transaction::with('product')->orderBy('created_at', 'desc')->paginate(15);
    }

    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $data = $request->validated();

        try {
            $result = DB::transaction(function () use ($data) {
                
                $product = Product::where('id', $data['product_id'])->lockForUpdate()->first();

                if (!$product) {
                    abort(404, 'Product not found');
                }

                
                if ($data['type'] === 'in') {
                    $newStock = $product->stok + $data['quantity'];
                } else {
                    $newStock = $product->stok - $data['quantity'];

                    
                    if ($newStock < 0) {
                        abort(422, 'Insufficient stock');
                    }
                }

                
                $product->update(['stok' => $newStock]);

                
                $tx = Transaction::create([
                    'product_id' => $product->id,
                    'type'       => $data['type'],
                    'quantity'   => $data['quantity'],
                    'note'       => $data['note'] ?? null,
                    'created_by' => auth()->id() ?? null,
                ]);

                return [
                    'transaction' => $tx,
                    'product'     => $product,
                ];
            });

            return response()->json($result, 201);

        } catch (\Throwable $e) {
            
            \Log::error('Transaction error: '.$e->getMessage());
            return response()->json(['message' => 'Transaction failed', 'error' => $e->getMessage()], 500);
        }
    }
    public function summary(Request $request)
    {
        $transactions = Transaction::selectRaw("
            DATE_FORMAT(created_at, '%Y-%u') as week,
            SUM(CASE WHEN type = 'in' THEN quantity ELSE 0 END) as `in`,
            SUM(CASE WHEN type = 'out' THEN quantity ELSE 0 END) as `out`
        ")
        ->groupBy('week')
        ->orderBy('week')
        ->get();

        return response()->json(['data' => $transactions]);
    }

}
