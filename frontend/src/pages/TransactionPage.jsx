// src/pages/TransactionPage.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { ArrowUpDown, RefreshCw } from "lucide-react";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    type: "in",
    quantity: "",
    note: "",
  });
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch data transaksi
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error("❌ Gagal fetch transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch data produk
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch (err) {
      console.error("❌ Gagal fetch produk:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  // 🔹 Submit form transaksi
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.product_id || !form.quantity) {
      alert("⚠️ Pilih barang dan isi jumlah terlebih dahulu!");
      return;
    }

    try {
      await api.post("/transactions", {
        product_id: Number(form.product_id),
        type: form.type,
        quantity: Number(form.quantity),
        note: form.note,
      });

      alert("✅ Transaksi berhasil disimpan!");
      setForm({ product_id: "", type: "in", quantity: "", note: "" });
      fetchTransactions();
      fetchProducts();
    } catch (err) {
      console.error("❌ Gagal menyimpan transaksi:", err);
      alert("❌ Terjadi kesalahan saat menyimpan transaksi");
    }
  };

  // 🔹 Sorting handler
  const toggleSort = (field) => {
    const order =
      field === sortField && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  // 🔹 Filter + Sort data
  const filteredTransactions = transactions
    .filter(
      (t) =>
        t.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.note?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortField] || a.product?.[sortField];
      const valB = b[sortField] || b.product?.[sortField];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">
          🧾 Form Transaksi Barang
        </h2>
        {/* <button
          onClick={fetchTransactions}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition"
        >
          <RefreshCw size={18} /> Refresh
        </button> */}
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Pilih Barang
          </label>
          <select
            value={form.product_id}
            onChange={(e) => setForm({ ...form, product_id: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="">-- Pilih Barang --</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
            <br></br>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Tipe Transaksi
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="in">Barang Masuk</option>
            <option value="out">Barang Keluar</option>
          </select>
        </div>
            <br></br>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Jumlah</label>
          <input
            type="number"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
            <br></br>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Catatan</label>
          <input
            type="text"
            value={form.note}
            placeholder="Contoh: GRN-003 atau retur"
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
            <br></br>
        <div className="col-span-2 flex justify-end mt-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Simpan Transaksi
          </button>
        </div>
      </form>

      {/* SEARCH + REFRESH */}
        <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
            📋 Riwayat Transaksi
        </h3>

        <div className="flex items-center gap-3">
            <input
            type="text"
            placeholder="🔍 Cari transaksi..."
            className="border border-gray-300 rounded-lg p-2 px-4 focus:ring-2 focus:ring-blue-400 outline-none w-64 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
            <button
            onClick={fetchTransactions}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition"
            >
            <RefreshCw size={18} /> Refresh
            </button>
        </div>
        </div>

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-500 text-center py-4">Loading data...</p>
      ) : filteredTransactions.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Belum ada transaksi
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                {["id", "product", "type", "quantity", "note", "created_at"].map(
                  (field) => (
                    <th
                      key={field}
                      onClick={() =>
                        field !== "product" && field !== "note"
                          ? toggleSort(field)
                          : undefined
                      }
                      className={`p-3 border cursor-pointer text-left ${
                        field !== "note" ? "hover:bg-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {field === "id"
                          ? "ID"
                          : field === "product"
                          ? "Barang"
                          : field === "type"
                          ? "Tipe"
                          : field === "quantity"
                          ? "Jumlah"
                          : field === "note"
                          ? "Catatan"
                          : "Tanggal"}
                        {field !== "note" && field !== "product" && (
                          <ArrowUpDown
                            size={14}
                            className={`${
                              sortField === field
                                ? "text-blue-600"
                                : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border text-center">{t.id}</td>
                  <td className="p-3 border">{t.product?.name}</td>
                  <td
                    className={`p-3 border text-center font-medium ${
                      t.type === "in" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "in" ? "Masuk" : "Keluar"}
                  </td>
                  <td className="p-3 border text-center">{t.quantity}</td>
                  <td className="p-3 border">{t.note || "-"}</td>
                  <td className="p-3 border text-gray-500 text-sm">
                    {new Date(t.created_at).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}