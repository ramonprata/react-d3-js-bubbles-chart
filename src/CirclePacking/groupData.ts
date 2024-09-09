import { ICirclePackingData } from "./types/ICirclePackingData";
import { getEquityValueInNumber } from "./utils";

export const groupDataByValue = (data: ICirclePackingData) => {
  const children = data.children?.map((c) => c.children).flat();
  const group = children?.reduce(
    (p, n) => {
      const value = Number(n?.value ?? 0);

      if (value < 2.5) {
        p["range_<_2.5"].children.push(n);
      } else if (value >= 2.5 && value < 3) {
        p["range_2.5_3"].children.push(n);
      } else {
        p["range_>_3"].children.push(n);
      }
      return p;
    },
    {
      "range_<_2.5": {
        children: [],
      },
      "range_2.5_3": {
        children: [],
      },
      "range_>_3": {
        children: [],
      },
    }
  );
  const newData = Object.keys(group).map((key) => ({
    name: key,
    children: group[key].children,
  }));

  return {
    name: "Walmart",
    children: newData,
  };
};

export const groupDataByEquity = (data: ICirclePackingData) => {
  const children = data.children?.map((c) => c.children).flat();

  const group = children?.reduce(
    (p, n) => {
      const equity = getEquityValueInNumber(n?.equity ?? "");

      if (n) {
        if (equity < 0) {
          p["range_<_0"].children.push(n);
        } else if (equity >= 0 && equity < 0.1) {
          p["range_0_10%"].children.push(n);
        } else {
          p["range_>_10%"].children.push(n);
        }
      }
      return p;
    },
    {
      "range_<_0": {
        children: [],
      },
      "range_0_10%": {
        children: [],
      },
      "range_>_10%": {
        children: [],
      },
    }
  );

  const newData = Object.keys(group).map((key) => ({
    name: key,
    children: group[key].children,
  }));

  return {
    name: "Walmart",
    children: newData,
  };
};
