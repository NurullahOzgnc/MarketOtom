import React, { useState, useEffect } from "react";

const API_URL = "https://sheetdb.io/api/v1/uosln4k3oc1tz/satislar";

export default function Satislar() {
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    ÇalışanAdı: "",
    SatılanÜrün: "",
    Adet: "",
    Tarih: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setSales(data);
    } catch {
      setError("Satışlar yüklenirken hata oluştu");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSale = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: form }),
      });

      if (res.ok) {
        setSuccess("Satış eklendi");
        setForm({
          ÇalışanAdı: "",
          SatılanÜrün: "",
          Adet: "",
          Tarih: ""
        });
        fetchSales();
      } else {
        setError("Satış eklenirken hata oluştu");
      }
    } catch {
      setError("Sunucu ile bağlantı kurulamadı");
    }
  };

  return (
    <div>
      <h2>Satışlar</h2>
      <form onSubmit={handleAddSale}>
        <input name="ÇalışanAdı" placeholder="Çalışan Adı" value={form.ÇalışanAdı} onChange={handleChange} required />
        <input name="SatılanÜrün" placeholder="Satılan Ürün" value={form.SatılanÜrün} onChange={handleChange} required />
        <input name="Adet" placeholder="Adet" value={form.Adet} onChange={handleChange} required />
        <input
          name="Tarih"
          type="date"
          placeholder="Tarih"
          value={form.Tarih}
          onChange={handleChange}
          required
        />
        <button type="submit">Satış Ekle</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <ul>
        {sales.map((s, idx) => (
          <li key={idx}>
            {s.ÇalışanAdı} - {s.SatılanÜrün} - {s.Adet} adet - {s.Tarih}
          </li>
        ))}
      </ul>
    </div>
  );
}
