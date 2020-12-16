import React, { useState, useEffect } from "react";

import { Button, Row, Col, Collapse, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSave } from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faAngleUp,
  faMapMarkerAlt,
  faPencilAlt,
  faTimes,
  faStar,
  faPhoneAlt,
  faEnvelope,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import CustomIconButton from "../components/utils/CustomIconButton";

const Contact = ({
  item,
  itemChangeCallback,
  closeCallback,
  itemEditableCallback,
}) => {
  const [currentItem, setCurrentItem] = useState(item);
  const [showDetail, setShowDetail] = useState(false);
  const [editable, setEditable] = useState(item.editable);
  const {
    id,
    name = "",
    phoneNumber = "",
    description = "",
    address = "",
    mail = "",
    isFavorite = false,
  } = currentItem;

  const bg = "light";

  useEffect(() => {
    setEditable(item.editable);
  }, [item.editable]);

  const editSaveHandler = () => {
    setEditable(!editable);
    editable ? changeItem("") : itemEditableCallback(id);
  };

  const changeItem = (action, ...data) => {
    const newItem = {
      id: currentItem.id,
      name: currentItem.name,
      phoneNumber: currentItem.phoneNumber,
      description: currentItem.description,
      address: currentItem.address,
      mail: currentItem.mail,
      editable: false,
      isFavorite: currentItem.isFavorite,
    };

    if (action !== "") {
      switch (action) {
        case "Name":
          newItem.name = data[0];
          break;
        case "Phone":
          newItem.phoneNumber = data[0];
          break;
        case "Description":
          newItem.description = data[0];
          break;
        case "Address":
          newItem.address = data[0];
          break;
        case "Mail":
          newItem.mail = data[0];
          break;
        case "Favorite":
          newItem.isFavorite = !currentItem.isFavorite;
          itemChangeCallback(newItem);
          break;
        default:
          break;
      }

      setCurrentItem(newItem);
    } else {
      itemChangeCallback(newItem);
    }
  };

  const descriptionMarkup = (
    <div className={description || editable ? "mb-1" : ""}>
      <FontAwesomeIcon icon={faInfo} className="mr-1" fixedWidth />
      <Form.Control
        className={"d-inline w-75 p-0".concat(
          !editable ? " form-control-sm" : ""
        )}
        placeholder="Enter descriptive text..."
        type="text"
        value={description}
        size="sm"
        plaintext={!editable}
        readOnly={!editable}
        onChange={(e) => changeItem("Description", e.currentTarget.value)}
      />
    </div>
  );

  const addressMarkup = (
    <div className={mail || editable ? "mb-1" : ""}>
      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" fixedWidth />
      <Form.Control
        className={"d-inline w-75 p-0".concat(
          !editable ? " form-control-sm" : ""
        )}
        placeholder="Enter address..."
        type="text"
        value={address}
        size="sm"
        plaintext={!editable}
        readOnly={!editable}
        onChange={(e) => changeItem("Address", e.currentTarget.value)}
      />
    </div>
  );

  const mailMarkup = (
    <div>
      <FontAwesomeIcon icon={faEnvelope} className="mr-1" fixedWidth />
      <Form.Control
        className={"d-inline w-75 p-0".concat(
          !editable ? " form-control-sm" : ""
        )}
        placeholder="Enter valid email..."
        type="mail"
        value={mail}
        size="sm"
        plaintext={!editable}
        readOnly={!editable}
        onChange={(e) => changeItem("Mail", e.currentTarget.value)}
      />
    </div>
  );

  return (
    <Col className={"m-1 align-self-start border rounded-lg bg-".concat(bg)}>
      <div className="d-flex flex-nowrap flex-row border-bottom align-items-start">
        <Row
          noGutters
          xs={1}
          lg={2}
          className="pl-1 justify-content-between w-100"
        >
          <Col className="d-flex flex-nowrap align-items-center">
            <Button
              variant={"outline-".concat(bg)}
              size="sm"
              aria-controls="collapse-text"
              aria-expanded={showDetail}
              onClick={() => setShowDetail(!showDetail)}
              className="text-body p-0 mr-1"
            >
              <FontAwesomeIcon icon={showDetail ? faAngleUp : faAngleDown} />
            </Button>
            <CustomIconButton
              variant={bg}
              size="sm"
              layersIcons={isFavorite ? [
                { icon: faUser, transform: "left-6" },
                { icon: faStar, color: "gold", transform: "shrink-2 right-6 up-6" },
              ] : [{ icon: faUser}]}
              tooltip={
                !isFavorite ? "Add to favorites" : "Remove from favorites"
              }
              onClick={(e) => {
                changeItem("Favorite", e.currentTarget.value);
              }}
              //className="mr-1"
            />
            <Form.Control
              className={"d-inline p-0".concat(
                !editable ? " form-control-sm" : ""
              )}
              type="text"
              value={name}
              size="sm"
              plaintext={!editable}
              readOnly={!editable}
              required
              onChange={(e) => {
                if (e.currentTarget.checkValidity() === false) {
                  e.preventDefault();
                  e.stopPropagation();
                } else {
                  changeItem("Name", e.currentTarget.value);
                }
              }}
            />
          </Col>
          <Col className="pl-md-1 d-flex flex-nowrap align-items-center">
            <FontAwesomeIcon icon={faPhoneAlt} fixedWidth className="mr-1" />
            <Form.Control
              className={"d-inline p-0".concat(
                !editable ? " form-control-sm" : ""
              )}
              type="text"
              value={phoneNumber}
              size="sm"
              plaintext={!editable}
              readOnly={!editable}
              required
              onChange={(e) => {
                if (e.currentTarget.checkValidity() === false) {
                  e.preventDefault();
                  e.stopPropagation();
                } else {
                  changeItem("Phone", e.currentTarget.value);
                }
              }}
            />
          </Col>
        </Row>
        <div className="ml-auto d-flex flex-nowrap">
          <CustomIconButton
            variant={bg}
            size="sm"
            icon={!editable ? faPencilAlt : faSave}
            tooltip={!editable ? "Edit contact" : "Save contact changes"}
            onClick={editSaveHandler}
          />
          <CustomIconButton
            variant={bg}
            size="sm"
            layersIcons={[
              { icon: faUser, transform: "left-6" },
              { icon: faTimes, color: "red", transform: "shrink-2 right-6" },
            ]}
            tooltip="Delete contact"
            onClick={() => closeCallback(id)}
          />
        </div>
      </div>
      <div>
        <Collapse in={showDetail}>
          <div id="collapse-text" className="p-1">
            {(description || editable) && descriptionMarkup}
            {(address || editable) && addressMarkup}
            {(mail || editable) && mailMarkup}
          </div>
        </Collapse>
      </div>
    </Col>
  );
};

export default Contact;
