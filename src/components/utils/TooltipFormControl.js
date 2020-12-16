import React, { useRef, useState } from "react";

import { Overlay, Tooltip, Form } from "react-bootstrap";
import { createGuid } from "../../utils/utils";

const TooltipFormControl = ({
  tooltip,
  tooltipPlacement = "right",
  ...props
}) => {
  const [showInput, setShowInput] = useState(false);
  const targetInput = useRef(null);

  return (
    <>
      <Form.Control
        {...props}
        onMouseOver={() => setShowInput(true)}
        onMouseOut={() => setShowInput(false)}
        ref={targetInput}
      />
      <Overlay
        target={targetInput.current}
        show={showInput}
        placement={tooltipPlacement}
        delay={{ show: 250, hide: 400 }}
      >
        <Tooltip id={`tooltip-${createGuid()}-Input`}>
          Click here to change title
        </Tooltip>
      </Overlay>
    </>
  );
};

export default TooltipFormControl;
