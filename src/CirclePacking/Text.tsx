import { useSpring, animated } from "react-spring";
import { useState } from "react";
import { TBubbleDataNode } from "./types/TBubbleDataNode";

type Props = {
  bubble: TBubbleDataNode;
  idx: number;
};

const Text = ({ bubble, idx }: Props) => {
  // Estado para controlar a visibilidade do texto
  const [showText, setShowText] = useState(false);

  // Animação de transição com react-spring
  const props = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    config: { duration: 1000 },
    delay: 1000,
  });

  return (
    <animated.text
      x={bubble.x}
      y={bubble.y}
      textAnchor="middle"
      alignmentBaseline="middle"
      fillOpacity={props.opacity}
    >
      {bubble.data.name}
    </animated.text>
  );
};

export default Text;
