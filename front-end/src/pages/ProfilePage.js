import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import Follow from "../components/Follow";
import { useAuthContext } from "../hooks/useAuthContext";

function ProfilePage() {
  const { user } = useAuthContext();
  const params = useParams();
  const { userId } = params;

  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [description, setDescription] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownProfile] = useState(false);
  const { ifDarkMode } = useContext(DarkModeContext);
  const [pfp, setPfp] = useState("");
  const [postList, setPostList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followedChangedSuccess, setFollowedChangedSuccess] = useState(false);

  useEffect(() => {
    if (user && user.following) {
      setFollowingList(user.following);
    }
    async function fetchProfileInfo() {
      setPostList([]);
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      let json = await response.json();
      if (json.success) {
        console.log(json);
        setUserData(json.data);
        setFetchError(null);
        setLoading(false);
      } else {
        console.log();
        setFetchError(json.message);
        setLoading(false);
      }
      setLoading(false);
    }

    async function fetchPfp() {
      if (userData.profilepic) {
        console.log(userData.profilepic);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: userData.profilepic,
          }),
        });
        if (response.status === 200) {
          const imageBlob = await response.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setPfp(imageObjectURL);
        }
      }
    }

    fetchPfp();
    fetchProfileInfo();
  }, [
    userData.profilepic,
    userId,
    followingList,
    followedChangedSuccess,
    user,
  ]);

  useEffect(() => {
    async function getPictureUrls() {
      if (userData?.allPosts?.length !== 0) {
        for (let i = 0; i < userData?.allPosts?.length; i++) {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/image`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              filename: userData.allPosts[i].image,
            }),
          });
          if (response.status === 200) {
            const imageBlob = await response.blob();
            const imageObjectURL = URL.createObjectURL(imageBlob);
            userData.allPosts[i].image = imageObjectURL;
          }
        }
        setPostList(userData.allPosts);
      }
    }
    getPictureUrls();
  }, [userData.allPosts, userId]);

  const handleMessageBtn = async () => {
    const idsArr = [user.id, userId];
    const sortedIds = idsArr.sort();

    // create chat room in database

    navigate(`/chatroom/${sortedIds[0]}--${sortedIds[1]}`);
  };

  return (
    <div className={`profileContainer ${ifDarkMode && "darkTheme"}`}>
      {loading ? (
        <img
          src={ifDarkMode ? "/Driply-load-dark.png" : "/Driply-load-light.png"}
          alt="loading"
          className="loadingSpinner"
        />
      ) : (
        <>
          {/* dont display message/follow btn on ur own account */}
          {user && user?.id !== userId && (
            <div className="pfpBtns">
              <div
                onClick={handleMessageBtn}
                className={`profilePageMsgBtn ${
                  ifDarkMode && "unfollowBtn-dark"
                }`}
              >
                Message
              </div>
              <div className="followBtnContainer">
                <Follow
                  ownProfile={ownProfile}
                  profileID={userId}
                  followedChangedSuccess={followedChangedSuccess}
                  setFollowedChangedSuccess={setFollowedChangedSuccess}
                />
              </div>
            </div>
          )}
          <div className="pfpContainer">
            <div className="pfp">
              <img src={pfp} alt="pic" />
            </div>
          </div>
          <div className="pf-name">
            <p>{userData?.name}</p>
          </div>
          <div className="pf-bio">
            <p>{description}</p>
          </div>
          <div className="profileInfo">
            <div
              className={
                ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
              }
            >
              <p>{userData?.allPosts?.length}</p>
              <p>Posts</p>
            </div>
            <div
              onClick={() => navigate(`/followers/${userId}`)}
              className={
                ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
              }
            >
              <p>{userData?.followers?.length}</p>
              <p>Followers</p>
            </div>
            <div
              onClick={() => navigate(`/following/${userId}`)}
              className={
                ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
              }
            >
              <p>{userData?.following?.length}</p>
              <p>Following</p>
            </div>
          </div>

          <div
            className={`${
              ifDarkMode ? "postsContainer-dark" : "postsContainer"
            }`}
          >
            {postList?.map((post) => {
              return (
                <div key={post._id} className="imagePostsContainer">
                  <Link to={`/post/${post._id}`}>
                    <img
                      className="img-responsive-post"
                      src={post.image}
                      alt="pic"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          {fetchError && <h2 className="error">{fetchError}</h2>}
        </>
      )}
    </div>
  );
}

export default ProfilePage;
