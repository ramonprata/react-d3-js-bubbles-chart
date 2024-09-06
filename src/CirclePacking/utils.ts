import * as d3 from "d3";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { TBubbleDataNode } from "./types/TBubbleDataNode";

export const SVG_WIDTH = 768;
export const SVG_HEIGHT = 640;

export const getColorScale = () => {
  return d3
    .scaleLinear<string>()
    .domain([0, 0.15, 0.2])
    .range([
      "rgba(237, 37, 78, 0.2)",
      "rgba(255, 161, 25, 0.2)",
      "rgba(18, 135, 28, 0.2)",
    ])
    .interpolate(d3.interpolateHcl);
};

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

// Create the SVG container.
export const createChartSVGContainer = (svgRef: SVGSVGElement | null) =>
  d3.select(svgRef);

export const getEquityValueInNumber = (equity: string) => {
  const number = parseFloat(equity?.replace("%", ""));
  const equityValue = number / 100;
  return equityValue;
};

export const addNodesToSVGChart = (
  svgRef: SVGSVGElement,
  root: TBubbleDataNode
) => {
  const node = d3
    .select(svgRef)
    .append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .style("fill", (d) => {
      return getColorEquity(d);
    })
    .attr("pointer-events", (d) => (!d.children ? "none" : null))
    .on("mouseover", function () {
      d3.select(this).attr("stroke", "#fff").attr("stroke-width", "3");
    })
    .on("mouseout", function () {
      d3.select(this).attr("stroke", null);
    });

  return node;
};

export const addLabelsToBubbles = (
  svgRef: SVGSVGElement,
  root: TBubbleDataNode
) =>
  d3
    .select(svgRef)
    .append("g")
    .style("font", "16px")
    .style("color", "#121619")
    .style("font-weight", "bold")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
    .style("display", (d) => (d.parent === root ? "inline" : "none"))
    .text((d) => d.data.name);

export const getTransition = (
  view: d3.ZoomView,
  focus: TBubbleDataNode,
  zoomTo: (newZoomValue: d3.ZoomView) => void
) => {
  const transition = d3
    .transition()
    .duration(750)
    .tween("zoom", () => {
      const interpolate = d3.interpolateZoom(view, [
        focus.x,
        focus.y,
        focus.r * 3,
      ]);
      return (t) => {
        const newZoomValue = interpolate(t);

        zoomTo(newZoomValue);
      };
    });

  return transition;
};

export const addTransitionToBubbleLabels = (
  bubblesLabels: ReturnType<typeof addLabelsToBubbles>,
  focus: TBubbleDataNode,
  transition: ReturnType<typeof getTransition>
) => {
  bubblesLabels
    .filter(function (d) {
      return d.parent === focus || this.style.display === "inline";
    })
    .transition(transition)
    .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
    .on("start", function (d) {
      if (d.parent === focus) this.style.display = "inline";
    })
    .on("end", function (d) {
      if (d.parent !== focus) this.style.display = "none";
    });
};

export const zoomTo = (
  bubblesRef: React.MutableRefObject<ReturnType<
    typeof addNodesToSVGChart
  > | null>,
  bubblesLabelsRef: React.MutableRefObject<ReturnType<
    typeof addLabelsToBubbles
  > | null>,
  referenceView: React.MutableRefObject<d3.ZoomView | null>,
  focusView: d3.ZoomView
) => {
  const zoomScale = SVG_WIDTH / focusView[2];

  referenceView.current = focusView;

  if (bubblesLabelsRef.current && bubblesRef.current && referenceView.current) {
    bubblesLabelsRef.current.attr(
      "transform",
      (label) =>
        `translate(${(label.x - referenceView.current[0]) * zoomScale},${
          (label.y - referenceView.current[1]) * zoomScale
        })`
    );

    bubblesRef.current
      .attr(
        "transform",
        (bubble) =>
          `translate(${(bubble.x - referenceView.current[0]) * zoomScale},${
            (bubble.y - referenceView.current[1]) * zoomScale
          })`
      )
      .attr("r", (d) => d.r * zoomScale);
  }
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
