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
import SacCodeTable from "./SacCodeTable";
import NewSacCode from "./NewSacCode";

const SacCodeMaster = () => {
  const { get, post,put, del, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [SacCodes, setSacCodes] = useState([]);

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

  function validate() { }

  const template = {
    fields: [
      {
        title: "Sac Code",
        type: "text",
        contains:"text",
        name: "sacCode",
        validationProps: "Sac code required",
      },
    ],
  };

  /* ---------------- Load Sac Codes ---------------- */
  const loadSacCodes = useCallback(async () => {
    const data = await get(api + "/sacCode/getAll");

    if (response.ok) {
      setSacCodes(data);
    } else {
      //   AlertHandler("Failed to load Sac codes", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadSacCodes();
  }, [loadSacCodes]);

  /* ---------------- Save Sac Code ---------------- */
  const saveSacCode = async (val) => {

    let res;

    if (val.sacCodeId) {
      res = await put(api + `/sacCode/update/${val.sacCodeId}`, val);
    } else {
      res = await post(api + "/sacCode/create", val);
    }

    if (response.ok) {
      AlertHandler("Sac Code saved", "success");

      if (val.sacCodeId) {
        setSacCodes(prev =>
          prev.map(x =>
            x.sacCodeId === res.sacCodeId ? res : x
          )
        );
      } else {
        setSacCodes(prev => [...prev, res]);
      }

      setIsSlideOpen(false);
      setActiveForm(null);
    }
  };
  /* ---------------- Delete Sac Code ---------------- */
  const deleteSacCode = async (id) => {
    await del(api + "/sacCode/delete/" + id);

    if (response.ok) {
      AlertHandler("Sac Code deleted", "success");
      setSacCodes((prev) =>
        prev.filter((h) => h.sacCodeId !== id)
      );
    }
  };

  /* ---------------- Slide Handler ---------------- */
  const showFormHandler = (item = {}, action) => () => {
    if (action === "Delete") {
      deleteSacCode(item.sacCodeId);
      return;
    }

    setActiveForm(
      <NewSacCode
        key={`Sac-form-${Date.now()}`}  // ? FIXED: Unique key
        selectedItem={action === "Edit" ? item : {}}
        template={template}
        validate={validate}
        saveSacCode={saveSacCode}
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
          cols={SacCodeTable({ showFormHandler, actions })}
          template={template}
          data={SacCodes}
          striped
          rows={10}
          title="Sac Code Master"
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

export default SacCodeMaster;
