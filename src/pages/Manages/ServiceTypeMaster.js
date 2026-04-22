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
import ServiceTypeTable from "./ServiceTypeTable";
import NewServiceType from "./NewServiceType";

const ServiceTypeMaster = () => {
  const { get, post, del, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [serviceTypes, setServiceTypes] = useState([]);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);  // ? FIXED: Always null initially

  const [showAlert] = useSelector((state) => [state.alertProps.showAlert]);

  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,  // ? FIXED: Always true, not toggle
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  // ? FIXED: Clear form on component mount
  useEffect(() => {
    setActiveForm(null);
  }, []);

  function validate() {}

  const template = {
    fields: [
      {
        title: "Service Type Name",
        type: "text",
        name: "serviceTypeName",
        validationProps: "Service type name required",
      },
    ],
  };

  /* ---------------- Load Service Types ---------------- */
  const loadServiceTypes = useCallback(async () => {
    const data = await get(api + "/serviceType/getAllServiceType");

    if (response.ok) {
      setServiceTypes(data);
    }
  }, [get, response]);

  useEffect(() => {
    loadServiceTypes();
  }, [loadServiceTypes]);

  /* ---------------- Save Service Type ---------------- */
  const saveServiceType = async (val) => {
    const res = await post(api + "/serviceType/createServiceType", val);

    if (response.ok) {
      AlertHandler("Service Type saved", "success");

      if (val.serviceTypeId) {
        setServiceTypes((prev) =>
          prev.map((x) =>
            x.serviceTypeId === val.serviceTypeId ? res : x
          )
        );
      } else {
        setServiceTypes((prev) => [...prev, res]);
      }

      setIsSlideOpen(false);
      setActiveForm(null);  // ? FIXED: Clear form after save
    }
  };

  /* ---------------- Delete Service Type ---------------- */
  const deleteServiceType = async (id) => {
    await del(api + "/serviceType/delete/" + id);

    if (response.ok) {
      AlertHandler("Service Type deleted", "success");
      setServiceTypes((prev) =>
        prev.filter((s) => s.serviceTypeId !== id)
      );
    }
    else{
       AlertHandler("Service Type deleted failed", "danger");
    }
  };

  /* ---------------- Slide Form Handler ---------------- */
  const showFormHandler = (item = {}, action) => () => {
    if (action === "Delete") {
      deleteServiceType(item.serviceTypeId);
      return;
    }

    setActiveForm(
      <NewServiceType
        key={`form-${Date.now()}`}  // ? FIXED: Unique key prevents stale form
        validate={validate}
        selectedItem={action === "Edit" ? item : {}}
        template={template}
        saveServiceType={saveServiceType}
        onCancel={() => {
          setIsSlideOpen(false);
          setActiveForm(null);  // ? FIXED: Clear on cancel
        }}
      />
    );

    setIsSlideOpen(true);
  };

  const actions = ["Edit", "Delete"];

  function onSubmit(values) {
    console.log("Search/filter values:", values);
  }

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        minHeight: "500px",
      }}
    >
      {/* ? Table View */}
      <div
        style={{
          transition: "0.4s ease",
          opacity: isSlideOpen ? 0 : 1,
          pointerEvents: isSlideOpen ? "none" : "auto",
        }}
      >
        <NewTable
          cols={ServiceTypeTable({ showFormHandler, actions })}
          template={template}
          data={serviceTypes}
          striped
          rows={10}
          title={"Service Type"}
          showPlusCircle={true}
          rowwise={3}
          handleAddClick={showFormHandler({}, "Add")}
          onSubmit={onSubmit}
          buttonName="Search"
          validate={validate}
        />
      </div>

      {/* ? Slide Popup View */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background: "white",
          transform: isSlideOpen
            ? "translateX(0%)"
            : "translateX(100%)",
          transition: "0.4s ease-in-out",
          zIndex: 999,
          overflowY: "auto",
        }}
      >
        {activeForm}
      </div>
    </div>
  );
};

export default ServiceTypeMaster;
