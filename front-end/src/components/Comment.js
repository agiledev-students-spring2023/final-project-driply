import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Like from "../components/Like";

function Comment(prop) {
    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState([]);
    const [fakeName, setFakeName] = useState(""); // remove after sprint 1, only used to randomize displayed username using mockaroo
    const [info, setInfo] = useState(null);
    const { user } = useAuthContext();
    const [postError, setPostError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const form = useRef();

    // this is just temp to get different imgs and sizes
    // const randomProfileSize = [350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380];
    // const randomProfileIndex = Math.floor(Math.random() * randomProfileSize.length);
    // const randomPostSize = [350, 300, 250, 200, 230, 240, 310, 320, 330, 360, 380];
    // const randomPostIndex = Math.floor(Math.random() * randomPostSize.length);


    useEffect(() => {
        async function fetchComment() {
            const response = await fetch(`http://localhost:4000/fetchComment`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
                // body: JSON.stringify({
                //     "postId": id
                // })
            });
            let json = await response.json();
            if (response.status === 200) {
                console.log(json);
                setFakeName(json.username);
                setCommentList(json.comments);
            } else {

            }
        }
        console.log(prop);
        fetchComment();
    }, []);

    const onChangeComment = (e) => {
        setComment(e.target.value);
    };

    const handleComment = (e) => {
        e.preventDefault();
        async function addComment() {
            const response = await fetch(`http://localhost:4000/createComment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                // body: JSON.stringify({
                //     "postId": id,
                //     "comment": comment
                // })
            });
            let json = await response.json();
            if (response.status === 200) {
                console.log(json);
                if (json.message === "success"){
                    setCommentList([comment, ...commentList]);
                    setComment('');
                }
            } else {
                setPostError(response.status);
                setLoading(false);
            }
        }

        addComment();
    };
    
    return (
        <div>
            {user && (
                <div>
                    <Like likes={prop.likes} postId={prop.postId}/>
                    <div class="container">
                        <Form onSubmit={handleComment} ref={form} class="row align-items-center">
                            <div className="col-auto px-0">
                            <div onClick={() => navigate("/profile")} className="postpfp">
                                <img src={`https://picsum.photos/id/22/131/150`} alt="user img"/>
                            </div>    
                            </div>
                            <div class="col px-0">
                                <Input
                                    type="text"
                                    value={comment}
                                    className="form-control search-query"
                                    name="comment"
                                    onChange={onChangeComment}
                                    required
                                />
                            </div>
                            <div class="col-auto">
                            <button className="btn btn-success btn-block">Submit</button>
                            </div>
                        </Form>
                    </div>
                </div>
            )}
            {commentList.map(c => (
                <div className="row align-items-center mx-auto">
                    <div className="col-12 d-flex align-items-center px-0 mx-0">
                        <div onClick={() => navigate("/profile")}>
                            <img src={`https://picsum.photos/id/22/131/150`} alt="user img" className="postpfp"/>
                        </div>
                        <div className="d-flex flex-column align-items-left mx-2">
                            <span className="username">{fakeName}</span>
                            <span>{c}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Comment;