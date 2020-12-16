import React from "react";

import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faSquare,
  faCheckSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import Palette from "./utils/Palette";
import NoteHeader from "./utils/NoteHeader";
import AddNoteItem from "./utils/AddNoteItem";
import CustomIconButton from "./utils/CustomIconButton";

const CheckListItem = ({
  item,
  index,
  onItemSelectionChanged,
  onItemDeleteClick,
}) => {
  return (
    <div className="item-container">
      <div className="item-name">
        {item.isSelected ? (
          <>
            <FontAwesomeIcon
              icon={faCheckSquare}
              onClick={() => onItemSelectionChanged(index)}
            />
            <span className="completed">{item.itemName}</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faSquare}
              onClick={() => onItemSelectionChanged(index)}
            />
            <span>{item.itemName}</span>
          </>
        )}
      </div>
      <div className="buttons-container">
        <CustomIconButton
          variant="outline-light"
          className="border-0 p-0"
          size="sm"
          layersIcons={[
            { icon: faCircle },
            {
              icon: faTrashAlt,
              inverse: true,
              className: "main-color",
              transform: "shrink-4.5 right-1 left-1 up-1 down-1",
            },
          ]}
          onClick={() => onItemDeleteClick(index)}
          tooltip="Delete item"
        />
      </div>
    </div>
  );
};

const CheckList = ({
  item: { title, theme = "red", id, isArchived, items = [] },
  closeCallback,
  itemChangeCallback,
}) => {
  const mainCompTheme = "rounded-lg d-flex flex-column pr-2 pl-2 pt-0 pb-1 note-body justify-content-between ".concat(
    theme,
    "-themed"
  );

  const onItemSelectionChanged = (index) => {
    const newItems = [...items];

    newItems[index].isSelected = !newItems[index].isSelected;

    changeItem("ChangeItem", newItems);
  };

  const onItemDeleteClick = (index) => {
    const newItems = [...items];

    newItems.splice(index, 1);

    changeItem("ChangeItem", newItems);
  };

  const changeItem = (action, ...data) => {
    const newItem = {
      id: id,
      type: "Check",
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
      <AddNoteItem
        onAddItemClick={(newItem) =>
          changeItem("ChangeItem", [...items, newItem])
        }
      />
      <div className="item-list flex-grow-1">
        {items.map((item, index) => (
          <CheckListItem
            key={index}
            item={item}
            index={index}
            onItemSelectionChanged={onItemSelectionChanged}
            onItemDeleteClick={onItemDeleteClick}
          />
        ))}
      </div>
      <Palette
        color={theme}
        onThemeSelected={(color) => changeItem("Theme", color)}
      />
    </Col>
  );
};

export default CheckList;
