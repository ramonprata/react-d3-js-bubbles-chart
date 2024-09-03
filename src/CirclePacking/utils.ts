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
  const node = svg;
  // .append("g")
  // .selectAll("circle")
  // .data(root.descendants().slice(1))
  // .join("circle");
  // .attr("fill", (d) => (d.children ? getColorScale()(d.depth) : "white"))
  // .attr("pointer-events", (d) => (!d.children ? "none" : null))
  // .on("mouseover", function () {
  //   d3.select(this).attr("stroke", "#000");
  // })
  // .on("mouseout", function () {
  //   d3.select(this).attr("stroke", null);
  // })
  // .on(
  //   "click",
  //   (event, d) => root !== d && (zoom(event, d), event.stopPropagation())
  // );

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
