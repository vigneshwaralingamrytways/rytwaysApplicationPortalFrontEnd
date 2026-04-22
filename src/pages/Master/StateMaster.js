import React, { useCallback, useEffect, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import StateMasterTable from "./StateMasterTable";
import NewState from "./NewState";
import NewTable from "../../Components/NewTable/NewTable";

const StateMaster = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [state, setState] = useState([]);

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

  const template = {
    fields: [
      {
        title: "State Name",
        type: "text",
        name: "stateName",
        contains: "text",
        validationProps: "State name is required",
      },
    ],
  };

  /* ---------------- LOAD STATES ---------------- */

  const loadStates = useCallback(async () => {
    const allstates = await get(api + "/state/getall");

    if (response.ok) {
      setState(allstates);
    } else {
      AlertHandler("Failed to load states", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadStates();
  }, [loadStates]);

  /* ---------------- SAVE STATE ---------------- */

  const savestate = async (val) => {
    if (val.stateId) {
      const updatestate = await post(
        api + "/state/update/" + val.stateId,
        val
      );

      if (response.ok) {
        AlertHandler("State Updated Successfully", "success");

        setState((prev) =>
          prev.map((c) =>
            c.stateId === updatestate.stateId ? updatestate : c
          )
        );

        closeSlide();
      } else {
        AlertHandler("Updation Failed", "danger");
      }
    } else {
      const newstate = await post(api + "/state/create", val);

      if (response.ok) {
        AlertHandler("State Saved Successfully", "success");
        setState((prev) => [...prev, newstate]);

        closeSlide();
      } else {
        AlertHandler("State Not Saved", "danger");
      }
    }
  };

  /* ---------------- DELETE STATE ---------------- */

  const deletestate = async (stateId) => {
    const deleted = await del(api + "/state/deleteone/" + stateId);

    if (response.ok) {
      AlertHandler("State Deleted Successfully", "success");
      setState((prev) => prev.filter((c) => c.stateId !== stateId));
    } else {
      AlertHandler("Failed to delete state", "danger");
    }
  };

  /* ---------------- SEARCH ---------------- */

  const searchDetails = async (values) => {
    try {
      const returnObject = await post(api + "/state/searchState", values);

      if (returnObject.length > 0) {
        setState(returnObject);
      } else {
        setState([]);
      }
    } catch (err) {
      console.log("err:", err);
      setState([]);
    }
  };

  function onSubmit(values) {
    searchDetails(values);
  }

  /* ---------------- SLIDE CLOSE ---------------- */

  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  /* ---------------- SHOW FORM HANDLER ---------------- */

  const actions = ["Edit", "Delete"];

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    if (action === "Add" || action === "Edit") {
      setActiveForm(
        <NewState
          selectedItem={formData}
          onCancel={closeSlide}
          savestate={savestate}
          template={template}
          validate={() => {}}
        />
      );

      setIsSlideOpen(true);
    }

    if (action === "Delete") {
      deletestate(item.stateId);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "650px",
      }}
    >
      {/* ? TABLE HIDE WHEN SLIDE OPEN */}
      {!isSlideOpen && (
        <NewTable
          cols={StateMasterTable(showFormHandler, actions)}
          data={state}
          striped
          rows={25}
          title="State Master"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={template}
          rowwise={3}
          validate={() => {}}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
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

export default StateMaster;
