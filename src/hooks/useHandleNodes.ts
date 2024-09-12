import { Node, Edge } from "reactflow";
import { Category, Meal, Ingredients, Meals, MealDetails } from "../types";
import { Dispatch, SetStateAction } from "react";

// Utility function to create edges
const createEdges = (sourceId: string, targetNodes: Node[]) => {
  return targetNodes.map((target) => ({
    id: `e-${sourceId}-${target.id}`,
    source: sourceId,
    target: target.id,
  }));
};

// Utility function to create category nodes
const createCategoryNodes = (categories: Category[], node: Node) => {
  return categories.map((category, index) => ({
    id: `category-${index}`,
    type: "entityNode",
    data: {
      label: category?.strCategory,
      type: "category",
      entityId: category?.strCategory,
    },
    position: { x: 350, y: node.position.y - 200 + index * 100 },
  }));
};

// Utility function to create option nodes
const createOptionNodes = (
  node: Node,
  options: { label: string; type: string }[]
) => {
  return options.map((option, index) => ({
    id: `option-${option.type}-${node.id}`,
    type: "optionNode",
    data: {
      label: option.label,
      type: option.type,
      entityId: node.data.entityId,
    },
    position: {
      x: node.position.x + 350,
      y: node.position.y - 100 + index * 100,
    },
  }));
};


// Utility function to create meal nodes
const createMealNodes = (meals: Meal[], node: Node): Node[] => {
  return meals.map((meal, index) => ({
    id: `meal-${meal.idMeal}-${Date.now()}-${Math.random()}`,
    type: "entityNode",
    data: { label: meal.strMeal, type: "meal", entityId: meal.idMeal },
    position: {
      x: node.position.x + 350,
      y: node.position.y - 200 + index * 100,
    },
  }));
};

// Handle StartNode
export const handleStartNode = async (
  node: Node,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  fetchData: (
    endpointKey: string,
    params?: string
  ) => Promise<{
    meals: Category[] | Meal[] | Meals[] | Ingredients[];
  } | null>
): Promise<void> => {
  const response = await fetchData("categories");
  const categories = response?.meals?.slice(0, 5) || [];
  const newNodes = createCategoryNodes(categories as Category[], node);

  setNodes((nds) => [...nds, ...newNodes]);
  setEdges((eds) => [...eds, ...createEdges("1", newNodes)]);
};

// Handle Meals Node
export const handleViewMealsNode = async (
  node: Node,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  fetchData: (
    endpointKey: string,
    params?: string
  ) => Promise<{
    meals: Category[] | Meal[] | Meals[] | Ingredients[];
  } | null>,
  mealId?: string
) => {
  const response = await fetchData(
    "filter",
    mealId ? mealId : node.data.entityId
  );
  const meals = response?.meals?.slice(0, 5) || [];
  const newNodes = createMealNodes(meals as Meal[], node);

  setNodes((nds) => [...nds, ...newNodes]);
  setEdges((eds) => [...eds, ...createEdges(node.id, newNodes)]);
};

// Handle Meal Options Node (View Ingredients, View Tags, etc.)
export const handleMealOptionsNode = (
  node: Node,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
) => {
  const options = [
    { label: "View Ingredients", type: "viewIngredients" },
    { label: "View Tags", type: "viewTags" },
    { label: "View Details", type: "viewDetails" },
  ];

  const optionNodes = createOptionNodes(node, options);

  setNodes((nds) => [...nds, ...optionNodes]);
  setEdges((eds) => [...eds, ...createEdges(node.id, optionNodes)]);
};

// Handle Ingredients Node
export const handleViewIngredientsNode = async (
  node: Node,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  fetchData: (
    endpointKey: string,
    params?: string
  ) => Promise<{
    meals: Ingredients[] | Category[] | Meal[] | Meals[];
  } | null>
): Promise<void> => {
  // Fetch ingredients data
  const response = await fetchData(`ingredients`);
  const ingredients = (response?.meals?.slice(0,5) || []) as Ingredients[];

  const newNodes = ingredients.map((ingredient, index) => ({
    id: `${node.data.type}-${node.data.entityId}-${ingredient?.idIngredient}`,
    type: "entityNode",
    data: {
      label: ingredient?.strIngredient,
      type: "ingredient",
      entityId: ingredient?.strIngredient,
    },
    position: {
      x: node.position.x + 350,
      y: node.position.y - 200 + index * 100,
    },
  }));

  setNodes((nds) => [...nds, ...newNodes]);
  setEdges((eds) => [...eds, ...createEdges(node.id, newNodes)]);
};

// Handle Tags Node
export const handleViewTagsNode = async (
  node: Node,
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  fetchData: (
    endpointKey: string,
    params?: string
  ) => Promise<{
    meals: Category[] | Meal[] | Meals[] | Ingredients[];
  } | null>
) => {
  const response = await fetchData(`meal`, node.data.entityId);
  const mealDetails = response?.meals[0] as MealDetails;
  const items = mealDetails?.strTags ? mealDetails.strTags.split(",") : [];

  const newNodes = {
    id: `${node.data.type}-${node.data.entityId}-${0}`,
    type: "tagsNode",
    data: { tags: items, type: "tag" },
    position: {
      x: node.position.x + 350,
      y: node.position.y,
    },
  };

  setNodes((nds) => [...nds, newNodes]);
  setEdges((eds) => [...eds, ...createEdges(node.id, [newNodes])]);
};

// Handle Details Node
export const handleViewDetailsNode = async (
  node: Node,
  setSelectedMeal: Dispatch<SetStateAction<Meal | undefined | null>>,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  fetchData: (
    endpointKey: string,
    params?: string
  ) => Promise<{
    meals: Category[] | Meal[] | Meals[] | Ingredients[];
  } | null>
) => {
  const response = await fetchData(`meal`, node.data.entityId);
  const mealDetails = response?.meals[0] as Meal | undefined | null;
  setSelectedMeal(mealDetails);
  setOpen(true);
};