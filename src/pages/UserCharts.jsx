
import {useSelector} from "react-redux";
import {BarChart,Bar,LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";
import {useTranslation} from "react-i18next";
import styles from "./UsersCharts.module.css";

export default function UserCharts(){

  const {t} = useTranslation();
  const users = useSelector((state)=>state.users.users);

  if(!users || users.length === 0){
    return(
      <div className={styles.errorBox}>
        <h2>{t("usersChartError")}</h2>
        <p>{t("usersChartMessage")}</p>
      </div>
    );
  }

  const bloodGroupData = Object.entries(users.reduce((acc,user)=>{
    const bloodGroup = user.bloodGroup || "Unknown";
    acc[bloodGroup] = (acc[bloodGroup] || 0) + 1;
    return acc;
  },{})).map(([bloodGroup,count])=>({
    bloodGroup,
    count
  }));

  const ageGroups = {
    "Below 20":0,
    "20-29":0,
    "30-39":0,
    "40-49":0,
    "50+":0
  };

  users.forEach((user)=>{
    const age = Number(user.age) || 0;

    if(age < 20){
      ageGroups["Below 20"]++;
    }else if(age < 30){
      ageGroups["20-29"]++;
    }else if(age < 40){
      ageGroups["30-39"]++;
    }else if(age < 50){
      ageGroups["40-49"]++;
    }else{
      ageGroups["50+"]++;
    }
  });

  const ageGroupData = Object.entries(ageGroups).map(([ageGroup,count])=>({
    ageGroup,
    count
  }));

  return(
    <div className={styles.chartsPage}>

      <div className={styles.chartCard}>
        <h2>{t("usersByBloodGroup")}</h2>

        {bloodGroupData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bloodGroupData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="bloodGroup" interval={0} angle={-30} textAnchor="end" height={60}/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="count"/>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.noChartData}>
            <p>{t("noBloodGroupData")}</p>
          </div>
        )}
      </div>

      <div className={styles.chartCard}>
        <h2>{t("usersByAgeGroup")}</h2>

        {ageGroupData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ageGroupData}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="ageGroup"/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="count" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className={styles.noChartData}>
            <p>{t("noAgeGroupData")}</p>
          </div>
        )}
      </div>

    </div>
  )
}

