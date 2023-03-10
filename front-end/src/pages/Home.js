import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { DarkModeContext } from "../context/DarkModeContext";

function Home() {
  const [postList, setPostList] = useState([]);
  const [postListError, setPostListError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function fetchPostList() {
      const response = await fetch(
        `https://my.api.mockaroo.com/post_schema.json?key=099dde30`
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
