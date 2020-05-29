export type CombinerKind = "Horizontal" | "Vertical";

export interface Combiner {
  widthAccumulator: (acc: number, nextWidth: number) => number;
  heightAccumulator: (acc: number, nextHeight: number) => number;

  offsetX: (width: number) => number;
  offsetY: (height: number) => number;
}

const maxer = (acc: number, next: number): number => {
  return acc > next ? acc : next;
};

const summer = (acc: number, next: number): number => {
  return acc + next;
};

const doNotOffset = (x: number) => 0;
const doOffset = (x: number) => x;

const HorizontalCombiner: Combiner = {
  widthAccumulator: summer,
  heightAccumulator: maxer,
  offsetX: doOffset,
  offsetY: doNotOffset,
};

const VerticalCombiner: Combiner = {
  widthAccumulator: maxer,
  heightAccumulator: summer,
  offsetX: doNotOffset,
  offsetY: doOffset,
};

export const getCombiner = (k: CombinerKind) => {
  return k === "Horizontal" ? HorizontalCombiner : VerticalCombiner;
};
