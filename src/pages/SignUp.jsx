import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./SignUp.module.css";
import {useNotification} from "../context/NotificationContext";

export default function SignUp(){

  const {t} = useTranslation();
  const navigate = useNavigate();
  const {showNotification} = useNotification();

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [errors,setErrors] = useState({});

  function handleSubmit(e){
    e.preventDefault();

    const newErrors = {};

    if(!username.trim()){
      newErrors.username = t("usernameRequired");
    }

    if(!email.trim()){
      newErrors.email = t("emailRequired");
    }

    if(!password.trim()){
      newErrors.password = t("passwordRequired");
    }else if(password.length < 6){
      newErrors.password = t("passwordMin");
    }

    if(!confirmPassword.trim()){
      newErrors.confirmPassword = t("confirmPasswordRequired");
    }else if(password !== confirmPassword){
      newErrors.confirmPassword = t("passwordsDoNotMatch");
    }

    if(Object.keys(newErrors).length > 0){
      setErrors(newErrors);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.some(
      (user)=>user.username === username || user.email === email
    );

    if(userExists){
      setErrors({
        username:t("userAlreadyExists")
      });

      showNotification(t("signupFailed"),"delete");
      return;
    }

    const newUser = {
      id:Date.now(),
      username,
      email,
      password,
      role:"user"
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...users,newUser])
    );

    showNotification(t("signupSuccess"),"success");

    navigate("/login");
  }

  return(
    <div className={styles.signupPage}>
      <div className={styles.signupCard}>

        <div className={styles.signupHeader}>
          <h1>{t("signUp")}</h1>
          <p>{t("createAccount")}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.signupForm}>

          <div className={styles.signupField}>
            <label htmlFor="username">{t("username")}</label>
            <input id="username" type="text" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            {errors.username && <p className={styles.error}>{errors.username}</p>}
          </div>

          <div className={styles.signupField}>
            <label htmlFor="email">{t("email")}</label>
            <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.signupField}>
            <label htmlFor="password">{t("password")}</label>
            <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <div className={styles.signupField}>
            <label htmlFor="confirmPassword">{t("confirmPassword")}</label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
            {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className={styles.signupBtn}>{t("signUp")}</button>

        </form>

        <p className={styles.loginText}>
          {t("alreadyHaveAccount")} <button onClick={()=>navigate("/login")}>{t("login")}</button>
        </p>

      </div>
    </div>
  )
}
