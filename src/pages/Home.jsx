import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./Home.module.css";

export default function Home(){

  const navigate = useNavigate();
  const {t} = useTranslation();
  const token = localStorage.getItem("token");

  let username = "";

  if(token){
    const userData = JSON.parse(atob(token));
    username = userData.username;
  }

  return(
    <div className={styles.home}>
      <div className={styles.homeHeader}>
        <h1>{t("dashboard")}</h1>
        {username && <h3>{t("welcome")}, {username}</h3>}
        <p>{t("dashboardDescription")}</p>
      </div>

      <div className={styles.dashboardCards}>

        <div className={`${styles.dashboardCard} ${styles.usersCard}`}>
          <h2>{t("users")}</h2>
          <p>{t("manageUsers")}</p>
          <button onClick={()=>navigate("/users")}>{t("viewUsers")}</button>
        </div>

        <div className={`${styles.dashboardCard} ${styles.chartsCard}`}>
          <h2>{t("charts")}</h2>
          <p>{t("viewCharts")}</p>
          <button onClick={()=>navigate("/charts")}>{t("viewCharts")}</button>
        </div>

        <div className={`${styles.dashboardCard} ${styles.postsCard}`}>
          <h2>{t("posts")}</h2>
          <p>{t("viewPostsDescription")}</p>
          <button onClick={()=>navigate("/posts")}>{t("viewPosts")}</button>
        </div>

        <div className={`${styles.dashboardCard} ${styles.postsChartCard}`}>
          <h2>{t("postsChart")}</h2>
          <p>{t("viewPostsStatistics")}</p>
          <button onClick={()=>navigate("/postschart")}>{t("viewChart")}</button>
        </div>

        <div className={`${styles.dashboardCard} ${styles.postsUserCard}`}>
          <h2>{t("postsPerUser")}</h2>
          <p>{t("viewPostsPerUser")}</p>
          <button onClick={()=>navigate("/postsperuser")}>{t("viewPosts")}</button>
        </div>

        <div className={`${styles.dashboardCard} ${styles.settingsCard}`}>
          <h2>{t("settings")}</h2>
          <p>{t("managePreferences")}</p>
          <button onClick={()=>navigate("/settings")}>{t("openSettings")}</button>
        </div>

      </div>
    </div>
  )
}