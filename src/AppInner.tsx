import React from "react";
import { useLocation } from "react-router";
import "./App.css";

import ReadmePage from "./readmePage";
import DownloadPage from "./DownloadPage";

const AppInner = () => {
  const location = useLocation();

  if (location.search === "") {
    return <ReadmePage />;
  }

  return <DownloadPage location={location} />;
};

export default AppInner;
