import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import {
  addLabelsToBubbles,
  addNodesToSVGChart,
  addTransitionToBubbleLabels,
  createChartSVGContainer,
  getColorScale,
  getTransition,
  packRootSVG,
} from "./utils";
import { ICirclePackingData } from "./types/ICirclePackingData";

const width = 928;
const height = width;

interface ICirclePackingChartProps {
  data: ICirclePackingData;
}

const Bubbles = ({ data }: ICirclePackingChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef(null);

  const root = packRootSVG(width, height, data);
  useEffect(() => {
    if (containerRef.current && svgRef.current) {
      let referenceNode = root;
      let referenceView: d3.ZoomView;

      const svg = createChartSVGContainer(svgRef.current);
      const bubbles = addNodesToSVGChart(svg, root);
      bubbles.on(
        "click",
        (event, d) =>
          referenceNode !== d && (zoom(event, d), event.stopPropagation())
      );

      const bubblesLabels = addLabelsToBubbles(svg, root);

      function zoomTo(focusView: d3.ZoomView) {
        const zoomScale = width / focusView[2];

        referenceView = focusView;
        return () => {
          bubblesLabels.attr(
            "transform",
            (label) =>
              `translate(${(label.x - focusView[0]) * zoomScale},${
                (label.y - focusView[1]) * zoomScale
              })`
          );

          bubbles
            .attr(
              "transform",
              (bubble) =>
                `translate(${(bubble.x - focusView[0]) * zoomScale},${
                  (bubble.y - focusView[1]) * zoomScale
                })`
            )
            .attr("r", (d) => d.r * zoomScale);
        };
      }

      function zoom(
        event: MouseEvent,
        node: d3.HierarchyCircularNode<ICirclePackingData>
      ) {
        referenceNode = node;
        const transition = getTransition(
          event,
          referenceView,
          referenceNode,
          zoomTo
        );
        addTransitionToBubbleLabels(bubblesLabels, referenceNode, transition);
      }

      svg.on("click", (event) => zoom(event, root));

      zoomTo([referenceNode.x, referenceNode.y, referenceNode.r * 2])();

      return () => {
        svg.selectAll("*").remove();
      };
    }
  }, [data, root]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "50vh",
        border: "dashed 1px red",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        width={width}
        height={height}
        ref={svgRef}
        viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "0 -14px",
          backgroundColor: getColorScale()(0),
          cursor: "pointer",
        }}
      ></svg>
    </div>
  );
};

export default Bubbles;
