import { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { addLabelsToBubbles, getColorScale, packRootSVG } from "./utils";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { TBubbleDataNode } from "./types/TBubbleDataNode";

const width = 928;
const height = width;

interface ICirclePackingChartProps {
  data: ICirclePackingData;
}

const Bubbles = ({ data }: ICirclePackingChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const root = packRootSVG(data);
  const [referenceNode, setReferenceNode] = useState(root);
  const [referenceView, setReferenceView] = useState<[number, number, number]>([
    root.x,
    root.y,
    root.r * 2,
  ]);
  const [nodes, setNodes] = useState(() => root.descendants().slice(1));

  useEffect(() => {
    // setNodes(root.descendants().slice(1)); // Atualiza nós ao mudar os dados
  }, [data, root]);

  const zoomTo = (focusView: [number, number, number]) => {
    const zoomScale = width / focusView[2];
    setReferenceView(focusView);
    return nodes.map((node) => ({
      ...node,
      x: (node.x - focusView[0]) * zoomScale,
      y: (node.y - focusView[1]) * zoomScale,
      r: node.r * zoomScale,
    }));
  };

  const handleZoom = (
    event: React.MouseEvent<SVGCircleElement, MouseEvent>,
    node: TBubbleDataNode
  ) => {
    if (referenceNode !== node) {
      setReferenceNode(node);
      setNodes(zoomTo([node.x, node.y, node.r * 2]));
    }
  };

  const resetZoom = () => {
    setReferenceNode(root);
    setNodes(zoomTo([root.x, root.y, root.r * 2]));
  };

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
        backgroundColor: "#F7F8FA",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`-${width / 2} -${height / 2} ${width} ${height}`}
        style={{
          maxWidth: "100%",
          height: "auto",
          display: "block",
          padding: 24,
          margin: "0 -14px",
          backgroundColor: "white",
          cursor: "pointer",
        }}
        onClick={resetZoom}
      >
        <defs>
          {/* Gradientes e definições de estilos adicionais podem ser adicionados aqui */}
        </defs>
        {/* Renderizando as bolhas com JSX */}
        {nodes.map((node, index) => (
          <circle
            key={index}
            cx={node.x}
            cy={node.y}
            r={node.r}
            // fill="url(#radial-gradient)" // Customize o preenchimento conforme necessário
            fill={gete}
            onClick={(event) => handleZoom(event, node)}
          />
        ))}
        {/* Renderizando os rótulos */}
        {nodes.map((node, index) => (
          <text
            key={`label-${index}`}
            x={node.x}
            y={node.y}
            textAnchor="middle"
            alignmentBaseline="middle"
            style={{
              pointerEvents: "none",
              fontSize: `${node.r / 5}px`,
            }}
          >
            {node.data.name}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default Bubbles;
