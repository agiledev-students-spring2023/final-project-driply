import React, { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../hooks/useAuthContext';

function PostForm() {
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState("");
  const { ifDarkMode } = useContext(DarkModeContext);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  function handleImageSelect(e) {
    setImage(e.target.files[0]);
  }

  function handlePriceChange(e) {
    setPrice(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("user", user.username);
    formData.append("price", price);
    formData.append("description", description);

    const response = await fetch(`http://localhost:4000/post-form`, {
      method: "POST",
      body: formData
    });
    let json = await response.json();
    if (response.status === 200) {
        console.log(json);
        setImage(null);
        setPrice(null);
    } else {

    }
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function promptDescriptionInput() {
    return (
      <div className="description-input-container">
        <label htmlFor="description-input" className="description-label">
          Description:
        </label>
        <input
          type="text"
          id="description-input"
          className="description-input"
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
    );
  }

  function promptPriceInput() {
    return (
      <div className="price-input-container">
        <label htmlFor="price-input" className="price-label">
          Price: {price ? `$${price}` : "-"}
        </label>
        <input
          type="number"
          id="price-input"
          className="price-input"
          value={price}
          onChange={handlePriceChange}
        />
      </div>
    );
  }

  return (
    <div className={`form-contain ${ifDarkMode && "darkTheme"}`}>
      <div className="chatPageHeader">
        <h1>Create Post</h1>
      </div>
      <form
        className="post-form"
        onSubmit={handleSubmit}
        method="POST"
        action="post-form"
      >
        <label className="input-label">
          Upload your photos
          <input
            className="input-field"
            type="file"
            onChange={handleImageSelect}
            name="image"
          />
        </label>
        {image && (
          <img
            className="preview-image"
            src={URL.createObjectURL(image)}
            alt="user img"
          />
        )}

        {image ? promptPriceInput() : null}
        {price ? promptDescriptionInput() : null}

        <input className="submit-button" type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default PostForm;
