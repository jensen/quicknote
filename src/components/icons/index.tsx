import React, { PropsWithChildren } from "react";

const DEFAULT_ICON_SIZE = 16;
const DEFAULT_ICON_COLOR = "black";

interface IIcon {
  size?: number;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

const Icon = ({ size = 64, onClick, children }: PropsWithChildren<IIcon>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={`${size}px`}
    height={`${size}px`}
    viewBox="0 0 512 512"
    onClick={onClick}
  >
    {children}
  </svg>
);

export const DeleteIcon = ({
  size = DEFAULT_ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
  onClick,
}: IIcon & {
  color?: string;
}) => (
  <Icon onClick={onClick} size={size}>
    <path
      fill={color}
      d="M497.941 273.941c18.745-18.745 18.745-49.137 0-67.882l-160-160c-18.745-18.745-49.136-18.746-67.883 0l-256 256c-18.745 18.745-18.745 49.137 0 67.882l96 96A48.004 48.004 0 0 0 144 480h356c6.627 0 12-5.373 12-12v-40c0-6.627-5.373-12-12-12H355.883l142.058-142.059zm-302.627-62.627l137.373 137.373L265.373 416H150.628l-80-80 124.686-124.686z"
    />
  </Icon>
);

export const PlusIcon = ({
  size = DEFAULT_ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
  onClick,
}: IIcon & {
  color?: string;
}) => (
  <Icon onClick={onClick} size={size}>
    <path
      fill={color}
      d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
    />
  </Icon>
);

export const SaveIcon = ({
  size = DEFAULT_ICON_SIZE,
  color = DEFAULT_ICON_COLOR,
  onClick,
}: IIcon & {
  color?: string;
}) => (
  <Icon onClick={onClick} size={size}>
    <path
      fill={color}
      d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"
    />
  </Icon>
);
