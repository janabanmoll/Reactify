import {useTranslation} from "react-i18next";
import {useState} from "react";
import styles from "./Settings.module.css";

export default function Settings(){

  const {t,i18n} = useTranslation();

  const [notifications,setNotifications] = useState(()=>{
    const saved = localStorage.getItem("notifications");
    return saved === "true";
  });

  function changeLanguage(e){
    const language = e.target.value;
    i18n.changeLanguage(language);
    localStorage.setItem("language",language);
  }

  function handleNotifications(e){
    const value = e.target.checked;
    setNotifications(value);
    localStorage.setItem("notifications",value);
  }

  return(
    <div className={styles.settingsPage}>

      <div className={styles.settingsCard}>
        <h1>{t("settings")}</h1>
        <h3>{t("language")}</h3>

        <select value={i18n.language} onChange={changeLanguage}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      <div className={styles.settingsCard}>
        <h3>{t("notifications")}</h3>

        <div className={styles.notificationSetting}>
          <label>
            <input type="checkbox" checked={notifications} onChange={handleNotifications}/>
            {t("enableNotifications")}
          </label>
        </div>
      </div>

    </div>
  )
}