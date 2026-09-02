import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import styles from "./Logout.module.css";

export default function Logout({onLogout}){

  const navigate = useNavigate();
  const {t} = useTranslation();
  const [showModal,setShowModal] = useState(false);

  function handleLogout(){
    setShowModal(false);
    localStorage.removeItem("token");
    onLogout();
    navigate("/login");
  }

  return(
    <>
      <button className={styles.logoutBtn} onClick={()=>setShowModal(true)}>
        {t("logout")}
      </button>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{t("confirmLogout")}</h2>
            <p>{t("logoutMessage")}</p>

            <div className={styles.modalButtons}>
              <button className={styles.yesBtn} onClick={handleLogout}>
                {t("yes")}
              </button>
              <button className={styles.noBtn} onClick={()=>setShowModal(false)}>
                {t("no")}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  )
}