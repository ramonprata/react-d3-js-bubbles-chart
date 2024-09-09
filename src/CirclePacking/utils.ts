import * as d3 from "d3";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { TBubbleDataNode } from "./types/TBubbleDataNode";

export const packRootSVG = (
  data: ICirclePackingData,
  dimensions: {
    width: number;
    height: number;
  }
) => {
  return d3
    .pack<ICirclePackingData>()
    .size([dimensions.width, dimensions.height])
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

export const getBubbleStyleColorsByEquality = (d: TBubbleDataNode) => {
  if (d.depth === 1) {
    return {
      bubbleMainColor: "white",
      bubbleStroke: {
        strokeWidth: 1,
        strokeDasharray: "5.5",
        stroke: "lightGray",
      },
      bubbleBackground: "white",
    };
  }
  if (d.data.type === "legend") {
    return {
      bubbleMainColor: "white",
      bubbleStroke: {
        strokeWidth: 1,
        stroke: "lightgray",
      },
      bubbleBackground: "white",
    };
  }

  const equityValue = getEquityValueInNumber(d.data.equity);

  if (d.data.equity) {
    if (equityValue <= 0) {
      return {
        bubbleMainColor: "#FF143C",
        bubbleStroke: {
          strokeWidth: 1,
          stroke: "#FF143C",
        },
        bubbleBackground: "url(#gradRed)",
      };
    }
    if (equityValue < 0.1) {
      return {
        bubbleMainColor: "#FFA119",
        bubbleStroke: {
          strokeWidth: 1,
          stroke: "#FFA119",
        },
        bubbleBackground: "url(#gradOrange)",
      };
    }

    return {
      bubbleMainColor: "#06A228",
      bubbleStroke: {
        strokeWidth: 1,
        stroke: "#06A228",
      },
      bubbleBackground: "url(#gradGreen)",
    };
  }
};
