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

const ApproveRequest = (props) => {
  const { get, del, put, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [requests, setRequests] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [statusList, setStatusList] = useState([]);

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
  const template = (isEdit, requestType) => {
    const baseFields = [
      {
        title: "Request Date",
        type: "disabled",
        name: "requestDate",
      },
      {
        title: "Type of Request",
        type: "disabled",
        name: "requestType",
      },
    ];
    const dateFields = requestType === "leave" ? [
      {
        title: "From Date",
        type: "disabled",
        name: "fromDate",
      },
      {
        title: "To Date",
        type: "disabled",
        name: "toDate",
      },
    ] : [];

    const otherFields = [
      {
        title: "purpuse",
        type: "disabled",
        name: "purpuse",
      },
      {
        title: "Request Desc",
        type: "disabled",
        name: "requestDesc",
      },
      {
        title: "Request To",
        type: "disabled",
        name: "toPerson",
      },
    ];

    const editFields = isEdit ? [
      {
        title: "Status",
        type: "select",
        name: "status",
        options: [{ label: "Select", val: "" }, ...statusList],
        validationProps: "Status is required",
      },
      {
        title: "Approve Remarks",
        type: "text",
        name: "approveRemarks",
        validationProps: "Remarks is required",
      },
    ] : [];

    return {
      fields: [...baseFields, ...dateFields, ...otherFields, ...editFields],
    };
  };

  // const template = (isEdit) => ({
  //   fields: [
  //     {
  //       title: "Request Date",
  //       type: "disabled",
  //       name: "requestDate",
  //     },
  //     {
  //       title: "Type of Request",
  //       type: "disabled",
  //       name: "requestType",
  //     },
  //     {
  //       title: "From Date",
  //       type: "disabled",
  //       name: "fromDate",
  //     },
  //     {
  //       title: "To Date",
  //       type: "disabled",
  //       name: "toDate",
  //     },
  //     {
  //       title: "purpuse",
  //       type: "disabled",
  //       name: "purpuse",
  //     },
  //     {
  //       title: "Request Desc",
  //       type: "disabled",
  //       name: "requestDesc",
  //     },
  //     {
  //       title: "Request To",
  //       type: "disabled",
  //       name: "toPerson",
  //     },

  //     ...(isEdit
  //       ? [
  //           {
  //             title: "Status",
  //             type: "select",
  //             name: "status",
  //             options: [{ label: "Select", val: "" }, ...statusList],
  //             validationProps: "Status is required",
  //           },
  //           {
  //             title: "Approve Remarks",
  //             type: "text",
  //             name: "approveRemarks",
  //             validationProps: "Remarks is required",
  //           },
  //         ]
  //       : []),
  //   ],
  // });

  /* ---------------- FILTER TEMPLATE ---------------- */

  const templateforfilter = {
    fields: [
      {
        title: "Type Of Request",
        type: "select",
        name: "requestType",
        options: [
          { label: "All", value: "" },
          { label: "Leave", value: "leave" },
          { label: "Permission", value: "permission" },
          { label: "Expenses", value: "expenses" },
        ],
      },
    ],
  };

  /* ---------------- LOAD STATUS LIST ---------------- */

  const loadStatuses = useCallback(async () => {
    const data = await get(api + "/status/getAllByStatusType/REQUEST");

    if (response.ok) {
      setStatusList(
        data.map((item) => ({
          val: item.statusId,
          label: item.statusName,
        }))
      );
    }
  }, [get, response]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  /* ---------------- LOAD REQUESTS ---------------- */

  const loadRequests = useCallback(async () => {
    const allRequests = await get(api + "/makeRequest/pending");

    if (response.ok) {
      setRequests(allRequests);
      setOriginalData(allRequests);
    } else {
      // AlertHandler("Failed to load pending requests", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  /* ---------------- UPDATE STATUS ---------------- */

  const updateStatus = async (requestId, values) => {
    const updated = await put(
      `${api}/makeRequest/updateStatus/${requestId}?status=${values.status}&approveRemarks=${values.approveRemarks}`
    );

    if (response.ok) {
      AlertHandler("Status updated successfully", "success");

      setRequests((prev) =>
        prev.filter((r) => r.requestId !== requestId)
      );

      closeSlide();
    } else {
      AlertHandler("Failed to update status", "danger");
    }
  };

  /* ---------------- FILTER SUBMIT ---------------- */

  function onSubmit(values) {
    if (!values || !values.requestType) {
      setRequests(originalData);
      return;
    }

    const filteredData = originalData.filter(
      (item) => item.requestType === values.requestType
    );

    setRequests(filteredData);
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

    if (isEdit) {
      setActiveForm(
        <NewRequest
          title="Approve Request"
          selectedItem={formData}
          onCancel={closeSlide}
          saveRequest={(values) =>
            updateStatus(formData.requestId, values)
          }
          template={() => template(true, formData.requestType)}
          validate={() => { }}
          rowWiseFields={4}
        />
      );

      setIsSlideOpen(true);
    }
  };

  const actions = ["Edit"];

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
          data={requests}
          striped
          rows={25}
          title="Approve Request"
          template={templateforfilter}
          rowwise={3}
          validate={() => { }}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
          rowWise={4}
        />
      )}

      {/* ? SLIDE PANEL */}
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

export default ApproveRequest;
