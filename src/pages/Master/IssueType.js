import React, { useCallback, useEffect, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import IssueTypeTable from "./IssueTypeTable";
import NewIssueType from "./NewIssueType";
import NewTable from "../../Components/NewTable/NewTable";

const IssueTypeMaster = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [issueTypes, setIssueTypes] = useState([]);

  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);


  const AlertHandler = (message, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: message,
        alertVariant: type,
      })
    );
  };


  const template = {
    fields: [
      {
        title: "Issue Type Name",
        type: "text",
        name: "issueTypeName",
        contains: "text",
        validationProps: "Issue Type Name is required",
      },
    ],
  };


  const loadIssueTypes = useCallback(async () => {
    const data = await get(api + "/issueType/getAll");
    console.log("data for issue types", data)
    if (response.ok) {
      setIssueTypes(data);
    } else {
      AlertHandler("Failed to fetch Issue Types", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadIssueTypes();
  }, [loadIssueTypes]);


  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };


  const saveIssueType = async (val) => {
    if (val.issueTypeId) {

      const updated = await post(
        api + "/issueType/update/" + val.issueTypeId,
        val
      );

      if (response.ok) {
        AlertHandler("Issue Type Updated", "success");

        setIssueTypes((prev) =>
          prev.map((item) =>
            item.issueTypeId === updated.issueTypeId ? updated : item
          )
        );

        closeSlide();
      } else {
        AlertHandler("Update Failed", "danger");
      }
    } else {

      const created = await post(api + "/issueType/create", val);

      if (response.ok) {
        AlertHandler("Issue Type Created", "success");

        setIssueTypes((prev) => [...prev, created]);

        closeSlide();
      } else {
        AlertHandler("Creation Failed", "danger");
      }
    }
  };


  const deleteIssueType = async (id) => {
    await del(api + "/issueType/delete/" + id);

    if (response.ok) {
      AlertHandler("Issue Type Deleted", "success");

      setIssueTypes((prev) =>
        prev.filter((item) => item.issueTypeId !== id)
      );
    } else {
      AlertHandler("Delete Failed", "danger");
    }
  };


  const searchDetails = async (values) => {

  };

  const onSubmit = (values) => {
    searchDetails(values);
  };

  const actions = ["Edit", "Delete"];

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    if (action === "Add" || isEdit) {
      setActiveForm(
        <NewIssueType
          selectedItem={formData}
          onCancel={closeSlide}
          saveIssueType={saveIssueType}
          template={template}
          validate={() => true}
        />
      );

      setIsSlideOpen(true);
    }

    if (action === "Delete") {
      deleteIssueType(item.issueTypeId);
    }
  };

  return (
    <div className={classes.container}>
      {!isSlideOpen && (
        <NewTable
          cols={IssueTypeTable(showFormHandler, actions)}
          data={issueTypes}
          striped
          rows={25}
          title="Issue Type Master"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={template}
          rowwise={3}
          validate={() => true}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
        />
      )}

      {isSlideOpen && (
        <div className="slidePopupContainer">
          {activeForm}
        </div>
      )}
    </div>
  );
};

export default IssueTypeMaster;
