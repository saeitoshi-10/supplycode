import React, { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "px-4 py-2 font-semibold rounded transition duration-200";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const combined = classNames(baseStyles, variants[variant], className);

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  );
}
