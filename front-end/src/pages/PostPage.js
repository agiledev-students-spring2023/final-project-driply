import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { DarkModeContext } from "../context/DarkModeContext";
import Comment from "../components/Comment";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Like from "../components/Like";

const PostPage = () => {
  const { user } = useAuthContext();
  const { ifDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [newComment, setNewComment] = useState(true);
  const [likes, setLikes] = useState([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState();
  const [pfp, setPfp] = useState();
  const [loggedInPfp, setLoggedInPfp] = useState();
  const [postError, setPostError] = useState(null);
  const { postId } = useParams();
  const [userID, setUserID] = useState(0);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const form = useRef();

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
        const response2 = await fetch(`http://localhost:4000/getUserPfp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: json.user,
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

    async function fetchLoggedInUserPfP() {
      const response = await fetch(`http://localhost:4000/getUserPfp`, {
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
        setLoggedInPfp(imageObjectURL);
      }
    }

    fetchPostInfo();
    fetchLoggedInUserPfP();
  }, [user, postId]);

  function navigateProfile() {
    navigate(`/profile/${userID}`);
  }

  const onChangeComment = (e) => {
    setComment(e.target.value);
  };

  const handleComment = (e) => {
    e.preventDefault();
    async function addComment() {
      const response = await fetch(`http://localhost:4000/createComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: postId,
          comment: comment,
          userId: user.id,
        }),
      });
      let json = await response.json();
      if (response.status === 200) {
        if (json.message === "success") {
          setCommentList([json.newComment, ...commentList]);
          setComment("");
          setNewComment(true);
        }
      } else {
        setPostError(response.status);
        setLoading(false);
      }
    }

    addComment();
  };

  return (
    <div
      className={`mb-100 postContainer overflow-auto ${
        ifDarkMode ? "darkTheme" : ""
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
      </div>
      <img className="center-block img-responsive" src={img} alt="pic" />
      <div className="description-block">
        <div className="name-in-des">{name + ": "}</div>
        {description}
      </div>

      {user && (
        <div>
          <Like likes={likes} postId={postId} />
          <div className="container">
            <Form
              onSubmit={handleComment}
              ref={form}
              className="row align-items-center"
            >
              <div className="col-auto px-0">
                <div
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="postpfp"
                >
                  {loggedInPfp && <img src={loggedInPfp} alt="user img" />}
                </div>
              </div>
              <div className="col px-0">
                <Input
                  type="text"
                  value={comment}
                  className="form-control search-query"
                  name="comment"
                  onChange={onChangeComment}
                  required
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-success btn-block">Send</button>
              </div>
            </Form>
          </div>
        </div>
      )}

      <br />
      <Comment
        postId={postId}
        loggedInID={user.id}
        likes={likes}
        commentList={commentList}
        setCommentList={setCommentList}
        newComment={newComment}
        setNewComment={setNewComment}
      />
    </div>
  );
};

export default PostPage;
