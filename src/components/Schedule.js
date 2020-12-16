import React, { useState, useEffect, useRef } from "react";

import { Button, Row, Col, Collapse, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCalendarTimes,
  faClock,
  faUser,
  faAddressBook,
  faSave,
} from "@fortawesome/free-regular-svg-icons";
import {
  faAngleDown,
  faAngleUp,
  faMapMarkerAlt,
  faPencilAlt,
  faTimes,
  faPlus,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import CustomIconButton from "../components/utils/CustomIconButton";

const AddContactModal = ({ callback }) => {
  const input = useRef();
  const form = useRef();
  useEffect(() => {
    if (input.current) input.current.focus();
  });

  const [currentValue, setCurrentValue] = useState("");
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleCloseContainer = () => {
    setValidated(false);
    setCurrentValue("");
    setShow(false);
  };
  const handleCloseButton = () => {
    handleCloseContainer();
  };
  const handleSaveButton = (event) => {
    const isValid = form.current.checkValidity();

    setValidated(true);

    if (isValid) {
      callback(currentValue);
      handleCloseContainer();
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <div className="badge badge-info mr-1 p-1" onClick={handleShow}>
        <FontAwesomeIcon icon={faUser} />
        <FontAwesomeIcon icon={faPlus} className="ml-1" />
      </div>

      <Modal size="sm" show={show} onHide={handleCloseContainer}>
        <Modal.Header closeButton>
          <Modal.Title>Add contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} ref={form}>
            <Form.Group>
              <Form.Label size="sm">Contact Name</Form.Label>
              <Form.Control
                ref={input}
                size="sm"
                type="text"
                placeholder="Enter contact name"
                value={currentValue}
                required
                onChange={(e) => setCurrentValue(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveButton(e);
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Contact Name is required!
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={handleCloseButton}>
            Close
          </Button>
          <Button size="sm" variant="primary" onClick={handleSaveButton}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ({
  item,
  itemChangeCallback,
  closeCallback,
  itemEditableCallback,
}) => {
  const [currentItem, setCurrentItem] = useState(item);
  const [showDetail, setShowDetail] = useState(false);
  const [editable, setEditable] = useState(item.editable);
  const { id, date = '', time = '', description = '', address = '', contacts = [] } = currentItem;

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
      date: currentItem.date,
      time: currentItem.time,
      description: currentItem.description,
      address: currentItem.address,
      contacts: currentItem.contacts,
      editable: false,
    };

    if (action !== "") {
      switch (action) {
        case "Date":
          newItem.date = data[0];
          break;
        case "Time":
          newItem.time = data[0];
          break;
        case "Description":
          newItem.description = data[0];
          break;
        case "Address":
          newItem.address = data[0];
          break;
        case "ContactAdd":
          if (
            !newItem.contacts
              .map((c) => c.toLowerCase())
              .includes(data[0].toLowerCase())
          )
            newItem.contacts.push(data[0]);
          break;
        case "ContactDel":
          newItem.contacts.splice(newItem.contacts.indexOf(data[0]), 1);
          break;
        default:
          break;
      }

      setCurrentItem(newItem);
    } else {
      itemChangeCallback(newItem);
    }
  };

  const addressMarkup = (
    <div className="mt-1 mb-1">
      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" fixedWidth />
      <Form.Control
        className={"d-inline w-75 p-0".concat(
          !editable ? " form-control-sm" : ""
        )}
        type="text"
        value={address}
        size="sm"
        plaintext={!editable}
        readOnly={!editable}
        onChange={(e) => changeItem("Address", e.currentTarget.value)}
      />
    </div>
  );

  return (
    <Col className={"m-1 align-self-start border rounded-md bg-".concat(bg)}>
      <div className="d-flex flex-nowrap flex-row border-bottom align-items-start">
        <Row noGutters xs={1} lg={2} className="pl-1 justify-content-between w-100">
          <Col className="d-flex flex-nowrap align-items-center">
            <Button
              variant="outline-light"
              size="sm"
              aria-controls="collapse-text"
              aria-expanded={showDetail}
              onClick={() => setShowDetail(!showDetail)}
              className="text-body p-0 mr-1"
            >
              <FontAwesomeIcon icon={showDetail ? faAngleUp : faAngleDown} />
            </Button>
            <FontAwesomeIcon icon={faCalendarAlt} fixedWidth />
            <Form.Control
              className={"d-inline p-0".concat(
                !editable ? " form-control-sm" : ""
              )}
              type="date"
              value={date}
              size="sm"
              plaintext={!editable}
              readOnly={!editable}
              required
              onChange={(e) => {
                if (e.currentTarget.checkValidity() === false) {
                  e.preventDefault();
                  e.stopPropagation();
                } else {
                  changeItem("Date", e.currentTarget.value);
                }
              }}
            />
          </Col>
          <Col className="pl-md-1 d-flex flex-nowrap align-items-center">
            <FontAwesomeIcon icon={faClock} fixedWidth className="mr-1" />
            <Form.Control
              className={"d-inline p-0".concat(
                !editable ? " form-control-sm" : ""
              )}
              type="time"
              value={time}
              size="sm"
              plaintext={!editable}
              readOnly={!editable}
              required
              onChange={(e) => {
                if (e.currentTarget.checkValidity() === false) {
                  e.preventDefault();
                  e.stopPropagation();
                } else {
                  changeItem("Time", e.currentTarget.value);
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
            tooltip={!editable ? "Edit event" : "Save event changes"}
            onClick={editSaveHandler}
          />
          <CustomIconButton
            variant={bg}
            size="sm"
            icon={faCalendarTimes}
            tooltip="Delete event"
            onClick={() => closeCallback(id)}
          />
        </div>
      </div>
      <div className="p-1">
        <div>
          <FontAwesomeIcon icon={faInfo} className="mr-1" fixedWidth />
          <Form.Control
            className={"d-inline w-75 p-0".concat(
              !editable ? " form-control-sm" : ""
            )}
            type="text"
            value={description}
            size="sm"
            plaintext={!editable}
            readOnly={!editable}
            required
            onChange={(e) => {
              if (e.currentTarget.checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
              } else {
                changeItem("Description", e.currentTarget.value);
              }
            }}
          />
        </div>
        <Collapse in={showDetail}>
          <div id="collapse-text">
            {(address || editable) && addressMarkup}
            <div>
              <FontAwesomeIcon icon={faAddressBook} fixedWidth />
              <span className="pl-1 form-control-sm">Contacts</span>
            </div>
            <div className="border rounded-lg p-1 bg-secondary">
              {contacts.map((c, index) => (
                <div key={index} className="badge badge-info mr-1 p-1">
                  <FontAwesomeIcon icon={faUser} />
                  <span className="pl-1">{c}</span>
                  {editable && (
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="ml-1"
                      onClick={() => changeItem("ContactDel", c)}
                    />
                  )}
                </div>
              ))}
              {editable && (
                <AddContactModal
                  callback={(data) => changeItem("ContactAdd", data)}
                />
              )}
            </div>
          </div>
        </Collapse>
      </div>
    </Col>
  );
};
