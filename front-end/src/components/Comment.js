import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Comment(prop) {
  const { commentList, setCommentList } = prop;
  const { newComment, setNewComment } = prop;

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchComment() {
      const response = await fetch(`http://localhost:4000/fetchComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: prop.postId,
        }),
      });
      let json = await response.json();
      if (response.status === 200) {
        async function setCommentImages(commentList) {
          console.log(commentList);
          for (let c of commentList) {
            const response = await fetch(`http://localhost:4000/image`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                filename: c.user.profilepic,
              }),
            });

            if (response.status === 200) {
              const imageBlob = await response.blob();
              const imageObjectURL = URL.createObjectURL(imageBlob);
              c.pfp = imageObjectURL;
            }
          }
        }
        setCommentImages(json.comments).then(() => {
          setCommentList([...json.comments].reverse());
        });
      } else {
      }
    }
    if (newComment) {
      fetchComment();
      setNewComment(false);
    }
  }, [newComment]);

  function navigateProfile() {
    navigate(`/profile/${prop.loggedInID}`);
  }

  return (
    <div>
      {commentList.map((c) => (
        <div className="row align-items-center mx-auto">
          <div className="col-12 d-flex align-items-center px-0 mx-0">
            <div onClick={navigateProfile}>
              <img src={c.pfp} alt="user img" className="postpfp" />
            </div>
            <div className="d-flex flex-column align-items-left mx-2">
              <span className="username username-each-comment">
                {c.user.name}
              </span>
              <span>{c.content}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Comment;
