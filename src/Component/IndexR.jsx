import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Routes } from "react-router-dom";
import About from "./About";

const routing = (
  <Router>
    <div>
      <h1>React Router Example</h1>
      <ul>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <Routes>
        <Route exact path="/about"  element={<About />} />
      </Routes>
    </div>
  </Router>
);

export default class IndexR extends Component {
  render() {
    return routing;
  }
}
