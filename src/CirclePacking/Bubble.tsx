import { useSpring, animated } from "react-spring";
import { useState } from "react";
import { TBubbleDataNode } from "./types/TBubbleDataNode";
import { getColorEquity } from "./utils";

type Props = {
  bubble: TBubbleDataNode;
  idx: number;
  parentRadius?: number;
  onClickBubble: (bubble: TBubbleDataNode, idx: number) => void;
};

const Bubble = ({ bubble, idx, onClickBubble }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const { cx, cy, r, opacity } = useSpring({
    to: { cx: bubble.x, cy: bubble.y, r: bubble.r, opacity: 1 },
    from: { cx: 0, cy: 0, r: 0, opacity: 0 },
    config: { duration: 600, tension: 1000, friction: 100 },
  });

  const hoverProps = useSpring({
    r: isHovered ? bubble.r * 1.4 : bubble.r,
    config: { tension: 300, friction: 10 },
  });

  const stroke =
    isHovered && bubble.depth === 1
      ? {
          stroke: "lightgray",
          strokeWidth: 2,
          strokeDasharray: "5, 5",
        }
      : {};

  return (
    <>
      <animated.circle
        cx={cx}
        cy={cy}
        r={bubble.depth > 1 ? hoverProps.r : r}
        fill={getColorEquity(bubble)}
        fillOpacity={opacity}
        {...stroke}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClickBubble(bubble, idx);
        }}
        style={{ cursor: "pointer" }}
      />
    </>
  );
};

export default Bubble;
