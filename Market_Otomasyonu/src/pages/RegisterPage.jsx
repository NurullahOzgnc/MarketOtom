import React, { useState } from "react";

const API_URL = "https://sheetdb.io/api/v1/uosln4k3oc1tz";

export default function RegisterPage({ onRegister, onLoginClick }) {
  const [form, setForm] = useState({
    KullaniciAdi: "",
    Şifre: "",
    İsim: "",
    Soyisim: "",
    Rol: "user"
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Kullanıcı adı var mı kontrolü
      const checkRes = await fetch(`${API_URL}?filter[KullaniciAdi]=${encodeURIComponent(form.KullaniciAdi)}`);
      
      const contentType = checkRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Geçersiz yanıt alındı: JSON değil.");
      }

      const checkData = await checkRes.json();
      if (checkData.length > 0) {
        setError("Bu kullanıcı adı zaten kayıtlı.");
        return;
      }

      // Kayıt
      const postRes = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: form })
      });

      if (postRes.ok) {
        setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
        setForm({
          KullaniciAdi: "",
          Şifre: "",
          İsim: "",
          Soyisim: "",
          Rol: "user"
        });
      } else {
        setError("Kayıt sırasında hata oluştu.");
      }

    } catch (err) {
      console.error("Hata:", err);
      setError("Sunucudan geçerli bir yanıt alınamadı.");
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="KullaniciAdi"
          placeholder="Kullanıcı Adı"
          value={form.KullaniciAdi}
          onChange={handleChange}
          required
        />
        <input
          name="Şifre"
          type="password"
          placeholder="Şifre"
          value={form.Şifre}
          onChange={handleChange}
          required
        />
        <input
          name="İsim"
          placeholder="İsim"
          value={form.İsim}
          onChange={handleChange}
          required
        />
        <input
          name="Soyisim"
          placeholder="Soyisim"
          value={form.Soyisim}
          onChange={handleChange}
          required
        />
        <button type="submit">Kayıt Ol</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <p>
        Zaten hesabınız var mı?{" "}
        <button onClick={onLoginClick}>Giriş Yap</button>
      </p>
    </div>
  );
}