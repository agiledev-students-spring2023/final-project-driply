import React, { useEffect, useState } from "react";

function FollowerPage() {
  const [followerList, setFollowerList] = useState([]);
  const [followerError, setFollowerError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFollowerList() {
      const response = await fetch(
        `https://my.api.mockaroo.com/follower_schema.json?key=${process.env.REACT_APP_MOCKAROO_API_KEY}`
      );
      let json = await response.json();
      if (response.status === 200) {
        setFollowerList(json);
        setFollowerError(null);
        setLoading(false);
      } else {
        setFollowerError(response.status);
        setLoading(false);
      }
    }

    fetchFollowerList();
  }, []);

  function LoadFollowerList() {
    return Array.from({ length: 10 }).map((_, idx) => {
      return (
        <div key={idx} className="eachFollowerDisplay">
          <div className="followerImgLoading"></div>
          <div className="followerDetailsLoading"></div>
        </div>
      );
    });
  }

  function Follower({ follower }) {
    return (
      <div className="eachFollowerDisplay">
        <div className="followerImg">
          <img src={follower.user_img} alt="user img" />
        </div>
        <div className="followerDetails">
          <p>{follower.username}</p>
          {follower.if_following ? (<div className="followBtn">Unfollow</div>) : (<div className="unfollowBtn">Follow</div>)}
        </div>
      </div>
    );
  }

  function DisplayFollowerList() {
    return (
      <div className="followerContainer">
        {followerList.map((follower) => (
          <Follower key={follower.id} follower={follower} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* header */}
      <div className="chatPageHeader">
        <h1>Followers {followerList?.length}</h1>
      </div>

      {loading ? <LoadFollowerList /> : <DisplayFollowerList />}
      {followerError && <h1 className="error">Error: {followerError}</h1>}
    </div>
  );
}

export default FollowerPage;
