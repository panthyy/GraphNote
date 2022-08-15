import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  ExcalidrawAPIRefValue,
} from "@excalidraw/excalidraw/types/types";
import { useEffect, useRef, useState } from "react";

type DrawPanelProps = {
  SelectedNodeId: string;
  IsFullScreen: boolean;
  setClientLoading: (loading: boolean) => void;
};
type DrawElement = ExcalidrawElement;
export const DrawPanel = (props: DrawPanelProps) => {
  const [Comp, setComp] = useState<any>(null);
  const [DrawElements, setDrawElements] = useState<DrawElement[]>([
    {
      id: "UigKpJFHiPzj3Z2cVePG6",
      type: "text",
      x: 132,
      y: 164,
      width: 21,
      height: 27,
      angle: 0,
      strokeColor: "#000000",
      backgroundColor: "transparent",
      fillStyle: "hachure",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      groupIds: [],
      strokeSharpness: "sharp",
      seed: 787056157,
      version: 4,
      versionNonce: 1722808275,
      isDeleted: false,
      boundElements: null,
      updated: 1660531784713,
      link: null,
      locked: false,
      text: props.SelectedNodeId,
      fontSize: 20,
      fontFamily: 1,
      textAlign: "left",
      verticalAlign: "top",
      baseline: 22,
      containerId: null,
      originalText: props.SelectedNodeId,
    },
  ]);
  const excalidrawRef = useRef<ExcalidrawAPIRefValue>(null);

  const handleChange = (
    elements: readonly ExcalidrawElement[],
    state: AppState,
    files: BinaryFiles
  ) => {
    console.log(JSON.stringify(elements));
  };

  useEffect(() => {
    const fetchRootData = async (id: string): Promise<DrawElement[]> => {
      if (id === "") {
        return [];
      }
      return [
        {
          id: "UigKpJFHiPzj3Z2cVePG4",
          type: "text",
          x: 132,
          y: 164,
          width: 21,
          height: 27,
          angle: 0,
          strokeColor: "#000000",
          backgroundColor: "transparent",
          fillStyle: "hachure",
          strokeWidth: 1,
          strokeStyle: "solid",
          roughness: 1,
          opacity: 100,
          groupIds: [],
          strokeSharpness: "sharp",
          seed: 787056157,
          version: 4,
          versionNonce: 1722808275,
          isDeleted: false,
          boundElements: null,
          updated: 1660531784713,
          link: null,
          locked: false,
          text: "Custom Text",
          fontSize: 20,
          fontFamily: 1,
          textAlign: "left",
          verticalAlign: "top",
          baseline: 22,
          containerId: null,
          originalText: "Custom Text",
        },
      ];
    };

    console.log(props.SelectedNodeId);

    fetchRootData(props.SelectedNodeId).then((data) => {
      const excali = excalidrawRef.current;
      const ready = excali?.ready;
      if (ready) {
        excali.updateScene({
          elements: data,
          appState: {},
        });
        excali.scrollToContent();
      }
    });
  }, [props.SelectedNodeId]);

  useEffect(() => {
    const excali = excalidrawRef.current;
    const ready = excali?.ready;
    if (ready) {
      setTimeout(() => {
        excali.scrollToContent();
      }, 800);
    }
  }, [props.IsFullScreen]);

  // quick fix refactor later
  useEffect(() => {
    const interval = setInterval(() => {
      const ref = excalidrawRef.current;
      const ready = ref?.ready;
      console.log(ready);

      if (ready) {
        props.setClientLoading(false);
        clearInterval(interval);
      }
    }, 200);
  }, []);

  useEffect(() => {
    import("@excalidraw/excalidraw").then((comp) => {
      setComp(
        <comp.Excalidraw
          ref={excalidrawRef}
          onChange={handleChange}
          theme={localStorage.getItem("theme") || "light"}
          autoFocus={true}
          initialData={{
            elements: DrawElements,
            appState: {
              currentItemFontFamily: comp.FONT_FAMILY.Virgil,
            },
          }}
        ></comp.Excalidraw>
      );
    });
  }, [DrawElements, props.SelectedNodeId]);

  return <>{Comp}</>;
};
