<?php
namespace App\Http\Controllers;

use App\Models\Accounting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountingController extends Controller
{
    public function index()
    {
        // para listar los movimientos contables
        return DB::table('accounting')
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();
    }

    public function store(Request $request)
    {
        // para crear un movimiento contable
        $validated = $this->validateAccounting($request);

        $accounting = DB::table('accounting')
            ->insert(array_merge($validated, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));

        return response()->json($accounting, 201);
    }

    public function show(Accounting $accounting)
    {
        // para mostrar un movimiento contable
        $accounting = DB::table('accounting')
            ->where('id', $accounting->id)
            ->first();

        return response()->json($accounting, 200);
    }

    public function update(Request $request, Accounting $accounting)
    {
        // para actualizar un movimiento contable
        $validated = $this->validateAccounting($request);

        $accounting = DB::table('accounting')
            ->where('id', $accounting->id)
            ->update($validated);

        return response()->json($accounting, 200);
    }

    public function destroy(Accounting $accounting)
    {
        // para eliminar un movimiento contable
        $accounting = DB::table('accounting')
            ->where('id', $accounting->id)
            ->delete();

        return response()->json($accounting, 200);
    }

    private function validateAccounting(Request $request)
    {
        return $request->validate([
            'date'          => ['required', 'date'],
            'movement_type' => ['required', 'in:haber,debe'],
            'payment_type'  => ['required', 'in:sinpe,efectivo,transferencia,tarjeta,otros'],
            'amount'        => ['required', 'numeric', 'min:0'],
            'description'   => ['nullable', 'string', 'max:255'],
        ]);
    }
}
