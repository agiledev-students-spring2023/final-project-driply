import React, { useContext, useRef, useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../context/DarkModeContext";

function EditProfilePage() {
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  // hooks to store data
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const [modalOpen, setModalOpen] = useState(false);
  const [pfp, setPfp] = useState(null);
  const [savedChanges, setSavedChanges] = useState(false);
  const [errorSaving, setErrorSaving] = useState(null);
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function fetchPfp() {
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
      }
    }
    fetchPfp();
  }, [user?.id]);

  const saveChanges = async (username, password) => {
    console.log(username, password);
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/editProfile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id, // temp until db working
        name: username,
        password: password,
      }),
    });

    const json = await response.json();
    if (json.success) {
      console.log(json);

      const { token, username, id, profilePic } = json;
      const user = { token, username, id, profilePic };

      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(user));

      // update the auth context
      dispatch({ type: "LOGIN", payload: user });
      setErrorSaving(null);
      setSavedChanges(true);
      usernameInputRef.current.value = "";
      passwordInputRef.current.value = "";
      confirmPasswordInputRef.current.value = "";
    } else {
      setErrorSaving(json.error);
      setSavedChanges(false);
    }
  };

  const changePfp = (e) => {
    e.preventDefault();
    async function addComment() {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      formData.append("userId", user.id);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/changePfp`, {
        method: "POST",
        body: formData,
      });
      let json = await response.json();
      if (response.status === 200) {
        if (json.message === "success") {
          setPfp(URL.createObjectURL(e.target.files[0]));
          setModalOpen(false);
        }
      } else {
      }
    }

    addComment();
  };

  const handleSubmit = async () => {
    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;
    const confirmedPassword = confirmPasswordInputRef.current.value;
    setErrorSaving(null);
    setSavedChanges(false);

    if (
      username.length === 0 &&
      (password.length === 0) & (confirmedPassword.length === 0)
    ) {
      setErrorSaving("Empty fields");
      return;
    } else {
      if (password !== confirmedPassword) {
        setErrorSaving("passwords don't match");
        return;
      }

      saveChanges(username, password);
    }
  };

  return (
    <>
      <div className={`editProfilePage ${ifDarkMode && "darkTheme"}`}>
        {/* header */}
        <div
          className={`${
            ifDarkMode ? "editProfileHeader-dark" : "editProfileHeader"
          }`}
        >
          <p onClick={() => navigate("/settings")}>Cancel</p>
          <p>Edit Profile</p>
          <p onClick={handleSubmit}>Save</p>
        </div>

        <div className={`editProfileBody`}>
          {/* users image */}
          <div onClick={() => setModalOpen(true)} className="editProfileImg">
            <img src={pfp} alt="profile pic" />
            <InsertPhotoIcon
              sx={{
                position: "absolute",
                top: "15px",
                right: "0px",
                backgroundColor: "#BDCDD6",
                fontSize: "60px",
                padding: "10px",
                zIndex: 10,
                color: "white",
                borderRadius: "50%",
              }}
            />
          </div>

          {/* change username and password form */}
          <div>
            <label>EDIT USERNAME</label>
            <input
              ref={usernameInputRef}
              type="text"
              placeholder={user?.username}
            />
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
            <label className="input-label-pfp">
              Upload a new pfp
              <input
                className="input-field"
                type="file"
                onChange={changePfp}
                name="changePfp"
              />
            </label>
            {/* <p>Delete picture</p> */}
          </div>

          <div onClick={() => setModalOpen(false)} className="editProfileBtns">
            <p className="cancelBtn">Cancel</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfilePage;
