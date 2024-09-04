import * as d3 from "d3";
import { ICirclePackingData } from "./types/ICirclePackingData";

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

export const packRootSVG = (
  width: number,
  height: number,
  data: ICirclePackingData
) => {
  return d3.pack<ICirclePackingData>().size([width, height]).padding(8)(
    d3
      .hierarchy<ICirclePackingData>(data)
      .sum((d) => Number(d.value ?? 0))
      .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0))
  );
};

// Create the SVG container.
export const createChartSVGContainer = (svgRef: SVGSVGElement | null) =>
  d3.select(svgRef);

export const addNodesToSVGChart = (
  svg: ReturnType<typeof createChartSVGContainer>,
  root: d3.HierarchyCircularNode<ICirclePackingData>
) => {
  const node = svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants().slice(1))
    .join("circle")
    .attr("fill", (d) => {
      if (d.depth === 1) {
        return "white";
      }
      if (d.data.equity) {
        const number = parseFloat(d.data.equity?.replace("%", ""));
        const equalityValue = number / 100;
        if (equalityValue <= 0) {
          return "#FF143C30";
        }
        if (equalityValue <= 0.15) {
          return "#FFA11930";
        }

        return "#06A22830";
      }
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
  svg: ReturnType<typeof createChartSVGContainer>,
  root: d3.HierarchyCircularNode<ICirclePackingData>
) =>
  svg
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
  event: MouseEvent,
  view: d3.ZoomView,
  focus: d3.HierarchyCircularNode<ICirclePackingData>,
  zoomTo: (newZoomValue: d3.ZoomView) => () => void
) => {
  const transition = d3
    .transition()
    .duration(event.altKey ? 7500 : 750)
    .tween("zoom", () => {
      const interpolate = d3.interpolateZoom(view, [
        focus.x,
        focus.y,
        focus.r * 3,
      ]);
      return (t) => {
        const newZoomValue = interpolate(t);
        zoomTo(newZoomValue)();
      };
    });

  return transition;
};

export const addTransitionToBubbleLabels = (
  bubblesLabels: ReturnType<typeof addLabelsToBubbles>,
  focus: d3.HierarchyCircularNode<ICirclePackingData>,
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

export function zoomTo(
  bubblesLabels: ReturnType<typeof addLabelsToBubbles>,
  bubbles: ReturnType<typeof addNodesToSVGChart>,
  width: number,
  view: d3.ZoomView
) {
  const zoomScale = width / view[2];

  bubblesLabels.attr(
    "transform",
    (label) =>
      `translate(${(label.x - view[0]) * zoomScale},${
        (label.y - view[1]) * zoomScale
      })`
  );

  bubbles
    .attr(
      "transform",
      (bubble) =>
        `translate(${(bubble.x - view[0]) * zoomScale},${
          (bubble.y - view[1]) * zoomScale
        })`
    )
    .attr("r", (d) => d.r * zoomScale);
}

export const getColorEquality = (
  d: d3.HierarchyCircularNode<ICirclePackingData>
) => {
  if (d.depth === 1) {
    return "white";
  }
  if (d.data.equity) {
    const number = parseFloat(d.data.equity?.replace("%", ""));
    const equalityValue = number / 100;
    if (equalityValue <= 0) {
      return "#FF143C30";
    }
    if (equalityValue <= 0.15) {
      return "#FFA11930";
    }

    return "#06A22830";
  }
};
