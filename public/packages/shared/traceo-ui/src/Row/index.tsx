import { conditionClass, joinClasses } from "../utils/classes";
import React, { FC } from "react";

interface RowProps {
  cols?: number;
  gap?: string; //https://tailwindcss.com/docs/gap
  children?: React.ReactNode;
  className?: string;
}
export const Row: FC<RowProps> = ({ cols, gap, children, className }) => {
  return (
    <div
      className={joinClasses(
        conditionClass(!!cols, `grid grid-cols-${cols}`, "flex flex-row items-center"),
        conditionClass(!!gap, `gap-${gap}`),
        className
      )}
    >
      {children}
    </div>
  );
};
