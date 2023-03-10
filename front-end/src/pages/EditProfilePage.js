import React, { useContext, useRef, useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { useNavigate } from 'react-router-dom';
import { DarkModeContext } from "../context/DarkModeContext";

function EditProfilePage() {

    const navigate = useNavigate();
    const { user } = useAuthContext();
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();
    const [modalOpen, setModalOpen] = useState(false);
    const [savedChanges, setSavedChanges] = useState(false);
    const [errorSaving, setErrorSaving] = useState(null);
    const { ifDarkMode } = useContext(DarkModeContext);

    const handleSubmit = () => {
        setSavedChanges(false);
        setErrorSaving(null);

        // user updating username and password
        if (usernameInputRef.current.value.length !== 0 && passwordInputRef.current.value.length !== 0 && confirmPasswordInputRef.current.value.length !== 0) {
            if (passwordInputRef.current.value !== confirmPasswordInputRef.current.value) {
                setErrorSaving("Error: Passwords are not matching");
            } else {
                setSavedChanges(true);
                setErrorSaving(null);
            }

        // udating password only
        } else if (passwordInputRef.current.value.length !== 0 && confirmPasswordInputRef.current.value.length !== 0) {
            if (passwordInputRef.current.value === confirmPasswordInputRef.current.value) {
                setErrorSaving("Error: Passwords are not matching");
            } else {
                setSavedChanges(true);
                setErrorSaving(null);
            }

        // updating username only
        } else if (usernameInputRef.current.value.length !== 0) {
            setSavedChanges(true);
            setErrorSaving(null);
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