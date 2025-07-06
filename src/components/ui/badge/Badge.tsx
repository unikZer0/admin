type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

interface BadgeProps {
  variant?: BadgeVariant; // Light or solid variant
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
  className?: string; // Additional CSS classes
}

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "info",
  size = "md",
  startIcon,
  endIcon,
  children,
  className,
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium";

  // Define size styles
  const sizeStyles = {
    sm: "text-xs", // Smaller padding and font size
    md: "text-sm", // Default padding and font size
  };

  // Define color styles for variants
  const variants = {
    light: {
      primary:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      success:
        "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
      error:
        "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
      warning:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-400",
      info: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
      light: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      dark: "bg-gray-500 text-white dark:bg-gray-600 dark:text-white",
    },
    solid: {
      primary: "bg-blue-500 text-white dark:bg-blue-600",
      success: "bg-green-500 text-white dark:bg-green-600",
      error: "bg-red-500 text-white dark:bg-red-600",
      warning: "bg-yellow-500 text-white dark:bg-yellow-600",
      info: "bg-blue-500 text-white dark:bg-blue-600",
      light: "bg-gray-400 text-white dark:bg-gray-500",
      dark: "bg-gray-700 text-white dark:bg-gray-800",
    },
  };

  // Get styles based on size and color variant
  const sizeClass = sizeStyles[size];
  const colorStyles = variants[variant][color];

  return (
    <span className={`${baseStyles} ${sizeClass} ${colorStyles} ${className || ''}`}>
      {startIcon && <span className="mr-1">{startIcon}</span>}
      {children}
      {endIcon && <span className="ml-1">{endIcon}</span>}
    </span>
  );
};

export default Badge;
