import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DarkModeContext } from '../context/DarkModeContext';
import { useAuthContext } from '../hooks/useAuthContext';

function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { ifDarkMode } = useContext(DarkModeContext);


  function FollowButton() {
    return <div className={`followButton ${ifDarkMode && "followButton-dark"}`}>Follow</div>;
  }
  return (
    <div className={`profileContainer ${ifDarkMode && "darkTheme"}`}>
      <div className="pfpContainer">
        <div className="pfp">
          <img src="https://picsum.photos/id/64/200" alt="pic" />
        </div>
        {user ? <FollowButton /> : <div></div>}
      </div>

      <div className="profileInfo">
        <div className={ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"}>
          <p>3</p>
          <p>Posts</p>
        </div>
        <div
          onClick={() => navigate("/followers")}
          className={ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"}
        >
          <p>3</p>
          <p>Followers</p>
        </div>
        <div
          onClick={() => navigate("/following")}
          className={ifDarkMode ? "profileInfoSpecific-dark" : "profileInfoSpecific"}
        >
          <p>3</p>
          <p>Following</p>
        </div>
      </div>

      <div className={`${ifDarkMode ? "postsContainer-dark" : "postsContainer"}`}>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive"
              src="https://picsum.photos/id/22/131/150"
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive"
              src="https://picsum.photos/id/27/131/150"
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive"
              src="https://picsum.photos/id/24/131/150"
              alt="pic"
            />
          </Link>
        </div>
        <div className="imagePostsContainer">
          <Link to={`/post/0`}>
            <img
              className="img-responsive"
              src="https://picsum.photos/id/25/131/150"
              alt="pic"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
