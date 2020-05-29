import React, { useState, useEffect } from "react";
import qs from "qs";
import { Location } from "history";
import { saveAs } from "file-saver";
import { getParamsFromQuery } from "./params";
import { combine } from "./combine";

interface DownloadPageProps {
  location: Location;
}

const DownloadPage = (p: DownloadPageProps) => {
  const q = qs.parse(p.location.search, { ignoreQueryPrefix: true });
  const params = getParamsFromQuery(q);

  const [fallback, setFallback] = useState<Blob | null>(null);

  useEffect(() => {
    combine(params).then(
      (success) => {
        saveAs(success, "combined.png");
        setFallback(success as Blob);
      },
      (failure) => {
        // TODO: React to img 404, 500 etc. appropriately.
        console.log(failure);
      }
    );
  }, []);

  return (
    <>
      <div>Download started...</div>
      {fallback !== null && (
        <a download="combined.png" href={URL.createObjectURL(fallback)}>
          Didn't work? Try this direct link instead.
        </a>
      )}
      <a href="/">What is this?</a>
    </>
  );
};

export default DownloadPage;
