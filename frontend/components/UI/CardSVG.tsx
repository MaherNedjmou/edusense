import { forwardRef } from "react";

interface CardSVGProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardSVG = forwardRef<HTMLDivElement, CardSVGProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-3/4 max-md:w-full mx-auto p-8 max-md:p-4 rounded-2xl bg-background border-2 border-primary/30 shadow-[4px_4px_0px_0px_#000] flex flex-col gap-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardSVG.displayName = "CardSVG";
export default CardSVG;