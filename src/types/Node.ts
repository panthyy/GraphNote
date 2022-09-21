import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { Interface } from "readline";

export type Node = {
  data: {
    id?: string;
    label: string;
    body: ExcalidrawElement[] | [];
  };
  renderedPosition?: {
    x: number;
    y: number;
  };
};
