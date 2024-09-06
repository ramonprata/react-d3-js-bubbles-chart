export interface INodeVale {
  name: string;
  value?: number;
  equity?: string;
  type?: "legend" | "child";
}
export interface ICirclePackingData extends INodeVale {
  children?: ICirclePackingData[];
}
