import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function BottomNavBar() {
  const navigate = useNavigate();
  let location = useLocation();
  let splitPath = location.pathname.split("/");

  // hide navbar when needed
  let ifHide;
  if (splitPath.includes("chatroom")) {
    ifHide = true;
  } else {
    ifHide = false;
  }

  return (
    <>
      {ifHide ? (
        <div></div>
      ) : (
        <div className="bottomNavBar">
          <div onClick={() => navigate("/")}>{(location.pathname === "/") ? <HomeIcon fontSize="large"/> : <HomeOutlinedIcon />}</div>
          <div onClick={() => navigate("/trending")}><TrendingUpOutlinedIcon fontSize={(location.pathname === "/trending") ? "large" : "medium"} /></div>
          <div onClick={() => navigate("/postform")}>{(location.pathname === "/postform") ? <AddBoxIcon fontSize="large"/> : <AddBoxOutlinedIcon />}</div>
          <div onClick={() => navigate("/profile")}>{(location.pathname === "/profile") ? <AccountBoxIcon fontSize="large"/> : <AccountBoxOutlinedIcon />}</div>
        </div>
      )}
    </>
  );
}

export default BottomNavBar;
