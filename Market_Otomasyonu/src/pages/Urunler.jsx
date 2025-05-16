import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "https://sheetdb.io/api/v1/uosln4k3oc1tz";

const Urunler = ({ user }) => {
  // State'ler
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    Barcode: "",
    "ÜrünAdı": "",
    Açıklama: "",
    Fiyat: "",
    Miktar: ""
  });
  const [loading, setLoading] = useState({
    list: false,
    submit: false,
    delete: false
  });
  const [isEditing, setIsEditing] = useState(false);

  // Veri çekme
  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, list: true }));
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(data.filter(item => item.Barcode));
    } catch (err) {
      toast.error("Ürünler yüklenemedi: " + err.message);
    } finally {
      setLoading(prev => ({ ...prev, list: false }));
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true }));
    
    try {
      const bodyData = {
        Barcode: form.Barcode.trim(),
        "ÜrünAdı": form["ÜrünAdı"].trim(),
        Fiyat: parseFloat(form.Fiyat),
        Miktar: parseInt(form.Miktar),
        Açıklama: form.Açıklama.trim() || "-"
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
      });

      if (!res.ok) throw new Error("Kayıt başarısız");
      
      toast.success("Ürün başarıyla kaydedildi!");
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error("Hata: " + err.message);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };


  // Silme işlemi (DÜZELTİLMİŞ)
  const handleDelete = async (barcode) => {
    if (!barcode) return toast.error("Geçersiz ürün seçildi");
    if (!window.confirm(`${barcode} barkodlu ürünü silmek istediğinize emin misiniz?`)) return;

    setLoading(prev => ({ ...prev, delete: true }));
    try {
      const res = await fetch(`${API_URL}/Barcode/${encodeURIComponent(barcode)}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error(res.status === 404 ? "Ürün bulunamadı" : "Silme başarısız");
      toast.success("Ürün silindi");
      fetchProducts();
    } catch (err) {
      toast.error("Silme hatası: " + err.message);
    } finally {
      setLoading(prev => ({ ...prev, delete: false }));
    }
  };

  // Diğer fonksiyonlar (Aynı)
  const handleEdit = (product) => {
    if (!product?.Barcode) return toast.error("Geçersiz ürün seçildi");
    setForm({
      Barcode: product.Barcode,
      "ÜrünAdı": product["ÜrünAdı"] || "",
      Açıklama: product.Açıklama || "",
      Fiyat: product.Fiyat || "",
      Miktar: product.Miktar || ""
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setForm({
      Barcode: "",
      "ÜrünAdı": "",
      Açıklama: "",
      Fiyat: "",
      Miktar: ""
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ürün Yönetimi</h2>
      
      {user && (
        <p style={styles.userInfo}>
          <span style={styles.userName}>{user.İsim}</span> ({user.Rol}) olarak giriş yapıldı
        </p>
      )}

      {/* Ürün Formu */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGrid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Barkod No*</label>
            <input
              name="Barcode"
              value={form.Barcode}
              onChange={handleChange}
              required
              disabled={isEditing}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Ürün Adı*</label>
            <input
              name="ÜrünAdı"
              value={form["ÜrünAdı"]}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Açıklama</label>
            <input
              name="Açıklama"
              value={form.Açıklama}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Fiyat (₺)*</label>
            <input
              name="Fiyat"
              type="number"
              step="0.01"
              min="0"
              value={form.Fiyat}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Miktar*</label>
            <input
              name="Miktar"
              type="number"
              min="0"
              value={form.Miktar}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={loading.submit}
            style={loading.submit ? styles.disabledButton : styles.primaryButton}
          >
            {loading.submit ? 'İşleniyor...' : isEditing ? 'Güncelle' : 'Ürün Ekle'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              style={styles.cancelButton}
            >
              İptal
            </button>
          )}
        </div>
      </form>

      {/* Ürün Listesi */}
      <div style={styles.productList}>
        <h3 style={styles.subtitle}>Ürün Listesi</h3>
        
        {loading.list ? (
          <div style={styles.loader}></div>
        ) : products.length === 0 ? (
          <p style={styles.emptyMessage}>Henüz ürün eklenmedi</p>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Barkod</th>
                  <th style={styles.tableHeader}>Ürün Adı</th>
                  <th style={styles.tableHeader}>Fiyat</th>
                  <th style={styles.tableHeader}>Miktar</th>
                  <th style={styles.tableHeader}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.tableCell}>{product.Barcode}</td>
                    <td style={styles.tableCell}>{product["ÜrünAdı"]}</td>
                    <td style={styles.tableCell}>{parseFloat(product.Fiyat).toFixed(2)}₺</td>
                    <td style={styles.tableCell}>{product.Miktar}</td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleEdit(product)}
                          style={styles.editButton}
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(product.Barcode)}
                          style={styles.deleteButton}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// CSS Stilleri
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  title: {
    color: '#2c3e50',
    fontSize: '28px',
    marginBottom: '20px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px'
  },
  userInfo: {
    color: '#7f8c8d',
    marginBottom: '20px'
  },
  userName: {
    fontWeight: 'bold',
    color: '#2980b9'
  },
  form: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#34495e'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #bdc3c7',
    borderRadius: '4px',
    fontSize: '16px',
    transition: 'border 0.3s',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px'
  },
  primaryButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'not-allowed',
    fontSize: '16px'
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s'
  },
  productList: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  subtitle: {
    color: '#2c3e50',
    fontSize: '22px',
    marginBottom: '20px'
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '20px auto'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '20px'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    backgroundColor: '#3498db',
    color: 'white'
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600'
  },
  tableRow: {
    borderBottom: '1px solid #ecf0f1',
    '&:hover': {
      backgroundColor: '#f8f9fa'
    }
  },
  tableCell: {
    padding: '12px',
    verticalAlign: 'middle'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  editButton: {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s'
  }
};

export default Urunler;