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
      border: "1px lightGray dashed",
      bubbleBackground: "white",
    };
  }
  if (d.data.type === "legend") {
    return {
      bubbleMainColor: "white",
      border: "1px lightGray dashed",
      bubbleBackground: "white",
    };
  }

  const equityValue = getEquityValueInNumber(d.data.equity);

  if (d.data.equity) {
    if (equityValue <= 0) {
      return {
        bubbleMainColor: "#FF143C",
        border: "1px #FF143C solid",
        bubbleBackground: "radial-gradient(circle, #fff 30%, #FF143C40)",
      };
    }
    if (equityValue < 0.1) {
      return {
        bubbleMainColor: "#FFA119",
        border: "1px #FFA119 solid",

        bubbleBackground: "radial-gradient(circle, #fff 30%, #FFA11940)",
      };
    }

    return {
      bubbleMainColor: "#06A228",
      border: "1px #06A228 solid",
      bubbleBackground: "radial-gradient(circle, #fff 30%, #06A22840)",
    };
  }
};
