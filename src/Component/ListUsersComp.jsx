import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

import axios from "axios";
import {
  Container,
  Button,
  Modal,
  Spinner,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

import "../App.css";

const tableHeader = [
  "#",
  "id",
  "Full Name",
  "Email",
  "Gender",
  "Status",
  "Action",
];

const headers = {
  Authorization:
    "Bearer 7a05df32ac888977333566633809a54ed07a3def62098ad2e531b394b433e5c1",
};

const URL = "https://gorest.co.in/public/v2/users";

export default class ListUsersComp extends Component {
  // Constructor
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      loading: false,
      formToggle: false,
      statusON: true,
      showMsg: false,
      pageWiseLoader: false,
      paginationLimit: 20,
      message: "",
      pageNumber: 1,
      msgStyle: "",
      totalPages: 0,
      btnValue: "Submit",
      addUsers: {
        name: "",
        email: "",
        gender: "",
        status: "active",
      },
      currentPage: 0,
      filter: {
        status: "",
        gender: "",
        name: "",
      },
      indexFrom: 1,
    };
  }

  componentDidMount() {
    const { paginationLimit } = this.state;
    if (
      sessionStorage.getItem("Page Number") === null ||
      sessionStorage.getItem("Page Number") === "2"
    ) {
      sessionStorage.setItem("Page Number", "1");
    }

    const indexFrom =
      (parseInt(sessionStorage.getItem("Page Number")) - 1) * paginationLimit +
      1;
    this.setState(
      {
        loading: true,
        pageNumber: sessionStorage.getItem("Page Number"),
        indexFrom,
      },
      () => this.handleShowData()
    );
  }

  handleReset = () => {
    this.setState({
      addUsers: {
        name: "",
        email: "",
        gender: "",
        status: "active",
      },
    });
  };

  handleShowData = () => {
    const { pageNumber } = this.state;

    sessionStorage.setItem("Page Number", pageNumber);

    axios
      .get(`${URL}?page=${pageNumber}`, { headers })
      .then((response) => {
        const totalPages = parseInt(response.headers["x-pagination-pages"]);
        const paginationLimit = parseInt(
          response.headers["x-pagination-limit"]
        );
        // const indexFrom = (parseInt(pageNumber) - 1) * paginationLimit + 1;

        this.setState(
          {
            users: response.data,
          },
          () =>
            this.setState({
              totalPages,

              pageWiseLoader: false,
              loading: false,
              paginationLimit,
            })
        );
      })
      .catch((error) => {
        console.log("error", error);
        if (error.response) {
          console.log("message cant be loaded");
        }
      });
  };

  handleChange = ({ target }) => {
    if (target.name === "status") {
      target.value = target.checked ? "active" : "inactive";
    } else if (target.name === "gender") {
      target.value = target.id === "male" ? "male" : "female";
    }

    this.setState({
      addUsers: { ...this.state.addUsers, [target.name]: target.value },
    });
  };

  handleSubmit = () => {
    const { addUsers, btnValue } = this.state;
    this.setState({ pageWiseLoader: true });

    if (btnValue === "Submit") {
      axios
        .post(URL, addUsers, { headers })
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
        this.handleShowData();
      }, 1000);
    } else if (btnValue === "Update") {
      axios.put(`${URL}/${addUsers.id}`, addUsers, { headers });

      this.setState({
        showMsg: true,
        message: "Data Updated Successfully",
        msgStyle: "success",
      });
      setTimeout(() => {
        this.handleShowModal();
        this.handleShowData();
      }, 1000);
    }
  };

  handleShowModal = () => {
    this.handleReset();

    this.setState({
      formToggle: !this.state.formToggle,
      showMsg: false,
      btnValue: "Submit",
    });
  };

  handleDelete = (e, id) => {
    if (window.confirm("Do you want to delete this record?")) {
      axios
        .delete(`${URL}/${id}`, { headers })
        .then((res) => {
          const users = this.state.users.filter((item) => item.id !== id);
          this.setState({ users });
        })
        .catch((error) => {
          console.log(error);
          if (error.response) {
            console.log("data didn't deleted");
          }
        });
    }
  };

  handleUpdate = (e, index) => {
    let users = this.state.users;

    users[index].status === "active"
      ? this.setState({ statusON: true })
      : this.setState({ statusON: false });

    this.setState({
      addUsers: users[index],
      btnValue: "Update",
      formToggle: !this.state.toggle,
      showMsg: false,
    });
  };

  //to get page number

  getPageNumber = ({ selected }) => {
    const { paginationLimit } = this.state;
    const pageNumber = selected + 1;

    const indexFrom = selected * paginationLimit + 1;
    this.setState({ pageNumber, indexFrom, pageWiseLoader: true }, () =>
      this.handleShowData(pageNumber)
    );
  };

  //-----------------------

  // for search form

  getFilterValue({ target }) {
    if (target.name === "status") {
      target.value = target.checked ? "active" : "inactive";
    } else if (target.name === "gender") {
      target.value = target.id === "modalmale" ? "male" : "female";
    }

    this.setState({
      filter: {
        ...this.state.filter,
        [target.name]: target.value.toLowerCase(),
      },
    });
  }

  handleFilterReset = () => {
    let { pageNumber } = this.state;
    this.setState(
      {
        filter: {
          name: "",
          status: "",
          gender: "",
        },
        pageWiseLoader: true,
      },
      () => {
        axios.get(`${URL}?page=${pageNumber}`, { headers }).then((res) => {
          this.setState({ users: res.data, pageWiseLoader: false });
        });
      }
    );
  };

  handleFilter = () => {
    let { filter, pageNumber } = this.state;
    this.setState({ pageWiseLoader: true });
    const params = Object.keys(filter)
      .map(function (key) {
        return filter[key] && key + "=" + filter[key];
      })
      .filter((v) => v);

    axios
      .get(
        `${URL}?page=${pageNumber}${
          (params.length && "&" + params.join("&")) || ""
        }`,
        {
          headers,
        }
      )
      .then((res) => {
        this.setState({ users: res.data, pageWiseLoader: false });
      });
  };

  //-----end------

  render() {
    const {
      users,
      loading,
      showMsg,
      message,
      msgStyle,
      addUsers,
      statusON,
      btnValue,
      filter,
      totalPages,
      indexFrom,
      formToggle,
      pageWiseLoader,
    } = this.state;

    return (
      <Container>
        <>
          <Row>
            <div className="col-6">
              <Button
                variant="primary"
                size="lg"
                value="Submit"
                className="mt-4"
                onClick={this.handleShowModal}
              >
                Add Employee
              </Button>
            </div>
          </Row>

          {loading ? (
            <div className="Spinner-div">
              <Spinner animation="border" className="Spinner" size="lg" />
            </div>
          ) : (
            <>
              <fieldset className="mt-3">
                <legend>Filter</legend>
                <Form>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Status</InputGroup.Text>
                    <span style={{ marginLeft: "5px", marginRight: "8px" }}>
                      Inactive
                    </span>

                    <Form.Check
                      type="switch"
                      checked={filter.status === "active"}
                      id="status"
                      onChange={(e) => this.getFilterValue(e)}
                      name="status"
                    />
                    <span>Active</span>
                  </InputGroup>

                  <InputGroup className="mb-3">
                    <InputGroup.Text>Gender</InputGroup.Text>
                    <Form.Check
                      inline
                      checked={filter.gender === "male"}
                      name="gender"
                      style={{ marginLeft: "10px" }}
                      id="modalmale"
                      label="male"
                      type="radio"
                      onChange={(e) => this.getFilterValue(e)}
                    />
                    <Form.Check
                      inline
                      checked={filter.gender === "female"}
                      name="gender"
                      id="modalfemale"
                      label="female"
                      type="radio"
                      onChange={(e) => this.getFilterValue(e)}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>Search By Name</InputGroup.Text>
                    <Form.Control
                      id="name"
                      label="name"
                      name="name"
                      value={filter.name}
                      aria-label="Name"
                      onChange={(e) => this.getFilterValue(e)}
                    />
                  </InputGroup>
                  <Button
                    variant="primary"
                    onClick={this.handleFilter}
                    value="Search"
                    disabled={pageWiseLoader === true}
                  >
                    Search
                  </Button>
                  <Button
                    variant="primary"
                    onClick={this.handleFilterReset}
                    value="Reset"
                    style={{ marginLeft: "5px" }}
                    disabled={pageWiseLoader === true}
                  >
                    Reset
                  </Button>
                </Form>
              </fieldset>

              {users.length === 0 ? (
                <h1 style={{ textAlign: "center", marginTop: "20px" }}>
                  No data are found
                </h1>
              ) : (
                <>
                  <div
                    className="users-container"
                    style={{
                      opacity: pageWiseLoader && 0.6,
                    }}
                  >
                    {pageWiseLoader && (
                      <div className="loader-container">
                        <Spinner animation="border" className="Spinner" />
                      </div>
                    )}

                    <table className="table table-bordered mt-4">
                      <thead>
                        <tr>
                          {tableHeader.map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {users.map((item, index) => (
                          <tr key={item.id}>
                            <td>{indexFrom + index}</td>
                            <td>{item.id}</td>
                            <td>
                              <Link
                                onClick={(e) =>
                                  this.props.setID(item.id, item.name)
                                }
                                style={{
                                  textDecoration: "none",
                                  color: "black",
                                }}
                                to={`/users/${item.id}/posts`}
                              >
                                {item.name}
                              </Link>
                            </td>
                            <td>{item.email}</td>
                            <td>
                              <i
                                className={`bi genderIcon bi-gender-${
                                  item.gender === "female" ? "female" : "male"
                                }`}
                              />
                            </td>
                            <td>
                              <i
                                className="bi bi-circle-fill"
                                style={{
                                  color:
                                    item.status === "active" ? "green" : "red",
                                  fontSize: "30px",
                                }}
                              ></i>
                            </td>
                            <td>
                              <Button
                                className="bi bi-trash"
                                variant="danger"
                                disabled={pageWiseLoader === true}
                                onClick={(e) => this.handleDelete(e, item.id)}
                              />

                              <Button
                                className="bi bi-pencil updateBtn"
                                variant="primary"
                                id="update"
                                disabled={pageWiseLoader === true}
                                onClick={(e) =>
                                  this.handleUpdate(e, index, item.id)
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={totalPages}
                    marginPagesDisplayed={3}
                    pageRangeDisplayed={5}
                    disableInitialCallback={true}
                    forcePage={
                      parseInt(sessionStorage.getItem("Page Number")) - 1
                    }
                    onPageChange={this.getPageNumber}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </>
              )}
            </>
          )}

          <Modal show={formToggle} onHide={this.handleShowModal}>
            <Modal.Header>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form>
                <InputGroup className="mb-3">
                  <InputGroup.Text>First and Last name</InputGroup.Text>
                  <Form.Control
                    name="name"
                    aria-label="Name"
                    placeholder="Name"
                    onChange={this.handleChange}
                    value={addUsers.name}
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>Email address</InputGroup.Text>
                  <Form.Control
                    type="email"
                    value={addUsers.email}
                    name="email"
                    placeholder="name@example.com"
                    onChange={this.handleChange}
                    aria-label="Email"
                  />
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>Status</InputGroup.Text>
                  <span style={{ marginLeft: "5px", marginRight: "8px" }}>
                    Inactive
                  </span>

                  <Form.Check
                    defaultChecked={statusON}
                    type="switch"
                    id="custom-switch"
                    onChange={this.handleChange}
                    name="status"
                  />
                  <span>Active</span>
                </InputGroup>

                <InputGroup className="mb-3">
                  <InputGroup.Text>Gender</InputGroup.Text>
                  <Form.Check
                    inline
                    defaultChecked={addUsers.gender === "male"}
                    name="gender"
                    style={{ marginLeft: "10px" }}
                    id="male"
                    label="Male"
                    type="radio"
                    onChange={this.handleChange}
                  />
                  <Form.Check
                    inline
                    defaultChecked={addUsers.gender === "female"}
                    name="gender"
                    id="female"
                    label="Female"
                    type="radio"
                    onChange={this.handleChange}
                  />
                </InputGroup>
              </Form>

              {showMsg && (
                <div className={`alert alert-${msgStyle} mt-1`} role="alert">
                  <b className="text-dark">{message}</b>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleShowModal}>
                Close
              </Button>
              <Button
                variant="primary"
                onClick={this.handleSubmit}
                value={btnValue}
              >
                {btnValue}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </Container>
    );
  }
}
