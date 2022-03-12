import { useHistory, withRouter } from "react-router-dom";
import Proptypes from "prop-types";
import React, { Component } from "react";

class FirstPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      detail: "test123",
    };
  }

  // static propTypes = {
  //   match: this.PropTypes.object.isRequired,
  //   location: this.PropTypes.object.isRequired,
  //   history: this.propTypes.object.isRequired,
  // };

  someEventHandler = (event) => {
    let history = useHistory();
    this.props.history.push({
      pathname: "/template",
      state: { detail: "test" },
    });
  };
  render() {
    // let { match, location, history } = this.props;
    return (
      <>
        {/* <div>You are now at {location.pathname}</div> */}
        <button className="btn" onClick={(e) => this.someEventHandler(e)}>
          Click Me!
        </button>
      </>
    );
  }
}

export default withRouter(FirstPage);
