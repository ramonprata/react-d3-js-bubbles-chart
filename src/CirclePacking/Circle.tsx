import { useSpring, animated } from "react-spring";
import { useState } from "react";
import { TBubbleDataNode } from "./types/TBubbleDataNode";
import { getColorEquity } from "./utils";

type Props = {
  bubble: TBubbleDataNode;
  idx: number;
};

const Circle = ({ bubble, idx }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  const { cx, cy, r, opacity } = useSpring({
    to: { cx: bubble.x, cy: bubble.y, r: bubble.r, opacity: 1 },
    from: { cx: 0, cy: 0, r: 0, opacity: 0 },
    config: { duration: 1000 },
  });

  const hoverProps = useSpring({
    r: isHovered ? bubble.r * 1.4 : bubble.r,
    config: { tension: 300, friction: 10 },
  });

  return (
    <animated.circle
      cx={cx}
      cy={cy}
      r={bubble.depth > 1 ? hoverProps.r : bubble.r}
      fill={getColorEquity(bubble)}
      fillOpacity={opacity}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      style={{ cursor: "pointer" }}
    />
  );
};

export default Circle;
