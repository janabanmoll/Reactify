import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import styles from "./Login.module.css";
import {useNotification} from "../context/NotificationContext";

export default function Login(){

  const {t} = useTranslation();
  const {showNotification} = useNotification();

  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [errors,setErrors] = useState({
    username:"",
    password:""
  });

  const navigate = useNavigate();

  function handleSubmit(e){
    e.preventDefault();

    const newErrors = {
      username:"",
      password:""
    };

    if(!username.trim()){
      newErrors.username = t("usernameRequired");
    }

    if(!password.trim()){
      newErrors.password = t("passwordRequired");
    }else if(password.length < 6){
      newErrors.password = t("passwordMin");
    }

    setErrors(newErrors);

    if(newErrors.username || newErrors.password){
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (user)=>user.username === username && user.password === password
    );

    if(!user){
      setErrors({
        username:t("invalidCredentials"),
        password:""
      });

      showNotification(t("loginFailed"),"delete");
      return;
    }

    const mockToken = btoa(JSON.stringify({
      username:user.username,
      userId:user.id,
      role:user.role || "user"
    }));

    localStorage.setItem("token",mockToken);
    window.dispatchEvent(new Event("login"));

    showNotification(t("loginSuccess"),"success");

    navigate("/");
  }

  return(
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>

        <div className={styles.loginHeader}>
          <h1>{t("welcomeBack")}</h1>
          <p>{t("loginDescription")}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.loginForm}>

          <div className={styles.loginField}>
            <label>{t("username")}</label>

            <input
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder={t("enterUsername")}
            />

            {errors.username && (
              <p className={styles.error}>{errors.username}</p>
            )}
          </div>

          <div className={styles.loginField}>
            <label>{t("password")}</label>

            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder={t("enterPassword")}
            />

            {errors.password && (
              <p className={styles.error}>{errors.password}</p>
            )}
          </div>

          <button type="submit" className={styles.loginBtn}>
            {t("login")}
          </button>

        </form>

        <p className={styles.signupText}>
          Don't have an account? <button type="button" onClick={()=>navigate("/signup")}>Sign Up</button>
        </p>

      </div>
    </div>
  )
}
