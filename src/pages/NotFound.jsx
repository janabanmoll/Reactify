import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./NotFound.module.css";

export default function NotFound(){

  const navigate = useNavigate();
  const {t} = useTranslation();

  return(
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundCard}>
        <div className={styles.errorCode}>404</div>
        <h1>{t("pageNotFound")}</h1>
        <p>{t("pageNotFoundDescription")}</p>

        <button onClick={()=>navigate("/")}>
          {t("goHome")}
        </button>
      </div>
    </div>
  )
}