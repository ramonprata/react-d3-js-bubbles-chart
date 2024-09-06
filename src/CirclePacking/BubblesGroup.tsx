import { PropsWithChildren } from "react";
import { useSpring, animated } from "react-spring";

interface IBubblesGroupProps extends PropsWithChildren {
  x: number;
  y: number;
  k: number;
}
const BubblesGroup = ({ children, x, y, k }: IBubblesGroupProps) => {
  const styles = useSpring({
    transform:
      k !== 1
        ? `translate(${x}px, ${y}px) scale(${k})`
        : "translate(0px, 0px) scale(1)",
    config: { tension: 170, friction: 26 },
  });

  return <animated.g style={styles}>{children}</animated.g>;
};

export default BubblesGroup;
