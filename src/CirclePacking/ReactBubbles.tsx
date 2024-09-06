import { useCallback, useRef, useState } from "react";

import { packRootSVG, SVG_WIDTH } from "./utils";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { groupDataByEquity, groupDataByValue } from "./groupData";

import Bubble from "./Bubble";
import { TBubbleDataNode } from "./types/TBubbleDataNode";
import BubblesGroup from "./BubblesGroup";

interface ICirclePackingChartProps {
  data: ICirclePackingData;
}

type TGroupTypes = "satelite" | "touchPoint" | "equity";

const Bubbles = ({ data }: ICirclePackingChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef(null);

  const [group, setGroup] = useState<TGroupTypes>("satelite");

  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

  const [dataGroup, setDataGroup] =
    useState<ICirclePackingChartProps["data"]>(data);

  const root = packRootSVG(dataGroup);

  const [bubbles, setBubbles] = useState<TBubbleDataNode[]>(() =>
    root.descendants().slice(1)
  );

  const resetScale = () => {
    setTransform({
      y: 0,
      x: 0,
      k: 1,
    });
  };

  const onGroup = (value: TGroupTypes) => {
    if (transform.k > 1) {
      resetScale();
    }
    setGroup(value);
    if (value === "satelite") {
      setDataGroup(data);
    }
    if (value === "touchPoint") {
      setDataGroup(groupDataByValue(data));
    }
    if (value === "equity") {
      setDataGroup(groupDataByEquity(data));
    }
    setBubbles(root.descendants().slice(1));
  };

  const onClickBubble = useCallback(
    (bubble: TBubbleDataNode) => {
      if (bubble.depth <= 1) {
        const scale = SVG_WIDTH / (bubble.r * 3);
        const translateX = SVG_WIDTH / 2 - bubble.x * scale;
        const translateY = SVG_WIDTH / 2 - bubble.y * scale;

        if (transform.k === 1) {
          setTransform({ x: translateX, y: translateY, k: scale });
        } else {
          setTransform({ x: 0, y: 0, k: 1 });
          setTimeout(() => {
            setTransform({ x: translateX, y: translateY, k: scale });
          }, 500);
        }
      }
    },
    [transform.k]
  );

  return (
    <>
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
        <button onClick={() => onGroup("satelite")}>Group by satelites</button>
      </div>
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
          position: "relative",
          top: 0,
          left: 0,
        }}
      >
        <svg
          onClick={() => resetScale()}
          width={SVG_WIDTH}
          height={SVG_WIDTH}
          ref={svgRef}
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            padding: 24,
            cursor: "pointer",
          }}
        >
          <BubblesGroup x={transform.x} y={transform.y} k={transform.k}>
            {bubbles.map((bubble, idx) => {
              return (
                <Bubble
                  bubble={bubble}
                  idx={idx}
                  key={idx}
                  onClickBubble={onClickBubble}
                />
              );
            })}
          </BubblesGroup>
        </svg>
      </div>
    </>
  );
};

export default Bubbles;
