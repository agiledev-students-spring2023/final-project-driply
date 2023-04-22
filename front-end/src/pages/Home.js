import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { DarkModeContext } from "../context/DarkModeContext";

function Home() {
  const [postList, setPostList] = useState([]);
  const [postListError, setPostListError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ifDarkMode } = useContext(DarkModeContext);

  function sortPosts(posts) {
    return posts.sort((a, b) => {
      const aDate = new Date(
        parseInt(a._id.toString().substring(0, 8), 16) * 1000
      );
      const bDate = new Date(
        parseInt(b._id.toString().substring(0, 8), 16) * 1000
      );
      return bDate - aDate;
    });
  }

  useEffect(() => {
    async function fetchPostList() {
      const response = await fetch(`http://localhost:4000/getHomePosts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let json = await response.json();
      if (response.status === 200) {
        // setPostList((oldArray) => [...oldArray, ...json.data]);
        setPostList(sortPosts(json.data));
        setPostListError(null);
      } else {
        setPostListError({ error: json.error, status: response.status });
      }
      setLoading(false);
    }

    fetchPostList();
  }, []);

  function LoadingPosts() {
    return Array.from({ length: 6 }).map((_, idx) => {
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
      <>
        {postList?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </>
    );
  }

  return (
    <div className={`postContainer ${ifDarkMode && "darkTheme"}`}>
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

export default Home;
