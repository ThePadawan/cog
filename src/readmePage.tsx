import React, { useState, ChangeEvent } from "react";
import qs from "qs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusCircle,
  faPlusCircle,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import { combine } from "./combine";
import { getCombinerKind } from "./params";

type Entry = string | File | null;

interface EntryCollection {
  [key: string]: Entry;
}

const validate = (urls: EntryCollection): boolean => {
  const urlValues = Object.values(urls);

  const isNoEntryEmpty = urlValues.reduce((acc: boolean, u: Entry) => {
    if (typeof u === "string") {
      const currentUrlValid = u.length > 0;
      return acc && currentUrlValid;
    }

    if (u === null) {
      return false;
    }

    return acc && u.size > 0;
  }, true);

  const hasEnoughUrls = urlValues.length > 1;

  return hasEnoughUrls && isNoEntryEmpty;
};

const ReadmePage = () => {
  const [entries, setEntries] = useState<EntryCollection>({
    0: "https://placekitten.com/200/300",
    1: "https://placekitten.com/400/300",
  });

  const indices = Object.keys(entries);
  const sortedEntries = indices.sort((a, b) => +a - +b).map((k) => entries[k]);

  const addUrl = () => {
    // -1 (to get last index) +1 to increment index equal out to 0
    const newIndex = indices.length;

    const newEntries = { ...entries };
    newEntries[newIndex] = "";
    setEntries(newEntries);
  };

  const addFile = () => {
    const newIndex = indices.length;

    const newEntries = { ...entries };
    newEntries[newIndex] = null;
    setEntries(newEntries);
  };

  const removeUrl = (idx: number) => {
    const newEntries: EntryCollection = {};
    let newIndex = 0;
    for (let oldIndex = 0; oldIndex < indices.length; oldIndex++) {
      if (oldIndex === idx) continue;

      newEntries[newIndex] = entries[oldIndex];
      newIndex++;
    }

    setEntries(newEntries);
  };

  const onFileChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files === null) return;
    const file = e.currentTarget.files[0];
    const newEntries = { ...entries };
    newEntries[idx] = file;
    setEntries(newEntries);
  };

  const onChange = (idx: number, e: ChangeEvent<HTMLInputElement>) => {
    const newEntries = { ...entries };
    const editedUrl = e.currentTarget.value;
    newEntries[idx] = editedUrl;
    setEntries(newEntries);
  };

  const [combinationType, setCombinationType] = useState<string>("h");

  const download = (x: any) => {
    const validEntries: Array<string | File> = [];
    sortedEntries.forEach((e) => {
      if (e !== null) validEntries.push(e);
    });

    combine({
      imagePaths: validEntries,
      combinerKind: getCombinerKind(x.combinationType)!,
    }).then((success: Blob | string) => {
      saveAs(success, "combined.png");
    });
    // TODO Error handling
  };

  // Prohibit submitting empty URLs.
  const linkAttributes: any = {};
  if (validate(entries)) {
    const areAllEntriesUrls = sortedEntries.reduce((acc, e) => {
      return acc && typeof e === "string";
    }, true);

    if (areAllEntriesUrls) {
      const q = qs.stringify(
        { t: combinationType, i: sortedEntries },
        { addQueryPrefix: true }
      );
      linkAttributes.href = q;
    } else {
      linkAttributes.href = "#";
      linkAttributes.onClick = (ev: any) => {
        // Don't actually pollute the URL with "#".
        ev.preventDefault();
        download({ combinationType, sortedEntries });
      };
    }
  }

  return (
    <>
      <p>
        Enter some image URLs and/or select some files here and how you want to
        combine them. Then just press <a {...linkAttributes}>Go!</a>
      </p>
      <p className="cog-disclaimer">
        No resizing of images is done. Works best with similarly-sized images.
        Images are loaded anonymously client-side.
      </p>
      <div className="cog-entries__container">
        {sortedEntries.map((k: Entry, idx: number) => {
          return (
            <div key={`entry${idx}`}>
              {typeof k === "string" ? (
                <input
                  className="cog-entries__entry"
                  type="text"
                  value={k}
                  onChange={(e) => onChange(idx, e)}
                />
              ) : (
                <input
                  className="cog-entries__entry"
                  type="file"
                  onChange={(e) => onFileChange(idx, e)}
                />
              )}
              {sortedEntries.length > 1 && (
                <FontAwesomeIcon
                  className="cog-entries__remove-button"
                  icon={faMinusCircle}
                  onClick={(_) => removeUrl(idx)}
                />
              )}
              {idx === sortedEntries.length - 1 ? (
                <FontAwesomeIcon
                  className="cog-entries__add-button"
                  icon={faPlusCircle}
                  onClick={(_) => addUrl()}
                />
              ) : undefined}
              {idx === sortedEntries.length - 1 ? (
                <FontAwesomeIcon
                  className="cog-entries__add-button"
                  icon={faFileUpload}
                  onClick={(_) => addFile()}
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
      <div className="cog-extras">
        <a href="//github.com/ThePadawan/cog" className="cog-extras__link">
          <FontAwesomeIcon icon={faGithub} />
        </a>
      </div>
    </>
  );
};

export default ReadmePage;
