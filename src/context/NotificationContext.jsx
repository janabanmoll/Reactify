import {createContext,useContext,useState} from "react";
import "../components/Notification.css";

const NotificationContext = createContext();

export function NotificationProvider({children}){

  const [notification,setNotification] = useState(null);

  function showNotification(message,type="success"){
    const enabled = localStorage.getItem("notifications") === "true";

    if(!enabled){
      return;
    }

    setNotification({message,type});

    setTimeout(()=>{
      setNotification(null);
    },3000);
  }

  return(
    <NotificationContext.Provider value={{showNotification}}>
      {children}

      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.message}
        </div>
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification(){
  return useContext(NotificationContext);
}
