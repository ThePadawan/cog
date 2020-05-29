import { ParsedQs } from "qs";
import { CombinerKind } from "./combiners";

interface CombinerKindLookup {
  h: CombinerKind;
  v: CombinerKind;
}

const tryGetCombinerKind = (q: ParsedQs): CombinerKind => {
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

export const getCombinerKind = (s: string): CombinerKind | null => {
  if (s !== "h" && s !== "v") {
    return null;
  }

  const combinerKindLookup: CombinerKindLookup = {
    h: "Horizontal",
    v: "Vertical",
  };
  return combinerKindLookup[s];
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
  imagePaths: Array<string | File>;
}

export const getParamsFromQuery = (q: ParsedQs): CombinationParameters => {
  return {
    combinerKind: tryGetCombinerKind(q),
    imagePaths: getImagePaths(q),
  };
};
