import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useMatch } from "react-router-dom";
import "draft-js/dist/Draft.css";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";

import EditorToolbar from "components/EditorToolbar";
import Button from "components/common/Button";
import ButtonGroup from "components/common/ButtonGroup";

import { saveNote } from "services/notes";
import { useSave } from "context/save";
import { useNote, useNotes } from "context/resources";
import { useLocalStorage } from "hooks/local";

const EditorWrapper = (props: React.PropsWithChildren<unknown>) => {
  const editor = useRef<HTMLInputElement>(null);

  const focusEditor = () => {
    if (editor.current) {
      editor.current.focus();
    }
  };

  if (!props.children) {
    throw new Error("Must provide a child Editor");
  }

  return (
    <div className="h-full flex-grow prose font-serif" onClick={focusEditor}>
      {React.Children.map(props.children, (child) => {
        if (!React.isValidElement<unknown>(child)) {
          return child;
        }

        return React.cloneElement(child, {
          ref: () => editor,
          ...child.props,
        });
      })}
    </div>
  );
};

const load = (content: string) => convertFromRaw(JSON.parse(content) as any);

interface INoteBody {
  title: string;
}

const NoteBody = (props: INoteBody) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addNote } = useNotes();
  const { note } = useNote(id);

  const isNew = useMatch("/new");

  const {
    data: draft,
    setItem,
    removeItem,
  } = useLocalStorage<string>(`notes:${isNew ? "new" : id}`);

  const [showDraftWarning, setShowDraftWarning] = useState(draft !== null);

  const [editorState, setEditorState] = useState(() => {
    if (draft) {
      return EditorState.createWithContent(load(draft));
    }

    return note?.content
      ? EditorState.createWithContent(load(note.content))
      : EditorState.createEmpty();
  });

  const saveDraft = (state: EditorState) => {
    const content = JSON.stringify(convertToRaw(state.getCurrentContent()));
    const existing = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );

    if (content !== existing) {
      setItem(content);
    }

    setEditorState(state);
  };

  const { onSave } = useSave();

  const save = useCallback(() => {
    const content = convertToRaw(editorState.getCurrentContent());

    if (draft) {
      removeItem();
    }

    saveNote({
      id,
      title: props.title,
      content: JSON.stringify(content),
      summary: content.blocks.find((block) => block.text)?.text ?? "",
    }).then(({ data, error }) => {
      if (error) {
        throw new Error("Could not save note");
      }

      if (Array.isArray(data) && data.length > 0) {
        const [note] = data;

        setShowDraftWarning(false);

        addNote(note);
        navigate(`/${note.id}`);
      }
    });
  }, [id, props.title, editorState, addNote, removeItem, navigate, draft]);

  const revertLocalEdits = () => {
    if (draft) {
      removeItem();
    }

    setEditorState(
      note?.content
        ? EditorState.createWithContent(load(note.content))
        : EditorState.createEmpty()
    );

    setShowDraftWarning(false);
  };

  useEffect(() => {
    onSave(save);
  }, [onSave, save]);

  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  const styleType = editorState.getCurrentInlineStyle();

  const toggleBlock = (type: string) =>
    setEditorState(RichUtils.toggleBlockType(editorState, type));

  const toggleStyle = (type: string) =>
    setEditorState(RichUtils.toggleInlineStyle(editorState, type));

  return (
    <>
      {showDraftWarning && (
        <div className="flex flex-col rounded border border-red-400 text-gray-800 bg-red-200 p-4 mb-2 items-end">
          <div className="w-full text-md my-2">
            Local edits have been made to this docment, they have not been saved
            to the server.
          </div>
          <div className="flex">
            <ButtonGroup>
              <Button onClick={revertLocalEdits} intent="danger">
                Revert
              </Button>
              <Button onClick={save}>Save</Button>
              <Button onClick={() => setShowDraftWarning(false)}>Hide</Button>
            </ButtonGroup>
          </div>
        </div>
      )}
      <EditorToolbar
        blockType={blockType}
        styleType={styleType}
        toggleBlock={toggleBlock}
        toggleStyle={toggleStyle}
      />

      <hr className="mt-2 mb-4" />
      <EditorWrapper>
        <Editor
          editorState={editorState}
          onChange={saveDraft}
          placeholder="Notes"
        />
      </EditorWrapper>
    </>
  );
};

export default NoteBody;
