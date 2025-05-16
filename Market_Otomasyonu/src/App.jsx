import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Urunler from "./Pages/Urunler";
import Satislar from "./Pages/Satislar";
import Raporlama from "./pages/Raporlama";
import { ToastContainer } from 'react-toastify';


export default function App() {
  const [currentPage, setCurrentPage] = useState("login"); // login | register | urunler | satislar | rapor
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);

    // Rol kontrolüne göre yönlendirme yapılabilir
    if (user.Rol === "admin") {
      setCurrentPage("rapor");
    } else {
      setCurrentPage("urunler");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage("login");
  };

  const handleRegisterClick = () => {
    setCurrentPage("register");
  };

  const handleLoginClick = () => {
    setCurrentPage("login");
  };

  return (
    <div>
      {currentUser && (
        <div>
          <p>Merhaba, {currentUser.İsim} ({currentUser.Rol})</p>
          <button onClick={handleLogout}>Çıkış Yap</button>
          <ToastContainer position="top-right" autoClose={3000} />

        </div>
      )}

      {currentPage === "login" && (
        <LoginPage
          onLogin={handleLogin}
          onRegisterClick={handleRegisterClick}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage
          onRegister={handleLogin}
          onLoginClick={handleLoginClick}
        />
      )}

      {currentPage === "urunler" && <Urunler user={currentUser} />}
      {currentPage === "satislar" && <Satislar user={currentUser} />}
      {currentPage === "rapor" && <Raporlama user={currentUser} />}
    </div>
  );
}
