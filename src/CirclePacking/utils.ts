import * as d3 from "d3";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { TBubbleDataNode } from "./types/TBubbleDataNode";

export const SVG_WIDTH = 768;
export const SVG_HEIGHT = 640;

export const packRootSVG = (data: ICirclePackingData) => {
  return d3
    .pack<ICirclePackingData>()
    .size([SVG_WIDTH, SVG_HEIGHT])
    .padding(24)(
    d3
      .hierarchy<ICirclePackingData>(data)
      .sum((d) => Number(d.value ?? 0))
      .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0))
  );
};

export const getEquityValueInNumber = (equity: string) => {
  const number = parseFloat(equity?.replace("%", ""));
  const equityValue = number / 100;
  return equityValue;
};

export const getColorEquity = (d: TBubbleDataNode) => {
  if (d.depth === 1) {
    return "white";
  }
  if (d.data.type === "legend") {
    return "lightgray";
  }
  const equityValue = getEquityValueInNumber(d.data.equity);
  if (d.data.equity) {
    if (equityValue <= 0) {
      return "#FF143C30";
    }
    if (equityValue < 0.1) {
      return "#FFA11930";
    }

    return "#06A22830";
  }
};
