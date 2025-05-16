import React, { useState, useEffect } from "react";

const API_URL = "https://sheetdb.io/api/v1/uosln4k3oc1tz/satislar";

export default function Raporlama() {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");

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

  // Çalışan adına göre satış adetlerini toplayan basit fonksiyon
  const
getSalesSummary = () => {
const summary = {};
sales.forEach(({ ÇalışanAdı, Adet }) => {
summary[ÇalışanAdı] = (summary[ÇalışanAdı] || 0) + Number(Adet);
});
return summary;
};

const summary = getSalesSummary();

return (
<div>
<h2>Satış Raporları</h2>
{error && <p style={{ color: "red" }}>{error}</p>}
<ul>
{Object.entries(summary).map(([employee, total]) => (
<li key={employee}>
{employee}: {total} adet satış
</li>
))}
</ul>
</div>
);
}