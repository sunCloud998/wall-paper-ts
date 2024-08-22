import { ClassifyData } from "./types";

export interface ThemeItemPop {
  isMore?: boolean;
  item?: ClassifyData;
}

export interface ClassListParam {
  id?: number;
  name: string;
  type?: string;
}
