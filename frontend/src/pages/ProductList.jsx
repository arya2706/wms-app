import React, { useState, useEffect } from "react";
import { Eye, Edit2, Trash2, RefreshCw, ArrowUpDown } from "lucide-react";
import api from "../services/api"; // pastikan ini sesuai path kamu

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/products?page=${page}`);
      const data = res.data;
      const productsData = data.data || [];
      const sorted = [...productsData].sort((a, b) => a.id - b.id);
      setProducts(sorted);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
      });
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchProducts(page);
    }
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleShow = (product) => {
    alert(`
📦 Product Detail
--------------------------
Name: ${product.name}
SKU: ${product.sku}
Stock: ${product.stock}
Rack: ${product.rack_location}
Reorder Level: ${product.reorder_level}
`);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    if (confirm("🗑️ Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/products/${id}`);
        alert("✅ Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert("❌ Failed to delete product");
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/products/${editingProduct.id}`, editingProduct);
      alert("✅ Product updated successfully!");
      fetchProducts();
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update product");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-semibold text-gray-800">📦 Product List</h2>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Cari barang..."
            className="border border-gray-300 rounded-lg p-2 px-4 focus:ring-2 focus:ring-blue-400 outline-none w-64 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 active:scale-95 transition"
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="ml-3 text-gray-500">Loading data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto transition-all duration-300">
          <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                {["id", "name", "sku", "stock", "rack_location", "aksi"].map(
                  (field) => (
                    <th
                      key={field}
                      onClick={() =>
                        field !== "aksi" ? toggleSort(field) : undefined
                      }
                      className={`p-3 border cursor-pointer text-left ${
                        field !== "aksi" ? "hover:bg-gray-50" : ""
                      } transition`}
                    >
                      <div className="flex items-center gap-1">
                        {field === "id"
                          ? "ID"
                          : field === "name"
                          ? "Nama Barang"
                          : field === "sku"
                          ? "SKU"
                          : field === "stock"
                          ? "Stock"
                          : field === "rack_location"
                          ? "Lokasi Rak"
                          : "Aksi"}
                        {field !== "aksi" && (
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 border text-center">{p.id}</td>
                    <td className="p-3 border">{p.name}</td>
                    <td className="p-3 border">{p.sku}</td>
                    <td className="p-3 border text-center">{p.stock}</td>
                    <td className="p-3 border">{p.rack_location}</td>
                    <td className="p-3 border text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleShow(p)}
                          className="text-blue-600 hover:scale-110 transition"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-green-600 hover:scale-110 transition"
                          title="Edit Produk"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:scale-110 transition"
                          title="Hapus Produk"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Inline edit form */}
          {editingProduct && (
            <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">
                ✏️ Edit Product #{editingProduct.id}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "name", label: "Nama Barang" },
                  { name: "sku", label: "SKU" },
                  { name: "stock", label: "Stock" },
                  { name: "rack_location", label: "Lokasi Rak" },
                  { name: "reorder_level", label: "Reorder Level" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="text-sm text-gray-600">{f.label}</label>
                    <input
                      name={f.name}
                      value={editingProduct[f.name] ?? ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          [f.name]: e.target.value,
                        })
                      }
                      className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
