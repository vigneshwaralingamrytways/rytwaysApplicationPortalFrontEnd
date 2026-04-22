import React from "react";
import * as FaIcons from "react-icons/fa";

const ManageBookEnquiryTable = (showFormHandler, actions, statusList, handleStatusChange) => {
  return [
    {
      title: "Enquiry Date",
      align: "left",
      val: "enquiryDate",
      render: (rowData) => <span>{rowData?.enquiryDate}</span>,
    },
    {
      title: "Customer Name",
      align: "left",
      val: "customerName",
      render: (rowData) => (
        <span>{rowData?.customer?.customerName || rowData?.customerName}</span>
      ),
    },
    {
      title: "Enquiry Description",
      align: "left",
      val: "enquiryDescription",
      render: (rowData) => (
        <span>{rowData?.enquiryDescription}</span>
      ),
    },

    {
      align: "left",
      title: "Status",
      val: "status",
      // render: (row) => <span>{row.status}</span>,

      render: (rowData) => {
        return (
          <select

            value={
              rowData.statusId ||
              rowData.status?.statusId ||
              ""
            }
            onChange={(e) => {
              const statusId = Number(e.target.value);
              handleStatusChange(rowData, statusId);
            }}
          >
            {/* <option value="opened" >Opened</option >
            <option value="closed">Closed</option>
            <option value="cancel">Cancel</option>
            <option value="coverted">Converted</option> */}
            <option value="">Select Status</option>
            {/* {statusList?.status?.map((t) => (
              <option
                key={t.statusId}
                value={t.statusId}
              >
                {t.statusName}
              </option>
            ))} */}
            {statusList?.map((t) => (
              <option key={t.val} value={t.val}>
                {t.label}
              </option>
            ))}
          </select >
        )
      },
    },
    // {
    //   title: "Edit",
    //   align: "center",
    //   render: (rowData) => (
    //     <span
    //       style={{ cursor: "pointer", color: "blue" }}
    //       onClick={showFormHandler(rowData, "Edit")}
    //     >
    //       <FaIcons.FaEdit />
    //     </span>
    //   ),
    // },
    {
      title: "Follow Up",
      align: "center",
      render: (rowData) => (
        <span
          style={{ cursor: "pointer", color: "red" }}
          onClick={showFormHandler(rowData, "FollowUp")}
        >
          <FaIcons.FaRocketchat />
        </span>
      ),
    },

  ];
};

export default ManageBookEnquiryTable;
