import React from "react";
import { createBrowserHistory } from "history";

// TODO Clean up CSS
import "./App.css";

import { Router } from "react-router";
import AppInner from "./AppInner";

function App() {
  const history = createBrowserHistory();
  return (
    <Router history={history}>
      <AppInner />
    </Router>
  );
}

export default App;
