<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $q = Product::query();


        if ($request->filled('search')) {
            $search = $request->input('search');
            $q->where(function($w) use ($search) {
            $w->where('name','like','%'.$search.'%')
            ->orWhere('sku','like','%'.$search.'%');
        });
        }


        if ($request->filled('sort_by')) {
            $dir = $request->input('sort_dir','asc');
            $q->orderBy($request->input('sort_by'), $dir);
            } else {
            $q->orderBy('id','asc');
        }


        return response()->json($q->paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         $data = $request->validate([
            'name'=>'required|string|max:255',
            'sku'=>'required|string|max:100|unique:products,sku',
            'stock'=>'required|integer|min:0',
            'rack_location'=>'nullable|string|max:100',
            'reorder_level'=>'nullable|integer|min:0'
            ]);


        $product = Product::create($data);
        return response()->json($product,201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        
        $product = Product::findOrFail($id);

        $product = Product::findOrFail($id);
        $data = $request->validate([
            'name'=>'sometimes|required|string|max:255',
            'sku'=>'sometimes|required|string|max:100|unique:products,sku,'.$product->id,
            'stock'=>'sometimes|required|integer|min:0',
            'rack_location'=>'nullable|string|max:100',
            'reorder_level'=>'nullable|integer|min:0'
            ]);


        $product->update($data);
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message'=>'deleted']);
    }

    public function transact(Request $request, $id)
    {
        $data = $request->validate([
        'type' => 'required|in:in,out',
        'quantity' => 'required|integer|min:1',
        'note' => 'nullable|string|max:255'
        ]);


        $qty = (int)$data['quantity'];
        $type = $data['type'];


        try {
            DB::transaction(function() use ($id, $type, $qty, $data, &$result) {
            $product = Product::lockForUpdate()->findOrFail($id);


        if ($type === 'out') {
        if ($product->stock < $qty) {
        abort(422, 'Insufficient stock');
        }
            $product->stock -= $qty;
        } else {
            $product->stock += $qty;
        }


        $product->save();


        $tx = StockTransaction::create([
            'product_id' => $product->id,
            'type' => $type,
            'quantity' => $qty,
            'note' => $data['note'] ?? null,
            'created_by' => auth()->id() ?? null,
        ]);


        $result = $tx->fresh();
        });


        return response()->json(['success'=>true,'transaction'=>$result]);
        } catch (\Illuminate\Http\Exception $e) {
        return response()->json(['error'=>$e->getMessage()], $e->getStatusCode());
        } catch (\Exception $e) {
        return response()->json(['error'=>$e->getMessage()], 500);
        }
    }
}
