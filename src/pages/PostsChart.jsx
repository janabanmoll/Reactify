import {useEffect,useState} from "react";
import {useTranslation} from "react-i18next";
import useFetch from "../hooks/useFetch";
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer} from "recharts";
import LoadingSpinner from "../components/LoadingSpinner";
import styles from "./PostsChart.module.css";

export default function PostsChart(){

  const {t} = useTranslation();

  const {data:usersData,loading:usersLoading,error:usersError,refetch:refetchUsers} = useFetch("https://dummyjson.com/users");
  const {data:postsData,loading:postsLoading,error:postsError,refetch:refetchPosts} = useFetch("https://dummyjson.com/posts?limit=0");

  const [signupUsers,setSignupUsers] = useState(JSON.parse(localStorage.getItem("users")) || []);
  const [addedPosts,setAddedPosts] = useState(JSON.parse(localStorage.getItem("addedPosts")) || []);

  useEffect(()=>{
    const handlePostsUpdated = ()=>{
      setAddedPosts(JSON.parse(localStorage.getItem("addedPosts")) || []);
    };

    const handleStorageUpdate = ()=>{
      setSignupUsers(JSON.parse(localStorage.getItem("users")) || []);
      setAddedPosts(JSON.parse(localStorage.getItem("addedPosts")) || []);
    };

    window.addEventListener("postsUpdated",handlePostsUpdated);
    window.addEventListener("storage",handleStorageUpdate);

    return()=>{
      window.removeEventListener("postsUpdated",handlePostsUpdated);
      window.removeEventListener("storage",handleStorageUpdate);
    };
  },[]);

  function handleRetry(){
    if(usersError){
      refetchUsers();
    }

    if(postsError){
      refetchPosts();
    }
  }

  if(usersLoading || postsLoading){
    return(
      <div className={styles.loadingBox}>
        <LoadingSpinner/>
        <h2>{t("loadingPostsChart")}</h2>
      </div>
    );
  }

  if(usersError || postsError){
    return(
      <div className={styles.errorBox}>
        <h2>{t("postsChartFetchError")}</h2>
        <p>{t("postsChartFetchMessage")}</p>
        <button className={styles.retryButton} onClick={handleRetry}>{t("retry")}</button>
      </div>
    );
  }

  const allUsers = [
    ...(usersData?.users || []),
    ...signupUsers
  ];

  const allPosts = [
    ...(postsData?.posts || []),
    ...addedPosts
  ];

  if(allUsers.length === 0){
    return(
      <div className={styles.emptyBox}>
        <h2>{t("noUsersFound")}</h2>
        <p>{t("noUsersMessage")}</p>
      </div>
    );
  }

  if(allPosts.length === 0){
    return(
      <div className={styles.emptyBox}>
        <h2>{t("noPostsFound")}</h2>
        <p>{t("noPostsMessage")}</p>
      </div>
    );
  }

  const postCount = {};

  allPosts.forEach((post)=>{
    const userId = Number(post.userId);

    if(userId){
      postCount[userId] = (postCount[userId] || 0) + 1;
    }
  });

  const chartData = allUsers.map((user,index)=>({
    chartId:`U${index + 1}`,
    userId:user.id,
    userName:user.firstName ? `${user.firstName} ${user.lastName}` : user.username,
    posts:postCount[user.id] || 0
  }));

  return(
    <div className={styles.chartPage}>
      <h1>{t("postsChart")}</h1>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="chartId"/>
          <YAxis/>
          <Tooltip
            formatter={(value)=>[value,t("posts")]}
            labelFormatter={(chartId)=>{
              const user = chartData.find((user)=>user.chartId === chartId);
              return user?.userName;
            }}
          />
          <Bar dataKey="posts"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

