import React, { useCallback, useContext, useEffect, useState } from "react";

import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
  AuthContext,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import NewRequest from "./NewRequest";
import RequestTable from "./RequestTable";

const MakeRequest = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();
  const authCtx = useContext(AuthContext)
  const uId = authCtx.userId
  const isAdmin = authCtx.roleId=="1"
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
        validate: (value, formValues) => {
          if (formValues.requestType === "leave") {
            if (!value) return "From Date is required for leave";
            if (formValues.requestDate && value < formValues.requestDate) return "From Date cannot be less than Request Date";
            if (formValues.toDate && value > formValues.toDate) return "From Date cannot be greater than To Date";
          }
          return true;
        }
      },
      {
        inpprops: {},
        title: "To Date",
        type: "date",
        name: "toDate",
        contains: "date",

        validationProps: "To Date is required",
        dynamic: { field: "requestType", value: "leave" },
        validate: (value, formValues) => {
          if (formValues.requestType === "leave") {
            if (!value) return "To Date is required for leave";
            if (formValues.fromDate && value < formValues.fromDate) return "To Date cannot be before From Date";
          }
          return true;
        }
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
    let allRequests
    if (isAdmin) {
      allRequests = await get(api + "/makeRequest/getall");
    } else {
      allRequests = await get(api + "/makeRequest/getByUserName/" + uId);


    }

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
      const values = {
        ...val,
        userId: authCtx.userId
      }
      const updateRequest = await post(
        api + "/makeRequest/update/" + val.requestId,
        values
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
      const values = {
        ...val,
        userId: authCtx.userId
      }
      const newRequest = await post(api + "/makeRequest/create", values);
      console.log(" val for save req", values)
      console.log(" res for the save req", newRequest)
      if (response.ok) {
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
    const resDel = await del(api + "/makeRequest/delete/" + requestId);

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

  const validateFormFields = (watchValues, { setError, clearErrors }) => {
    const { requestType, fromDate, toDate, requestDate } = watchValues;
    const todayStr = new Date().toISOString().split('T')[0];

    clearErrors(["requestDate", "fromDate", "toDate"]);

    if (requestDate && requestDate < todayStr) {
      setError("requestDate", {
        type: "manual",
        message: "The Request Date Could Not Be Less Than Today",
      });
    }

    if (requestType === "leave") {
      if (!fromDate) {
        setError("fromDate", {
          type: "manual",
          message: "From Date is required for leave",
        });
      }
      if (!toDate) {
        setError("toDate", {
          type: "manual",
          message: "To Date is required for leave",
        });
      }

      if (fromDate && requestDate && fromDate < requestDate) {
        setError("fromDate", {
          type: "manual",
          message: "From Date Could Not Be Less Than Request Date",
        });
      }

      if (fromDate && toDate && fromDate > toDate) {
        setError("fromDate", {
          type: "manual",
          message: "From Date Could Not Be Greater Than To Date",
        });
      }
    }
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
          validate={validateFormFields}
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
          validate={validateFormFields}
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
