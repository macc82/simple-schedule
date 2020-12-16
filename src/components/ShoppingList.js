import React, { useState } from "react";

import { Col, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
  faCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

import Palette from "./utils/Palette";
import NoteHeader from "./utils/NoteHeader";
import AddNoteItem from "./utils/AddNoteItem";
import CustomIconButton from "./utils/CustomIconButton";

const ShoppingListItem = ({
  item,
  index,
  onItemSelectionChanged,
  onItemDeleteClick,
  onItemQuantityChanged,
}) => {
  const [currentItem, setCurrentItem] = useState(item);

  const onQuantityInputChanged = (e, index, action = "") => {
    let quantityInputValue = e.target.value;

    if (quantityInputValue === "") return null;
    if (isNaN(quantityInputValue)) return null;
    if (quantityInputValue <= 0) quantityInputValue = 1;

    currentItem.quantity = parseInt(quantityInputValue);
    setCurrentItem(currentItem);

    onItemQuantityChanged({ index, quantity: currentItem.quantity });

    if (action === "toggle") {
      e.currentTarget.style.display = "none";
      const el = e.currentTarget.previousElementSibling;
      el.style.display = "flex";
    }
  };

  const handleQuantityButtons = (action) => {
    if (action === "Increase") currentItem.quantity++;
    else if (action === "Decrease" && currentItem.quantity > 1)
      currentItem.quantity--;

    setCurrentItem(currentItem);

    onItemQuantityChanged({ index, quantity: currentItem.quantity });
  };

  return (
    <div className="item-container">
      <div className="item-name">
        {item.isSelected ? (
          <>
            <FontAwesomeIcon
              icon={faCheckCircle}
              onClick={() => onItemSelectionChanged(index)}
            />
            <span className="completed">{item.itemName}</span>
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faCircle}
              onClick={() => onItemSelectionChanged(index)}
            />
            <span>{item.itemName}</span>
          </>
        )}
      </div>
      <div className="buttons-container">
        <div className="quantity">
          <CustomIconButton
            variant="outline-light"
            className="border-0 p-0"
            size="sm"
            icon={faChevronLeft}
            transform="shrink-3"
            onClick={() => handleQuantityButtons("Decrease")}
            tooltip="Decrease quantity"
          />
          <Form.Control
            className="d-inline p-0 form-control-sm quantity-item-input"
            type="text"
            value={currentItem.quantity}
            plaintext
            onChange={(e) => {
              onQuantityInputChanged(e, index);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onQuantityInputChanged(e, index, "toggle");
            }}
            onClick={(e) => e.currentTarget.select()}
          />
          <CustomIconButton
            variant="outline-light"
            className="border-0 p-0"
            size="sm"
            icon={faChevronRight}
            transform="shrink-3"
            onClick={() => handleQuantityButtons("Increase")}
            tooltip="Increase quantity"
          />
        </div>
        <CustomIconButton
          variant="outline-light"
          className="border-0 p-0"
          size="sm"
          layersIcons={[
            { icon: faCircle },
            {
              icon: faTrashAlt,
              inverse: true,
              className: 'main-color',
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

const ShoppingList = ({
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

  const onItemQuantityChanged = ({ index, quantity }) => {
    const newItems = [...items];

    newItems[index].quantity = quantity;

    changeItem("ChangeItem", newItems);
  };

  const changeItem = (action, ...data) => {
    const newItem = {
      id: id,
      type: "Shopping",
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
          <ShoppingListItem
            key={index}
            item={item}
            index={index}
            onItemSelectionChanged={onItemSelectionChanged}
            onItemDeleteClick={onItemDeleteClick}
            onItemQuantityChanged={onItemQuantityChanged}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Palette
          color={theme}
          onThemeSelected={(color) => changeItem("Theme", color)}
        />
        <div>
          Total:{" "}
          {items.reduce(function (accumulator, currentValue) {
            return currentValue.isSelected
              ? accumulator
              : accumulator + currentValue.quantity;
          }, 0)}
        </div>
      </div>
    </Col>
  );
};

export default ShoppingList;
