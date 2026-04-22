import * as FaIcons from 'react-icons/fa'

export const ManageActivityTable = (showFormHandler) => {

  return [
    {
      title: 'Process Name',
      align: 'left',
      val:"function.process.processName",
      render: rowData => {
        return <span>{rowData?.function?.process?.processName}</span>
      },
    },
    {
      title: 'Function Name',
      align: 'left',
       val:"function.functionName",
      render: rowData => {
        return <span>{rowData?.function?.functionName}</span>
      },
    },
    {
      title: 'Activity Name',
      align: 'left',
      render: rowData => {
        return <span>{rowData?.activityName}</span>
      },
    },
    {
      title: 'Add User',
      align: 'center',
      render: rowData => {
        return <FaIcons.FaUser style={{ cursor: "pointer" }} onClick={showFormHandler(rowData, "add")}></FaIcons.FaUser>
      },
    },
  ];
};


export default ManageActivityTable

