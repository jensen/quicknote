import React from "react";
import cn from "classnames";

export interface IButton {
  intent?: "primary" | "danger";
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}

const Button = ({
  intent = "primary",
  disabled,
  onClick,
  children,
}: React.PropsWithChildren<IButton>) => (
  <button
    className={cn(
      "inline-flex justify-center items-center",
      "px-4 py-2",
      "rounded-md shadow-sm",
      "text-sm font-medium",
      {
        "text-gray-700 bg-white hover:bg-gray-200 focus:ring-blue-400":
          intent === "primary",
        "text-white bg-red-400 hover:bg-red-500 focus:ring-red-400":
          intent === "danger",
      },
      "focus:outline-none focus:ring-2 focus:ring-offset-2"
      // "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      // "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      // {
      //   "text-white bg-blue-400": props.disabled !== true,
      //   "text-black bg-gray-400": props.disabled === true,
      // }
    )}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
