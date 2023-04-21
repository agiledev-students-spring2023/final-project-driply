import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

function Follow(props) {
  const [followed, setFollowed] = useState(false);
  const [followedChanged, setFollowedChanged] = useState(false);
  const [ownProfile, setOwnProfile] = useState(props.ownProfile);
  const { user } = useAuthContext();
  const [followingList, setFollowingList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.following && user.name) {
      setFollowingList(user.following);
      console.log(user.name);
    }
    console.log(followingList);
  }, [followedChanged, followingList]);

  const handleFollow = (e) => {
    if (user) {
      e.stopPropagation();

      async function follow() {
        const response = await fetch(`http://localhost:4000/follow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: user.id,
            followedID: props.profileID,
          }),
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.message === "success") {
            setFollowed(true);
            setFollowedChanged(true);
          }
        }
      }

      async function unfollow() {
        const response = await fetch(`http://localhost:4000/unfollow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: user.id,
            followedID: props.profileID,
          }),
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.message === "success") {
            setFollowed(false);
            setFollowedChanged(true);
          }
        }
      }
      // follow if profileID is not in user.following
      if (followed) {
        unfollow();
      } else {
        follow();
      }
    } else {
      navigate("/login");
    }
  };

  function FollowButton() {
    if (!followed) {
      return (
        <button onClick={handleFollow} className="buttonPaddingRight">
          Follow
        </button>
      );
    } else {
      return (
        <button onClick={() => handleFollow()} className="buttonPaddingRight">
          Followed
        </button>
      );
    }
  }

  return (
    <>
      {ownProfile ? (
        <div></div>
      ) : (
        <div className="right">{user ? <FollowButton /> : <div></div>}</div>
      )}
    </>
  );
}

export default Follow;
