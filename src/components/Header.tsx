import { Routes, Route, useNavigate } from "react-router-dom";
import Button, { IButton } from "components/common/Button";
import ButtonGroup from "components/common/ButtonGroup";
import { PlusIcon, SaveIcon } from "components/icons";
import { useSave } from "context/save";

const SaveButton = (props: IButton) => {
  return (
    <Button {...props}>
      <span className="mr-2">
        <SaveIcon />
      </span>
      Save
    </Button>
  );
};

const NewButton = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate("/new")}>
      <span className="mr-2">
        <PlusIcon />
      </span>
      New Note
    </Button>
  );
};

const Header = () => {
  const { save } = useSave();

  return (
    <div className="flex px-10 py-4">
      <ButtonGroup>
        <Routes>
          <Route path="/" element={<NewButton />} />
          <Route
            path="new"
            element={
              <>
                <SaveButton onClick={() => save.current && save.current()} />
              </>
            }
          />
          <Route
            path=":id"
            element={
              <>
                <NewButton />
                <SaveButton onClick={() => save.current && save.current()} />
              </>
            }
          />
        </Routes>
      </ButtonGroup>
    </div>
  );
};

export default Header;
