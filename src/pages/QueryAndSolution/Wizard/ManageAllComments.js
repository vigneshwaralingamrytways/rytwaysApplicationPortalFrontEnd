import React, { useCallback, useEffect, useState } from 'react';
import {

  alertActions,
  api,
  modalActions,
  useDispatch,
  useFetch,
  useSelector
} from '../../../Components/CommonImports/CommonImports';
import NewTable from '../../../Components/NewTable/NewTable';
import { generateToken } from '../../../Components/GenerateToken';
import RoleForm from '../RoleForm';
import ProcCommWiz from './Popup/ProcCommWiz';
import AddStatusWiz from './Popup/AddStatusWiz';
import * as FaIcons from "react-icons/fa";
import classes from "../../../Components/Wizard.module.css";
import AllQueryCommentsTable from './AllQueryCommentsTable';
import UploadFormWiz from './UploadFormWiz';
import EditActivity from '../../../Components/SlidingMenu/EditActivity';
import Responsewiz from './Popup/Responsewiz';

function ManageAllComments(props) {
  const { post, response, loading, error } = useFetch({ data: [] });
  const activityId = useSelector((state) => state.sideBar.activityId);
  const processTittle = useSelector((state) => state.sideBar.processTittle);
  const functionTittle = useSelector((state) => state.sideBar.functionTittle);
  const activityTittle = useSelector((state) => state.sideBar.activityTittle);

  const [orderItems, setOrderItems] = useState([]);
  const [commentStatus, setCommentStatus] = useState([{ value: "", label: "Select" }]);
  const [commentType, setCommentType] = useState([{ value: "", label: "Select" }]);

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const dispatch = useDispatch();

  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  const actions = ["activityform", "processComments", "status", "upload", "commentUpload", "edit", "notes"];

  const showFormHandler = (item, action) => () => {
    if (action === "activityform") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <RoleForm
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
            />
          ),
          showModal: true,
        })
      );
    } else if (action === "processComments") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '48%',
          modalLeft: '26%',
          selectedForm: (
            <ProcCommWiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              commentType={commentType}
              onSubmitTwo={onSubmitTwo}
            />
          ),
          showModal: true,
        })
      );
    } else if (action === "status") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          modalWidth: '24%',
          modalLeft: '38%',
          selectedForm: (
            <AddStatusWiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              onSubmitTwo={onSubmitTwo}
              commentStatus={commentStatus}
            />
          ),
          showModal: true,
        })
      );
    } else if (action === "upload") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <UploadFormWiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              onSubmitTwo={onSubmitTwo}
              commentStatus={commentStatus}
              reportType={"ACTIVITY"}
              filePath={"ACTIVITY/"}
              docId={activityId}
            />
          ),
          showModal: true,
        })
      );
    } else if (action === "commentUpload") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <UploadFormWiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              onSubmitTwo={onSubmitTwo}
              commentStatus={commentStatus}
              reportType={"Activity"}
              filePath={"Activity/"}
              docId={item.commentId}
            />
          ),
          showModal: true,
        })
      );
    } else if (action === "edit") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <EditActivity
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              saveFunction={onSubmitTwo}
            />
          ),
          showModal: true,
        })
      );
    } else if (action === "notes") {
      dispatch(
        modalActions.showModalHandler({
          selectedData: { ...item },
          selectedForm: (
            <Responsewiz
              onCancel={() => dispatch(modalActions.hideModalHandler())}
              selectedItem={{ ...item }}
              onSubmitTwo={onSubmitTwo}
            />
          ),
          showModal: true,
        })
      );
    }
  };

  const loadInitialDashboardData = useCallback(async () => {
    const initialUnit = await post(api + "/issueSolution/loadIssueAllComments", { "random": generateToken() });
    const loadQueryStatus = await post(api + "/queryStatus/loadOptions", { "statusType": "COMMENTS", "random": generateToken() });
    const loadType = await post(api + "/commentType/loadOptions", { "random": generateToken() });
    console.log("loadtypes", loadType)
    if (loadQueryStatus && loadQueryStatus.length > 0) {
      setCommentStatus([{ value: "", label: "Select" }, ...loadQueryStatus]);
    }
    if (loadType && loadType.length > 0) {
      setCommentType([{ value: "", label: "Select" }, ...loadType]);
    }
    if (initialUnit && initialUnit.length > 0) {
      setOrderItems(initialUnit);
    } else {
      setOrderItems([]);
    }
  }, [post]);

  useEffect(() => {
    loadInitialDashboardData();
  }, [loadInitialDashboardData]);

  const saveOrder = async (values) => {
    const val = {
      ...values,
      source: "Testing"
    }
    const newTransac = await post(api + "/issueSolution/createComments", val);
    if (response.ok) {
      if (values.commentId) {
        const updatedItem = orderItems.map(item => item.commentId == values.commentId ? newTransac : item);
        setOrderItems(updatedItem);
        AlertHandler("Comments Updated Successfully", "success");
      } else {
        setOrderItems([...orderItems, newTransac]);
        AlertHandler("Comments Saved Successfully", "success");
      }
      return newTransac;
    } else {
      AlertHandler("Comments Failed To Save", "danger");
    }
  };

  function onSubmitTwo(values) {
    saveOrder(values);
  }

  const validate = () => ({});


  const template = {
    fields: [
      {
        title: "Activity Name",
        type: "select",
        name: "activityName",
        contains: "select",
        options: []
      },
      {
        title: "Type",
        type: "select",
        name: "commentType",
        options: [{ value: "Bug", label: "Bug" }],
      },
      {
        title: "Comments",
        type: "text",
        name: "issueComments",
      },
      {
        title: "Response",
        type: "text",
        name: "commentNotes",
      },
      {
        title: "From Date",
        type: "date",
        name: "fromDate",
      },
      {
        title: "To Date",
        type: "date",
        name: "toDate",
      },
    ],
  };
  const onSubmit = async (values) => {
    const searchResult = await post(api + "/issueSolution/searchAllComments", values);
    if (response.ok && searchResult) {
      setOrderItems(searchResult);
    } else {
      setOrderItems([]);
    }
  };
  return (
    <div className={classes.container}>

      <NewTable
        cols={AllQueryCommentsTable(showFormHandler, actions)}
        data={orderItems}
        rows={25}

        validate={validate}
        // title="Country Master"
        title={"Manage All Comments"}
        showPlusCircle={false}
        showFilterIcon={true}
        template={template}
        rowwise={2}
        onSubmit={onSubmit}
        buttonName="Search"

      />

    </div>
  );
}

export default ManageAllComments;