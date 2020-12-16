import React, { useState, useReducer, useRef } from "react";

import {
  Row,
  Col,
  Navbar,
  Nav,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Form,
  Modal,
} from "react-bootstrap";
import {
  faCalendarPlus,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import Schedule from "../components/Schedule";
import { DateTime } from "luxon";
import CustomIconButton from "../components/utils/CustomIconButton";
import CustomToggleIconButton from "../components/utils/CustomToggleIconButton";
import { createGuid } from "../utils/utils";

const CustomNavbar = ({ initialState, onButtonClick, onAddButtonClick }) => {
  const onRangeButtonChange = (e) => {
    onButtonClick({ type: "", range: e.currentTarget.value });
  };

  const onPaginationChange = (type) => {
    onButtonClick({ type, range: initialState.range });
  };

  const paginationText = () => {
    switch (initialState.range) {
      case "W":
        return `Week ${
          DateTime.fromISO(initialState.today).weekNumber.toString().length ===
          1
            ? "0"
            : ""
        }${DateTime.fromISO(initialState.today).weekNumber}, ${
          DateTime.fromISO(initialState.firstDate).year
        }`;
      case "M":
        return `${DateTime.fromISO(initialState.today).monthShort}, ${
          DateTime.fromISO(initialState.firstDate).year
        }`;
      case "Y":
        return `Year ${DateTime.fromISO(initialState.firstDate).year}`;
      default:
        return "";
    }
  };

  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="md">
      <Navbar.Brand>Schedule</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse
        className="w-100 justify-content-between pt-2 pt-md-0"
        id="basic-navbar-nav"
      >
        <Nav className="w-100">
          <ButtonToolbar
            aria-label="Toolbar with button groups"
            style={{ rowGap: ".5rem" }}
            className="w-100"
          >
            <ButtonGroup size="sm" aria-label="First group" className="mr-2">
              <AddEventModal callback={onAddButtonClick} />
            </ButtonGroup>
            <Navbar.Text className="m-0 pr-2 pt-0 pb-0 align-self-center">
              View by:
            </Navbar.Text>
            <ButtonGroup size="sm" toggle aria-label="Second group">
              <CustomToggleIconButton
                type="radio"
                name="radio"
                variant="info"
                value={"W"}
                checked={initialState.range === "W"}
                onChange={onRangeButtonChange}
                text={"W"}
                tooltip="Show events by weeks"
              />
              <CustomToggleIconButton
                type="radio"
                name="radio"
                variant="info"
                value={"M"}
                checked={initialState.range === "M"}
                onChange={onRangeButtonChange}
                text={"M"}
                tooltip="Show events by months"
              />
              <CustomToggleIconButton
                type="radio"
                name="radio"
                variant="info"
                value={"Y"}
                checked={initialState.range === "Y"}
                onChange={onRangeButtonChange}
                text={"Y"}
                tooltip="Show events by years"
              />
            </ButtonGroup>
            <ButtonGroup
              size="sm"
              aria-label="Third group"
              className="ml-md-auto"
            >
              <CustomIconButton
                variant="info"
                onClick={() => onPaginationChange("decrement")}
                icon={faAngleLeft}
                tooltip="Previous"
              />
              <Button variant="light" disabled>
                {paginationText()}
              </Button>
              <CustomIconButton
                variant="info"
                onClick={() => onPaginationChange("increment")}
                icon={faAngleRight}
                tooltip="Next"
              />
            </ButtonGroup>
          </ButtonToolbar>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const AddEventModal = ({ callback }) => {
  const form = useRef();

  const initValue = {
    id: "Sch" + createGuid(),
    date: DateTime.local().toISODate(),
    time: DateTime.local().toFormat("HH:mm"),
    description: "",
    address: "",
    contacts: [],
    editable: false,
  };

  const modalReducer = (state, action) => {
    const newState = {
      id: state.id,
      time: state.time,
      date: state.date,
      description: state.description,
      address: state.address,
      contacts: state.contacts,
      editable: state.editable,
    };

    switch (action.type) {
      case "Time":
        newState.time = action.value;
        break;
      case "Date":
        newState.date = action.value;
        break;
      case "Description":
        newState.description = action.value;
        break;
      case "Address":
        newState.address = action.value;
        break;
      case "Clean":
        return initValue;
      default:
        break;
    }

    return newState;
  };

  const [currentValue, dispatch] = useReducer(modalReducer, initValue);
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleCloseContainer = () => {
    setValidated(false);
    dispatch({ type: "Clean" });
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
      <CustomIconButton
        variant="info"
        onClick={handleShow}
        icon={faCalendarPlus}
        tooltip="Add new event"
        text="Add event"
      />

      <Modal size="sm" show={show} onHide={handleCloseContainer}>
        <Modal.Header closeButton>
          <Modal.Title>Add event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} ref={form}>
            <Form.Group>
              <Form.Label size="sm">Date</Form.Label>
              <Form.Control
                type="Date"
                size="sm"
                placeholder="Select date"
                value={currentValue.date}
                required
                onChange={(e) =>
                  dispatch({ type: "Date", value: e.currentTarget.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Date must be valid
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label size="sm">Time</Form.Label>
              <Form.Control
                type="Time"
                size="sm"
                placeholder="Select time"
                value={currentValue.time}
                required
                onChange={(e) =>
                  dispatch({ type: "Time", value: e.currentTarget.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Time must be valid
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label size="sm">Description</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Enter event description..."
                value={currentValue.description}
                required
                onChange={(e) =>
                  dispatch({
                    type: "Description",
                    value: e.currentTarget.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Description is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label size="sm">Address</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Enter event address..."
                value={currentValue.address}
                onChange={(e) =>
                  dispatch({ type: "Address", value: e.currentTarget.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
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

export default () => {
  const [currentItems, setCurrentItems] = useState(() => {
    if (localStorage.getItem("Schedules"))
      return JSON.parse(localStorage.getItem("Schedules"));
    else return [];
  });
  const initState = {
    today: DateTime.fromISO(DateTime.local().toISODate()),
    firstDate: DateTime.fromISO(DateTime.local().toISODate()).minus({
      days: DateTime.local().weekday - 1,
    }),
    lastDate: DateTime.fromISO(DateTime.local().toISODate()).plus({
      days: 8 - DateTime.local().weekday,
    }),
    range: "W",
  };
  const reducer = (state, action) => {
    let today = state.today;

    switch (action.type) {
      case "increment":
        switch (action.range) {
          case "W":
            today = today.plus({ days: 7 });
            break;
          case "M":
            today = today.plus({ month: 1 });
            break;
          case "Y":
            today = today.plus({ year: 1 });
            break;
          default:
            throw new Error();
        }
        break;
      case "decrement":
        switch (action.range) {
          case "W":
            today = today.minus({ days: 7 });
            break;
          case "M":
            today = today.minus({ month: 1 });
            break;
          case "Y":
            today = today.minus({ year: 1 });
            break;
          default:
            throw new Error();
        }
        break;
      default:
        break;
    }

    switch (action.range) {
      case "W":
        return {
          today,
          firstDate: today.minus({ days: today.weekday - 1 }),
          lastDate: today.plus({ days: 8 - today.weekday }),
          range: action.range,
        };
      case "M":
        return {
          today,
          firstDate: DateTime.local(today.year, today.month, 1),
          lastDate: DateTime.local(
            today.year,
            today.month,
            today.daysInMonth
          ).plus({ days: 1 }),
          range: action.range,
        };
      case "Y":
        return {
          today,
          firstDate: DateTime.local(today.year, 1, 1),
          lastDate: DateTime.local(today.year + 1, 1, 1),
          range: action.range,
        };
      default:
        throw new Error();
    }
  };
  const [state, dispatch] = useReducer(reducer, initState);

  const [isEditing, setIsEditing] = useState(false);

  const onItemChanged = (data) => {
    const newItems = [...currentItems];

    const itemFinded = newItems.find((item) => item.id === data.id);
    if (itemFinded) {
      newItems[newItems.indexOf(itemFinded)] = data;

      setCurrentItems(newItems);
      localStorage.setItem("Schedules", JSON.stringify(newItems));

      setIsEditing(
        newItems.filter((item) => item.editable === true).length > 0
      );
    }
  };

  const onAddItem = (data) => {
    const newItems = [...currentItems];

    newItems.push(data);

    setCurrentItems(newItems);
    localStorage.setItem("Schedules", JSON.stringify(newItems));
  };

  const onDeleteItem = (id) => {
    const newItems = [...currentItems].filter((item) => item.id !== id);

    const res = window.confirm("Do you want to delete this event?");
    if (res === true) {
      setCurrentItems(newItems);
      localStorage.setItem("Schedules", JSON.stringify(newItems));
    }
  };

  const onEditItem = (id) => {
    const newItems = [...currentItems];

    const itemFinded = newItems.find((item) => item.id === id);
    if (itemFinded) {
      newItems[newItems.indexOf(itemFinded)].editable = true;

      setCurrentItems(newItems);
      localStorage.setItem("Schedules", JSON.stringify(newItems));

      setIsEditing(true);
    }
  };

  const onStateChange = (action) => {
    if (isEditing) {
      //If there is events in edition, the user must confirm if it want to discard the changes before continue
      const res = window.confirm(
        "There is events in edition. Do you want to discard the changes and continue?"
      );
      if (res === true) {
        const newItems = [...currentItems];
        newItems.forEach((item) => {
          item.editable = false;
        });
        setCurrentItems(newItems);
        localStorage.setItem("Schedules", JSON.stringify(newItems));
        setIsEditing(false);
        dispatch(action);
      } else {
        //TODO: NavBar must be restore to previous state
      }
    } else {
      dispatch(action);
    }
  };

  const sortItems = (a, b) => {
    const fxA = DateTime.fromISO(a.date + "T" + a.time);
    const fxB = DateTime.fromISO(b.date + "T" + b.time);
    if (fxA > fxB) return 1;
    if (fxB > fxA) return -1;
    return 0;
  };

  const filterItems = (item) => {
    const fx = DateTime.fromISO(item.date + "T" + item.time);

    return fx >= state.firstDate && fx < state.lastDate;
  };

  return (
    <Row noGutters xs={1} className="w-100">
      <Col>
        <CustomNavbar
          initialState={state}
          onButtonClick={onStateChange}
          onAddButtonClick={onAddItem}
        />
      </Col>
      <Col>
        <Row
          noGutters
          xs={1}
          md={2}
          lg={3}
          className="content-container flex-wrap p-1 pr-3 pr-md-1"
        >
          {currentItems
            .filter(filterItems)
            .sort(sortItems)
            .map((item) => (
              <Schedule
                key={item.id}
                item={item}
                closeCallback={onDeleteItem}
                itemChangeCallback={onItemChanged}
                itemEditableCallback={onEditItem}
              />
            ))}
        </Row>
      </Col>
    </Row>
  );
};
