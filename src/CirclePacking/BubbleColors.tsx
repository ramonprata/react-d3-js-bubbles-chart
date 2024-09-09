const BubbleColors = () => {
  return (
    <>
      <defs>
        <radialGradient id="gradGreen">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#06A22840" />
        </radialGradient>
      </defs>
      <defs>
        <radialGradient
          id="gradRed"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#FF143C40" />
        </radialGradient>
      </defs>
      <defs>
        <radialGradient
          id="gradOrange"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="#FFA11940" />
        </radialGradient>
      </defs>
    </>
  );
};

export default BubbleColors;
