import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import { ImCross } from "react-icons/im"
import { AiOutlinePullRequest, AiOutlineReconciliation } from 'react-icons/ai'
import WizardMenu from './Wizard/Popup/WizardMenu';

// This is the table constant/settings which needed to render table elements

export const QueryCommentsTable = (showFormHandler, actions) => {
  return [
    {
      title: 'Source',
      align: 'center',
      render: rowData => {
        return <span >{rowData?.source?.charAt(0) || ""}</span>;
      },
    },
    {
      title: 'Type',
      align: 'center',
      render: rowData => {
        return (
          <>
            <span>{rowData?.commentType?.charAt(0)}</span></>
        )
      },
    },
    //  {
    //     title: 'Comments and Response (Maximum Length is 1024)',
    //     align:'left',
    //     render: rowData => {
    //       return <>
    //       <span>Comments : {rowData.issueComments}</span><br/>
    //       <span>Response : {rowData?.commentNotes || "N/A"}</span>
    //       </>;
    //     },
    //   },
    {
      title: 'Comments and Response (Maximum Length is 1024)',
      align: 'left',
      render: (rowData) => {
        const plainText = rowData?.commentNotes?.replace(/<[^>]+>/g, '') || "N/A";
        return (
          <>
            <div><strong>Comments:</strong> {rowData?.issueComments || "N/A"}</div>
            <div><strong>Response:</strong> {plainText}</div>
          </>
        );
      }
    },

    // {
    //   title: 'Upload',
    //   align:'center',
    //   render: rowData => {
    //     return <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData,actions[4])}><FaIcons.FaUpload /></span>;
    //   },
    // },{
    //   title: 'Edit',
    //   align:'center',
    //   render: rowData => {
    //     return <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData,actions[1])}><FaIcons.FaEdit /></span>;
    //   },
    // },
    {
      title: <>
        <span style={{ textWrap: "nowrap" }}>UpdatedBy/UpdatedOn</span><br />
        <span style={{ textWrap: "nowrap" }}>ResponseBy/ResponseOn</span>
      </>,
      align: 'center',
      render: rowData => {
        return <>
          <span>{`${rowData?.updateBy || "N/A"}/`}</span><span>{rowData?.updateOn ? new Date(rowData?.updateOn)?.toLocaleDateString("en-GB") : ""}</span><br />
          <span>{`${rowData?.responseBy || "N/A"}/`}</span><span>{rowData?.responseOn ? new Date(rowData?.responseOn)?.toLocaleDateString("en-GB") : ""}</span>
        </>;
      },
    },
    {
      title: 'Response',
      align: 'center',
      render: rowData => {
        return <span style={{ cursor: "pointer", color: "blue" }} onClick={showFormHandler(rowData, actions[6])}><FaIcons.FaPaperPlane /></span>;
      },
    },
    // {
    //   title: 'Status',
    //   align: 'center',
    //   render: rowData => {
    //     return <span style={{ cursor: "pointer", color: "blue" }} onClick={showFormHandler(rowData, actions[2])}>{rowData.commentStatus}</span>;
    //   },
    // },
    {
      title: 'Action',
      align: 'center',
      render: rowData => {
        return (<div style={{ height: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <WizardMenu rowData={rowData} showFormHandler={showFormHandler} actions={actions} />
        </div>)
      }
    }
    // {
    //   title: '',
    //   align:'center',
    //   render: rowData => {
    //     return <></>;
    //   },
    // },
  ];
};


export default QueryCommentsTable
