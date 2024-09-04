import * as d3 from "d3";
import { ICirclePackingData } from "./types/ICirclePackingData";

// Create the color scale.
export const getColorScale = () => {
  return d3
    .scaleLinear<string>()
    .domain([0, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);
};

export const packRootSVG = (
  width: number,
  height: number,
  data: ICirclePackingData
) => {
  return d3.pack<ICirclePackingData>().size([width, height]).padding(3)(
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
    .attr("fill", (d) => (d.children ? getColorScale()(d.depth) : "white"))
    .attr("pointer-events", (d) => (!d.children ? "none" : null))
    .on("mouseover", function () {
      d3.select(this).attr("stroke", "#000");
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
    .style("font", "10px sans-serif")
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
        focus.r * 2,
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
