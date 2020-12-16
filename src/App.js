import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Notes from "./pages/Notes";
import Schedules from "./pages/Schedules";
import Contacts from "./pages/Contacts";
import { Tabs, Tab, Nav, Navbar } from "react-bootstrap";
import CustomNavLink from "./components/utils/CustomNavLink";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const App = () => {
  const [key, setKey] = useState("Schedule");
  return (
    <>
      <header className="bg-dark text-center">Simple Scheduler Project</header>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="bg-dark">
        <Tab
          eventKey="Schedule"
          title="Schedule"
          tabClassName="bg-info text-white border border-light"
        >
          <Schedules />
        </Tab>
        <Tab
          eventKey="Contacts"
          title="Contacts"
          tabClassName="bg-info text-white border border-light"
        >
          <Contacts />
        </Tab>
        <Tab
          eventKey="Notes"
          title="Notes"
          tabClassName="bg-info text-white border border-light"
        >
          <Notes />
        </Tab>
      </Tabs>
      <footer className="footer pl-2 pr-2 text-secondary">
        <Nav className="align-items-center">
          <Navbar.Text className="p-0 font-weight-bold">Created by: Miguel Corrales Cortés</Navbar.Text>
          <CustomNavLink
            icon={faGithub}
            tooltip="View source code on GitHub"
            tooltipPlacement="left"
            href="https://github.com/macc82/simple-schedule"
            target="_blank"
            className="ml-auto p-0"
            color="gray"
          />
        </Nav>
      </footer>
    </>
  );
};

export default App;
