export const withStopPropagation = (fn?: any) => (event) => {
  event.stopPropagation();

  if (fn) {
    fn(event);
  }
};

export const withPreventDefault = (fn?: any) => (event) => {
  event.preventDefault();

  if (fn) {
    fn(event);
  }
};
