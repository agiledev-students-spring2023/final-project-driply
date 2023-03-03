import React, { useState , useEffect } from "react";

const required = (value) => {
    if (!value){
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const PostPage = () => {
    const [comment, setComment] = useState("");
    const [post, setPost] = useState(null);

    useEffect(() => {
        // Retrieve post information here and update post using setPost
    }, []);

    const onChangeComment = (e) => {
        setComment(e.target.value);
    };

    const handleComment = (e) => {
        e.preventDefault();


    };

    return (
        <div>
            Hello
        </div>
    );
};

export default PostPage;