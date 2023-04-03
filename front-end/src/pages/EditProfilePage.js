import React, { useContext, useRef, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from "../context/DarkModeContext";

function EditProfilePage() {

    const navigate = useNavigate();
    const { user, dispatch } = useAuthContext();

    // hooks to store data
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();

    const [modalOpen, setModalOpen] = useState(false);
    const [savedChanges, setSavedChanges] = useState(false);
    const [errorSaving, setErrorSaving] = useState(null);
    const { ifDarkMode } = useContext(DarkModeContext);

    const saveChanges = async (username, password) => {
        console.log(username, password);
        const user = JSON.parse(localStorage.getItem("user"));
            const response = await fetch("http://localhost:4000/editProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "userId": user.id, // temp until db working
                    "username": username,
                    "password": password,
                })
            });

            const json = await response.json();
            if (json.status === 200) {
                const ifNewUsername = (username.length > 0) ? username : user.username;
                user.username = ifNewUsername;

                // save the user to local storage
                localStorage.setItem("user", JSON.stringify(user));
                
                // update the auth context
                dispatch({type: 'LOGIN', payload: user});
                setErrorSaving(null);
                setSavedChanges(true);
                usernameInputRef.current.value = "";
                passwordInputRef.current.value = "";
                confirmPasswordInputRef.current.value = "";
            } else {
                setErrorSaving(json.error);
                setSavedChanges(false);
            }
    }

    const handleSubmit = async () => {
        const username = usernameInputRef.current.value;
        const password = passwordInputRef.current.value;
        const confirmedPassword = confirmPasswordInputRef.current.value;
        setErrorSaving(null);
        setSavedChanges(false);

        if (username.length === 0 && password.length === 0 & confirmedPassword.length === 0) {
            setErrorSaving("Empty fields");
            return;
        } else {
            if (password !== confirmedPassword) {
                setErrorSaving("passwords don't match");
                return;
            }

            saveChanges(username, password);
        }

    }

    return (
        <>
            <div className={`editProfilePage ${ifDarkMode && "darkTheme"}`}>

                {/* header */}
                <div className={`${ifDarkMode ? "editProfileHeader-dark" : "editProfileHeader"}`}>
                    <p onClick={() => navigate("/settings")}>Cancel</p>
                    <p>Edit Profile</p>
                    <p onClick={handleSubmit}>Save</p>
                </div>
                
                <div className={`editProfileBody`}>
                    {/* users image */}
                    <div onClick={() => setModalOpen(true)} className="editProfileImg">
                        <img src="https://picsum.photos/150/150" alt="profile pic"/>
                        <InsertPhotoIcon sx={{ position: "absolute", top: "15px", right: "0px", backgroundColor: "#BDCDD6", fontSize: "60px", padding: "10px", zIndex: 10, color: "white", borderRadius: "50%" }} />
                    </div>
                    
                    {/* change username and password form */}
                    <div>
                        <label>EDIT USERNAME</label>
                        <input ref={usernameInputRef} type="text" placeholder={user?.username}/>
                    </div>

                    <div>
                        <label>EDIT PASSWORD</label>
                        <input ref={passwordInputRef} type="password" />
                    </div>

                    <div>
                        <label>CONFIRM PASSWORD</label>
                        <input ref={confirmPasswordInputRef} type="password" />
                    </div>

                    {savedChanges && <h4 className="success">Saved changes!</h4>}
                    {errorSaving && <h4 className="error">{errorSaving}</h4>}
                </div>
            </div>

            <div className={`editProfileModal ${modalOpen ? "" : "hideModal"}`}>
                <div onClick={() => setModalOpen(false)} className="blackBg"></div>
                <div className={`editPicture ${modalOpen ? "slideUpAnimation" : ""}`}>
                    <div className="editProfileBtns">
                        <p>Replace picture</p>
                        <p>Delete picture</p>
                    </div>
                    <div onClick={() => setModalOpen(false)} className="editProfileBtns">
                        <p className="cancelBtn">Cancel</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfilePage;