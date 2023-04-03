import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";


function FollowerPage() {
  const [followerList, setFollowerList] = useState([]);
  const [followerError, setFollowerError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function fetchFollowerList() {
      const response = await fetch(`http://localhost:4000/follower`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let json = await response.json();
      if (json.status === 200) {
        setFollowerList(json.data);
        setFollowerError(null);
        setLoading(false);
        console.log(json);
      } else {
        console.log(json.error);
        setFollowerError({ error: json.error, status: json.status });
        setLoading(false);
      }
    }

    fetchFollowerList();
  }, []);

// function FollowerPage() {
//   const [followerList, setFollowerList] = useState([]);
//   const [followerError, setFollowerError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { ifDarkMode } = useContext(DarkModeContext);

//   useEffect(() => {
//     async function fetchFollowerList() {
//       const response = await fetch(`http://localhost:5000/follower`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       let json = await response.json();
//       if (json.status === 200) {
//         setFollowerList(json.data);
//         setFollowerError(null);
//         setLoading(false);
//         console.log(json);
//       } else {
//         console.log(json.error);
//         setFollowerError({ error: json.error, status: json.status });
//         setLoading(false);
//       }
//     }

//     fetchFollowerList();
//   }, []);

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
          {follower.if_following ? (
            <div className={`followBtn ${ifDarkMode && "followBtn-dark"}`}>
              Unfollow
            </div>
          ) : (
            <div className={`unfollowBtn ${ifDarkMode && "unfollowBtn-dark"}`}>
              Follow
            </div>
          )}
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
    <div className={ifDarkMode && "darkTheme"}>
      {/* header */}
      <div className="chatPageHeader">
        <h1>Followers {followerList?.length}</h1>
      </div>

      {loading ? <LoadFollowerList /> : <DisplayFollowerList />}
      {followerError && (
        <div>
          <h1 className="error">Error: {followerError.status}</h1>
          <h3 className="error">{followerError.error}</h3>
        </div>
      )}
    </div>
  );
}

export default FollowerPage;
