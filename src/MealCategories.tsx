import React, { useEffect } from "react";
import useMealApi from "./hooks/useMealApi";
import { Category } from "./types";

const MealCategories: React.FC = () => {
  const { data, loading, error, fetchData } = useMealApi<{
    meals: Category[];
  }>();

  useEffect(() => {
    fetchData("filter", "Beef");
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Meal Categories</h2>
      <ul>
        {data?.meals.map(
          (category, i) =>
            i < 5 && (
              <>
                <li key={i}>{category.strCategory}</li>
              </>
            )
        )}
      </ul>
    </div>
  );
};

export default MealCategories;
