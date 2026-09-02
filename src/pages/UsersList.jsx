import {useState,useEffect} from "react";
import useFetch from "../hooks/useFetch";
import UserForm from "../components/UserForm";
import {useTranslation} from "react-i18next";
import {useDispatch,useSelector} from "react-redux";
import {setUsers,updateUser,deleteUser,addUser} from "../store/userSlice";
import {confirmAlert} from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import styles from "./UsersList.module.css";
import LoadingSpinner from "../components/LoadingSpinner";
import {useNotification} from "../context/NotificationContext";

export default function UsersList(){

  const {data,loading,error,refetch} = useFetch("https://dummyjson.com/users");

  const dispatch = useDispatch();
  const users = useSelector((state)=>state.users.users);

  const {t} = useTranslation();
  const {showNotification} = useNotification();

  const [search,setSearch] = useState("");
  const [gender,setGender] = useState("all");
  const [sortBy,setSortBy] = useState("none");
  const [currentPage,setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const [editingUser,setEditingUser] = useState(null);
  const [showAddForm,setShowAddForm] = useState(false);

  useEffect(()=>{
    if(data?.users){
      const addedUsers = JSON.parse(localStorage.getItem("addedUsers")) || [];
      const signupUsers = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = JSON.parse(localStorage.getItem("updatedUsers")) || [];
      const deletedUsers = JSON.parse(localStorage.getItem("deletedUsers")) || [];

      const apiUsers = data.users.filter((user)=>!deletedUsers.includes(user.id)).map((user)=>{
        const updatedUser = updatedUsers.find((item)=>item.id === user.id);
        return updatedUser || user;
      });

      const filteredSignupUsers = signupUsers.filter((user)=>user.role !== "admin");

      dispatch(setUsers([...apiUsers,...addedUsers,...filteredSignupUsers]));
    }
  },[data,dispatch]);

  function calculateAge(birthDate){
    if(!birthDate) return 0;

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())){
      age--;
    }

    return age;
  }

  function formatDate(date){
    if(!date) return "";

    const [year,month,day] = date.split("T")[0].split("-");

    return `${day}/${month}/${year}`;
  }

  const filteredUsers = users.filter((user)=>{
    const userName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username || "";

    const matchesSearch = `${userName} ${user.age || ""} ${user.email || ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesGender = gender === "all" || user.gender === gender;

    return matchesSearch && matchesGender;
  });

  const sortedUsers = [...filteredUsers].sort((a,b)=>{
    if(sortBy === "age-asc"){
      return (a.age || calculateAge(a.birthDate)) - (b.age || calculateAge(b.birthDate));
    }

    if(sortBy === "age-desc"){
      return (b.age || calculateAge(b.birthDate)) - (a.age || calculateAge(a.birthDate));
    }

    if(sortBy === "phone-asc"){
      return (a.phone || "").localeCompare(b.phone || "");
    }

    if(sortBy === "phone-desc"){
      return (b.phone || "").localeCompare(a.phone || "");
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  useEffect(()=>{
    if(totalPages === 0){
      setCurrentPage(1);
    }else if(currentPage > totalPages){
      setCurrentPage(totalPages);
    }
  },[totalPages,currentPage]);

  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = sortedUsers.slice(startIndex,startIndex + usersPerPage);

  function handleUpdate(updatedUser){
    const savedUsers = JSON.parse(localStorage.getItem("addedUsers")) || [];
    const signupUsers = JSON.parse(localStorage.getItem("users")) || [];

    const isAddedUser = savedUsers.some((user)=>user.id === updatedUser.id);
    const isSignupUser = signupUsers.some((user)=>user.id === updatedUser.id);

    if(isAddedUser){
      const updatedAddedUsers = savedUsers.map((user)=>user.id === updatedUser.id ? updatedUser : user);
      localStorage.setItem("addedUsers",JSON.stringify(updatedAddedUsers));
    }else if(isSignupUser){
      const updatedSignupUsers = signupUsers.map((user)=>user.id === updatedUser.id ? {...user,...updatedUser} : user);
      localStorage.setItem("users",JSON.stringify(updatedSignupUsers));
    }else{
      const updatedUsers = JSON.parse(localStorage.getItem("updatedUsers")) || [];
      const existingIndex = updatedUsers.findIndex((user)=>user.id === updatedUser.id);

      if(existingIndex !== -1){
        updatedUsers[existingIndex] = updatedUser;
      }else{
        updatedUsers.push(updatedUser);
      }

      localStorage.setItem("updatedUsers",JSON.stringify(updatedUsers));
    }

    dispatch(updateUser(updatedUser));
    setEditingUser(null);
    showNotification(t("userUpdated"),"update");
  }

  function handleAdd(newUser){
    const user = {...newUser,id:Date.now(),role:"user"};
    const savedUsers = JSON.parse(localStorage.getItem("addedUsers")) || [];

    localStorage.setItem("addedUsers",JSON.stringify([...savedUsers,user]));

    dispatch(addUser(user));
    setShowAddForm(false);
    showNotification(t("userAdded"),"success");
  }

  function handleDelete(id){
    confirmAlert({
      title:t("confirmDelete"),
      message:t("deleteUserMessage"),
      buttons:[
        {
          label:t("yes"),
          onClick:()=>{
            const savedUsers = JSON.parse(localStorage.getItem("addedUsers")) || [];
            const signupUsers = JSON.parse(localStorage.getItem("users")) || [];

            const isAddedUser = savedUsers.some((user)=>user.id === id);
            const isSignupUser = signupUsers.some((user)=>user.id === id);

            if(isAddedUser){
              const updatedUsers = savedUsers.filter((user)=>user.id !== id);
              localStorage.setItem("addedUsers",JSON.stringify(updatedUsers));
            }else if(isSignupUser){
              const updatedUsers = signupUsers.filter((user)=>user.id !== id);
              localStorage.setItem("users",JSON.stringify(updatedUsers));
            }else{
              const deletedUsers = JSON.parse(localStorage.getItem("deletedUsers")) || [];

              if(!deletedUsers.includes(id)){
                deletedUsers.push(id);
              }

              localStorage.setItem("deletedUsers",JSON.stringify(deletedUsers));
            }

            dispatch(deleteUser(id));
            showNotification(t("userDeleted"),"delete");
          }
        },
        {
          label:t("no")
        }
      ]
    });
  }

  if(loading){
    return(
      <div className={styles.loadingBox}>
        <LoadingSpinner/>
        <h2>{t("loadingUsers")}</h2>
      </div>
    );
  }

  if(error){
    return(
      <div className={styles.errorBox}>
        <h2>{t("usersFetchError")}</h2>
        <p>{t("tryAgain")}</p>
        <button className={styles.retryButton} onClick={refetch}>{t("retry")}</button>
      </div>
    );
  }

  if(!users || users.length === 0){
    return(
      <div className={styles.emptyBox}>
        <h2>{t("noUsersFound")}</h2>
        <p>{t("noUsersMessage")}</p>
      </div>
    );
  }

  return(
    <div className={styles.usersPage}>
      <div className={styles.usersHeader}>
        <h1>{t("users")}</h1>
        <button className={styles.addButton} onClick={()=>setShowAddForm(true)}>{t("addUsers")}</button>
      </div>

      <div className={styles.filters}>
        <input type="text" placeholder={t("searchUser")} value={search} onChange={(e)=>setSearch(e.target.value)}/>

        <select value={gender} onChange={(e)=>setGender(e.target.value)}>
          <option value="all">{t("all")}</option>
          <option value="male">{t("male")}</option>
          <option value="female">{t("female")}</option>
        </select>

        <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
          <option value="none">{t("sortBy")}</option>
          <option value="age-asc">{t("lowestAge")}</option>
          <option value="age-desc">{t("highestAge")}</option>
          <option value="phone-asc">{t("phoneLowHigh")}</option>
          <option value="phone-desc">{t("phoneHighLow")}</option>
        </select>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.usersTable}>
          <thead>
            <tr>
              <th>{t("id")}</th>
              <th>{t("name")}</th>
              <th>{t("gender")}</th>
              <th>{t("age")}</th>
              <th>{t("email")}</th>
              <th>{t("phone")}</th>
              <th>{t("birthDate")}</th>
              <th colSpan="2">{t("actions")}</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user)=>{
              const age = user.birthDate ? calculateAge(user.birthDate) : user.age || 0;
              const userName = user.firstName ? `${user.firstName} ${user.lastName || ""}` : user.username || "";

              return(
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{userName}</td>
                  <td>{user.gender || "-"}</td>
                  <td className={age > 50 ? styles.oldUser : styles.fitUser}>{age}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || "-"}</td>
                  <td>{formatDate(user.birthDate)}</td>
                  <td><button className={styles.editButton} onClick={()=>setEditingUser(user)}>✏️ Edit</button></td>
                  <td><button className={styles.deleteButton} onClick={()=>handleDelete(user.id)}>🗑️ Delete</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <UserForm onUpdate={(newUser)=>{handleAdd(newUser);}} onCancel={()=>setShowAddForm(false)}/>
          </div>
        </div>
      )}

      <div className={styles.pagination}>
        <button disabled={currentPage === 1} className={styles.pageBtn} onClick={()=>setCurrentPage(prev=>prev - 1)}>{t("previous")}</button>

        {Array.from({length:totalPages},(_,index)=>(
          <button key={index} onClick={()=>setCurrentPage(index + 1)} className={currentPage === index + 1 ? `${styles.pageBtn} ${styles.activePage}` : styles.pageBtn}>{index + 1}</button>
        ))}

        <button disabled={currentPage === totalPages} onClick={()=>setCurrentPage(prev=>prev + 1)} className={styles.pageBtn}>{t("next")}</button>
      </div>

      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <UserForm user={editingUser} onUpdate={handleUpdate} onCancel={()=>setEditingUser(null)}/>
          </div>
        </div>
      )}
    </div>
  )
}
