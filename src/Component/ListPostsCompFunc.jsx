import React, { useState } from "react";
import {
  Route,
  Link,
  BrowserRouter as Router,
  Routes,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { Container, Button } from "react-bootstrap";

const header = {
  Authorization:
    "Bearer e251afb144fa11d2aa8471e44f5b6ae6a5b73d553b0bf2907a74b1df86f97a66",
};
const URL = "https://gorest.co.in/public/v2/";

function ListPostsComp({ childFunc }) {
  let { id } = useParams();
  let [post, setPost] = useState([]);
  let [Comments, setComments] = useState([]);
  let [btnValue, setbtnValue] = useState("Show Comments");
  let [CommentToggle, setCommentToggle] = useState(false);

  console.log(id);

  function handleShowPost() {
    console.log("props function");
    axios.get(`${URL}users/${id}/posts`, { header }).then((res) => {
      setPost(res.data);
    });
  }

  function handleComments(e, id) {
    let buttonValue = e.target.value;
    if (buttonValue === "Show Comments") {
      axios
        .get(`${URL}posts/1850/comments`, { header })
        .then((res) => setComments(res.data));
      setbtnValue("Hide Comments");
      setCommentToggle(true);
    } else {
      setbtnValue("Show Comments");
      setCommentToggle(false);
    }
    console.log(id);
  }

  return (
    <div>
      <Link to="/" className="btn btn-primary m-3">
        Back To User
      </Link>

      {post.length === 0 ? (
        <h1>No Posts are Found</h1>
      ) : (
        post.map((post) => (
          <div className="card mt-4" key={post.id}>
            <div className="card-body">
              <h5 className="card-title">Title</h5>
              <h6 className="card-subtitle mb-2 text-muted">{post.title}</h6>
              <p className="card-text">{post.body}</p>
              
                <Button
                  className="card-link"
                  onClick={(e) => handleComments(e, post.id)}
                  value={btnValue}
                >
                  {btnValue}
                </Button>
              
            </div>
          </div>
        ))
      )}
      {CommentToggle &&
        (Comments.length === 0 ? (
          <h1>No Comments Found</h1>
        ) : (
          Comments.map((Comments) => (
            <div
              className="card mt-4"
              key={Comments.id}
              style={{ width: "18rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">{Comments.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {Comments.email}
                </h6>
                <p className="card-text">{Comments.body}</p>
              </div>
            </div>
          ))
        ))}
    </div>
  );
}

export default ListPostsComp;
