import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";
import Follow from "../components/Follow";
import { useAuthContext } from "../hooks/useAuthContext";

function ProfilePage() {
  const { user } = useAuthContext();

  const navigate = useNavigate();
  const [fakeName, setFakeName] = useState(""); // remove after sprint 1, only used to randomize displayed username using mockaroo
  const [description, setDescription] = useState("");
  const [postError, setPostError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ownProfile, setOwnProfile] = useState(false);
  const { ifDarkMode } = useContext(DarkModeContext);

  const randomSize = [350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380];
  const randomIndex1 = Math.floor(Math.random() * randomSize.length);
  const randomIndex2 = Math.floor(Math.random() * randomSize.length);
  const randomIndex3 = Math.floor(Math.random() * randomSize.length);
  const randomIndex4 = Math.floor(Math.random() * randomSize.length);
  const randomIndex5 = Math.floor(Math.random() * randomSize.length);

  useEffect(() => {
    async function fetchProfileInfo() {
        const response = await fetch(`http://localhost:4000/profile`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "userId": user.id
            })
        });
        let json = await response.json();
        if (response.status === 200) {
            console.log(json);
            setFakeName(json.username);
            setDescription(json.description);
            setOwnProfile(json.ownProfile);
            setPostError(null);
            setLoading(false);
        } else {
            setPostError(response.status);
            setLoading(false);
        }
    }
    fetchProfileInfo();
  }, []);

  
  return (
    <div className={`profileContainer ${ifDarkMode && "darkTheme"}`}>
      <Follow ownProfile={ownProfile}/>
      <div className="pfpContainer">
        <div className="pfp">
          <img src={`https://picsum.photos/${randomSize[randomIndex5]}/300`} alt="pic" />
        </div>
      </div>
      <div className="pf-name">
        <p>{fakeName}</p>
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
          <p>3</p>
          <p>Posts</p>
        </div>
        <div
          onClick={() => navigate("/followers")}
          className={
            ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
          }
        >
          <p>3</p>
          <p>Followers</p>
        </div>
        <div
          onClick={() => navigate("/following")}
          className={
            ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"
          }
        >
          <p>3</p>
          <p>Following</p>
        </div>
      </div>

      <div
        className={`${ifDarkMode ? "postsContainer-dark" : "postsContainer"}`}
      >
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive-post"
              src={`https://picsum.photos/${randomSize[randomIndex1]}/300`}
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive-post"
              src={`https://picsum.photos/${randomSize[randomIndex2]}/300`}
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive-post"
              src={`https://picsum.photos/${randomSize[randomIndex3]}/300`}
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive-post"
              src={`https://picsum.photos/${randomSize[randomIndex4]}/300`}
              alt="pic"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
