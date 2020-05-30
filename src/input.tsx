import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusCircle,
  faPlusCircle,
  faFileUpload,
} from "@fortawesome/free-solid-svg-icons";

type Entry = string | File | null;

interface CogInputProps {
  entry: Entry;
  idx: number;
  isOnly: boolean;
  isLast: boolean;
  dispatch: React.Dispatch<any>;
}

const CogInput = React.memo((p: CogInputProps) => {
  const { idx, entry: k, dispatch, isOnly, isLast } = p;

  return (
    <div key={`entry${idx}`}>
      {typeof k === "string" ? (
        <input
          className="cog-entries__entry"
          type="text"
          value={k}
          onChange={(e) =>
            dispatch({
              type: "changeUrl",
              data: { idx, value: e.currentTarget.value },
            })
          }
        />
      ) : (
        <input
          className="cog-entries__entry"
          type="file"
          onChange={(e) =>
            dispatch({
              type: "changeFile",
              data: { idx, value: e.currentTarget.files },
            })
          }
        />
      )}
      {!isOnly && (
        <FontAwesomeIcon
          className="cog-entries__remove-button"
          icon={faMinusCircle}
          onClick={(e) =>
            dispatch({
              type: "remove",
              data: { idx },
            })
          }
        />
      )}
      {isLast ? (
        <FontAwesomeIcon
          className="cog-entries__add-button"
          icon={faPlusCircle}
          onClick={(e) =>
            dispatch({
              type: "add",
              data: "",
            })
          }
        />
      ) : undefined}
      {isLast ? (
        <FontAwesomeIcon
          className="cog-entries__add-button"
          icon={faFileUpload}
          onClick={(e) =>
            dispatch({
              type: "add",
              data: null,
            })
          }
        />
      ) : undefined}
    </div>
  );
});

export default CogInput;
