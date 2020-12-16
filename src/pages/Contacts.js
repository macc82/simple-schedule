import React, { useState, useRef, useReducer } from "react";

import {
  Row,
  Col,
  Navbar,
  Nav,
  Form,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Modal,
} from "react-bootstrap";
import {
  faStar,
  faSearch,
  faUserPlus,
  faUser,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";
import Contact from "../components/Contact";
import CustomToggleIconButton from "../components/utils/CustomToggleIconButton";
import CustomIconButton from "../components/utils/CustomIconButton";
import { createGuid } from "../utils/utils";

const CustomNavbar = ({
  showFavorites,
  orderBy,
  onButtonClick,
  onAddButtonClick,
}) => {
  const [searchInput, setSearchInput] = useState("");
  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="md">
      <Navbar.Brand>Contacts</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse
        className="w-100 justify-content-between pt-2 pt-md-0"
        id="basic-navbar-nav"
      >
        <Nav style={{ rowGap: ".5rem" }} className="w-100">
          <ButtonToolbar aria-label="Toolbar with button groups">
            <ButtonGroup size="sm" aria-label="First group" className="mr-2">
              <AddContactModal callback={onAddButtonClick} />
            </ButtonGroup>
            <ButtonGroup
              size="sm"
              toggle
              aria-label="Second group"
              className="mr-2"
            >
              <CustomToggleIconButton
                type="checkbox"
                variant="info"
                onClick={() => onButtonClick({ type: "ChangeShowFavorites" })}
                icon={faStar}
                color={showFavorites ? "gold" : null}
                tooltip={showFavorites ? "Show all" : "Show only favorites"}
                value="1"
                checked={showFavorites}
              />
            </ButtonGroup>
            <Navbar.Text className="m-0 pr-2 pt-0 pb-0 align-self-center">
              Sort by:
            </Navbar.Text>
            <ButtonGroup size="sm" toggle aria-label="Third group">
              <CustomToggleIconButton
                type="radio"
                name="radio"
                variant="info"
                onClick={() =>
                  onButtonClick({ type: "ChangeSort", data: "name" })
                }
                icon={faUser}
                tooltip="Name"
                value="name"
                checked={orderBy === "name"}
              />
              <CustomToggleIconButton
                type="radio"
                name="radio"
                variant="info"
                onClick={() =>
                  onButtonClick({ type: "ChangeSort", data: "phone" })
                }
                icon={faPhoneAlt}
                tooltip="Phone Number"
                value="phone"
                checked={orderBy === "phone"}
              />
            </ButtonGroup>
          </ButtonToolbar>
          <Form className="d-inline-flex flex-nowrap ml-md-auto">
            <Form.Control
              type="text"
              size="sm"
              placeholder="Search"
              className="mr-2"
              value={searchInput}
              onChange={(e) => setSearchInput(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchInput(e.currentTarget.value);
                  onButtonClick({
                    type: "Search",
                    data: e.currentTarget.value,
                  });
                  e.preventDefault();
                }
              }}
            />
            <CustomIconButton
              variant="info"
              size="sm"
              layersIcons={[{ icon: faSearch }]}
              tooltip="Search contact by name"
              tooltipPlacement="bottom"
              onClick={() =>
                onButtonClick({ type: "Search", data: searchInput })
              }
            />
          </Form>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

const AddContactModal = ({ callback }) => {
  const form = useRef();

  const initValue = {
    id: "Cont" + createGuid(),
    name: "",
    phoneNumber: "",
    description: "",
    address: "",
    mail: "",
    editable: false,
    isFavorite: false,
  };

  const modalReducer = (state, action) => {
    const newState = {
      id: state.id,
      name: state.name,
      phoneNumber: state.phoneNumber,
      description: state.description,
      address: state.address,
      mail: state.mail,
      editable: state.editable,
      isFavorite: state.isFavorite,
    };

    switch (action.type) {
      case "Name":
        newState.name = action.value;
        break;
      case "Phone":
        newState.phoneNumber = action.value;
        break;
      case "Description":
        newState.description = action.value;
        break;
      case "Address":
        newState.address = action.value;
        break;
      case "Mail":
        newState.mail = action.value;
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
  const handleSaveButton = (contact) => {
    const isValid = form.current.checkValidity();
    //console.log(form.current.querySelector('input[type="mail"]'));

    setValidated(true);

    if (isValid) {
      callback(currentValue);
      handleCloseContainer();
    } else {
      contact.preventDefault();
      contact.stopPropagation();
    }
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <CustomIconButton
        variant="info"
        onClick={handleShow}
        icon={faUserPlus}
        tooltip="Add new contact"
        text="Add contact"
      />

      <Modal size="sm" show={show} onHide={handleCloseContainer}>
        <Modal.Header closeButton>
          <Modal.Title>Add contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} ref={form}>
            <Form.Group>
              <Form.Label size="sm">Name</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Enter contact name..."
                value={currentValue.name}
                required
                onChange={(e) =>
                  dispatch({ type: "Name", value: e.currentTarget.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Name is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label size="sm">Phone Number</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Enter phone number..."
                value={currentValue.phoneNumber}
                required
                onChange={(e) =>
                  dispatch({ type: "Phone", value: e.currentTarget.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Phone Number is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label size="sm">Description</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Enter contact description..."
                value={currentValue.description}
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
            </Form.Group>
            <Form.Group>
              <Form.Label size="sm">Address</Form.Label>
              <Form.Control
                type="text"
                size="sm"
                placeholder="Enter contact address..."
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
            <Form.Group>
              <Form.Label size="sm">eMail</Form.Label>
              <Form.Control
                type="email"
                size="sm"
                placeholder="Enter contact email..."
                value={currentValue.mail}
                onChange={(e) =>
                  dispatch({ type: "Mail", value: e.currentTarget.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
              <Form.Control.Feedback type="invalid">
                Email format must be valid
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

const Contacts = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [orderBy, setOrderBy] = useState("name");
  const [filter, setFilter] = useState("");

  const [currentItems, setCurrentItems] = useState(() => {
    if (localStorage.getItem("Contacts"))
      return JSON.parse(localStorage.getItem("Contacts"));
    else return [];
  });
  const [isEditing, setIsEditing] = useState(false);

  const onItemChanged = (data) => {
    const newItems = [...currentItems];

    const itemFinded = newItems.find((item) => item.id === data.id);
    if (itemFinded) {
      newItems[newItems.indexOf(itemFinded)] = data;

      setCurrentItems(newItems);
      localStorage.setItem("Contacts", JSON.stringify(newItems));

      setIsEditing(
        newItems.filter((item) => item.editable === true).length > 0
      );
    }
  };

  const onAddItem = (data) => {
    const newItems = [...currentItems];

    newItems.push(data);

    setCurrentItems(newItems);
    localStorage.setItem("Contacts", JSON.stringify(newItems));
  };

  const onDeleteItem = (id) => {
    const newItems = [...currentItems].filter((item) => item.id !== id);

    const res = window.confirm("Do you want to delete this contact?");
    if (res === true) {
      setCurrentItems(newItems);
      localStorage.setItem("Contacts", JSON.stringify(newItems));
    }
  };

  const onEditItem = (id) => {
    const newItems = [...currentItems];

    const itemFinded = newItems.find((item) => item.id === id);
    if (itemFinded) {
      newItems[newItems.indexOf(itemFinded)].editable = true;

      setCurrentItems(newItems);
      localStorage.setItem("Contacts", JSON.stringify(newItems));

      setIsEditing(true);
    }
  };

  const onNavButtonClick = (e) => {
    if (isEditing) {
      //If there is contacts in edition, the user must confirm if it want to discard the changes before continue
      const res = window.confirm(
        "There is contacts in edition. Do you want to discard the changes and continue?"
      );
      if (res === true) {
        const newItems = [...currentItems];
        newItems.forEach((item) => {
          item.editable = false;
        });
        setCurrentItems(newItems);
        localStorage.setItem("Contacts", JSON.stringify(newItems));
        setIsEditing(false);
      } else {
        return; //Exit function
      }
    }
    switch (e.type) {
      case "ChangeShowFavorites":
        setShowFavorites(!showFavorites);
        break;
      case "ChangeSort":
        setOrderBy(e.data);
        break;
      case "Search":
        setFilter(e.data);
        break;
      default:
        break;
    }
  };

  const filterItems = (item) => {
    if (filter === "") {
      return showFavorites ? item.isFavorite : true;
    } else {
      const re = new RegExp(filter, "i");
      return showFavorites
        ? item.isFavorite && re.test(item.name)
        : re.test(item.name);
    }
  };

  const sortItems = (a, b) => {
    switch (orderBy) {
      case "phone":
        if (a.phoneNumber.includes("+"))
          return a.phoneNumber > b.phoneNumber
            ? 1
            : a.phoneNumber === b.phoneNumber
            ? 0
            : -1;
        else
          return Number.parseFloat(a.phoneNumber.replace(/\s/g, "")) >
            Number.parseFloat(b.phoneNumber.replace(/\s/g, ""))
            ? 1
            : Number.parseFloat(a.phoneNumber.replace(/\s/g, "")) ===
              Number.parseFloat(b.phoneNumber.replace(/\s/g, ""))
            ? 0
            : -1;
      default:
        return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    }
  };

  return (
    <Row noGutters xs={1} className="w-100">
      <Col>
        <CustomNavbar
          showFavorites={showFavorites}
          orderBy={orderBy}
          onButtonClick={onNavButtonClick}
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
              <Contact
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

export default Contacts;
