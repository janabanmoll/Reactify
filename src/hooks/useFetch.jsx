import {useEffect,useState} from "react";

export default function useFetch(url){
  const [data,setData] = useState(null);
  const [loading,setIsLoading] = useState(true);
  const [error,setError] = useState(null);
  const [retry,setRetry] = useState(0);

  useEffect(()=>{
    if(!url) return;

    async function fetchData(){
      try{
        setIsLoading(true);
        setError(null);

        const response = await fetch(url);

        if(!response.ok){
          throw new Error("Failed to fetch users");
        }

        const resData = await response.json();
        setData(resData);
      }catch(e){
        setError(e.message);
      }finally{
        setIsLoading(false);
      }
    }

    fetchData();
  },[url,retry]);

  function refetch(){
    setRetry(prev=>prev + 1);
  }

  return {data,loading,error,refetch};
}