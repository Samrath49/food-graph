import { memo } from "react";
import CustomHandle from "./CustomHandle";
import { Position } from "reactflow";
import { Card } from "./ui/card";
import { Globe } from "lucide-react";

function StartNode({ data }: { data: { label: string; type: string } }) {
  return (
    <Card className="relative px-4 py-4 backdrop-blur-md !rounded-xl shadow-md group hover:shadow-lg transition-shadow duration-300 border border-neutral-300">
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 p-1 bg-slate-100 !rounded-xl flex justify-center items-center group-hover:bg-yellow-100/60 transition-all duration-300">
          <Globe className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="font-semibold text-lg text-neutral-700">
          {data.label}
        </div>
      </div>
      <CustomHandle type="source" position={Position.Right} />
    </Card>
  );
}

export default memo(StartNode);
