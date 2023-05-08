import React, { useContext, useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Switch from "@mui/material/Switch";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import InfoIcon from "@mui/icons-material/Info";
import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import NotificationsIcon from "@mui/icons-material/Notifications";

function SettingsPage() {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { ifDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [pfp, setPfp] = useState(null);
  const [noti, setNoti] = useState("");

  const handleDarkThemeChange = () => {
    toggleDarkMode();
  };
  const hanldeNotificationChange = () => {
    let notification = JSON.parse(localStorage.getItem("notifications"));
    if (notification) {
      notification = notification === "on" ? "off" : "on";
      localStorage.setItem("notifications", JSON.stringify(notification));
      setNoti(notification);
    } else {
      setNoti("on");
      localStorage.setItem("notifications", JSON.stringify("on"));
    }
  };

  const logOut = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  useEffect(() => {
    async function fetchPfp() {
      if (user.id) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getUserPfp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        });

        if (response.status === 200) {
          const imageBlob = await response.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setPfp(imageObjectURL);
          let notification = JSON.parse(localStorage.getItem("notifications"));
          if (!notification) {
            notification = "on";
          }
          setNoti(notification);
        }
      }
    }
    fetchPfp();
  }, [user?.id]);

  return (
    <>
      {user ? (
        <div
          className={
            ifDarkMode ? "settingsPage settingsPage-Dark" : "settingsPage"
          }
        >
          <h1>Profile</h1>

          <div
            onClick={() => navigate("/editprofile")}
            className="showProfileBtn"
          >
            {pfp && (
              <img
                src={pfp}
                alt="profile pic"
              />
            )}
            <div className="showProfileName">
              <p>{user?.username}</p>
              <p>Show profile</p>
            </div>
            <ArrowForwardIosIcon />
          </div>

          <h2>Account Settings</h2>

          <div className="accountSettingBtns">
            <div>
              <DarkModeIcon sx={{ fontSize: "25px" }} />
              <p>Dark Mode</p>
              <Switch
                checked={ifDarkMode}
                onChange={handleDarkThemeChange}
              />
            </div>

            <div>
              <NotificationsIcon sx={{ fontSize: "30px" }} />
              <p>Notifications</p>
              <Switch
                checked={noti === "on" ? true : false}
                onChange={hanldeNotificationChange}
              />
            </div>
          </div>

          <h2>Support</h2>

          <div className="supportBtns">
            <div onClick={() => navigate("/aboutus")}>
              <InfoIcon sx={{ fontSize: "25px" }} />
              <p>About us</p>
              <ArrowForwardIosIcon />
            </div>
          </div>

          <div
            onClick={logOut}
            id="logoutBtn"
          >
            Log out
          </div>
        </div>
      ) : (
        <div className="notLoggedInBookmark">
          <h2>You are not logged in</h2>

          <div
            onClick={() => navigate("/login")}
            className="displayLogInBtn"
          >
            Login
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsPage;
