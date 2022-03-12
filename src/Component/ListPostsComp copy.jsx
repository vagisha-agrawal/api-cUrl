import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

const header = {
  Authorization:
    "Bearer e251afb144fa11d2aa8471e44f5b6ae6a5b73d553b0bf2907a74b1df86f97a66",
};
const URL = "https://gorest.co.in/public/v2/";

export default class ListPostsComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: [],
      btnValue: "Show Comments",
      commentToggle: false,
      comments: [],

    };
  }
  componentDidMount() {
    /* console.log(this.props.id)
    console.log(this.props.name) */
    this.handleShowPost();
  }
  handleShowPost() {
    let id = this.props.id;

    axios.get(`${URL}users/${id}/posts`, { header }).then((res) => {
      this.setState({ post: res.data });
      console.log(res.data);
    });
  }

  handleComments(e, id) {
    console.log(id);
    let buttonValue = e.target.value;
    axios
      .get(`${URL}posts/${id}/comments`, { header })
      .then((res) => this.setState({comments:res.data}) );
    
      // if (buttonValue === "Show Comments") {
      //   this.setState({ btnValue: "Hide Comments", commentToggle: true });
      // } else {
      //   this.setState({ btnValue: "Show Comments", commentToggle: false });
      // }
    
    
  }

  render() {
    let { post, btnValue,commentToggle,comments,display } = this.state;
    let name = this.props.name;
    // console.log({post})
    return (
      <>
        <Button>
          <Link to="/" style={{ color: "white" }}>
            Back To User
          </Link>
        </Button>

        {post.length === 0 ? (
          <h1>No Posts are Found</h1>
        ) : (
          post.map((post) => (
            <div className="card mt-4" key={post.id} id={post.id} style={{display:display}}>
              <div className="card-body">
                <h5 className="card-title">{post.id} {name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{post.title}</h6>
                <p className="card-text">{post.body}</p>
                <Button
                  className="card-link"
                  onClick={(e) => this.handleComments(e, post.id)}
                  value={btnValue}
                >
                  {btnValue}
                </Button>
                <div>
                  {commentToggle &&
                    (comments.length === 0 ? (
                      <h1>No Comments Found</h1>
                    ) : (
                      comments.map((Comments) => (
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
              </div>
            </div>
          ))
        )}
      </>
    );
  }
}
