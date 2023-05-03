import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"; // unliked post
import FavoriteIcon from "@mui/icons-material/Favorite"; // liked post

function Like(prop) {
  const [likes, setLikes] = useState([...prop.likes]);
  const [likeChanged, setLikeChanged] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchLikes() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/getPost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: prop.postId,
          }),
        }
      );
      let json = await response.json();
      if (response.status === 200) {
        let arr = [...json.likes];
        setLikes(arr);
      } else {
      }
    }

    fetchLikes();
    setLikeChanged(false);
  }, [likeChanged, prop.postId]);

  const handleLike = () => {
    async function like() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/like/${prop.postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );
      let json = await response.json();
      if (response.status === 200) {
        if (json.success) {
          likes.push(user.id);
          setLikeChanged(true);
        }
      } else {
        // setPostError(response.status);
        // setLoading(false);
      }
    }
    async function unlike() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/unlike/${prop.postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );
      let json = await response.json();
      if (response.status === 200) {
        if (json.success) {
          const index = likes.indexOf(user.id);
          likes.splice(index, 1);
          setLikeChanged(true);
        }
      } else {
        // setPostError(response.status);
        // setLoading(false);
      }
    }
    if (likes.filter((e) => e.localeCompare(user.id) === 0).length === 0) {
      like();
    } else {
      unlike();
    }
  };

  return (
    <div className="right">
      {likes.length}
      {likes.filter((e) => e.localeCompare(user.id) === 0).length === 0 ? (
        <FavoriteBorderIcon
          onClick={() => handleLike()}
          className="likeIconPostpage"
        />
      ) : (
        <FavoriteIcon
          onClick={() => handleLike()}
          sx={{ color: "#cba2e2" }}
          className="likeIconPostpage"
        />
      )}
    </div>
  );
}

export default Like;
