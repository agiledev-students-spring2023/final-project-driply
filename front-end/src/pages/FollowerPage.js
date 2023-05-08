import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Follow from "../components/Follow";

function FollowerPage() {
  const [followerList, setFollowerList] = useState([]);
  const [followersData, setFollowerData] = useState([]);
  const [followerError, setFollowerError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followedChangedSuccess, setFollowedChangedSuccess] = useState(false);
  const { ifDarkMode } = useContext(DarkModeContext);
  const params = useParams();
  const { userId } = params;
  const { user } = useAuthContext();
  const [ownProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFollowerList() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/follower/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let json = await response.json();
      if (json.success) {
        setFollowerList(json.followers);
        setFollowerData(json.followersData);
        setFollowerError(null);
        setLoading(false);
        console.log(json);
      } else {
        console.log(json.error);
        setFollowerError({ error: json.error.message, message: json.message });
        setLoading(false);
      }
    }

    async function fetchFollowingList() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/following/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let json = await response.json();
      if (json.success) {
        setLoading(false);
      } else {
        console.log(json.error);
        setLoading(false);
      }
    }

    fetchFollowingList();
    fetchFollowerList();
  }, [userId]);

  function LoadFollowerList() {
    return Array.from({ length: followerList.length }).map((_, idx) => {
      return (
        <div
          key={idx}
          className="eachFollowerDisplay"
        >
          <div className="followerImgLoading"></div>
          <div className="followerDetailsLoading"></div>
        </div>
      );
    });
  }

  function Follower({ follower }) {
    const { name, id } = follower;
    const [profilePic, setProfilePic] = useState(null);
    const params = useParams();
    const { userId } = params;

    useEffect(() => {
      async function fetchProfilePic() {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getUserPfp`, {
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
    }, [id, userId]);

    const isCurrentUser = user.id === id;

    return (
      <div className="eachFollowerDisplay">
        <div className="followerImg">
          <img
            src={profilePic}
            alt="user img"
            onClick={() => navigate(`/profile/${id}`)}
          />
        </div>
        <div className="followerDetails">
          <p onClick={() => navigate(`/profile/${id}`)}>{name}</p>
          {!isCurrentUser && (
            <div className={`${ifDarkMode && "unfollowBtn-dark"}`}>
              <Follow
                ownProfile={ownProfile}
                profileID={id}
                followedChangedSuccess={followedChangedSuccess}
                setFollowedChangedSuccess={setFollowedChangedSuccess}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  function DisplayFollowerList() {
    // display logged in user on top
    const sortedFollowers = [...followersData].sort((a, b) => {
      if (a.id === user.id) return -1;
      if (b.id === user.id) return 1;
      return 0;
    });

    return (
      <div className="followerContainer">
        {sortedFollowers.map((follower, index) => (
          <Follower
            key={index}
            follower={follower}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`allFollowContainer ${ifDarkMode && "darkTheme"}`}>
      {/* header */}
      <div className="chatPageHeader">
        <h1 className="followHeadline">Followers</h1>
        <h1 className="followCount">{followerList?.length}</h1>
      </div>

      {loading ? <LoadFollowerList /> : <DisplayFollowerList />}
      {followerError && (
        <div>
          <h1 className="error">Error: {followerError.message}</h1>
          <h3 className="error">{followerError.error}</h3>
        </div>
      )}
    </div>
  );
}

export default FollowerPage;
