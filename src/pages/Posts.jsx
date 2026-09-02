import {useState} from "react";
import {useTranslation} from "react-i18next";
import useFetch from "../hooks/useFetch";
import styles from "./Posts.module.css";
import LoadingSpinner from "../components/LoadingSpinner";
import {confirmAlert} from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {useNotification} from "../context/NotificationContext";

export default function Posts(){

  const {t} = useTranslation();
  const {showNotification} = useNotification();
  const {data,loading,error,refetch} = useFetch("https://dummyjson.com/posts?limit=30");

  const [showAddForm,setShowAddForm] = useState(false);
  const [editingPost,setEditingPost] = useState(null);
  const [title,setTitle] = useState("");
  const [body,setBody] = useState("");
  const [currentPage,setCurrentPage] = useState(1);

  const [addedPosts,setAddedPosts] = useState(
    JSON.parse(localStorage.getItem("addedPosts")) || []
  );

  const token = localStorage.getItem("token");
  const loggedInUser = token ? JSON.parse(atob(token)) : null;

  const allPosts = [
    ...addedPosts,
    ...(data?.posts || [])
  ];

  const postsPerPage = 6;
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = allPosts.slice(startIndex,startIndex + postsPerPage);

  function handleAddPost(e){
    e.preventDefault();

    if(!title.trim() || !body.trim()){
      return;
    }

    const newPost = {
      id:Date.now(),
      title,
      body,
      views:0,
      reactions:{
        likes:0,
        dislikes:0
      },
      tags:[],
      userId:loggedInUser.userId,
      username:loggedInUser.username
    };

    const updatedPosts = [...addedPosts,newPost];

    localStorage.setItem("addedPosts",JSON.stringify(updatedPosts));
    setAddedPosts(updatedPosts);
    window.dispatchEvent(new Event("postsUpdated"));

    setTitle("");
    setBody("");
    setShowAddForm(false);
    setCurrentPage(1);

    showNotification(t("postAdded"),"success");
  }

  function handleEditClick(post){
    setEditingPost(post);
    setTitle(post.title);
    setBody(post.body);
  }

  function handleUpdatePost(e){
    e.preventDefault();

    if(!title.trim() || !body.trim()){
      return;
    }

    const updatedPosts = addedPosts.map((post)=>
      post.id === editingPost.id
        ? {...post,title,body}
        : post
    );

    localStorage.setItem("addedPosts",JSON.stringify(updatedPosts));
    setAddedPosts(updatedPosts);
    window.dispatchEvent(new Event("postsUpdated"));

    setTitle("");
    setBody("");
    setEditingPost(null);

    showNotification(t("postUpdated"),"update");
  }

  function handleDeletePost(postId){
    confirmAlert({
      title:t("deletePostConfirm"),
      message:t("deletePostMessage"),
      buttons:[
        {
          label:t("yes"),
          onClick:()=>{
            const updatedPosts = addedPosts.filter(
              (post)=>post.id !== postId
            );

            localStorage.setItem("addedPosts",JSON.stringify(updatedPosts));
            setAddedPosts(updatedPosts);
            window.dispatchEvent(new Event("postsUpdated"));

            const newTotalPages = Math.ceil(
              (updatedPosts.length + (data?.posts?.length || 0)) / postsPerPage
            );

            if(currentPage > newTotalPages && newTotalPages > 0){
              setCurrentPage(newTotalPages);
            }

            showNotification(t("postDeleted"),"delete");
          }
        },
        {
          label:t("no")
        }
      ]
    });
  }

  function handleReaction(postId,type){
    const updatedPosts = addedPosts.map((post)=>{
      if(post.id !== postId){
        return post;
      }

      return{
        ...post,
        reactions:{
          ...post.reactions,
          [type]:(post.reactions?.[type] || 0) + 1
        }
      };
    });

    localStorage.setItem("addedPosts",JSON.stringify(updatedPosts));
    setAddedPosts(updatedPosts);
    window.dispatchEvent(new Event("postsUpdated"));

    showNotification(
      type === "likes" ? t("likeAdded") : t("dislikeAdded"),
      "reaction"
    );
  }

  function closeForm(){
    setShowAddForm(false);
    setEditingPost(null);
    setTitle("");
    setBody("");
  }

  if(loading){
    return(
      <div className={styles.loadingBox}>
        <LoadingSpinner/>
        <h2>{t("loadingPosts")}</h2>
      </div>
    );
  }

  if(error){
    return(
      <div className={styles.errorBox}>
        <h2>{t("postsFetchError")}</h2>
        <p>{t("postsFetchMessage")}</p>
        <button className={styles.retryButton} onClick={refetch}>{t("retry")}</button>
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

  return(
    <div className={styles.postsPage}>

      <div className={styles.postsHeader}>
        <h1>{t("posts")}</h1>

        <button className={styles.addButton} onClick={()=>setShowAddForm(true)}>
          {t("addPost")}
        </button>
      </div>

      {(showAddForm || editingPost) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <div className={styles.modalHeader}>
              <h2>{editingPost ? t("editPost") : t("addPost")}</h2>

              <button onClick={closeForm}>×</button>
            </div>

            <form onSubmit={editingPost ? handleUpdatePost : handleAddPost}>

              <label>{t("title")}</label>

              <input
                type="text"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
              />

              <label>{t("body")}</label>

              <textarea
                value={body}
                onChange={(e)=>setBody(e.target.value)}
              />

              <p>{t("postedBy")}: {loggedInUser?.username}</p>

              <div className={styles.modalButtons}>

                <button type="button" onClick={closeForm}>
                  {t("cancel")}
                </button>

                <button type="submit">
                  {editingPost ? t("updatePost") : t("addPost")}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      <div className={styles.postsGrid}>

        {currentPosts.map((post)=>{

          const isMyPost =
            loggedInUser &&
            addedPosts.some(
              (addedPost)=>Number(addedPost.id) === Number(post.id)
            );

          return(
            <div className={styles.postCard} key={post.id}>

              <div className={styles.postHeader}>
                <span>{t("post")} #{post.id}</span>

                <span>
                  {post.views || 0} {t("views")}
                </span>
              </div>

              <h3>{post.title}</h3>

              <p>{post.body}</p>

              <div className={styles.tags}>
                {post.tags?.map((tag)=>(
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              {isMyPost ? (
                <div className={styles.reactions}>

                  <button onClick={()=>handleReaction(post.id,"likes")}>
                    ↑ {post.reactions?.likes || 0}
                  </button>

                  <button onClick={()=>handleReaction(post.id,"dislikes")}>
                    ↓ {post.reactions?.dislikes || 0}
                  </button>

                </div>
              ) : (
                <div className={styles.reactions}>

                  <span>
                    {t("likes")}: {post.reactions?.likes || 0}
                  </span>

                  <span>
                    {t("dislikes")}: {post.reactions?.dislikes || 0}
                  </span>

                </div>
              )}

              {isMyPost && (
                <div className={styles.postActions}>

                  <button onClick={()=>handleEditClick(post)}>
                    {t("editPost")}
                  </button>

                  <button onClick={()=>handleDeletePost(post.id)}>
                    {t("deletePost")}
                  </button>

                </div>
              )}

            </div>
          )
        })}

      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>

          <button
            disabled={currentPage === 1}
            onClick={()=>setCurrentPage(currentPage - 1)}
          >
            {t("previous")}
          </button>

          {Array.from({length:totalPages},(_,index)=>(
            <button
              key={index + 1}
              className={currentPage === index + 1 ? styles.activePage : ""}
              onClick={()=>setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={()=>setCurrentPage(currentPage + 1)}
          >
            {t("next")}
          </button>

        </div>
      )}

    </div>
  )
}
