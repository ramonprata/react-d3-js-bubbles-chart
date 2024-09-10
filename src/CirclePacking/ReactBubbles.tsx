import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getBubbleStyleColorsByEquality,
  getEquityValueInNumber,
  packRootSVG,
} from "./utils";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { groupDataByEquity, groupDataByValue } from "./groupData";

import Bubble from "./Bubble";
import { TBubbleDataNode } from "./types/TBubbleDataNode";
// import BubblesGroup from "./BubblesGroup";
import BubbleColors from "./BubbleColors";
import { animated, useSpring } from "react-spring";

interface ICirclePackingChartProps {
  data: ICirclePackingData;
}

type TGroupTypes = "satellite" | "touchPoint" | "equity";

const Bubbles = ({ data }: ICirclePackingChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef(null);

  const [group, setGroup] = useState<TGroupTypes>("satellite");

  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [dynamicDimensions, setDynamicDimensions] = useState({
    width: 0,
    height: 0,
    top: 0,
  });

  useEffect(() => {
    if (containerRef.current) {
      const { width, top } = containerRef.current.getBoundingClientRect();
      setDynamicDimensions({
        width: width,
        height: window.innerHeight - top,
        top,
      });
    }
  }, [containerRef]);

  const bubbles = useMemo(() => {
    if (data && dynamicDimensions.width) {
      let nodes: TBubbleDataNode | null = null;
      if (group === "satellite") {
        const dataGroup = { ...data };
        nodes = packRootSVG(dataGroup, dynamicDimensions);
      }
      if (group === "touchPoint") {
        const dataGroup = groupDataByValue({ ...data });
        nodes = packRootSVG(dataGroup, dynamicDimensions);
      }
      if (group === "equity") {
        const dataGroup = groupDataByEquity({ ...data });
        nodes = packRootSVG(dataGroup, dynamicDimensions);
      }
      if (nodes) {
        return nodes.descendants().slice(1);
      }
    }
  }, [data, dynamicDimensions, group]);

  const resetScale = () => {
    setTransform({
      y: 0,
      x: 0,
      k: 1,
    });
  };

  const onGroup = (value: TGroupTypes) => {
    resetScale();
    if (transform.k > 1) {
      setTimeout(() => {
        setGroup(value);
      }, 500);
    } else {
      setGroup(value);
    }
  };

  const onClickBubble = useCallback(
    (bubble: TBubbleDataNode) => {
      if (bubble.depth <= 1) {
        const scale = 1.8;
        const translateX = dynamicDimensions.width / 2 - bubble.x;
        const translateY = dynamicDimensions.height / 2 - bubble.y;

        if (transform.k === 1) {
          setTransform({ x: translateX, y: translateY, k: scale });
        } else {
          setTransform({ x: 0, y: 0, k: 1 });
          setTimeout(() => {
            setTransform({ x: translateX, y: translateY, k: scale });
          }, 500);
        }
      } else {
        alert("Bubble clicked");
      }
    },
    [dynamicDimensions, transform.k]
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          justifyContent: "center",
          width: "100%",
          boxSizing: "border-box",
          top: 0,
        }}
      >
        <button onClick={() => onGroup("equity")}>Group by equity</button>
        <button onClick={() => onGroup("touchPoint")}>
          Group by touchpoint values
        </button>
        <button onClick={() => onGroup("satellite")}>
          Group by satellites
        </button>
      </div>
      <div
        ref={containerRef}
        onClick={resetScale}
        style={{
          width: "100%",
          height: window.innerHeight - dynamicDimensions.top,
          border: "dashed 1px lightGray",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#F7F8FA",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <BubblesGroup
          height={dynamicDimensions.height}
          width={dynamicDimensions.width}
          x={transform.x}
          y={transform.y}
          k={transform.k}
        >
          {bubbles?.map((bubble, idx) => {
            return (
              <BubbleDiv
                key={`bubble-${idx}`}
                idx={idx}
                bubble={bubble}
                onClickBubble={onClickBubble}
              >
                {bubble.value}
              </BubbleDiv>
            );
          })}
        </BubblesGroup>
      </div>
    </>
  );
};

export default Bubbles;

const BubbleDiv = ({
  bubble,
  idx,
  onClickBubble,
}: {
  bubble: TBubbleDataNode;

  idx: number;
  onClickBubble: (bubble: TBubbleDataNode, idx: number) => void;
} & PropsWithChildren) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useSpring({
    to: {
      opacity: 1,
      transform: `translate(${bubble.x - bubble.r}px, ${
        bubble.y - bubble.r
      }px)`,
    },
    from: {
      opacity: 0,
      transform: `translate(${0}px, ${0}px)`,
    },

    opacity: 1,
    config: { friction: 26, duration: 600 },
  });

  const bubbleColors = getBubbleStyleColorsByEquality(bubble);
  const strokeProps = isHovered ? bubbleColors?.border : "";

  const hoverStyles = useSpring({
    width: isHovered && bubble.depth >= 1 ? bubble.r * 2 * 1.5 : bubble.r * 2,
    zIndex: isHovered ? 1 : 0,
    config: { duration: 500 },
  });

  return (
    <animated.div
      onClick={(e) => {
        e.stopPropagation();
        onClickBubble(bubble, idx);
      }}
      onMouseEnter={() => {
        if (bubble.depth > 1) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (bubble.depth > 1) {
          setIsHovered(false);
        }
      }}
      style={{
        position: "absolute",
        aspectRatio: 1,
        ...(bubble.depth === 1 && { background: "white" }),
        ...(bubble.depth > 1 && {
          backgroundImage: bubbleColors?.bubbleBackground,
        }),
        borderRadius: "50%",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: strokeProps,
        ...styles,
        ...hoverStyles,
      }}
    >
      {bubble.depth > 1 && bubble.value}
    </animated.div>
  );
};

interface IBubblesGroupProps extends PropsWithChildren {
  x: number;
  y: number;
  k: number;
  height: number;
  width: number;
}
const BubblesGroup = ({ children, x, y, k, height }: IBubblesGroupProps) => {
  const styles = useSpring({
    from: {
      transform: `translate(${0}px, ${0}px) scale(${1})`,
    },
    to: {
      transform: `translate(${x}px, ${y}px) scale(${k})`,
    },
    config: { friction: 26 },
  });

  return (
    <animated.div
      style={{
        width: "100%",
        height: height,
        position: "absolute",
        ...styles,
      }}
    >
      {children}
    </animated.div>
  );
};
