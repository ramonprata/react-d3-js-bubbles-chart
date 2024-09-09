import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getBubbleStyleColorsByEquality, packRootSVG } from "./utils";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { groupDataByEquity, groupDataByValue } from "./groupData";

import Bubble from "./Bubble";
import { TBubbleDataNode } from "./types/TBubbleDataNode";
import BubblesGroup from "./BubblesGroup";
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
        const scale =
          dynamicDimensions.width /
          (bubble.r * Math.ceil(dynamicDimensions.height * 0.01));
        const translateX = dynamicDimensions.width / 2 - bubble.x * scale;
        const translateY = dynamicDimensions.height / 2 - bubble.y * scale;

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
    [dynamicDimensions.height, dynamicDimensions.width, transform.k]
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "row",
          gap: 24,
          justifyContent: "center",
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
        style={{
          width: "100%",
          height: "100%",
          minHeight: "50vh",
          border: "dashed 1px lightGray",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#F7F8FA",
          position: "relative",
        }}
      >
        <div
          style={{
            width: "100%",

            height: dynamicDimensions.height,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {bubbles?.map((bubble, idx) => {
            return (
              <BubbleDiv key={idx} bubble={bubble}>
                {bubble.value}
              </BubbleDiv>
            );
          })}
        </div>
        {/* <svg
          onClick={() => resetScale()}
          width={dynamicDimensions.width}
          height={dynamicDimensions.height}
          ref={svgRef}
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",

            cursor: "pointer",
          }}
        >
          <BubbleColors />
          <BubblesGroup x={transform.x} y={transform.y} k={transform.k}>
            {bubbles?.map((bubble, idx) => {
              return (
                <>
                  <Bubble
                    bubble={bubble}
                    idx={idx}
                    key={idx}
                    onClickBubble={onClickBubble}
                  />
                </>
              );
            })}
          </BubblesGroup>
        </svg> */}
      </div>
    </div>
  );
};

export default Bubbles;

const BubbleDiv = ({ bubble }: { bubble: TBubbleDataNode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const styles = useSpring({
    transform: `translate(${bubble.x - bubble.r}px, ${
      bubble.y - bubble.r
    }px) scale(1)`,
    config: { friction: 26 },
  });

  const hoverProps = useSpring({
    r: isHovered ? bubble.r * 1.5 : bubble.r,
    // config: { tension: 300, friction: 10 },
    config: { duration: 300 },
  });

  const bubbleColors = getBubbleStyleColorsByEquality(bubble);
  const strokeProps = isHovered ? bubbleColors?.bubbleStroke : {};

  return (
    <animated.div
      style={{
        position: "absolute",
        // top: bubble.y - bubble.r,
        // left: bubble.x - bubble.r,
        width: bubble.r * 2,
        aspectRatio: 1,
        background: bubble.depth === 1 ? "violet" : "orange",
        borderRadius: "50%",
        ...styles,
      }}
    >
      {bubble.value}
    </animated.div>
  );
};
