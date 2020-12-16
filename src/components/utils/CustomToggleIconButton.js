import React, { useRef, useState } from "react";

import { Overlay, Tooltip, ToggleButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CustomToggleIconButton = ({
  text = "",
  icon = null,
  layersIcons = null,
  mask = null,
  transform = null,
  color = null,
  tooltip = "",
  tooltipPlacement = "right",
  onClick = () => {},
  ...props
}) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return (
    <>
      {props.type === "radio" && (
        <ToggleButton {...props} onClick={onClick}>
          <div
            ref={target}
            className="d-flex h-100 align-items-center"
            onMouseOver={() => setShow(true)}
            onMouseOut={() => setShow(false)}
          >
            {icon !== null && (
              <FontAwesomeIcon
                icon={icon}
                mask={mask}
                transform={transform}
                color={color}
                fixedWidth
              />
            )}
            {layersIcons !== null && (
              <span className="fa-layers fa-fw">
                {" "}
                {layersIcons.map((icon, index) => (
                  <FontAwesomeIcon key={index} {...icon} />
                ))}{" "}
              </span>
            )}
            {text && (
              <span
                className={icon !== null || layersIcons !== null ? "ml-1" : ""}
              >
                {text}
              </span>
            )}
          </div>
        </ToggleButton>
      )}
      {props.type === "checkbox" && (
        <ToggleButton {...props} onChange={onClick}>
          <div
            ref={target}
            //className="flex-row flex-nowrap justify-content-start"
            onMouseOver={() => setShow(true)}
            onMouseOut={() => setShow(false)}
          >
            {icon !== null && (
              <FontAwesomeIcon
                icon={icon}
                mask={mask}
                transform={transform}
                color={color}
                fixedWidth
              />
            )}
            {text && (
              <span className={icon !== null ? "ml-1" : ""}>{text}</span>
            )}
          </div>
        </ToggleButton>
      )}

      <Overlay
        target={target.current}
        show={show}
        placement={tooltipPlacement}
        delay={{ show: 250, hide: 400 }}
      >
        <Tooltip id={`tooltip-${tooltip.toLowerCase().replace(/\s/g, "-")}`}>
          {tooltip}
        </Tooltip>
      </Overlay>
    </>
  );
};

export default CustomToggleIconButton;
