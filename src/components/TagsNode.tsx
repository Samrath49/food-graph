import { memo } from "react";
import { Position } from "reactflow";
import CustomHandle from "./CustomHandle";
import { Card } from "./ui/card";
import { Wheat } from "lucide-react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

function TagsNode({ data }: { data: { tags: string[]; type: string } }) {
  return (
    <Card className="px-2 py-3 w-52 min-w-52 max-w-52 shadow-md group hover:shadow-lg transition-shadow duration-300">
      <div className="font-medium px-2 text-neutral-700 flex items-center justify-start gap-2">
        <div className="w-8 h-8 p-1 bg-slate-100 !rounded-xl flex justify-center items-center group-hover:bg-fuchsia-100/75 transition-all duration-300">
          <Wheat className="w-6 h-6 text-fuchsia-600" />
        </div>
        Meal Tags
      </div>
      <Separator className="my-2 group-hover:bg-fuchsia-200 transition-all duration-300" />
      <div className="px-2 flex flex-wrap gap-2">
        {data?.tags?.length === 0 && (
          <Badge
            variant={"outline"}
            className="!rounded group-hover:border-red-200"
          >
            No tags found.
          </Badge>
        )}
        {data?.tags?.map((tag, i) => (
          <Badge
            key={i}
            variant={"outline"}
            className="!rounded group-hover:border-fuchsia-200"
          >
            {tag}
          </Badge>
        ))}
      </div>
      <CustomHandle type="target" position={Position.Left} />
    </Card>
  );
}

export default memo(TagsNode);
