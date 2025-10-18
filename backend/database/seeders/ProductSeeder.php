<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            $items = [
                    ['name'=>'Shampoo A','sku'=>'SKU-0001','stock'=>120,'rack_location'=>'R1-A1','reorder_level'=>20],
                    ['name'=>'Sabun B','sku'=>'SKU-0002','stock'=>50,'rack_location'=>'R1-A2','reorder_level'=>10],
                    ['name'=>'Lotion C','sku'=>'SKU-0003','stock'=>0,'rack_location'=>'R2-B1','reorder_level'=>5],
                    ['name'=>'Conditioner D','sku'=>'SKU-0004','stock'=>75,'rack_location'=>'R2-B2','reorder_level'=>15],
                    ['name'=>'Body Wash E','sku'=>'SKU-0005','stock'=>200,'rack_location'=>'R3-C1','reorder_level'=>30],
                    ['name'=>'Face Cream F','sku'=>'SKU-0006','stock'=>10,'rack_location'=>'R3-C2','reorder_level'=>5],
                    ['name'=>'Sunscreen G','sku'=>'SKU-0007','stock'=>0,'rack_location'=>'R4-D1','reorder_level'=>10],
                    ['name'=>'Hand Sanitizer H','sku'=>'SKU-0008','stock'=>300,'rack_location'=>'R4-D2','reorder_level'=>50],
                    ['name'=>'Hair Gel I','sku'=>'SKU-0009','stock'=>25,'rack_location'=>'R5-E1','reorder_level'=>5],
                    ['name'=>'Deodorant J','sku'=>'SKU-0010','stock'=>80,'rack_location'=>'R5-E2','reorder_level'=>20]
            ];


            foreach ($items as $i) {
                Product::create($i);
            }
    }
}
