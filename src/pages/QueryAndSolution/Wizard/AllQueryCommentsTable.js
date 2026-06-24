import React from 'react';
import * as FaIcons from 'react-icons/fa';
import WizardMenu from './Popup/WizardMenu';

export const AllQueryCommentsTable = (showFormHandler, actions) => {
  return [
    {
      title: 'Process Name',
      align: 'left',
      render: rowData => <span>{rowData?.processName || "N/A"}</span>,
    },
    {
      title: 'Function Name',
      align: 'left',
      render: rowData => <span>{rowData?.functionName || "N/A"}</span>,
    },
    {
      title: 'Activity Name',
      align: 'left',
      render: rowData => <span>{rowData?.activityName || "N/A"}</span>,
    },
    {
      title: 'Source',
      align: 'center',
      render: rowData => <span>{rowData?.source?.charAt(0) || "N/A"}</span>,
    },
    {
      title: 'Type',
      align: 'center',
      render: rowData => <span>{rowData?.commentType?.charAt(0) || "N/A"}</span>,
    },
    {
      title: 'Comments and Response (Maximum Length is 1024)',
      align: 'left',
      render: (rowData) => {
        const plainText = rowData?.commentNotes?.replace(/<[^>]+>/g, '') || "N/A";
        return (
          <>
            <div><strong>Comments:</strong> {rowData?.issueComments || "N/A"}</div>
            <div style={{ marginTop: '4px' }}><strong>Response:</strong> {plainText}</div>
          </>
        );
      }
    },
    {
      title: (
        <>
          <span style={{ whiteSpace: "nowrap" }}>UpdatedBy/UpdatedOn</span><br />
          <span style={{ whiteSpace: "nowrap" }}>ResponseBy/ResponseOn</span>
        </>
      ),
      align: 'center',
      render: rowData => {
        const uOn = rowData?.updateOn ? new Date(rowData?.updateOn)?.toLocaleDateString("en-GB") : "N/A";
        const rOn = rowData?.responseOn ? new Date(rowData?.responseOn)?.toLocaleDateString("en-GB") : "N/A";
        return (
          <>
            <span>{`${rowData?.updateBy || "N/A"} / ${uOn}`}</span><br />
            <span>{`${rowData?.responseBy || "N/A"} / ${rOn}`}</span>
          </>
        );
      },
    },
    {
      title: 'Response',
      align: 'center',
      render: rowData => (
        <span style={{ cursor: "pointer", color: "blue" }} onClick={showFormHandler(rowData, actions[6])}>
          <FaIcons.FaPaperPlane />
        </span>
      ),
    },
    {
      title: 'Status',
      align: 'center',
      render: rowData => <span style={{ cursor: "pointer", color: "blue" }} onClick={showFormHandler(rowData, actions[2])}>{rowData.commentStatus || "N/A"}</span>,
    },
    {
      title: 'Action',
      align: 'center',
      render: rowData => (
        <div style={{ height: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WizardMenu rowData={rowData} showFormHandler={showFormHandler} actions={actions} />
        </div>
      )
    }
  ];
};

export default AllQueryCommentsTable;