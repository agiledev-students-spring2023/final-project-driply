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
  const [ownProfile, setOwnProfile] = useState(false);
  const { ifDarkMode } = useContext(DarkModeContext);

  const randomSize = [350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380];
  const randomIndex1 = Math.floor(Math.random() * randomSize.length);
  const randomIndex5 = Math.floor(Math.random() * randomSize.length);

  useEffect(() => {
    async function fetchProfileInfo() {
        setLoading(true);
        const response = await fetch(`http://localhost:4000/profile`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": userId
            })
        });
        let json = await response.json();
        if (json.success) {
            console.log(json);
            setUserData(json.data);
            // setDescription(json.description);
            // setOwnProfile(json.ownProfile);
            setFetchError(null);
            setLoading(false);
        } else {
            console.log();
            setFetchError(json.message);
            setLoading(false);
        }
        setLoading(false);
    }
    fetchProfileInfo();
  }, [userId]);

  const handleMessageBtn = async () => {
    const idsArr = [user.id, userId];
    const sortedIds = idsArr.sort();

    // create chat room in database

    navigate(`/chatroom/${sortedIds[0]}--${sortedIds[1]}`);
  }
  
  return (
    <div className={`profileContainer ${ifDarkMode && "darkTheme"}`}>
      {loading ? (
        <div className="loadingSpinner"></div>
      ) : (
        <>
          {/* dont display message/follow btn on ur own account */}
          {user?.id !== userId && (
            <>
              <div onClick={handleMessageBtn} className="profilePageMsgBtn btn btn-secondary">Message</div> 
              <Follow ownProfile={ownProfile}/>
            </>
          )}
          <div className="pfpContainer">
            <div className="pfp">
              <img src={`https://picsum.photos/${randomSize[randomIndex5]}/300`} alt="pic" />
            </div>
          </div>
          <div className="pf-name">
            <p>{userData?.name}</p>
          </div>
          <div className="pf-bio">
            <p>
              {description}
            </p>
          </div>
          <div className="profileInfo">
            <div
              className={
                ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
              }
            >
              <p>{userData?.posts?.length}</p>
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
            className={`${ifDarkMode ? "postsContainer-dark" : "postsContainer"}`}
          >
            {userData?.posts?.map((post) => {
              return (
                <div key={post.id} className="imagePostsContainer">
                  <Link to={`/post/0`}>
                    <img
                      className="img-responsive-post"
                      src={`https://picsum.photos/${randomSize[randomIndex1]}/300`}
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
