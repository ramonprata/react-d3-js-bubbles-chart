import { useSpring, animated } from "react-spring";
import { useState } from "react";
import { TBubbleDataNode } from "./types/TBubbleDataNode";
import { getBubbleStyleColorsByEquality } from "./utils";

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
    config: { duration: 600 },
  });

  const hoverProps = useSpring({
    r: isHovered ? bubble.r * 1.5 : bubble.r,
    // config: { tension: 300, friction: 10 },
    config: { duration: 300 },
  });

  const bubbleColors = getBubbleStyleColorsByEquality(bubble);
  const strokeProps = isHovered ? bubbleColors?.border : {};

  return (
    <g
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
    >
      <animated.circle
        cx={cx}
        cy={cy}
        r={bubble.depth > 1 ? hoverProps.r : r}
        fill={bubble.depth > 1 ? bubbleColors?.bubbleBackground : "white"}
        fillOpacity={opacity}
        {...strokeProps}
        style={{ cursor: "pointer" }}
      />
      {/* {bubble.depth > 1 && (
        <animated.text x={cx} y={cy} textAnchor={"middle"}>
          {bubble.value}
        </animated.text>
      )} */}
    </g>
  );
};

export default Bubble;
