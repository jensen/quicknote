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

      /* There are two values that we will end up swapping,
         we need to keep keep track of their values.
         
         dragIndex is the index of the item that is dragged
         hoverIndex is the index of the item that is a possible drop target
      */
      const dragIndex = item.index;
      const hoverIndex = props.index;

      /* When these values match, we haven't dragged anywhere. */
      if (dragIndex === hoverIndex) {
        return;
      }

      /* As we drag the elment down or up we want to swap its position
         with the element below it.
         
         We need to figure out where the mouse is relative to the elements in our list.
      */

      const hoverBoundingRect = draggableRef.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      /* When we are dragging downwards we want to avoiding the swap
         until the mouse is lower than the halfway point of the element below. */
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      /* When we are dragging upwards we want to avoid the swap
         until the mouse is higher than the halfway point of the element below. */
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      /* This eventually updates the cache, which is responsible for the order. */
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
