import React, { useState } from "react";

import ShoppingList from "../components/ShoppingList";
import CheckList from "../components/CheckList";
import SimpleNote from "../components/SimpleNote";
import {
  Row,
  Col,
  Navbar,
  Nav,
  ButtonToolbar,
  ButtonGroup,
  Button
} from "react-bootstrap";
import {
  faArchive,
  faClipboard,
  faClipboardCheck,
  faClipboardList,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import CustomIconButton from "../components/utils/CustomIconButton";
import CustomToggleIconButton from "../components/utils/CustomToggleIconButton";

const CustomNavbar = ({ showArchived, currentPage, totalNotes, notesPerPage, onButtonClick,
  onAddButtonClick, }) => {

  const onPaginationChange = (type) => {
    onButtonClick({ type });
  };

  const paginationText = () => {
    if (totalNotes === 0) return `Page ${currentPage} of 1`;
    return `Page ${currentPage} of ${Math.ceil(totalNotes / notesPerPage).toString()}`;
  };

  return (
    <Navbar collapseOnSelect bg="dark" variant="dark" expand="md">
      <Navbar.Brand>Notes</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="w-100 justify-content-between pt-2 pt-md-0" id="basic-navbar-nav">
        <Nav className="w-100">
          <ButtonToolbar
            aria-label="Toolbar with button groups"
            style={{ rowGap: ".5rem" }} className="w-100"
          >
            <ButtonGroup size="sm" aria-label="First group" className="mr-2">
              <CustomIconButton
                variant="info"
                onClick={() => onAddButtonClick("Simple")}
                icon={faClipboard}
                tooltip="Add Simple Note"
              />
              <CustomIconButton
                variant="info"
                onClick={() => onAddButtonClick("Check")}
                icon={faClipboardCheck}
                tooltip="Add Checklist Note"
              />
              <CustomIconButton
                variant="info"
                onClick={() => onAddButtonClick("Shopping")}
                icon={faClipboardList}
                tooltip="Add ShoppingList Note"
              />
            </ButtonGroup>
            <ButtonGroup toggle size="sm" aria-label="Second group">
              <CustomToggleIconButton
                type="checkbox"
                variant='info'
                onClick={() => onButtonClick({ type: 'ChangeShowArchived' })}
                icon={faArchive}
                color={showArchived ? "gold" : null }
                tooltip={`${showArchived ? "Hide" : "Show"} Archived Notes`}
                value="1"
                checked={showArchived}
              />
            </ButtonGroup>
            <ButtonGroup size="sm" aria-label="Third group" className="ml-auto">
              <CustomIconButton
                variant="info"
                onClick={() => onPaginationChange("decrement")}
                icon={faAngleLeft}
                tooltip="Previous"
                disabled={currentPage === 1}
              />
              <Button variant="light" disabled>
                {paginationText()}
              </Button>
              <CustomIconButton
                variant="info"
                onClick={() => onPaginationChange("increment")}
                icon={faAngleRight}
                tooltip="Next"
                disabled={(currentPage === Math.ceil(totalNotes / notesPerPage)) || (totalNotes === 0)}
              />
            </ButtonGroup>
          </ButtonToolbar>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default () => {
  const [showArchived, setShowArchived] = useState(false);
  const [currentItems, setCurrentItems] = useState(() => {
    if (localStorage.getItem("Notes"))
      return JSON.parse(localStorage.getItem("Notes"));
    else return [];
  });
  const [currentPage, setCurrentPage] = useState(1);

  const notesPerPage = 8;

  const onItemClose = (data) => {
    const newItems = [...currentItems].filter((item) => item.id !== data.id);

    const res = window.confirm("Do you want to delete this note?");
    if (res === true) {
      setCurrentItems(newItems);
      localStorage.setItem("Notes", JSON.stringify(newItems));
    }
  };

  const onItemChanged = (data) => {
    const newItems = [...currentItems];

    const itemFinded = newItems.find((item) => item.id === data.id);
    if (itemFinded) {
      if (
        itemFinded.isArchived !== data.isArchived &&
        window.confirm(
          `Do you want to ${showArchived ? "unarchive" : "archive"} this note?`
        ) !== true
      ) {
        return null;
      }

      newItems[newItems.indexOf(itemFinded)] = data;

      setCurrentItems(newItems);
      localStorage.setItem("Notes", JSON.stringify(newItems));
    }
  };

  const onShowArchivedChanged = () => {
    setShowArchived(!showArchived);
    setCurrentPage(1);
  };

  const onNavButtonClick = ({type}) => {
    switch (type) {
      case 'ChangeShowArchived':
        onShowArchivedChanged();
        break;
      case 'decrement':
        if (currentPage > 1) setCurrentPage(currentPage - 1);
        break;
      case 'increment':
        if (currentPage < Math.ceil(currentItems.length / notesPerPage)) setCurrentPage(currentPage + 1);
        break;
      default:
        break;
    }
  }

  const onAddNote = (type) => {
    const newItems = [...currentItems];

    const note = {
      id: "item " + newItems.length,
      type: type,
      theme: "red",
      isArchived: false,
    };

    newItems.unshift(note);

    setCurrentItems(newItems);
    localStorage.setItem("Notes", JSON.stringify(newItems));
  };

  return (
    <Row noGutters xs={1} className="w-100">
      <Col>
        <CustomNavbar 
          currentPage={currentPage}
          totalNotes={currentItems.length}
          notesPerPage={notesPerPage}
          showArchived={showArchived}
          onAddButtonClick={(type) => onAddNote(type)}
          onButtonClick={onNavButtonClick}
        />
      </Col>
      <Col>
        <Row noGutters xs={1} md={2} lg={3} className="content-container flex-wrap p-1 pr-3 pr-md-1">
          {currentItems
            .filter((i) => i.isArchived === showArchived)
            .slice((currentPage - 1) * notesPerPage, currentPage * notesPerPage)
            .map((item, index) => {
              let markup = "";

              if (item.isArchived !== showArchived) return null;
              if (item.type === "Shopping")
                markup = (
                  <ShoppingList
                    item={item}
                    closeCallback={onItemClose}
                    itemChangeCallback={onItemChanged}
                  />
                );
              if (item.type === "Check")
                markup = (
                  <CheckList
                    item={item}
                    closeCallback={onItemClose}
                    itemChangeCallback={onItemChanged}
                  />
                );
              if (item.type === "Simple")
                markup = (
                  <SimpleNote
                    item={item}
                    closeCallback={onItemClose}
                    itemChangeCallback={onItemChanged}
                  />
                );

              markup =
                markup !== "" ? (
                  <Col key={index}>
                    {markup}
                  </Col>
                ) : null;

              return markup;
            })}
        </Row>
      </Col>
    </Row>
  );
};
