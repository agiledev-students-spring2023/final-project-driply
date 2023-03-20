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
        `https://my.api.mockaroo.com/post_schema.json?key=${process.env.REACT_APP_MOCKAROO_API_KEY}`
      );
      let json = await response.json();
      if (response.status === 200) {
        setPostList(json);
        setPostListError(null);
      } else {
        setPostListError({ error: json.error, status: response.status });
      }
      setLoading(false);
      console.log(json);
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

  function DisplayPostLists() {
    return (
      <div className='galleryContainer'>
        {postList?.map((post) => (
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