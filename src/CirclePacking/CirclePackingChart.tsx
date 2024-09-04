import * as d3 from "d3";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { createChartSVGContainer, getColorScale, packRootSVG } from "./utils";
import { useEffect, useRef, useState } from "react";

interface ICirclePackingChartProps {
  data: ICirclePackingData;
}

const width = 928;
const height = width;

const CirclePackingChart = (props: ICirclePackingChartProps) => {
  const [stroke, setStroke] = useState("");
  // const [nodes, setNodes] = useState<
  //   d3.HierarchyCircularNode<ICirclePackingData>[]
  // >([]);
  // const [root, setRoot] = useState<d3.HierarchyNode<ICirclePackingData>>();
  const [selectedNode, setSelectedNode] = useState<{
    node: d3.HierarchyCircularNode<ICirclePackingData>;
    nodeKey: string;
    transformLabel: string;
    transformBubble: string;
    bubbleR: number;
  }>();

  const svgRef = useRef<SVGSVGElement>(null);

  const D3Svg = createChartSVGContainer(svgRef.current);

  const packedData = packRootSVG(width, height, props.data);
  let view: d3.ZoomView = [0, 0, 0];

  const k = (width / packedData.r) * 2;

  const nodes = packedData.descendants();

  const zoomTo = (
    v: d3.ZoomView,
    node: d3.HierarchyCircularNode<ICirclePackingData>,
    i: number
  ) => {
    view = v;
    const k = width / v[2];
    if (node) {
      console.log(node);
      // const xPosition = node.x - v[0];
      // const yPosition = node.y - v[1];
      const xPosition = packedData.x / 2;
      const yPosition = packedData.y / 2;

      const transformLabel = `translate(${xPosition * k},${yPosition * k})`;
      const transformBubble = `translate(${xPosition * k},${yPosition * k})`;
      const bubbleR = node.r * 2;

      setSelectedNode({
        node,
        nodeKey: `node${i}`,
        transformLabel,
        transformBubble,
        bubbleR,
      });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        border: "dashed 1px red",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <svg
        ref={svgRef}
        onClick={() => {}}
        // viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
        stroke={stroke}
        width={width}
        height={height}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "0 -14px",
          backgroundColor: getColorScale()(0),
          cursor: "pointer",
        }}
      >
        <g>
          {nodes.slice(1).map((node, idx) => (
            <circle
              key={idx}
              cx={node.x}
              cy={node.y}
              r={
                selectedNode?.nodeKey === `node${idx}`
                  ? selectedNode.bubbleR
                  : node.r
              }
              transform={
                selectedNode?.nodeKey === `node${idx}`
                  ? selectedNode.transformBubble
                  : ""
              }
              fill={node.children ? getColorScale()(node.depth) : "white"}
              pointerEvents={node.children ? "all" : "none"}
              onMouseOver={(e) =>
                e.currentTarget.setAttribute("stroke", "#000")
              }
              onMouseOut={(e) => e.currentTarget.setAttribute("stroke", "none")}
              onClick={(event) => {
                if (node !== nodes[0]) {
                  event.stopPropagation();
                  console.log(node);
                  // zoomTo(view, node, i);

                  // event.stopPropagation();
                }
              }}
            />
          ))}
        </g>
        <g>
          {nodes.slice(1).map((d, i) => (
            <text
              key={i}
              x={d.x}
              y={d.y}
              r={d.r}
              pointerEvents={"none"}
              textAnchor="middle"
              // transform={selectedNode && selectedNode.transformLabel}
              style={{
                font: "10px sans-serif",
                fillOpacity: d.parent === packedData ? 1 : 0,
                display: d.parent === packedData ? "inline" : "none",
              }}
            >
              {d.data.name}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default CirclePackingChart;
