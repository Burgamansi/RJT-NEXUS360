type ProgressBarProps = {
  value: number;
  className?: string;
};

export function ProgressBar({ value, className = "bg-secondary" }: ProgressBarProps) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
      <div className={`h-full ${className}`} style={{ width: `${value}%` }} />
    </div>
  );
}


