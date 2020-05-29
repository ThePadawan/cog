import { ParsedQs } from "qs";
import { CombinerKind } from "./combiners";

interface CombinerKindLookup {
  h: CombinerKind;
  v: CombinerKind;
}

const getCombinerKind = (q: ParsedQs): CombinerKind => {
  const defaultCombinerKind = "Horizontal";

  if (q.t !== "h" && q.t !== "v") {
    return defaultCombinerKind;
  }

  const combinerKindLookup: CombinerKindLookup = {
    h: "Horizontal",
    v: "Vertical",
  };
  return combinerKindLookup[q.t];
};

const getImagePaths = (q: ParsedQs): string[] => {
  if (!(q.i instanceof Array)) {
    return [];
  }

  const parameters: Array<string | ParsedQs> = q.i;

  const result: string[] = [];

  parameters.forEach((p) => {
    if (typeof p === "string") {
      result.push(p);
    }
  });

  return result;
};

export interface CombinationParameters {
  combinerKind: CombinerKind;
  imagePaths: string[];
}

export const getParams = (q: ParsedQs): CombinationParameters => {
  return {
    combinerKind: getCombinerKind(q),
    imagePaths: getImagePaths(q),
  };
};
