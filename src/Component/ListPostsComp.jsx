import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Button,
  Row,
  Spinner,
  Container,
  Modal,
  Form,
  InputGroup,
} from "react-bootstrap";

import "../App.css";

const headers = {
  Authorization:
    "Bearer 7a05df32ac888977333566633809a54ed07a3def62098ad2e531b394b433e5c1",
};
const URL = "https://gorest.co.in/public/v2/";

export default class ListPostsComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      posts: [],
      formToggle: false,
      btnValue: "Show Comments",
      commentToggle: false,
      comments: [],
      showMsg: "",
      commentWiseLoader: false,
      addPost: {
        title: "",
        body: "",
      },
    };
  }
  componentDidMount() {
    /* console.log(this.props.id)
    console.log(this.props.name) */
    this.setState({ loading: true }, () => this.handleShowPost());
  }

  handleShowPost() {
    let id = this.props.id;

    axios.get(`${URL}users/${id}/posts`, { headers }).then((res) => {
      this.setState({ posts: res.data, loading: false });
    });
  }

  handleChange = ({ target }) => {
    let id=this.props.id;
    this.setState({
      addPost: { ...this.state.addPost, [target.name]: target.value,user_id:id },
    });
  };

  handleSubmit=()=>{
    const {addPost}=this.state;
    axios
        .post(`${URL}posts`, addPost, { headers })
        .then((res) => {
          this.setState({
            showMsg: true,
            message: "Data stored Successfully",
            msgStyle: "success",
          });
          setTimeout(() => {
            this.setState({ formToggle: !this.state.formToggle });
          }, 1000);
        })

        .catch((error) => {
          console.log(">error", error);
          if (error.response) {
            this.setState({
              message: "Duplicate data cant be stored",
              showMsg: true,
              msgStyle: "danger",
            });
          }
        });
      setTimeout(() => {
        this.setState({ showMsg: false });
        this.handleShowPost();
      }, 1000);
  }

  handleComments(e, id) {
    let buttonValue = e.target.value;
    this.setState({ commentWiseLoader: true, getID: parseInt(id) }, () => {
      if (buttonValue === "Show Comments") {
        axios.get(`${URL}posts/${id}/comments`, { headers }).then((res) =>
          this.setState({
            comments: res.data,
            btnValue: "Hide Comments",
            commentToggle: true,
            commentWiseLoader: false,
          })
        );
      } else {
        this.setState({
          btnValue: "Show Comments",
          commentToggle: false,
          commentWiseLoader: false,
        });
      }
    });
  }

  handleShowModal = () => {
    this.setState({
      formToggle: !this.state.formToggle,
      showMsg: false,
    });
  };

  render() {
    let {
      posts,
      btnValue,
      commentToggle,
      comments,
      getID,
      loading,
      commentWiseLoader,
      formToggle,
      addPost,
    } = this.state;
    let name = this.props.name;

    console.log({ addPost });
    return (
      <Container style={{ marginTop: "3rem" }}>
        <Button>
          <Link to="/" style={{ color: "white" }}>
            Back To User
          </Link>
        </Button>
        <Button
          variant="primary"
          value="Submit"
          style={{ marginLeft: "1rem" }}
          onClick={this.handleShowModal}
        >
          Add Post
        </Button>
        <h2
          style={{
            textAlign: "center",
            marginTop: "20px",
            textDecoration: "underline",
          }}
        >
          {name}
        </h2>

        {loading ? (
          <div className="Spinner-div">
            <Spinner animation="border" className="Spinner" size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <h1
            style={{
              textAlign: "center",
              marginTop: "10px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            No posts are found
          </h1>
        ) : (
          posts.map((post, index) => (
            <div className="card" key={post.id} id={post.id}>
              <h1 style={{ textAlign: "center" }}>Post no.{index + 1}</h1>
              <div className="card-body">
                <h6 className="card-subtitle mb-2 text-muted">{post.title}</h6>
                <p className="card-text">{post.body}</p>
                <Button
                  className="card-link"
                  disabled={commentWiseLoader === true}
                  onClick={(e) => this.handleComments(e, post.id)}
                  value={getID === post.id ? btnValue : "Show Comments"}
                >
                  {getID === post.id ? btnValue : "Show Comments"}
                  {getID === post.id && commentWiseLoader && (
                    <Spinner
                      animation="border"
                      style={{ marginLeft: "10px" }}
                      size="sm"
                    />
                  )}
                </Button> 

                {commentToggle &&
                  getID === post.id &&
                  (comments.length === 0 ? (
                    <h1>No Comments Found</h1>
                  ) : (
                    <Row>
                      {comments.map((comment) => (
                        <div className="col-6" key={comment.id}>
                          <div className="card mt-4" style={{ width: "18rem" }}>
                            <div className="card-body">
                              <h5 className="card-title">{comment.name}</h5>
                              <p className="card-text">{comment.body}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Row>
                  ))}
              </div>
            </div>
          ))
        )}

        <Modal show={formToggle} onHide={this.handleShowModal}>
          <Modal.Header>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              <InputGroup className="mb-3">
                <InputGroup.Text>Topic</InputGroup.Text>
                <Form.Control
                  type="text"
                  value={addPost.topic}
                  name="title"
                  placeholder="Your Topic"
                  onChange={this.handleChange}
                  aria-label="Topic"
                />
              </InputGroup>

              <InputGroup>
                <InputGroup.Text>Description</InputGroup.Text>
                <Form.Control
                  as="textarea"
                  name="body"
                  aria-label="Description"
                  value={addPost.description}
                  onChange={this.handleChange}
                />
              </InputGroup>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleShowModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={this.handleSubmit}
              value="Submit"
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
