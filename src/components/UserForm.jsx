import {useEffect,useState} from "react";
import {useTranslation} from "react-i18next";
import styles from "./UserForm.module.css";

export default function UserForm({user,onUpdate,onCancel}){

  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [phone,setPhone] = useState("");
  const [gender,setGender] = useState("");
  const [birthDate,setBirthDate] = useState("");
  const [usernames,setUserNames] = useState([]);
  const [username,setUserName] = useState("");
  const {t} = useTranslation();
  const [errors,setErrors] = useState({});
  const [showAdditionalFields,setShowAdditionalFields] = useState(false);
  const [height,setHeight] = useState("");
  const [weight,setWeight] = useState("");

  useEffect(()=>{
    if(user){
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setGender(user.gender || "");
      setBirthDate(user.birthDate ? String(user.birthDate).split("T")[0] : "");
      setUserName(user.username || "");
      setHeight(user.height || "");
      setWeight(user.weight || "");
      setShowAdditionalFields(Boolean(user.height || user.weight));
      setErrors({});
    }else{
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setGender("");
      setBirthDate("");
      setUserName("");
      setHeight("");
      setWeight("");
      setShowAdditionalFields(false);
      setErrors({});
    }
  },[user]);

  useEffect(()=>{
    async function getData(){
      const response = await fetch("https://dummyjson.com/users");
      const resData = await response.json();
      setUserNames(resData.users);
    }
    getData();
  },[]);

  function validateForm(){
    const newErrors = {};

    if(!firstName.trim()){
      newErrors.firstName = "First Name is required";
    }

    if(!lastName.trim()){
      newErrors.lastName = "Last Name is required";
    }

    if(!email.trim()){
      newErrors.email = "Email is required";
    }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      newErrors.email = "Please enter a valid email";
    }

    if(!phone.trim()){
      newErrors.phone = "Phone number is required";
    }

    if(!gender){
      newErrors.gender = "Gender is required";
    }

    if(!birthDate){
      newErrors.birthDate = "Birth Date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e){
    e.preventDefault();

    if(!validateForm()){
      return;
    }

    const formData = {
      firstName,
      lastName,
      username,
      email,
      phone,
      gender,
      birthDate,
      height,
      weight
    };

    if(user){
      onUpdate({
        ...user,
        ...formData
      });
    }else{
      onUpdate(formData);
    }
  }

  return(
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>{user ? t("editUser") : t("addUser")}</h2>

      <form onSubmit={handleSubmit} className={styles.form}>

        <label htmlFor="firstName">{t("firstName")}</label>
        <input type="text" id="firstName" value={firstName} onChange={(e)=>{
          const value = e.target.value;
          setFirstName(value);
          setErrors((prev)=>({
            ...prev,
            firstName:value.trim() ? "" : "First Name is Required"
          }));
        }}/>

        {errors.firstName && <p className={styles.error}>{errors.firstName}</p>}

        <label htmlFor="username">{t("username")}</label>
        <select id="username" value={username} onChange={(e)=>setUserName(e.target.value)}>
          <option value="">{t("selectUsername")}</option>
          {usernames.map((user)=>(
            <option key={user.id} value={user.username}>{user.username}</option>
          ))}
        </select>

        <div className={styles.checkboxField}>
          <label htmlFor="check">
            <input id="check" type="checkbox" checked={showAdditionalFields} onChange={(e)=>{
              const checked = e.target.checked;
              setShowAdditionalFields(checked);

              if(!checked){
                setHeight("");
                setWeight("");
              }
            }}/>
            {t("additionalDetails")}
          </label>
        </div>

        {showAdditionalFields && (
          <div className={styles.additionalFields}>

            <label htmlFor="height">{t("height")}</label>
            <input type="number" id="height" value={height} onChange={(e)=>setHeight(e.target.value)} placeholder={t("enterHeight")}/>

            <label htmlFor="weight">{t("weight")}</label>
            <input type="number" id="weight" value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder={t("enterWeight")}/>

          </div>
        )}

        <label htmlFor="lastName">{t("lastName")}</label>
        <input type="text" id="lastName" value={lastName} onChange={(e)=>{
          const value = e.target.value;
          setLastName(value);

          setErrors((prev)=>({
            ...prev,
            lastName:value.trim() ? "" : "Last Name is required"
          }));
        }}/>

        {errors.lastName && <p className={styles.error}>{errors.lastName}</p>}

        <label htmlFor="gender">{t("gender")}</label>

        <select value={gender} id="gender" onChange={(e)=>{
          const value = e.target.value;
          setGender(value);

          setErrors((prev)=>({
            ...prev,
            gender:value ? "" : "Gender is required"
          }));
        }}>
          <option value="">{t("selectGender")}</option>
          <option value="male">{t("male")}</option>
          <option value="female">{t("female")}</option>
        </select>

        {errors.gender && <p className={styles.error}>{errors.gender}</p>}

        <label htmlFor="email">{t("email")}</label>

        <input type="text" id="email" value={email} onChange={(e)=>{
          const value = e.target.value;
          setEmail(value);

          let error = "";

          if(!value.trim()){
            error = "Email is required";
          }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){
            error = "Please enter a valid email";
          }

          setErrors((prev)=>({
            ...prev,
            email:error
          }));
        }}/>

        {errors.email && <p className={styles.error}>{errors.email}</p>}

        <label htmlFor="contact">{t("contact")}</label>

        <input type="text" id="contact" value={phone} onChange={(e)=>{
          const value = e.target.value;
          setPhone(value);

          setErrors((prev)=>({
            ...prev,
            phone:value.trim() ? "" : "Phone is required"
          }));
        }}/>

        {errors.phone && <p className={styles.error}>{errors.phone}</p>}

        <label htmlFor="date">{t("date")}</label>

        <input type="date" id="date" value={birthDate} onChange={(e)=>{
          const value = e.target.value;
          setBirthDate(value);

          setErrors((prev)=>({
            ...prev,
            birthDate:value ? "" : "Birth date is required"
          }));
        }}/>

        {errors.birthDate && <p className={styles.error}>{errors.birthDate}</p>}

        <div className={styles.formButtons}>
          <button type="submit">{user ? t("updateUser") : t("addUser")}</button>
          <button type="button" onClick={onCancel}>{t("cancel")}</button>
        </div>

      </form>
    </div>
  )
}