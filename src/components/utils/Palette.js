import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPalette } from "@fortawesome/free-solid-svg-icons";

export default ({ color, onThemeSelected }) => {
  const [currentColor, setCurrentColor] = useState(color);

  const toggleVisibilityPalette = (e) => {
    const el = e.currentTarget.parentElement.nextElementSibling;
    el.classList.toggle("invisible");
  };

  const onColorClick = (e) => {
    setCurrentColor(e.currentTarget.style.color);
    onThemeSelected(e.currentTarget.style.color);
  };

  const transform = "shrink-5.5 right-1 left-1 up-1 down-1";

  return (
    <div className="paletteButton d-flex flex-row">
      <div>
        <FontAwesomeIcon
          icon={faPalette}
          mask={faCircle}
          transform={transform}
          fixedWidth
          onClick={toggleVisibilityPalette}
        />
        {/* <span className="tooltiptext">Select theme</span> */}
      </div>
      <div className="paletteContainer invisible">
        &nbsp;
        <FontAwesomeIcon
          className={currentColor === "red" ? "active" : ""}
          icon={faCircle}
          style={{ color: "red" }}
          onClick={onColorClick}
          transform={transform}
        />
        &nbsp;
        <FontAwesomeIcon
          className={currentColor === "orange" ? "active" : ""}
          icon={faCircle}
          style={{ color: "orange" }}
          onClick={onColorClick}
          transform={transform}
        />
        &nbsp;
        <FontAwesomeIcon
          className={currentColor === "blue" ? "active" : ""}
          icon={faCircle}
          style={{ color: "blue" }}
          onClick={onColorClick}
          transform={transform}
        />
        &nbsp;
        <FontAwesomeIcon
          className={currentColor === "green" ? "active" : ""}
          icon={faCircle}
          style={{ color: "green" }}
          onClick={onColorClick}
          transform={transform}
        />
        &nbsp;
        <FontAwesomeIcon
          className={currentColor === "purple" ? "active" : ""}
          icon={faCircle}
          style={{ color: "purple" }}
          onClick={onColorClick}
          transform={transform}
        />
        &nbsp;
      </div>
    </div>
  );
};
