import React, { useContext, useEffect, useState, useRef } from "react";
import TrendingCard from "../components/TrendingCard";
import searchBar from "../components/SearchBar";
import { DarkModeContext } from "../context/DarkModeContext";
import { useAuthContext } from "../hooks/useAuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function TrendingPage() {
  const { user } = useAuthContext();
  const [postList, setPostList] = useState([]);
  const [postListError, setPostListError] = useState(null);
  const [formData, setFormData] = useState({
    query: "",
    select: "content",
  });
  const formRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const { ifDarkMode } = useContext(DarkModeContext);

  useEffect(() => {
    async function fetchPostList() {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/getTrendingPosts`
      );
      let json = await response.json();
      if (response.status === 200) {
        //console.log(json);
        setPostList((oldArray) => [...json.data]);
        console.log(postList);
        setPostListError(null);
      } else {
        setPostListError({ error: json.error, status: response.status });
      }
      setLoading(false);
    }

    fetchPostList();
  }, []);

  function handleInputChange(e) {
    formData.query = e.target.value;
  }

  function handleSelectChange(e) {
    formData.select = e.target.value;
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("called");
    if (formData.query === "") {
      async function fetchPostList() {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/getTrendingPosts`
        );
        let json = await response.json();
        if (response.status === 200) {
          //console.log(json);
          setPostList((oldArray) => [...json.data]);
          console.log(postList);
          setPostListError(null);
        } else {
          setPostListError({ error: json.error, status: response.status });
        }
        setLoading(false);
      }

      fetchPostList();
      return;
    }

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/search/${formData.query}/${formData.select}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setPostList(() => [...result.data]);
        console.log(result.data);
        formData.query = "";
        formData.select = "content";
        formRef.current.reset();
      });
  }

  function quickSort(arr) {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const less = [];
    const greater = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].likes.length > pivot.likes.length) {
        greater.push(arr[i]);
      } else {
        if (i !== Math.floor(arr.length / 2)) less.push(arr[i]);
      }
    }
    console.log(less);
    console.log(greater);
    return [...quickSort(greater), pivot, ...quickSort(less)];
  }

  function DisplayPostLists() {
    const sortedPostList = quickSort([...postList]); // create a new array
    console.log(sortedPostList);
    return (
      <div className="galleryContainer">
        {sortedPostList?.map((post) => (
          <TrendingCard key={post._id} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className={`trendingPage ${ifDarkMode && "darkTheme"}`}>
      {postListError && (
        <div>
          <h1 className="error">Error Code: {postListError.status}</h1>
          <h3 className="error">{postListError.error}</h3>
        </div>
      )}

      {loading ? (
        <img
          src={ifDarkMode ? "/Driply-load-dark.png" : "/Driply-load-light.png"}
          alt="loading"
          className="loadingSpinner"
        />
      ) : (
        <div>
          <searchBar />
          <div className="row align-items-center mx-auto">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="form-inline col-12 d-flex align-items-center px-0 mx-0"
            >
              <input className="form-control" onChange={handleInputChange} />
              <div className="col-3">
                <select
                  className="form-select"
                  onChange={handleSelectChange}
                  aria-label="Default select example"
                >
                  <option value="content">Content</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  type="submit"
                  id="searchBtn"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          <DisplayPostLists />
        </div>
      )}
    </div>
  );
}

export default TrendingPage;
