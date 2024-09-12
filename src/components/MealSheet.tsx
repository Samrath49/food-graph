import { Meal } from "@/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Utensils, Globe, Tag, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const MealSheet = ({
  mealData,
  open,
  onClose,
}: {
  mealData: Meal | null | undefined;
  open: boolean;
  onClose: () => void;
}) => {
  if (!mealData) {
    // Render nothing or fallback UI if mealData is null or undefined
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-[600px] p-0 bg-gradient-to-br from-purple-50 to-pink-50">
          <ScrollArea className="h-full w-full">
            <div className="p-6">
              <SheetHeader>
                <SheetTitle>No Meal Data Available</SheetTitle>
              </SheetHeader>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  const ingredients = Array.from({ length: 20 }, (_, i) => ({
    ingredient: mealData[`strIngredient${i + 1}` as keyof Meal] as string,
    measure: mealData[`strMeasure${i + 1}` as keyof Meal] as string,
  })).filter(
    ({ ingredient }) => ingredient && ingredient.trim() !== ""
  );

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetTrigger></SheetTrigger>
      <SheetContent className="w-full sm:max-w-[600px] p-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <SheetHeader className="absolute -top-2 -right-2 z-50 p-4">
          <SheetClose className="rounded-full hover:bg-neutral-200 p-2 transition-colors">
            <X className="h-4 w-4" />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="h-full w-full">
          <div className="p-6">
            <div className="relative h-64 mb-6 pt-5 rounded-lg overflow-hidden">
              {mealData.strMealThumb ? (
                <img
                  src={mealData.strMealThumb}
                  alt={mealData.strMeal}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                  <span>No Image Available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <SheetTitle className="absolute bottom-4 left-4 text-3xl font-bold text-white">
                {mealData.strMeal || "No Meal Name"}
              </SheetTitle>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {mealData.strCategory && (
                <Badge className="bg-purple-500 hover:bg-purple-600">
                  <Utensils className="w-3 h-3 mr-1" />
                  {mealData.strCategory}
                </Badge>
              )}
              {mealData.strArea && (
                <Badge className="bg-pink-500 hover:bg-pink-600">
                  <Globe className="w-3 h-3 mr-1" />
                  {mealData.strArea}
                </Badge>
              )}
              {mealData.strTags &&
                mealData.strTags.split(",").map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-gray-700 border-gray-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.trim()}
                  </Badge>
                ))}
            </div>
            <Separator className="my-6" />
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-3 text-purple-700">
                    Instructions
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {mealData.strInstructions || "No instructions available."}
                  </p>
                </CardContent>
              </Card>
              {ingredients.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-3 text-pink-700">
                      Ingredients
                    </h3>
                    <ul className="grid grid-cols-2 gap-2">
                      {ingredients.map(({ ingredient, measure }, index) => (
                        <li
                          key={index}
                          className="text-sm bg-white p-2 rounded-md shadow-sm border border-gray-100"
                        >
                          <span className="font-medium text-gray-700">
                            {ingredient}
                          </span>
                          <span className="text-gray-500 ml-1">
                            - {measure}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {(mealData.strYoutube || mealData.strSource) && (
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-3 text-purple-700">
                      Links
                    </h3>
                    <div className="flex flex-col space-y-2">
                      {mealData.strYoutube && (
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          asChild
                        >
                          <a
                            href={mealData.strYoutube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> Watch on
                            YouTube
                          </a>
                        </Button>
                      )}
                      {mealData.strSource && (
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          asChild
                        >
                          <a
                            href={mealData.strSource}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> View
                            Source
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default MealSheet;
