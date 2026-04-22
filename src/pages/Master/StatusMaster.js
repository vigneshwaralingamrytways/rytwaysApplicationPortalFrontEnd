import React, { useCallback, useEffect, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import StatusMasterTable from "./StatusMasterTable";
import NewStatus from "./NewStatus";
import NewTable from "../../Components/NewTable/NewTable";

const StatusMaster = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [status, setStatus] = useState([]);

  // ? Slide State
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

  // ? Alert Handler
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  // ? Template
  const template = {
    fields: [
      {
        title: "Status Name",
        type: "text",
        name: "statusName",
        contains: "text",
        validationProps: "Status name is required",
      },
       {
        title: "Status Type",
        type: "text",
        name: "statusType",
        contains: "text",
        validationProps: "Status Type is required",
      },
    ],
  };

  // ? Load Status
  const loadStatuses = useCallback(async () => {
    const allstatus = await get(api + "/status/getall");

    if (response.ok) {
      setStatus(allstatus);
    } else {
      AlertHandler("failed to get the status", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  // ? Close Slide
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  // ? Save Status
  const savestatus = async (val) => {
    if (val.statusId) {
      const updatestatus = await post(
        api + "/status/update/" + val.statusId,
        val
      );

      if (response.ok) {
        AlertHandler("status updated", "success");

        setStatus((prev) =>
          prev.map((c) =>
            c.statusId === updatestatus.statusId ? updatestatus : c
          )
        );

        closeSlide();
      } else {
        AlertHandler("updation failed", "danger");
      }
    } else {
      const newstatus = await post(api + "/status/create", val);

      if (response.ok) {
        AlertHandler("status saved", "success");
        setStatus([...status, newstatus]);

        closeSlide();
      } else {
        AlertHandler("status not saved", "danger");
      }
    }
  };

  // ? Delete Status
  const deletestatus = async (statusId) => {
    await del(api + "/status/delete/" + statusId);

    if (response.ok) {
      AlertHandler("status deleted", "success");
      setStatus((prev) => prev.filter((c) => c.statusId !== statusId));
    } else {
      AlertHandler("Failed to delete status", "danger");
    }
  };

  // ? Search Status
  const searchDetails = async (values) => {
    try {
      const returnObject = await post(
        api + "/status/searchStatus",
        values
      );

      if (returnObject.length > 0) {
        setStatus(returnObject);
      } else {
        setStatus([]);
      }
    } catch (err) {
      setStatus([]);
    }
  };

  function onSubmit(values) {
    searchDetails(values);
  }

  // ? Slide Popup Handler
  const actions = ["Edit", "Delete"];

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    // ? Add/Edit ? Slide Open
    if (action === "Add" || isEdit) {
      setActiveForm(
        <NewStatus
          selectedItem={formData}
          onCancel={closeSlide}
          savestatus={savestatus}
          template={template}
          validate={() => true}
        />
      );

      setIsSlideOpen(true);
    }

    // ? Delete
    if (action === "Delete") {
      deletestatus(item.statusId);
    }
  };

  return (
    <div className={classes.container}>
      {/* ? Table hides when slide opens */}
      {!isSlideOpen && (
        <NewTable
          cols={StatusMasterTable(showFormHandler, actions)}
          data={status}
          striped
          rows={25}
          title="Status Master"
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

      {/* ? Slide Popup */}
      {isSlideOpen && (
        <div className="slidePopupContainer">
          {activeForm}
        </div>
      )}
    </div>
  );
};

export default StatusMaster;
