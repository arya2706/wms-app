// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import api from "../services/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({ token }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStockMovement = async () => {
    setLoading(true);
    try {
      // Contoh endpoint: /transactions/summary?period=week
      const res = await api.get("/transactions/summary", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Asumsi API mengembalikan array: [{ week: "2025-10-13", in: 12, out: 5 }, ...]
      const data = res.data.data;

      const labels = data.map(d => d.week);
      const inData = data.map(d => d.in);
      const outData = data.map(d => d.out);

      setChartData({
        labels,
        datasets: [
          {
            label: "Barang Masuk",
            data: inData,
            backgroundColor: "rgba(34,197,94,0.7)" // hijau
          },
          {
            label: "Barang Keluar",
            data: outData,
            backgroundColor: "rgba(239,68,68,0.7)" // merah
          }
        ]
      });
    } catch (err) {
      console.error("❌ Gagal fetch stock movement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockMovement();
  }, []);

  if (loading || !chartData) {
    return <p className="text-gray-500 text-center py-6">Loading dashboard...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        📊 Dashboard Stok Mingguan
      </h2>
      <Bar 
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "Pergerakan Stok Barang (Masuk/Keluar per Minggu)"
            }
          }
        }}
      />
    </div>
  );
}
