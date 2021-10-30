import { useRef } from "react";
import { useResource, useNotes } from "context/resources";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  DndProvider,
  useDrag,
  useDrop,
  DropTargetMonitor,
  DragLayerMonitor,
} from "react-dnd";
import { XYCoord } from "dnd-core";
import classNames from "classnames";

import { useLocalStorage } from "hooks/local";

import NotePreview from "components/NotePreview";

interface IDragItem {
  index: number;
  id: string;
  type: string;
}

interface IDraggableNote {
  note: INote;
  index: number;
  move: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableNote = (props: IDraggableNote) => {
  const resources = useResource();
  const draggableRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "note",
    item: () => ({ id: props.note.id, index: props.index }),
    collect: (monitor: DragLayerMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: "note",
    collect: (monitor: DropTargetMonitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover: (item: IDragItem, monitor: DropTargetMonitor) => {
      if (!draggableRef.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = props.index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = draggableRef.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      props.move(dragIndex, hoverIndex);

      item.index = hoverIndex;
    },
  });

  drag(drop(draggableRef));

  return (
    <li
      ref={draggableRef}
      className={classNames("w-full mb-2 relative", {
        "opacity-0": isDragging,
      })}
      data-handler-id={handlerId}
    >
      <div onClick={() => resources.notes.load(props.note.id)}>
        <NotePreview note={props.note} />
      </div>
    </li>
  );
};

const NoteList = () => {
  const { notes, moveNote } = useNotes();

  const { data: order } = useLocalStorage<string[]>("notes:order");
  const indexed: {
    [key: string]: INote;
  } = notes.reduce((existing, note) => ({ ...existing, [note.id]: note }), {});
  const sorted: INote[] = order
    ? order.filter((id) => indexed[id] !== undefined).map((id) => indexed[id])
    : notes;

  return (
    <DndProvider backend={HTML5Backend}>
      <ul className="flex flex-col items-end px-10">
        {sorted.map((note, index) => (
          <DraggableNote
            key={note.id}
            note={note}
            index={index}
            move={moveNote}
          />
        ))}
      </ul>
    </DndProvider>
  );
};

export default NoteList;
