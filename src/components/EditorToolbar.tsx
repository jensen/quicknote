import classnames from "classnames";
import { DraftInlineStyle } from "draft-js";

const headingBlockTypes = [
  { label: "Paragraph", style: "unstyled" },
  { label: "Heading 1", style: "header-one" },
  { label: "Heading 2", style: "header-two" },
  { label: "Heading 3", style: "header-three" },
  { label: "Heading 4", style: "header-four" },
  { label: "Heading 5", style: "header-five" },
  { label: "Heading 6", style: "header-six" },
];
const blockTypes = [
  { label: "Blockquote", style: "blockquote" },
  { label: "Unordered List", style: "unordered-list-item" },
  { label: "Ordered List", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" },
];

const styleTypes = [
  { label: "B", style: "BOLD", classes: "font-bold" },
  { label: "I", style: "ITALIC", classes: "italic" },
  { label: "U", style: "UNDERLINE", classes: "underline" },
];

interface IStyleButton {
  active?: boolean;
  label: string;
  style: string;
  onToggle?: (type: string) => void;
  classes?: string;
}

const StyleButton = (props: IStyleButton) => {
  return (
    <span
      className={classnames(
        "w-8 h-8 flex flex-col mr-2 justify-center items-center",
        "border border-gray-300 hover:bg-gray-50",
        "rounded-md shadow-sm cursor-pointer select-none",
        props.classes,
        {
          "text-black bg-gray-100 border-gray-400": props.active,
          "text-gray-400 bg-white": !props.active,
        }
      )}
      onClick={() => {
        if (props.onToggle) {
          props.onToggle(props.style);
        }
      }}
    >
      {props.label}
    </span>
  );
};

interface IEditorToolbar {
  blockType: string;
  styleType: DraftInlineStyle;
  toggleBlock: (type: string) => void;
  toggleStyle: (type: string) => void;
}

const styles = {
  select:
    "block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-400 focus:border-blue-400 sm:text-sm",
};

export const EditorToolbarSkeleton = () => {
  return (
    <>
      <div className={"grid grid-flow-col gap-4 mb-2"}>
        <select disabled className={styles.select}>
          {headingBlockTypes.map((type) => (
            <option key={type.style} value={type.style}>
              {type.label}
            </option>
          ))}
        </select>
        <select disabled className={styles.select}>
          {blockTypes.map((type) => (
            <option key={type.style} value={type.style}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex">
        {styleTypes.map((type) => (
          <StyleButton
            key={type.label}
            label={type.label}
            style={type.style}
            classes={type.classes}
          />
        ))}
      </div>
    </>
  );
};

const EditorToolbar = (props: IEditorToolbar) => {
  return (
    <>
      <div className={"grid grid-flow-col gap-4 mb-2"}>
        <select
          className={styles.select}
          defaultValue={props.blockType}
          onChange={(event) => props.toggleBlock(event.target.value)}
        >
          {headingBlockTypes.map((type) => (
            <option key={type.style} value={type.style}>
              {type.label}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          defaultValue={props.blockType}
          onChange={(event) => props.toggleBlock(event.target.value)}
        >
          {blockTypes.map((type) => (
            <option key={type.style} value={type.style}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex">
        {styleTypes.map((type) => (
          <StyleButton
            key={type.label}
            active={props.styleType.has(type.style)}
            label={type.label}
            onToggle={props.toggleStyle}
            style={type.style}
            classes={type.classes}
          />
        ))}
      </div>
    </>
  );
};

export default EditorToolbar;
