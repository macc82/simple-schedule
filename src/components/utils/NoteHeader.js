import React, { useState } from "react";

import { faTimes, faBan, faArchive } from "@fortawesome/free-solid-svg-icons";
import CustomIconButton from "./CustomIconButton";
import TooltipFormControl from './TooltipFormControl';

export default ({
  id,
  title = '',
  isArchived,
  onCloseClick,
  onSaveClick,
  onTitleChange,
}) => {
  const [editable, setEditable] = useState(false);
  
  return (
    <div className="d-flex flex-nowrap flex-row pb-1 pt-1">
      <TooltipFormControl
          className="d-inline pt-0 pb-0 title-box form-control-sm"
          type="text"
          value={title}
          placeholder="Add title here..."
          plaintext={!editable}
          onClick={(e) => {
            setEditable(true);
            e.currentTarget.select();
          }}
          onBlur={() => setEditable(false)}
          onChange={(e) => onTitleChange(e)}
          tooltip="Click here to change title"
          tooltipPlacement="bottom"        
        />
      <CustomIconButton
        variant="outline-light"
        className="border-0 p-0"
        size="sm"
        icon={isArchived ? faBan : faArchive}
        onClick={onSaveClick}
        tooltip={isArchived ? "Unarchive note" : "Archive note"}
      />
      <CustomIconButton
        variant="outline-light"
        className="border-0 p-0"
        size="sm"
        icon={faTimes}
        onClick={onCloseClick}
        tooltip="Delete note"
      />
    </div>
  );
};
