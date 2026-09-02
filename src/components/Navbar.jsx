import { useState,useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Logout from "../pages/Logout";
import styles from "./Navbar.module.css";
import img from './images.png'
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [isLoggedIn,setIsLoggedIn] = useState(!!localStorage.getItem("token"))

  function closeMenu() {
    setIsOpen(false);
  }
  
  useEffect(()=> {
    function handleLogin(){
      setIsLoggedIn(true);
    }

    window.addEventListener("login",handleLogin);

    return()=> {
      window.removeEventListener("login",handleLogin)
    }
  },[])

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navBrand}>
          <img src={img} />
          <span>{t("reactify")}</span>
          </div>&nbsp;&nbsp;&nbsp;
        <button className={styles.hamburger} onClick={() => setIsOpen(prev => !prev)} aria-label="Toggle navigation">☰</button>
        <div className={`${styles.navLinks} ${isOpen ? styles.show : ""}`}>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ""}>{t("home")}</NavLink>
         {!isLoggedIn && <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ""}>{t("login")}</NavLink>}
          <NavLink to="/users" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ""}>{t("users")}</NavLink>
          <NavLink to="/charts" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ""}>{t("charts")}</NavLink>
          <NavLink to="/settings" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ""}>{t("settings")}</NavLink>
          <NavLink to="/posts" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ""}>{t("posts")}</NavLink>
          <NavLink to="/postsperuser" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ""}>{t("postsPerUser")}</NavLink>
          <NavLink to="/postschart" onClick={closeMenu} className={({ isActive }) => isActive ? styles.active : ""}>{t("postsChart")}</NavLink>
          <Logout onLogout={()=>setIsLoggedIn(false)}/>
        </div>
      </nav>
      <Outlet />
    </>
  )
}