import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
// import { createBrowserHistory } from "history";
import { useState } from "react";

import ListUsersComp from "./Component/ListUsersComp";
import ListPostsComp from "./Component/ListPostsComp";
import reactPractice from "./Component/reactPractice";


function App() {
  const [test, setTest] = useState("");
  const [name, setName] = useState("");

  let setId = (childSetID, name) => {
    setTest(childSetID);
    setName(name);
  };

  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <ListUsersComp setID={setId} />}
          />
          <Route
            exact
            path="/users/:id/posts"
            render={() => <ListPostsComp id={test} name={name} />}
          />
          <Route exact path="/practice" component={reactPractice} />
        </Switch>
      </Router>
      {/* <ListUsersComp setID={setId} /> */}
    </>
  );
}

export default App;
