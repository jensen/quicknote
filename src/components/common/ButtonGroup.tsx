import classNames from "classnames";

interface IButtonGroup {
  vertical?: boolean;
}

const ButtonGroup = (props: React.PropsWithChildren<IButtonGroup>) => {
  return (
    <div
      className={classNames("grid", {
        "grid-flow-row auto-rows-auto gap-2": props.vertical,
        "grid-flow-col auto-cols-auto gap-4": !props.vertical,
      })}
    >
      {props.children}
    </div>
  );
};

export default ButtonGroup;
