import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { useAuthContext } from "../hooks/useAuthContext";
import { DarkModeContext } from "../context/DarkModeContext";

function Home() {
  const [postList, setPostList] = useState([]);
  const [postListError, setPostListError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    let u;
    if (user) {
      u = user.id;
    }

    async function fetchPostList() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getHomePosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: u,
        }),
      });
      let json = await response.json();
      if (response.status === 200) {
        setPostList(json.data);
        setPostListError(null);
      } else {
        setPostListError({ error: json.error, status: response.status });
      }
      setLoading(false);
    }

    if (user) {
      u = user.id;
    }
    fetchPostList();
  }, []);

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

      {loading ? (
        <img
          src={ifDarkMode ? "/Driply-load-dark.png" : "/Driply-load-light.png"}
          alt="loading"
          className="loadingSpinner"
        />
      ) : (
        <DisplayPostLists />
      )}
    </div>
  );
}

export default Home;
