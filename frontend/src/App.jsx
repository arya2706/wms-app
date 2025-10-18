// src/App.jsx
import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ProductList from "./pages/ProductList";
import TransactionPage from "./pages/TransactionPage";
import AddProduct from "./pages/AddProduct";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState("products");

  const handleLoginSuccess = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📦 Warehouse Management System
      </h1>

      <p className="mb-4">Welcome, {user.name} ({user.role})</p>

      {/* NAVIGATION */}
      <div className="mb-6 flex gap-3">
        {/* Tombol Products hanya untuk admin */}
        {user.role === "admin" && (
          <button
            onClick={() => setPage("products")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Products
          </button>
        )}

        {/* Tombol Transactions untuk admin & staff */}
        {["admin", "staff"].includes(user.role) && (
          <button
            onClick={() => setPage("transactions")}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Transactions
          </button>
        )}

        {/* Tombol Logout selalu muncul */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* PAGE CONTENT */}
      {page === "products" && user.role === "admin" && (
        <>
          <AddProduct onSuccess={() => setRefresh(!refresh)} />
          <ProductList key={refresh} token={token} />
        </>
      )}
      <div className="mb-6 flex gap-3">
        {user.role === "admin" && (
          <button onClick={() => setPage("dashboard")} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
            Dashboard
          </button>
        )}
        {/* tombol lain tetap sama */}
      </div>

      {/* Page Content */}
      {page === "dashboard" && user.role === "admin" && <Dashboard token={token} />}

      {page === "transactions" && ["admin", "staff"].includes(user.role) && (
        <TransactionPage token={token} />
      )}
    </div>
  );
}

export default App;
