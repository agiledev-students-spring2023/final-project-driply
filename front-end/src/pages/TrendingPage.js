import React, { useContext, useEffect, useState } from 'react'
import TrendingCard from "../components/TrendingCard";
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuthContext } from '../hooks/useAuthContext';

function TrendingPage() {
  const { user } = useAuthContext();
  const [postList, setPostList] = useState([]);
  const [postListError, setPostListError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function fetchPostList() {
      const response = await fetch(
        `http://localhost:4000/getTrendingPosts`
      );
      let json = await response.json();
      if (response.status === 200) {
        setPostList(json.data);
        setPostListError(null);
      } else {
        setPostListError({ error: json.error, status: response.status });
      }
      setLoading(false);
    }

    fetchPostList();
  }, []);


  function LoadingPosts() {
    return Array.from({ length: 4 }).map((_, idx) => {
      return (
        <div key={idx} className="post">
          {/* header */}
          <div className="postHeader">
            <div className="loadingUserImg"></div>
          </div>

          {/* post pictures */}
          <div className="loadingPostBody"></div>
        </div>
      );
    });
  }

  

  function quickSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }
  
    const pivot = arr[Math.floor(arr.length / 2)];
    const less = [];
    const greater = [];
  
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].likes > pivot.likes) {
        greater.push(arr[i]);
      } else if (arr[i].likes < pivot.likes) {
        less.push(arr[i]);
      }
    }
  
    return [...quickSort(greater), pivot, ...quickSort(less)];
  }
  
  function DisplayPostLists() {
    const sortedPostList = quickSort([...postList]); // create a new array
    return (
      <div className='galleryContainer'>
        {sortedPostList?.map((post) => (
          <TrendingCard key={post.id} post={post} />
        ))}
      </div>
    );
  }


  return (
    <div className={`trendingPage ${ifDarkMode && "darkTheme"}`}>
      {postListError && (
        <div>
          <h1 className="error">Error Code: {postListError.status}</h1>
          <h3 className="error">{postListError.error}</h3>
        </div>
      )}

      {loading ? <LoadingPosts /> : <DisplayPostLists />}
    </div>
  );
}

export default TrendingPage