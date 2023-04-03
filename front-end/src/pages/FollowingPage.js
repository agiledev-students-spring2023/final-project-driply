import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

function FollowingPage() {
  const [followingList, setFollowingList] = useState([]);
  const [followingError, setFollowingError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function fetchFollowingList() {
      const response = await fetch(`http://localhost:4000/following`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let json = await response.json();
      if (json.status === 200) {
        setFollowingList(json.data);
        setFollowingError(null);
        setLoading(false);
        console.log(json);
      } else {
        console.log(json.error);
        setFollowingError({ error: json.error, status: json.status });
        setLoading(false);
      }
    }

    fetchFollowingList();
  }, []);

  
}

export default FollowingPage;


