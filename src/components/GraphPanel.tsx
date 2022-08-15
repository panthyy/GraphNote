import cytoscape from "cytoscape";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

type GraphPanelProps = {
  elements: cytoscape.ElementDefinition[];
  setSelectedNodeId: (id: string) => void;
};

export const GraphPanel = (props: GraphPanelProps) => {
  const GraphNoSSR = dynamic(() => import("react-cytoscapejs"), {
    ssr: false,
  });

  const GraphComp = useMemo((): JSX.Element => {
    const styleSheet: cytoscape.Stylesheet[] = [
      {
        selector: "node",
        style: {},
      },
      {
        selector: "edge",
        style: {},
      },
    ];

    return (
      <GraphNoSSR
        className="w-full h-full"
        minZoom={0.8}
        maxZoom={4}
        wheelSensitivity={0.5}
        motionBlur={true}
        elements={props.elements}
        cy={(cy) => {
          cy.on("tap", "node", (evt) => {
            props.setSelectedNodeId(evt.target.id());
          });

          // tap on background to deselect
          cy.on("tap", (evt) => {
            if (evt.target === cy) {
              props.setSelectedNodeId("");
              console.log("tap on background");
            }
          });
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.elements]);

  return <>{GraphComp}</>;
};
