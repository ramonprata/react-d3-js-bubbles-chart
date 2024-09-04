import { useRef, useState } from "react";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { getColorEquality } from "./utils";
type Props = {
  node: d3.HierarchyCircularNode<ICirclePackingData>;
  idx: number;
};
const Circle = ({ node, idx }: Props) => {
  const circleRef = useRef(null);

  const [transition, setTransition] = useState(
    () => `translate(${node.x} ${node.y})`
  );

  const onClick = () => {
    const zoomScale = 1.2;
    setTransition(
      `translate(${(node.x - 8) * zoomScale},${(node.y - 8) * zoomScale})`
    );
  };
  return (
    <circle
      ref={circleRef}
      key={idx}
      r={node.r}
      transform={transition}
      fill={getColorEquality(node)}
      pointerEvents={node.children ? "all" : "none"}
      onMouseOver={(e) => e.currentTarget.setAttribute("stroke", "#000")}
      onMouseOut={(e) => e.currentTarget.setAttribute("stroke", "none")}
      onClick={(event) => {
        // onClick();
      }}
    />
  );
};

export default Circle;
