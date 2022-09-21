import cytoscape from "cytoscape";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Node } from "../types";
import { MakeOptional, OmitRecursively } from "../utils/utils";

type GraphPanelProps = {
  elements: cytoscape.ElementDefinition[];
  setSelectedNodeId: (id: string) => void;
};


export const GraphPanel = (props: GraphPanelProps) => {
  const GraphNoSSR = dynamic(() => import("react-cytoscapejs"), {
    ssr: false,
  });

  const GraphOfflineApi = {
    GetNodes :  (): Node[] => {
      return JSON.parse(localStorage.getItem("nodes") || "[]");
    },
    GetEdges :  (): cytoscape.EdgeDefinition[] => {
      return JSON.parse(localStorage.getItem("edges") || "[]");
    },
    UpdateNode : (id: string, values: Partial<Node>) => {
      const nodes = JSON.parse(localStorage.getItem("nodes") || "[]");
      const node = nodes.find((n: any) => n.data.id === id);
      if (node) {
        Object.assign(node, values);
        localStorage.setItem("nodes", JSON.stringify([
          ...nodes.filter((n: any) => n.data.id !== id),
          node,
        ]));
      }
    },
    DeleteNode: (id: string) => {
      localStorage.setItem(
        "nodes",
        JSON.stringify(
          JSON.parse(localStorage.getItem("nodes") || "[]").filter(
            (e: any) => e.data.id !== id
          )
        )
      );
    },
    CreateNode: (cy: cytoscape.Core, node : Node)=> {
      const id = String(GraphOfflineApi.GetNodes().length + 1);
      localStorage.setItem(
        "nodes",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("nodes") || "[]"),
          {
            ...node,
            data: {
              ...node.data,
              id,
            },
            
          },
        ])
      );

      return id;
    },
    CreateEdge: (cy: cytoscape.Core, source: string, target: string) => {
      const id = String(GraphOfflineApi.GetEdges().length + 1);
      localStorage.setItem(
        "edges",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("edges") || "[]"),
          {
            data: {
              id,
              source,
              target,
            },
          },
        ])
      );

      return id;
    },
    }

  let nodeRightClickSelected : cytoscape.AbstractEventObject;
  let nodeRightClickTarget : cytoscape.AbstractEventObject | undefined;

  const GraphComp = useMemo((): JSX.Element => {
    const styleSheet: cytoscape.Stylesheet[] = [
      {
        selector: "node",
        style: {
          label: "data(label)",
          backgroundColor: "#444"
        },
      },
      {
        selector: "node:label",
        style: {
          "font-weight": "normal",
          "text-margin-y": "-5px",
        }
      },
      {
        selector: "edge",
        style: {
          "background-color": "#444",
          "line-color": "#666",
          "width": 2,
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
          "target-arrow-color": "#666",
        }
      },
    ];

    return (
      <GraphNoSSR
        className="w-full h-full"
        minZoom={0.8}
        maxZoom={4}
        stylesheet={styleSheet}
        wheelSensitivity={0.5}
        motionBlur={true}
        elements={props.elements}
        cy={(cy) => {

          // event listender for DELETE key
          document.addEventListener("keydown", (e) => {
            if (e.key === "Delete") {
              const selectedNodes = cy.$("node:selected");
              const selectedEdges = cy.$("edge:selected");
              selectedNodes.forEach((node) => {
                GraphOfflineApi.DeleteNode(node.id());
                cy.remove(node);
              });
              selectedEdges.forEach((edge) => {
                cy.remove(edge);
              }
              );
            }
          });

          cy.on("tap", "node", (evt) => {
            props.setSelectedNodeId(evt.target.id());
          });

          cy.on("cxttapstart", "node", (evt) => {
            nodeRightClickSelected = evt;
            console.log("right clicked",nodeRightClickSelected.target.id());
            
          });

          cy.on("cxtdragover", "node", (evt) => {
            nodeRightClickTarget = evt;
            
          });

          cy.on("cxtdragout", "node", (evt) => {
            nodeRightClickTarget = undefined;
            
          });

          cy.on("cxttapend", "node", (evt) => {
              const position= evt.renderedPosition 
              if (nodeRightClickTarget != undefined){
                const source = nodeRightClickSelected.target.id();
                const target = nodeRightClickTarget.target.id();
                const id = GraphOfflineApi.CreateEdge(cy, source, target);
                cy.add({
                  group: "edges",
                  data: {
                    id,
                    source,
                    target,
                  },
              })
              }else{
                const newNode: Node = {
                  data: {
                    label: "New Node",
                    body: [],
                  },
                  renderedPosition:position
                };

                const newNodeId = GraphOfflineApi.CreateNode(cy, newNode);
                cy.add({
                  ...newNode,
                  data: {
                    ...newNode.data,
                    id: newNodeId,
                  },
                });

                cy.add({
                  group: "edges",
                  data: {
                    id: GraphOfflineApi.CreateEdge(cy, nodeRightClickSelected.target.id(), newNodeId),
                    source: nodeRightClickSelected.target.id(),
                    target: newNodeId,
                  },
                });
              }
          })

          cy.on("cxttap", (evt) => {
            if (evt.target === cy) {
              const position= evt.renderedPosition 

              const newNode:Node = {
                data: {
                  label: "n0",
                  body: [],
                },
                renderedPosition:  position,
              }
              
              const newNodeId = GraphOfflineApi.CreateNode(cy,newNode);

              cy.add({
                ...newNode,
                data: {
                  ...newNode.data,
                  id: newNodeId,
                },
              });

              
            }});

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
