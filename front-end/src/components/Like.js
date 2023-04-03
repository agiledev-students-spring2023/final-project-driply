import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

function Like(prop) {
  const [likes, setLikes] = useState([...prop.likes]);
  const [likeChanged, setLikeChanged] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    setLikeChanged(false);
  }, [likeChanged]);

  const handleLike = () => {
    async function like() {
      const response = await fetch(`http://localhost:4000/like/${prop.postId}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
      });
      let json = await response.json();
      if (response.status === 200) {
        console.log(json);
        if (json.success){
          likes.push(user.username);
          setLikeChanged(true);
        }
      } else {
        // setPostError(response.status);
        // setLoading(false);
      }
    }
    async function unlike() {
      const response = await fetch(`http://localhost:4000/unlike/${prop.postId}`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
      });
      let json = await response.json();
      if (response.status === 200) {
        console.log(json);
        if (json.success){
          const index = likes.indexOf(user.username);
          likes.splice(index, 1);
          setLikeChanged(true);
        }
      } else {
        // setPostError(response.status);
        // setLoading(false);
      }
    }
    console.log(likes);
    if (likes.filter((e) => e.localeCompare(user.username) === 0).length === 0) {
      like();
    } 
    else {
      unlike();
    }
  };

  return (
    <div className="right">
      {likes.length}
      {likes.filter((e) => e.localeCompare(user.username) === 0).length ===
        0 && (
        <button onClick={() => handleLike()} className="btn btn-secondary mx-2">
          Like
        </button>
      )}
      {likes.filter((e) => e.localeCompare(user.username) === 0).length > 0 && (
        <button onClick={() => handleLike()} className="btn btn-primary mx-2">
          Liked
        </button>
      )}
    </div>
  );
}

export default Like;
