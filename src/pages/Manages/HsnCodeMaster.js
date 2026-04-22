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
import HsnCodeTable from "./HsnCodeTable";
import NewHsnCode from "./NewHsnCode";

const HsnCodeMaster = () => {
  const { get, post, del, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [hsnCodes, setHsnCodes] = useState([]);

  /* ? Slide Popup States */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert] = useSelector((state) => [state.alertProps.showAlert]);

  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,  // ? FIXED: Always true
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  // ? FIXED: Clear form on mount
  useEffect(() => {
    setActiveForm(null);
  }, []);

  function validate() {}

  const template = {
    fields: [
      {
        title: "HSN Code",
        type: "text",
        name: "hsnCode",
        validationProps: "HSN code required",
      },
    ],
  };

  /* ---------------- Load HSN Codes ---------------- */
  const loadHsnCodes = useCallback(async () => {
    const data = await get(api + "/hsnCode/getAllHsnCode");

    if (response.ok) {
      setHsnCodes(data);
    } else {
      AlertHandler("Failed to load HSN codes", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadHsnCodes();
  }, [loadHsnCodes]);

  /* ---------------- Save HSN Code ---------------- */
  const saveHsnCode = async (val) => {
    const res = await post(api + "/hsnCode/createHsnCode", val);

    if (response.ok) {
      AlertHandler("HSN Code saved", "success");

      if (val.hsnCodeId) {
        setHsnCodes((prev) =>
          prev.map((x) =>
            x.hsnCodeId === val.hsnCodeId ? res : x
          )
        );
      } else {
        setHsnCodes((prev) => [...prev, res]);
      }

      setIsSlideOpen(false);
      setActiveForm(null);  // ? FIXED: Clear after save
    }
  };

  /* ---------------- Delete HSN Code ---------------- */
  const deleteHsnCode = async (id) => {
    await del(api + "/hsnCode/delete/" + id);

    if (response.ok) {
      AlertHandler("HSN Code deleted", "success");
      setHsnCodes((prev) =>
        prev.filter((h) => h.hsnCodeId !== id)
      );
    }
  };

  /* ---------------- Slide Handler ---------------- */
  const showFormHandler = (item = {}, action) => () => {
    if (action === "Delete") {
      deleteHsnCode(item.hsnCodeId);
      return;
    }

    setActiveForm(
      <NewHsnCode
        key={`hsn-form-${Date.now()}`}  // ? FIXED: Unique key
        selectedItem={action === "Edit" ? item : {}}
        template={template}
        validate={validate}
        saveHsnCode={saveHsnCode}
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
          cols={HsnCodeTable({ showFormHandler, actions })}
          template={template}
          data={hsnCodes}
          striped
          rows={10}
          title="HSN Code Master"
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

export default HsnCodeMaster;
