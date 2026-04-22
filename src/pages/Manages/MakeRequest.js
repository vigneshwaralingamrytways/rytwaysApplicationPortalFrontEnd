import React, { useCallback, useEffect, useState } from "react";

import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import NewRequest from "./NewRequest";
import RequestTable from "./RequestTable";

const MakeRequest = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [Request, setRequest] = useState([]);
  const [defaultValues, setDefaultValues] = useState({});
  const [originalData, setOriginalData] = useState([]);

  /* ? SLIDE STATE */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  /* ---------------- TEMPLATE ---------------- */

  const template = (isEdit, requestType) => ({
    fields: [
      {
        inpprops: {},
        title: "Request Date",
        type: "date",
        contains: "date",
        name: "requestDate",
        validationProps: "Request Date is required",
      },
      {
        inpprops: {},
        title: "Type of Request",
        type: "select",
        name: "requestType",
        contains: "text",
        validationProps: "Request Type is required",
        options: [
          { label: "select", value: "" },
          { label: "leave", value: "leave" },
          { label: "permission", value: "permission" },
          { label: "expenses", value: "expenses" },
        ],
      },
      {
        inpprops: {},
        title: "From Date",
        type: "date",
        name: "fromDate",
        contains: "date",
        validationProps: "From Date is required",
        dynamic: { field: "requestType", value: "leave" },
      },
      {
        inpprops: {},
        title: "To Date",
        type: "date",
        name: "toDate",
        contains: "date",
       
        validationProps: "To Date is required",
        dynamic: { field: "requestType", value: "leave" },
      },
      {
        inpprops: {},
        title: "purpuse",
        type: "text",
        name: "purpuse",
        contains: "text",
        validationProps: "Request purpuse is required",
      },
      {
        inpprops: {},
        title: "Request Desc",
        type: "text",
        name: "requestDesc",
        contains: "text",
        validationProps: "Request Desc is required",
      },
      {
        inpprops: {},
        title: "Request To",
        type: "text",
        name: "toPerson",
        contains: "text",
        validationProps: "Request to is required",
      },

      ...(isEdit
        ? [
          {
            inpprops: {},
            title: "Status",
            type: "select",
            name: "status",
            contains: "text",
            options: [
              { label: "select ", val: "" },
              { label: "Requested", val: "Requested" },
              { label: "Aproved", val: "Aproved" },
              { label: "Rejected", val: "Rejected" },
              { label: "Cancel", val: "Cancel" },
            ],
            validationProps: "Status is required",
          },
        ]
        : []),
    ],
  });

  /* ---------------- FILTER TEMPLATE ---------------- */

  const templateforfilter = {
    fields: [
      {
        inpprops: {},
        title: "Type Of Request",
        type: "select",
        name: "requestType",

        contains: "text",
        options: [
          { label: "All", value: "" },
          { label: "Leave", value: "leave" },
          { label: "Permission", value: "permission" },
          { label: "Expenses", value: "expenses" },
        ],
      },
    ],
  };

  /* ---------------- LOAD REQUESTS ---------------- */

  const loadRequests = useCallback(async () => {
    const allRequests = await get(api + "/makeRequest/getall");

    if (response.ok) {
      setRequest(allRequests);
      setOriginalData(allRequests);
    }
  }, [get, response]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  /* ---------------- SAVE REQUEST ---------------- */

  const saveRequest = async (val) => {
    if (val.requestId) {
      const updateRequest = await post(
        api + "/makeRequest/update/" + val.requestId,
        val
      );

      if (response.ok) {
        AlertHandler("Request updated", "success");

        setRequest((prev) =>
          prev.map((c) =>
            c.requestId === updateRequest.requestId ? updateRequest : c
          )
        );

        setDefaultValues({});
        closeSlide();
      } else {
        AlertHandler("Updation failed", "danger");
      }
    } else {
      const newRequest = await post(api + "/makeRequest/create", val);

      if (newRequest) {
        AlertHandler("Request saved", "success");
        setRequest((prev) => [...prev, newRequest]);

        setDefaultValues({});
        closeSlide();
      } else {
        AlertHandler("Request not saved", "danger");
      }
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteRequest = async (requestId) => {
    await del(api + "/makeRequest/delete/" + requestId);

    if (response.ok) {
      AlertHandler("Request deleted", "success");
      setRequest((prev) => prev.filter((c) => c.requestId !== requestId));
    }
  };

  /* ---------------- FILTER SUBMIT ---------------- */

  function onSubmit(values) {
    if (!values || !values.requestType) {
      setRequest(originalData);
      return;
    }

    const filteredData = originalData.filter(
      (item) => item.requestType === values.requestType
    );

    setRequest(filteredData);
  }

  /* ---------------- SLIDE CLOSE ---------------- */

  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  /* ---------------- SHOW FORM HANDLER ---------------- */

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    /* DELETE */
    if (action === "Delete") {
      deleteRequest(item.requestId);
      return;
    }

    /* ADD / EDIT ? SLIDE OPEN */
    if (action === "Add" || isEdit) {
      setActiveForm(
        <NewRequest
          selectedItem={formData}
          onCancel={closeSlide}
          saveRequest={saveRequest}
          template={template}
          validate={() => { }}
          rowWiseFields={4}
        />
      );

      setIsSlideOpen(true);
    }
  };

  const actions = ["Edit", "Delete", "Add"];

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "650px",
      }}
    >
      {/* ? TABLE (HIDE WHEN SLIDE OPEN) */}
      {!isSlideOpen && (
        <NewTable
          cols={RequestTable({
            showFormHandler,
            actions,
          })}
          data={Request}
          striped
          rows={25}
          title="Make Request"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={templateforfilter}
          rowwise={3}
          validate={() => { }}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
          rowWise={4}
        />
      )}

      {/* ? SLIDE FORM PANEL */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: 0,
          width: "100%",
          height: "calc(100% - 60px)",
          transform: isSlideOpen
            ? "translateX(0%)"
            : "translateX(110%)",
          transition: "transform 0.4s ease-in-out",
          overflowY: "auto",
        }}
      >
        {activeForm}
      </div>
    </div>
  );
};

export default MakeRequest;
