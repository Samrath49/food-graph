import { memo } from "react";
import { Position } from "reactflow";
import CustomHandle from "./CustomHandle";
import { Card } from "./ui/card";
import { HandPlatter, Salad, Soup } from "lucide-react";
import { cn } from "@/lib/utils";

function EntityNode({ data }: { data: { label: string; type: string } }) {
  return (
    <Card
      className={cn(
        "px-4 py-3 w-52 min-w-52 max-w-52 shadow-md group hover:shadow-lg transition-shadow duration-300",
        data?.type === "meal" && "w-60 min-w-60 max-w-60"
      )}
    >
      <div className="font-base text-neutral-700 flex items-center justify-start gap-2">
        {data?.type === "category" && (
          <div className="w-8 h-8 p-1 bg-slate-100 !rounded-xl flex justify-center items-center group-hover:bg-pink-100/75 transition-all duration-300">
            <Soup className="w-6 h-6 text-pink-600" />
          </div>
        )}

        {data?.type === "meal" && (
          <div className="w-8 h-8 p-1 bg-slate-100 !rounded-xl flex justify-center items-center group-hover:bg-purple-100/75 transition-all duration-300">
            <Salad className="w-6 h-6 text-purple-600" />
          </div>
        )}

        {data?.type === "ingredient" && (
          <div className="w-8 h-8 p-1 bg-slate-100 !rounded-xl flex justify-center items-center group-hover:bg-orange-100/75 transition-all duration-300">
            <HandPlatter className="w-6 h-6 text-orange-600" />
          </div>
        )}  

        {data.label}
      </div>
      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Right} />
    </Card>
  );
}

export default memo(EntityNode);
