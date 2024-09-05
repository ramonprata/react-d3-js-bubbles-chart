import { useRef, useEffect, useCallback, useState } from "react";
import * as d3 from "d3";
import {
  addLabelsToBubbles,
  addNodesToSVGChart,
  addTransitionToBubbleLabels,
  createChartSVGContainer,
  getTransition,
  packRootSVG,
  SVG_HEIGHT,
  SVG_WIDTH,
  zoomTo,
} from "./utils";
import { ICirclePackingData } from "./types/ICirclePackingData";
import { TBubbleDataNode } from "./types/TBubbleDataNode";
import { groupDataByEquity, groupDataByValue } from "./groupData";
import Circle from "./Circle";
import Text from "./Text";

interface ICirclePackingChartProps {
  data: ICirclePackingData;
}

type TGroupTypes = "satelite" | "touchPoint" | "equity";

const Bubbles = ({ data }: ICirclePackingChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef(null);

  const [group, setGroup] = useState<TGroupTypes>("satelite");

  const [dataGroup, setDataGroup] =
    useState<ICirclePackingChartProps["data"]>(data);

  const bubblesRef = useRef<ReturnType<typeof addNodesToSVGChart> | null>(null);
  const bubblesLabelsRef = useRef<ReturnType<typeof addLabelsToBubbles> | null>(
    null
  );

  // Define os dados com base no estado atual
  const newData = dataGroup;
  const root = packRootSVG(newData);
  // if (svgRef.current) {
  //   bubblesRef.current = addNodesToSVGChart(svgRef.current, root);
  //   bubblesLabelsRef.current = addLabelsToBubbles(svgRef.current, root);
  // }

  // let referenceNode = root;
  // const referenceView = useRef<d3.ZoomView>([root.x, root.y, root.r]);
  // const boundZoomTo = zoomTo.bind(
  //   null,
  //   bubblesRef,
  //   bubblesLabelsRef,
  //   referenceView
  // );

  // const zoom = useCallback(
  //   (
  //     event: React.MouseEvent<SVGSVGElement, MouseEvent>,
  //     node: TBubbleDataNode
  //   ) => {
  //     event.stopPropagation();
  //     referenceNode = node;
  //     const transition = getTransition(
  //       referenceView.current,
  //       referenceNode,
  //       boundZoomTo
  //     );
  //     addTransitionToBubbleLabels(
  //       bubblesLabelsRef.current,
  //       referenceNode,
  //       transition
  //     );
  //   },
  //   []
  // );

  // useEffect(() => {
  //   if (containerRef.current && svgRef.current) {
  //     const svg = createChartSVGContainer(svgRef.current);
  //     bubblesRef.current = addNodesToSVGChart(svgRef.current, root);
  //     bubblesLabelsRef.current = addLabelsToBubbles(svgRef.current, root);

  //     bubblesRef.current.on(
  //       "click",
  //       (event, d) =>
  //         referenceNode !== d && (zoom(event, d), event.stopPropagation())
  //     );

  //     boundZoomTo([referenceNode.x, referenceNode.y, referenceNode.r * 2]);

  //     return () => {
  //       svg.selectAll("*").remove();
  //     };
  //   }
  // }, [boundZoomTo, referenceNode, root, zoom]);

  const onGroup = (value: TGroupTypes) => {
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
  };

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
        }}
      >
        <svg
          onClick={(event) => {
            // zoom(event, root);
          }}
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
          <g>
            {root
              .descendants()
              .slice(1)
              .map((bubble, idx) => (
                <Circle bubble={bubble} idx={idx} key={idx} />
              ))}
          </g>
          {/* <g>
            {root
              .descendants()
              .slice(1)
              .map((bubble, idx) => (
                <Text bubble={bubble} idx={idx} />
              ))}
          </g> */}
        </svg>
      </div>
    </>
  );
};

export default Bubbles;
