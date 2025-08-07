import { cn } from "@/lib/utils";

const LoadingSpinner = ({ size = "md", className }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-wild-500/30 border-t-nature-500",
          sizes[size],
          className
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
