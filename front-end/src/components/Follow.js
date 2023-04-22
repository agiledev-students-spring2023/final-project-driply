import React, { useContext, useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";

function Follow(props) {
  const [followed, setFollowed] = useState(false);
  const [followedChanged, setFollowedChanged] = useState(false);
  const [ownProfile] = useState(props.ownProfile);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function fetchFollowingList() {
      const response = await fetch(
        `http://localhost:4000/following/${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let json = await response.json();
      if (json.success) {
        if (json.following.includes(props.profileID)) {
          setFollowed(true);
        }
        console.log(json);
      } else {
        console.log(json.error);
      }
    }

    fetchFollowingList();
  }, [followedChanged, user.id, followed, props.profileID]);

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
            props.setFollowedChangedSuccess(true);
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
            props.setFollowedChangedSuccess(true);
          }
        }
      }
      // follow if profileID is not in user.following
      if (followed) {
        unfollow();
      } else {
        follow();
      }
      props.setFollowedChangedSuccess(false);
    } else {
      navigate("/login");
    }
  };

  function FollowButton() {
    if (!followed) {
      return (
        <button
          onClick={handleFollow}
          className={`buttonPaddingRight ${ifDarkMode && "unfollowBtn-dark"}`}
        >
          Follow
        </button>
      );
    } else {
      return (
        <button
          onClick={handleFollow}
          className={`buttonPaddingRight ${ifDarkMode && "unfollowBtn-dark"}`}
        >
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
        <div className={`right ${ifDarkMode && "right-dark"}`}>
          {user ? <FollowButton /> : <div></div>}
        </div>
      )}
    </>
  );
}

export default Follow;
