import React from "react";

import { Col, Form } from "react-bootstrap";
import Palette from "./utils/Palette";
import NoteHeader from "./utils/NoteHeader";

const SimpleNote = ({
  item: { title, theme = "red", id, isArchived, items = "" },
  closeCallback,
  itemChangeCallback,
}) => {
  const mainCompTheme = "rounded-lg d-flex flex-column pr-2 pl-2 pt-0 pb-1 note-body justify-content-between ".concat(
    theme,
    "-themed"
  );

  const changeItem = (action, ...data) => {
    const newItem = {
      id: id,
      type: "Simple",
      theme: theme,
      title: title,
      isArchived: isArchived,
      items: items,
    };

    switch (action) {
      case "ChangeItem":
        newItem.items = data[0];
        break;
      case "Title":
        newItem.title = data[0];
        break;
      case "Archived":
        newItem.isArchived = !newItem.isArchived;
        break;
      case "Theme":
        newItem.theme = data[0];
        break;
      default:
    }

    itemChangeCallback(newItem);
  };

  return (
    <Col className={mainCompTheme}>
      <NoteHeader
        id={id}
        title={title}
        isArchived={isArchived}
        onCloseClick={() => closeCallback({ id, theme })}
        onSaveClick={() => changeItem("Archived")}
        onTitleChange={(e) => changeItem("Title", e.currentTarget.value)}
      />
      <Form.Control
        as="textarea"
        className="note-textarea flex-grow-1 p-1"
        placeholder="Enter the text of your note..."
        size="sm"
        value={items}
        style={{ resize: "none" }}
        onChange={(e) => changeItem("ChangeItem", e.currentTarget.value)}
        onFocus={(e) => {
          e.currentTarget.select();
        }}
      />
      <Palette
        color={theme}
        onThemeSelected={(color) => changeItem("Theme", color)}
      />
    </Col>
  );
};

export default SimpleNote;
