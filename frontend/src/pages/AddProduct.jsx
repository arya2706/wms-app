import { useState } from "react";
import api from "../services/api";
import { PlusCircle, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AddProduct({ onSuccess }) {
const [form, setForm] = useState({
    name: "",
    sku: "",
    stock: 0,
    rack_location: "",
    reorder_level: 0,
});
const [loading, setLoading] = useState(false);
const [status, setStatus] = useState(null);

const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
    await api.post("/products", form);
    setStatus("success");
    setForm({
        name: "",
        sku: "",
        stock: 0,
        rack_location: "",
        reorder_level: 0,
    });
    onSuccess?.();
    } catch {
    setStatus("error");
    } finally {
    setLoading(false);
    setTimeout(() => setStatus(null), 3000);
    }
};

return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100">
    {/* Header */}
    <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <PlusCircle className="text-blue-600" size={24} />
        Add New Product
        </h2>

        {status === "success" && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
            <CheckCircle2 size={18} /> <span>Product added successfully!</span>
        </div>
        )}
        {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-lg border border-red-200">
            <XCircle size={18} /> <span>Failed to add product</span>
        </div>
        )}
    </div>

    {/* Form */}
    <form
        onSubmit={handleSubmit}
        className="space-y-6 animate-fadeIn"
    >
        {/* Row 1 */}
        <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-2 font-medium">Product Name</label>
            <input
            name="name"
            placeholder="Ex: Shampoo A"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
        </div>
        <br></br>
        <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-2 font-medium">SKU</label>
            <input
            name="sku"
            placeholder="Ex: SKU-0001"
            value={form.sku}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
        </div>
        </div>
        <br></br>
        {/* Row 2 */}
        <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-2 font-medium">Initial Stock</label>
            <input
            name="stock"
            type="number"
            placeholder="0"
            value={form.stock}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
        </div>
        <br></br>
        <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-2 font-medium">Rack Location</label>
            <input
            name="rack_location"
            placeholder="Ex: R5-E2"
            value={form.rack_location}
            onChange={handleChange}
            required
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
        </div>
        <br></br>
        <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-2 font-medium">Reorder Level</label>
            <input
            name="reorder_level"
            type="number"
            placeholder="10"
            value={form.reorder_level}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
            />
        </div>
        </div>
        <br></br>
        {/* Submit Button */}
        <div className="flex justify-end">
        <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition active:scale-95 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
            {loading ? (
            <>
                <Loader2 className="animate-spin" size={18} /> Saving...
            </>
            ) : (
            <>
                <PlusCircle size={18} /> Save Product
            </>
            )}
        </button>
        </div>
    </form>
    </div>
);
}
