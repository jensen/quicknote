import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";
import { format } from "date-fns";
import classNames from "classnames";
import { DeleteIcon } from "components/icons";
import Button from "components/common/Button";
import ButtonGroup from "components/common/ButtonGroup";
import { useNotes } from "context/resources";
import { deleteNote } from "services/notes";
import { withStopPropagation } from "utils";

interface INotePreview {
  note: INote;
}

const NotePreview = (props: INotePreview) => {
  const navigate = useNavigate();
  const { removeNote } = useNotes();

  const isSelected = useMatch(`/${props.note.id}`) !== null;

  const [confirmDelete, setConfirmDelete] = useState(false);

  const remove = () => {
    deleteNote(props.note.id).then(() => {
      if (isSelected) {
        navigate("/");
      }

      removeNote(props.note.id);
    });
  };

  return (
    <article
      className={classNames(
        "rounded border-l-8 shadow-sm bg-gray-50 cursor-pointer",
        {
          "border-gray-50": !isSelected,
          "border-blue-400": isSelected,
        }
      )}
      onClick={() => navigate(`/${props.note.id}`)}
    >
      {confirmDelete && (
        <div
          className="absolute inset-0 rounded flex justify-center items-center bg-red-200"
          onClick={withStopPropagation()}
        >
          <ButtonGroup>
            <Button onClick={remove} intent="danger">
              Confirm
            </Button>
            <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          </ButtonGroup>
        </div>
      )}
      <div className={classNames("flex justify-between", "select-none")}>
        <div className="overflow-hidden px-4 py-2">
          <header className="text-lg font-bold">{props.note.title}</header>
          <section className="text-sm text-gray-500 truncate mb-2">
            {props.note.summary}
          </section>
          <section className="text-xs text-gray-600 font-light">
            {format(new Date(props.note.created_at), "MMMM d yyyy, h:mmaa")}
          </section>
        </div>
        <div
          className={classNames(
            "rounded-tr rounded-br p-2 flex justify-center items-center hover:bg-red-500",
            {
              "bg-gray-200 ": !isSelected,
              "bg-red-400": isSelected,
            }
          )}
          onClick={(event) => {
            event.stopPropagation();
            setConfirmDelete(true);
          }}
        >
          <DeleteIcon size={16} color="white" />
        </div>
      </div>
    </article>
  );
};

export default NotePreview;
