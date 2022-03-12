import React, { Component } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";

const headers = {
  Authorization:
    "Bearer e251afb144fa11d2aa8471e44f5b6ae6a5b73d553b0bf2907a74b1df86f97a66",
};

const URL = "https://gorest.co.in/public/v2/users";

export default class paginationClass extends Component {
  constructor(props) {
    super(props);

    // Change everywhere
    this.state = {
      users: [],
      loading: false,
    }
  }

  handleShowData = (pageNumber) => {
    axios
      .get(`${URL}?page=${pageNumber}`, { headers })
      .then((response) => {
        this.setState({
          users: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log("message cant be loaded");
        }
      });
  };

  getPageNumber = ({selected}) => {

    let pageNumber=selected+1;
    console.log(pageNumber)
    this.setState({ pageNumber });

    // this.handleShowData(pageNumber);
  };
  render() {
    return (
      <div>
        <ReactPaginate
        previousLabel={"previous"}
        nextLabel={"next"}
        breakLabel={"..."}
        pageCount={15}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
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
      </div>
    );
  }
}
