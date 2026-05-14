import { COMPLEXITY_DATA } from "../../data/complexityData";

export default function ComplexitySummary({ algorithm }: { algorithm: string }) {
  const data = COMPLEXITY_DATA[algorithm];
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono mt-1">
      <div className="flex justify-between items-center bg-surface-850 px-2.5 py-1.5 rounded-md border border-surface-700/30">
        <span className="text-gray-500 uppercase tracking-wider">Best</span>
        <span className="text-emerald-400 font-semibold">{data.best}</span>
      </div>
      <div className="flex justify-between items-center bg-surface-850 px-2.5 py-1.5 rounded-md border border-surface-700/30">
        <span className="text-gray-500 uppercase tracking-wider">Average</span>
        <span className="text-amber-400 font-semibold">{data.average}</span>
      </div>
      <div className="flex justify-between items-center bg-surface-850 px-2.5 py-1.5 rounded-md border border-surface-700/30">
        <span className="text-gray-500 uppercase tracking-wider">Worst</span>
        <span className="text-rose-400 font-semibold">{data.worst}</span>
      </div>
      <div className="flex justify-between items-center bg-surface-850 px-2.5 py-1.5 rounded-md border border-surface-700/30">
        <span className="text-gray-500 uppercase tracking-wider">Space</span>
        <span className="text-gray-300 font-semibold">{data.space}</span>
      </div>
    </div>
  );
}
