
import {useEffect,useState} from "react";
import useFetch from "../hooks/useFetch";
import {useTranslation} from "react-i18next";
import styles from "./PostsPerUser.module.css";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PostsPerUser(){

  const {t} = useTranslation();
  const [userId,setUserId] = useState("");
  const [signupUsers,setSignupUsers] = useState(JSON.parse(localStorage.getItem("users")) || []);
  const [addedPosts,setAddedPosts] = useState(JSON.parse(localStorage.getItem("addedPosts")) || []);

  const {data:usersData,loading:usersLoading,error:usersError,refetch:refetchUsers} = useFetch("https://dummyjson.com/users");
  const {data:postsData,loading:postsLoading,error:postsError,refetch:refetchPosts} = useFetch("https://dummyjson.com/posts?limit=0");

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

  const allUsers = [
    ...(usersData?.users || []),
    ...signupUsers
  ];

  const selectedUser = allUsers.find((user)=>Number(user.id) === Number(userId));

  const apiUserPosts = (postsData?.posts || []).filter((post)=>Number(post.userId) === Number(userId));

  const userAddedPosts = addedPosts.filter((post)=>Number(post.userId) === Number(userId));

  const allUserPosts = [
    ...apiUserPosts,
    ...userAddedPosts
  ];

  function handleUserChange(e){
    setUserId(e.target.value);
  }

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
        <h2>{t("loadingPostsPerUser")}</h2>
      </div>
    );
  }

  if(usersError || postsError){
    return(
      <div className={styles.errorBox}>
        <h2>{t("postsPerUserFetchError")}</h2>
        <p>{t("postsPerUserFetchMessage")}</p>
        <button className={styles.retryButton} onClick={handleRetry}>{t("retry")}</button>
      </div>
    );
  }

  if(allUsers.length === 0){
    return(
      <div className={styles.emptyBox}>
        <h2>{t("noUsersFound")}</h2>
        <p>{t("noUsersMessage")}</p>
      </div>
    );
  }

  return(
    <div className={styles.postsPage}>

      <div className={styles.header}>
        <h1>{t("postsPerUser")}</h1>
        <p>{t("selectUserToViewPosts")}</p>
      </div>

      <div className={styles.selectBox}>
        <label>{t("selectUser")}</label>

        <select value={userId} onChange={handleUserChange}>
          <option value="">{t("selectUser")}</option>

          {usersData?.users?.map((user)=>(
            <option key={`api-${user.id}`} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}

          {signupUsers.map((user)=>(
            <option key={`signup-${user.id}`} value={user.id}>
              {user.username} ({user.email})
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className={styles.userInfo}>
          <div>
            <h2>{selectedUser.firstName ? `${selectedUser.firstName} ${selectedUser.lastName}` : selectedUser.username}</h2>
            <p>{selectedUser.email}</p>
          </div>

          <div className={styles.postCount}>
            <span>{allUserPosts.length}</span>
            <p>{t("posts")}</p>
          </div>
        </div>
      )}

      {userId && allUserPosts.length === 0 && (
        <div className={styles.emptyBox}>
          <h3>{t("noPostsFound")}</h3>
          <p>{t("noPostsMessage")}</p>
        </div>
      )}

      {allUserPosts.length > 0 && (
        <div className={styles.postsGrid}>
          {allUserPosts.map((post)=>(
            <div className={styles.postCard} key={post.id}>

              <div className={styles.postHeader}>
                <span>{t("post")} #{post.id}</span>
                <span>{post.views} {t("views")}</span>
              </div>

              <h3>{post.title}</h3>

              <p>{post.body}</p>

              <div className={styles.tags}>
                {post.tags?.map((tag)=>(
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className={styles.reactions}>
                <span>{t("likes")}: {post.reactions?.likes || 0}</span>
                <span>{t("dislikes")}: {post.reactions?.dislikes || 0}</span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

