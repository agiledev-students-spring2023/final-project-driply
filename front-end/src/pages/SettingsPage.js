import React, { useContext } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Switch from '@mui/material/Switch';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import InfoIcon from '@mui/icons-material/Info';
import CreateIcon from '@mui/icons-material/Create';
import { useLogout } from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

function SettingsPage() {

    const { logout } = useLogout();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { ifDarkMode, toggleDarkMode } = useContext(DarkModeContext);

    const handleDarkThemeChange = () => {
        toggleDarkMode();
    }

    const logOut = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
      };

    return (
        <>
            {user ? (
                <div className={ifDarkMode ? "settingsPage settingsPage-Dark" : "settingsPage"}>
                    <h1>Profile</h1>
        
                    <div onClick={() => navigate("/editprofile")} className="showProfileBtn">
                        <img src="https://picsum.photos/100/100" alt="profile pic"/>
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
                            <Switch checked={ifDarkMode} onChange={handleDarkThemeChange} />
                        </div>
        
                        <div>
                            <FavoriteIcon sx={{ fontSize: "25px" }} />
                            <p>Your likes</p>
                            <ArrowForwardIosIcon />
                        </div>
        
                        <div>
                            <ChatBubbleIcon sx={{ fontSize: "25px" }} />
                            <p>Your comments</p>
                            <ArrowForwardIosIcon />
                        </div>
                    </div>
        
                    <h2>Support</h2>
        
                    <div className="supportBtns">
                        <div>
                            <InfoIcon sx={{ fontSize: "25px" }} />
                            <p>About us</p>
                            <ArrowForwardIosIcon />
                        </div>
        
                        <div>
                            <CreateIcon sx={{ fontSize: "25px" }} />
                            <p>Give us feedback</p>
                            <ArrowForwardIosIcon />
                        </div>
                    </div>
        
                    <div onClick={logOut} id="logoutBtn">
                        Log out
                    </div>
        
                </div>
            ) : (
                <div className="notLoggedInBookmark">
                    <h2>You are not logged in</h2>

                    <div onClick={() => navigate("/login")} className="displayLogInBtn">Login</div>
                </div>
            )}
        </>
    )
}

export default SettingsPage;