
import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { FaRegCommentDots, FaHome, FaPlusCircle, FaSearch } from "react-icons/fa";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, IconButton } from '@mui/material';

const userType = localStorage.getItem("userType");

const ReleaseActionMenu = ({ rowData, showFormHandler }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (type) => {
    showFormHandler(rowData, type)();
    handleClose();
  };

  const menuItems = [
  
    <MenuItem key="ActivityReview" onClick={() => handleAction('ActivityReview')}>
    <FaRegCommentDots style={{ marginRight: 8, color: "#4b6cb7" }} /> Comment
  </MenuItem>,
    <MenuItem key="pdfReport" onClick={() => handleAction('pdfReport')}>
    <FaIcons.FaPrint style={{ marginRight: 8, color: "#4b6cb7" }} /> Print
  </MenuItem>,
   
    
  ].filter(Boolean); // Removes any false/null elements

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon style={{ cursor: 'pointer', color: 'blue' }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {menuItems}
      </Menu>
    </>
  );
};

export default ReleaseActionMenu;