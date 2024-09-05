export interface INodeVale {
  name: string;
  value?: number;
  equity?: string;
}
export interface ICirclePackingData extends INodeVale {
  children?: ICirclePackingData[];
}
