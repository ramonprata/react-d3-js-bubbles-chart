interface INodeVale {
  name: string;
  value?: number;
}
export interface ICirclePackingData extends INodeVale {
  children?: ICirclePackingData[];
}
