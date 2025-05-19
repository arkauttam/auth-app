import { cn } from "@/lib/utils";
import { type FC } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container: FC<Props> = ({ children, className }) => {
  return <div className={cn("main-container", className)}>{children}</div>;
};

export default Container;