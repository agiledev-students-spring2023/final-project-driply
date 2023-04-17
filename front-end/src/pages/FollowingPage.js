import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { useParams } from "react-router-dom";

function FollowingPage() {
  const [followingList, setFollowingList] = useState([]);
  const [followingError, setFollowingError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ifDarkMode } = useContext(DarkModeContext);
  const params = useParams();
  const { userId } = params;

  useEffect(() => {
    async function fetchFollowingList() {
      const response = await fetch(`http://localhost:4000/following/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let json = await response.json();
      if (json.success) {
        setFollowingList(json.following);
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
  }, [userId]);

// function FollowingPage() {
//   const [followingList, setFollowingList] = useState([]);
//   const [followingError, setFollowingError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { ifDarkMode } = useContext(DarkModeContext);

//   useEffect(() => {
//     async function fetchFollowingList() {
//       const response = await fetch(`http://localhost:5000/following`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       let json = await response.json();
//       if (json.status === 200) {
//         setFollowingList(json.data);
//         setFollowingError(null);
//         setLoading(false);
//         console.log(json);
//       } else {
//         console.log(json.error);
//         setFollowingError({ error: json.error, status: json.status });
//         setLoading(false);
//       }
//     }

//     fetchFollowingList();
//   }, []);

  function LoadingFollowingList() {
    return Array.from({ length: 6 }).map((_, idx) => {
      return (
        <div key={idx} className="eachFollowingDisplay">
          <div className="followingImgLoading"></div>
          <div className="followingDetailsLoading"></div>
        </div>
      );
    });
  }

  function Following({ following }) {
    return (
      <div className="eachFollowingDisplay">
        <div className="followingImg">
          <img src={following.user_img} alt="user img" />
        </div>
        <div className="followingDetails">
          <p>{following.username}</p>
          <div className={`unfollowBtn ${ifDarkMode && "unfollowBtn-dark"}`}>
            Unfollow
          </div>
        </div>
      </div>
    );
  }

  function DisplayFollowingList() {
    return (
      <div className="followingContainer">
        {followingList?.map((following) => (
          <Following key={following.id} following={following} />
        ))}
      </div>
    );
  }

  return (
    <div className={ifDarkMode && "darkTheme"}>
      {/* header */}
      <div className="chatPageHeader">
        <h1>Following {followingList?.length}</h1>
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


