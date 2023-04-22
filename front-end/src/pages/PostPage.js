import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import Comment from "../components/Comment";

const PostPage = () => {
  //const { user } = useAuthContext();
  const { ifDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  //const [comment, setComment] = useState("");
  //const [commentList, setCommentList] = useState([]);
  const [likes, setLikes] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState();
  const [pfp, setPfp] = useState();
  const [postError, setPostError] = useState(null);
  const { postId } = useParams();
  const [userID, setUserID] = useState(0);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState(""); // remove after sprint 1, only used to randomize displayed username using mockaroo

  // this is just temp to get different imgs and sizes
  const randomProfileSize = [
    350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380,
  ];
  const randomProfileIndex = Math.floor(
    Math.random() * randomProfileSize.length
  );
  const randomPostSize = [
    350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380,
  ];
  const randomPostIndex = Math.floor(Math.random() * randomPostSize.length);


  useEffect(() => {
    async function fetchPostInfo() {
      const response = await fetch(`http://localhost:4000/getPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
        }),
      });
      let json = await response.json();
      if (response.status === 200) {
        console.log(json);
        let arr = [...json.likes];
        setLikes(arr);
        setName(json.username);
        setDescription(json.description);
        setPrice(json.price);
        setUserID(json.user);
        setPostError(null);
        setLoading(false);
        const response = await fetch(`http://localhost:4000/image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: json.image,
          }),
        });
        if (response.status === 200) {
          const imageBlob = await response.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setImg(imageObjectURL);
        }
        const response2 = await fetch(`http://localhost:4000/image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: json.pfp,
          }),
        });
        if (response2.status === 200) {
          const imageBlob = await response2.blob();
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setPfp(imageObjectURL);

        }
      } else {
        setPostError(response.status);
        setLoading(false);
      }
    }

    fetchPostInfo();
  }, []);

  function navigateProfile() {
    navigate(`/profile/${userID}`);
  }


  return (
    <div
      className={`mb-100 postContainer overflow-auto ${
        ifDarkMode && "darkTheme"
      } postPage`}
    >
      <div className="row align-items-center mx-auto">
        <div className="col-8 d-flex align-items-center px-0 mx-auto">
          <div onClick={navigateProfile} className="postpfp">
            <img src={pfp} alt="user img" />
          </div>
          <span onClick={navigateProfile}>{name}</span>
        </div>
        <div className="col-4 d-flex justify-content-end px-0 mx-auto">
          <span className="mr-3">${price}</span>
      </div>
      <img className="center-block img-responsive" src={img} alt="pic" />
      {description}
      <br />
      <Comment postId={postId} likes={likes} />
    </div>
  );
};

export default PostPage;
