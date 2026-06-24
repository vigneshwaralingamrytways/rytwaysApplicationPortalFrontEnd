import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem, IconButton } from '@mui/material';
import { MdRefresh, MdCheckCircle, MdLogin, MdPerson, MdContactPhone, MdDeliveryDining, MdAddLocationAlt, MdUpload, MdReply } from 'react-icons/md';

const WizardMenu = ({ rowData, showFormHandler,actions }) => {
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
    <MenuItem onClick={() => handleAction(actions[4])}>
      <MdUpload style={{ marginRight: 8 }} /> Upload
    </MenuItem>,
    <MenuItem onClick={() => handleAction(actions[1])}>
      <FaIcons.FaEdit style={{ marginRight: 8 }} /> Edit
    </MenuItem>,
    // <MenuItem onClick={() => handleAction(actions[6])}>
    //   <MdReply style={{ marginRight: 8 }} /> Response
    // </MenuItem>,
  ].filter(Boolean);

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon style={{ cursor: 'pointer', color: 'blue' }} onClick={showFormHandler} />
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

export default WizardMenu
