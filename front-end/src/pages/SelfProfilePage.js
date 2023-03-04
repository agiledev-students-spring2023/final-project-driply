import React from "react";
import { useNavigate, Link } from "react-router-dom";

function SelfProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="profileContainer">
      <div className="pfpContainer">
        <div className="pfp">
          <img src="https://picsum.photos/id/64/200" alt="pic" />
        </div>
      </div>

      <div className="profileInfo">
        <div className="profileInfoSpecific">
          <p>3</p>
          <p>Posts</p>
        </div>
        <div
          onClick={() => navigate("/followers")}
          className="profileInfoSpecific"
        >
          <p>3</p>
          <p>Followers</p>
        </div>
        <div
          onClick={() => navigate("/following")}
          className="profileInfoSpecific"
        >
          <p>3</p>
          <p>Following</p>
        </div>
      </div>

      <div className="postsContainer">
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

export default SelfProfilePage;
