import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://sheetdb.io/api/v1/uosln4k3oc1tz";

export default function LoginPage({ onLogin, onRegisterClick }) {
  const [form, setForm] = useState({
    KullaniciAdi: "",
    Şifre: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = `${API_URL}/search?KullaniciAdi=${encodeURIComponent(form.KullaniciAdi)}&Şifre=${encodeURIComponent(form.Şifre)}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error("Sunucu hatası: " + res.status);

      const data = await res.json();
      if (data.length > 0) {
        onLogin(data[0]);
        toast.success("Giriş başarılı!");
      } else {
        setError("Kullanıcı adı veya şifre yanlış");
      }
    } catch (err) {
      console.error(err);
      setError("Sunucu ile bağlantı kurulamadı");
      toast.error("Giriş sırasında hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Giriş Yap</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Kullanıcı Adı</label>
            <input
              name="KullaniciAdi"
              placeholder="Kullanıcı adınızı girin"
              value={form.KullaniciAdi}
              onChange={handleChange}
              required
              autoComplete="username"
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Şifre</label>
            <input
              name="Şifre"
              type="password"
              placeholder="Şifrenizi girin"
              value={form.Şifre}
              onChange={handleChange}
              required
              autoComplete="current-password"
              style={styles.input}
            />
          </div>
          
          <button 
            type="submit" 
            style={loading ? styles.disabledButton : styles.submitButton}
            disabled={loading}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner}></span>
                Giriş Yapılıyor...
              </span>
            ) : "Giriş Yap"}
          </button>
        </form>

        {error && <p style={styles.errorText}>{error}</p>}
        
        <div style={styles.footer}>
          <p style={styles.footerText}>Hesabınız yok mu?</p>
          <button 
            onClick={onRegisterClick} 
            type="button"
            style={styles.registerButton}
          >
            Kayıt Ol
          </button>
        </div>
      </div>
    </div>
  );
}

// CSS Stilleri
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
    textAlign: "center"
  },
  title: {
    color: "#2c3e50",
    fontSize: "28px",
    marginBottom: "30px",
    fontWeight: "600"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    textAlign: "left",
    marginBottom: "15px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#34495e",
    fontSize: "14px",
    fontWeight: "500"
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #dfe6e9",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: "#f8f9fa",
    ":focus": {
      borderColor: "#3498db",
      boxShadow: "0 0 0 3px rgba(52, 152, 219, 0.2)",
      outline: "none",
      backgroundColor: "#ffffff"
    }
  },
  submitButton: {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
    ":hover": {
      backgroundColor: "#2980b9",
      transform: "translateY(-2px)"
    }
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "not-allowed",
    marginTop: "10px"
  },
  buttonContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  spinner: {
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    width: "16px",
    height: "16px",
    animation: "spin 1s linear infinite"
  },
  errorText: {
    color: "#e74c3c",
    marginTop: "15px",
    fontSize: "14px"
  },
  footer: {
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #ecf0f1"
  },
  footerText: {
    color: "#7f8c8d",
    marginBottom: "10px"
  },
  registerButton: {
    backgroundColor: "transparent",
    color: "#3498db",
    border: "1px solid #3498db",
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    ":hover": {
      backgroundColor: "#f8f9fa"
    }
  }
};

// Animasyon tanımı
const spin = {
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" }
};

// Animasyonu ekleme (React'in style özelliği için)
document.styleSheets[0].insertRule(`
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`);