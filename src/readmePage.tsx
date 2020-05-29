import React, { useState, ChangeEvent } from "react";
import qs from "qs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

// TODO Also allow local images?

interface UrlCollection {
  [key: string]: string;
}

const validate = (urls: UrlCollection): boolean => {
  const urlValues = Object.values(urls);

  const isNoUrlEmpty = urlValues.reduce((acc: boolean, u: string) => {
    const currentUrlValid = u.length > 0;
    return acc && currentUrlValid;
  }, true);

  const hasEnoughUrls = urlValues.length > 1;

  return hasEnoughUrls && isNoUrlEmpty;
};

const ReadmePage = () => {
  const [urlObj, setUrlObj] = useState<UrlCollection>({
    0: "https://placekitten.com/200/300",
    1: "https://placekitten.com/400/300",
  });

  const indices = Object.keys(urlObj);
  const sortedUrls = indices.sort().map((k) => urlObj[k]);

  const addUrl = () => {
    // -1 (to get last index) +1 to increment index equal out to 0
    const newIndex = indices.length;

    const newUrlObj = { ...urlObj };
    newUrlObj[newIndex] = "";
    setUrlObj(newUrlObj);
  };

  const removeUrl = (idx: number) => {
    const newUrlObj: UrlCollection = {};
    let newIndex = 0;
    for (let oldIndex = 0; oldIndex < indices.length; oldIndex++) {
      if (oldIndex === idx) continue;

      newUrlObj[newIndex] = urlObj[oldIndex];
      newIndex++;
    }

    setUrlObj(newUrlObj);
  };

  const onChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const newUrlObj = { ...urlObj };
    const editedUrl = e.currentTarget.value;
    newUrlObj[idx] = editedUrl;
    setUrlObj(newUrlObj);
  };

  const [combinationType, setCombinationType] = useState<string>("h");

  const q = qs.stringify(
    { t: combinationType, i: sortedUrls },
    { addQueryPrefix: true }
  );

  // Prohibit submitting empty URLs.
  const linkAttributes: any = {};
  if (validate(urlObj)) linkAttributes.href = q;

  return (
    <>
      <p>
        Enter some image URLs here and how you want to combine them. Then just
        press <a {...linkAttributes}>Go!</a>
      </p>
      <p className="cog-disclaimer">
        No resizing of images is done. Works best with similarly-sized images.
        Images are loaded anonymously client-side.
      </p>
      <div className="cog-urls__container">
        {sortedUrls.map((k: string, idx: number) => {
          return (
            <div>
              <input
                className="cog-urls__url"
                type="text"
                key={`url-${idx}`}
                value={k}
                onChange={(e) => onChange(idx, e)}
              />
              <FontAwesomeIcon
                className="cog-urls__remove-button"
                icon={faMinusCircle}
                onClick={(_) => removeUrl(idx)}
              />
              {idx === sortedUrls.length - 1 ? (
                <FontAwesomeIcon
                  className="cog-urls__add-button"
                  icon={faPlusCircle}
                  onClick={(_) => addUrl()}
                />
              ) : undefined}
            </div>
          );
        })}
      </div>
      <div className="cog-settings__container">
        <input
          className="cog-settings__radio"
          type="radio"
          id="combination-horizontal"
          name="combination"
          value="h"
          checked={combinationType === "h"}
          onChange={(_) => setCombinationType("h")}
        />
        <label className="cog-settings__label" htmlFor="combination-horizontal">
          Horizontal
        </label>
        <input
          className="cog-settings__radio"
          type="radio"
          id="combination-vertical"
          name="combination"
          value="v"
          checked={combinationType === "v"}
          onChange={(_) => setCombinationType("v")}
        />
        <label className="cog-settings__label" htmlFor="combination-vertical">
          Vertical
        </label>
      </div>
    </>
  );
};

export default ReadmePage;
