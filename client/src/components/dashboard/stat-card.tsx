import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  changeValue?: number;
  changeText?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  changeValue = 0,
  changeText = "Desde el mes pasado",
  className,
}: StatCardProps) {
  const isPositive = changeValue >= 0;

  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-5", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      {changeValue !== 0 && (
        <div className="mt-2 flex items-center text-sm">
          <span
            className={cn(
              "font-medium flex items-center",
              isPositive ? "text-success-500" : "text-danger-500"
            )}
          >
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownIcon className="h-4 w-4 mr-1" />
            )}
            {Math.abs(changeValue)}%
          </span>
          <span className="text-neutral-500 ml-2">{changeText}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;
