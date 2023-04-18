import React, { useContext, useEffect, useState } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Switch from '@mui/material/Switch';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import { useLogout } from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { DarkModeContext } from '../context/DarkModeContext';

function SettingsPage() {

    const { logout } = useLogout();
    const { user } = useAuthContext();
    const navigate = useNavigate();
    const { ifDarkMode, toggleDarkMode } = useContext(DarkModeContext);
    const [pfp, setPfp] = useState(null);

    const handleDarkThemeChange = () => {
        toggleDarkMode();
    }

    const logOut = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    useEffect(() => {
        async function fetchPfp() {
            const response = await fetch(`http://localhost:4000/getUserPfp`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "userId": user.id,
                })
            });

            if (response.status === 200) {
                const imageBlob = await response.blob();
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setPfp(imageObjectURL);
            }
        }
        fetchPfp();
    }, [user?.id]);

    return (
        <>
            {user ? (
                <div className={ifDarkMode ? "settingsPage settingsPage-Dark" : "settingsPage"}>
                    <h1>Profile</h1>
        
                    <div onClick={() => navigate("/editprofile")} className="showProfileBtn">
                        {pfp && <img src={pfp} alt="profile pic"/>}
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
        
                        {/* <div>
                            <FavoriteIcon sx={{ fontSize: "25px" }} />
                            <p>Your likes</p>
                            <ArrowForwardIosIcon />
                        </div>
        
                        <div>
                            <ChatBubbleIcon sx={{ fontSize: "25px" }} />
                            <p>Your comments</p>
                            <ArrowForwardIosIcon />
                        </div> */}
                    </div>
        
                    <h2>Support</h2>
        
                    <div className="supportBtns">
                        <div onClick={() => navigate("/aboutus")}>
                            <InfoIcon sx={{ fontSize: "25px" }} />
                            <p>About us</p>
                            <ArrowForwardIosIcon />
                        </div>
        
                        {/* <div>
                            <CreateIcon sx={{ fontSize: "25px" }} />
                            <p>Give us feedback</p>
                            <ArrowForwardIosIcon />
                        </div> */}
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