import React from "react";
import { useParams } from "react-router-dom";

/* function Demo(props) {
  let x = useParams();
  console.log("x", x, props);

  return <div>This is demo</div>;
} */

class Demo extends React.Component {
  constructor(props) {
    super(props);

    console.log(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return <div>This is demo</div>;
  }
}

export default Demo;
