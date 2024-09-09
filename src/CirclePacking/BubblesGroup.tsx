import { PropsWithChildren } from "react";
import { useSpring, animated } from "react-spring";

interface IBubblesGroupProps extends PropsWithChildren {
  x: number;
  y: number;
  k: number;
}
const BubblesGroup = ({ children, x, y, k }: IBubblesGroupProps) => {
  const styles = useSpring({
    transform: `translate(${x}px, ${y}px) scale(${k})`,
    config: { tension: 170, friction: 26 },
  });

  return <animated.g style={styles}>{children}</animated.g>;
};

export default BubblesGroup;
