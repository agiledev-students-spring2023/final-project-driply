import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { useParams } from "react-router-dom";
import Follow from "../components/Follow";

function FollowingPage() {
  const [followingList, setFollowingList] = useState([]);
  const [followingData, setFollowingData] = useState([]);
  const [followingError, setFollowingError] = useState(null);
  const [followedChanged, setFollowedChanged] = useState(false);
  const [removedFollowed, setRemovedFollowed] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ifDarkMode } = useContext(DarkModeContext);
  const params = useParams();
  const { userId } = params;

  useEffect(() => {
    async function fetchFollowingList() {
      const response = await fetch(
        `http://localhost:4000/following/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let json = await response.json();
      if (json.success) {
        setFollowingList(json.following);
        setFollowingData(json.followingData);
        setFollowingError(null);
        setLoading(false);
        console.log(json);
      } else {
        console.log(json.error);
        setFollowingError({ error: json.error.message, message: json.message });
        setLoading(false);
      }
    }

    fetchFollowingList();
  }, [userId, followedChanged]);

  useEffect(() => {
    if (followedChanged) {
      setFollowingList((prevState) =>
        prevState.filter((following) => following !== removedFollowed)
      );
    }
    setFollowedChanged(false);
    setRemovedFollowed(null);
  }, [followedChanged, userId, removedFollowed]);

  function LoadingFollowingList() {
    return Array.from({ length: followingList.length }).map((_, idx) => {
      return (
        <div key={idx} className="eachFollowingDisplay">
          <div className="followingImgLoading"></div>
          <div className="followingDetailsLoading"></div>
        </div>
      );
    });
  }

  function Following({ following }) {
    const { name, id } = following;
    const [profilePic, setProfilePic] = useState(null);

    useEffect(() => {
      async function fetchProfilePic() {
        const response = await fetch(`http://localhost:4000/getUserPfp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: id,
          }),
        });
        const blob = await response.blob();
        setProfilePic(URL.createObjectURL(blob));
      }

      fetchProfilePic();
    }, [id]);

    const unfollow = async (e) => {
      if (userId) {
        e.stopPropagation();

        const response = await fetch(`http://localhost:4000/unfollow`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: userId,
            followedID: id,
          }),
        });
        let json = await response.json();
        if (response.status === 200) {
          console.log(json);
          if (json.success) {
            setFollowedChanged(true);
            setRemovedFollowed(id);
          }
        }
      }
    };

    return (
      <div className="eachFollowingDisplay">
        <div className="followingImg">
          <img src={profilePic} alt="user img" />
        </div>
        <div className="followingDetails">
          <p>{name}</p>
          <div
            className={`unfollowBtn ${ifDarkMode && "unfollowBtn-dark"}`}
            onClick={unfollow}
          >
            Unfollow
          </div>
        </div>
      </div>
    );
  }

  function DisplayFollowingList() {
    return (
      <div className="followingContainer">
        {followingData.map((following, index) => (
          <Following key={index} following={following} />
        ))}
      </div>
    );
  }

  return (
    <div className={ifDarkMode && "darkTheme"}>
      {/* header */}
      <div className="chatPageHeader">
        <h1 className="followHeadline">Following </h1>
        <h1 className="followCount">{followingList?.length}</h1>
      </div>

      {loading ? <LoadingFollowingList /> : <DisplayFollowingList />}
      {followingError && (
        <div>
          <h1 className="error">{followingError.message}</h1>
          <h3 className="error">{followingError.error}</h3>
        </div>
      )}
    </div>
  );
}

export default FollowingPage;
