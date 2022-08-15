import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import cytoscape from "cytoscape";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { DrawPanel } from "../components";
import { GraphPanel } from "../components/GraphPanel";
import { trpc } from "../utils/trpc";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};
type GraphElement = cytoscape.ElementDefinition;

const Home: NextPage = () => {
  const [SelectedNodeId, setSelectedNodeId] = useState("none");
  const [ClientLoading, setClientLoading] = useState(true);
  const [GraphElements, setGraphElements] = useState<GraphElement[]>([
    {
      data: {
        id: "5",
        label: "n0",
        color: "red",
      },
    },
  ]);
  const [IsFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <>
      {ClientLoading && <div>Loading...</div>}

      <div
        style={{
          opacity: ClientLoading ? 0 : 1,
        }}
        className="flex  w-full h-full"
      >
        <div
          style={{
            width: IsFullScreen ? "100%" : "30%",
          }}
          className="  border-r-2 relative p-8 min-w-[400px] box-border transition-all duration-1000 ease-in-out "
        >
          <div
            onClick={() => setIsFullScreen(!IsFullScreen)}
            className=" absolute top-3 right-3 hover:cursor-pointer"
          >
            X
          </div>
          <DrawPanel
            setClientLoading={setClientLoading}
            IsFullScreen={IsFullScreen}
            SelectedNodeId={SelectedNodeId}
          />
        </div>
        <div
          style={{
            width: IsFullScreen ? "0" : "100%",
          }}
          className="shadow-inner  bg-white h-full  transition-all duration-1000 ease-in-out"
        >
          <GraphPanel
            setSelectedNodeId={setSelectedNodeId}
            elements={GraphElements}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
