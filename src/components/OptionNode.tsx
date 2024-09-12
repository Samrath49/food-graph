import { memo } from "react";
import { Position } from "reactflow";
import { Card } from "./ui/card";
import CustomHandle from "./CustomHandle";
import { CircleArrowOutUpRight } from "lucide-react";

function OptionNode({ data }: { data: { label: string } }) {
  return (
    <Card className="px-3 py-3 w-48 min-w-48 max-w-48 rounded-full shadow-md group hover:shadow-lg transition-shadow duration-300">
      <div className="font-base text-neutral-700 flex items-center justify-start gap-2">
        <div className="w-8 h-8 p-1 bg-slate-100 !rounded-xl flex justify-center items-center group-hover:bg-green-100/60 transition-all duration-300">
          <CircleArrowOutUpRight className="w-6 h-6 text-green-600" />
        </div>
        {data.label}
      </div>
      <CustomHandle type="target" position={Position.Left} />
      <CustomHandle type="source" position={Position.Right} />
    </Card>
  );
}

export default memo(OptionNode);
