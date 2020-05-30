import React, { useState, useReducer } from "react";
import qs from "qs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import { combine } from "./combine";
import { getCombinerKind } from "./params";
import CogInput from "./input";

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

const reducer = (c: EntryCollection, action: any) => {
  switch (action.type) {
    case "changeUrl": {
      const newEntries = { ...c };
      newEntries[action.data.idx] = action.data.value;
      return newEntries;
    }
    case "changeFile": {
      const newEntries = { ...c };
      const files: FileList | null = action.data.value;
      if (!files) return c;
      if (files.length === 0) newEntries[action.data.idx] = null;
      else newEntries[action.data.idx] = files[0];
      return newEntries;
    }
    case "add": {
      const newIndex = Object.keys(c).length;
      const newEntries = { ...c };
      newEntries[newIndex] = action.data;
      return newEntries;
    }
    case "remove": {
      const indices = Object.keys(c);
      const newEntries: EntryCollection = {};
      let newIndex = 0;
      for (let oldIndex = 0; oldIndex < indices.length; oldIndex++) {
        if (oldIndex === action.data.idx) continue;

        newEntries[newIndex] = c[oldIndex];
        newIndex++;
      }

      return newEntries;
    }
  }
  return c;
};

const ReadmePage = () => {
  const [entries, dispatch] = useReducer(reducer, {
    0: "https://placekitten.com/200/300",
    1: "https://placekitten.com/400/300",
  } as EntryCollection);

  const sortedEntries = Object.values(entries);

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

  const inputs = sortedEntries.map((k: Entry, idx: number) => {
    return (
      <CogInput
        key={`cog-input-${idx}`}
        entry={k}
        idx={idx}
        dispatch={dispatch}
        isOnly={sortedEntries.length === 1}
        isLast={idx === sortedEntries.length - 1}
      />
    );
  });

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
      <div className="cog-entries__container">{inputs}</div>
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
