import React, { useState, ChangeEvent } from "react";
import qs from "qs";

// TODO Also allow local images?

const ReadmePage = () => {
  // TODO Show explanatory UI
  const [urlObj, setUrlObj] = useState<any>({
    0: "https://placekitten.com/200/300",
    1: "https://placekitten.com/400/300",
  });

  const indices = Object.keys(urlObj);
  const sortedUrls = indices.sort().map((k) => urlObj[k]);

  const q = qs.stringify({ t: "h", i: sortedUrls }, { addQueryPrefix: true });

  const addUrl = () => {
    const maxIndex = indices[indices.length - 1];
    const newIndex = +maxIndex + 1;
    const newUrlObj = { ...urlObj };
    newUrlObj[newIndex] = "";
    setUrlObj(newUrlObj);
  };

  const onChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const newUrlObj = { ...urlObj };
    const editedUrl = e.currentTarget.value;
    newUrlObj[idx] = editedUrl;
    setUrlObj(newUrlObj);
  };

  // TODO: Prohibit submitting empty URLs.

  // TODO "Clear URLs" button
  // TODO "Add URL" button
  return (
    <div>
      <div>TODO: Readme</div>
      <div>
        {sortedUrls.map((k: string, idx: number) => {
          return (
            <input
              type="text"
              key={`url-${idx}`}
              defaultValue={k}
              onChange={(e) => onChange(idx, e)}
            />
          );
        })}
      </div>
      <button onClick={(_) => addUrl()}>Add URL</button>

      <a href={q}>Download link</a>
    </div>
  );
};

export default ReadmePage;
