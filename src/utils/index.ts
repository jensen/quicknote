import React from "react";

export const withStopPropagation =
  (fn?: any) => (event: React.BaseSyntheticEvent) => {
    event.stopPropagation();

    if (fn) {
      fn(event);
    }
  };

export const withPreventDefault =
  (fn?: any) => (event: React.BaseSyntheticEvent) => {
    event.preventDefault();

    if (fn) {
      fn(event);
    }
  };
