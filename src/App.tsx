import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { Category, Ingredients, Meal, Meals } from "./types";

import useMealApi from "./hooks/useMealApi";
import { EntityNode, TagsNode, OptionNode, StartNode } from "./components";
import MealSheet from "./components/MealSheet";
import { handleMealOptionsNode, handleStartNode, handleViewDetailsNode, handleViewIngredientsNode, handleViewMealsNode, handleViewTagsNode } from "./hooks/useHandleNodes";

const nodeTypes = {
  startNode: StartNode,
  entityNode: EntityNode,
  optionNode: OptionNode,
  tagsNode: TagsNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "startNode",
    data: { label: "Explore", type: "start" },
    position: { x: 50, y: 5 },
  },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | undefined | null>(
    null
  );

  const { fetchData } = useMealApi<{
    meals: Category[] | Meal[] | Meals[] | Ingredients[];
  }>();

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        animated: true,
        id: `${edges.length} + 1`,
        type: "customEdge",
      };
      setEdges((prevEdges) => addEdge(edge, prevEdges));
    },
    [edges]
  );

  const onNodeClick = useCallback(
    async (_event: React.MouseEvent, node: Node) => {
      switch (node.data.type) {
        case "start":
          await handleStartNode(node, setNodes, setEdges, fetchData);
          break;
  
        case "category": {
          const optionNode: Node = {
            id: `option-${node.id}`,
            type: "optionNode",
            data: {
              label: "View Meals",
              type: "viewMeals",
              entityId: node.data.entityId,
            },
            position: { x: node.position.x + 350, y: node.position.y },
          };
          setNodes((nds) => [...nds, optionNode]);
          setEdges((eds) => [
            ...eds,
            {
              id: `e-${node.id}-${optionNode.id}`,
              source: node.id,
              target: optionNode.id,
            },
          ]);
          break;
        }
  
        case "viewMeals":
        case "ingredient":
          await handleViewMealsNode(node, setNodes, setEdges, fetchData);
          break;
  
        case "meal":
          handleMealOptionsNode(node, setNodes, setEdges);
          break;
  
        case "viewIngredients":
          await handleViewIngredientsNode(node, setNodes, setEdges, fetchData);
          break;
  
        case "viewTags":
          await handleViewTagsNode(node, setNodes, setEdges, fetchData);
          break;
  
        case "viewDetails":
          await handleViewDetailsNode(node, setSelectedMeal, setOpen, fetchData);
          break;
  
        default:
          // Optional: handle unknown node types if necessary
          break;
      }
    },
    [fetchData, setNodes, setEdges, setSelectedMeal, setOpen]
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
      </ReactFlow>
      {open && (
        <MealSheet
          mealData={selectedMeal}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
