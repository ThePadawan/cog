import React from "react";
import { createBrowserHistory } from "history";
import { Router } from "react-router";
import "./App.css";

import AppInner from "./AppInner";

function App() {
  const history = createBrowserHistory();
  return (
    <div className="cog">
      <Router history={history}>
        <AppInner />
      </Router>
    </div>
  );
}

export default App;
