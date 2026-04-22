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
import InvoiceTypeTable from "./InvoiceTypeTable";
import NewInvoiceType from "./NewInvoiceType";

const InvoiceTypeMaster = () => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [invoiceTypes, setInvoiceTypes] = useState([]);

  /* ? Slide State */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,  // Fixed: was !showAlert (toggle), now always true
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  function validate() { }

  const template = {
    fields: [
      {
        title: "Invoice Type Name",
        type: "text",
        name: "invoiceTypeName",
        contains: "text",
        validationProps: "Invoice type name required",
      },
    ],
  };

  /* ---------------- Load Invoice Types ---------------- */
  const loadInvoiceTypes = useCallback(async () => {
  const data = await get(api + "/invoiceType/getAllInvoiceType?t=" + Date.now());
    console.log("all invoice types", data)
    if (response.ok) {
      setInvoiceTypes(data);
    }
    else {
      AlertHandler("Failed to load invoice types", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadInvoiceTypes();
  }, [loadInvoiceTypes]);

  /* ---------------- Save Invoice Type ---------------- */
  const saveInvoiceType = useCallback(async (val, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      console.log("Saving data:", val);

      const res = await post(api + "/invoiceType/createInvoiceType", val);

      if (response.ok) {
        AlertHandler("Invoice Type Saved", "success");

        if (val.invoiceTypId) {
          setInvoiceTypes((prev) =>
            prev.map((x) =>
              x.invoiceTypId === val.invoiceTypId ? res : x
            )
          );
        } else {
          setInvoiceTypes((prev) => [...prev, res]);
        }

        setIsSlideOpen(false);
        setActiveForm(null);
       await loadInvoiceTypes();
      } else {
        AlertHandler("Save failed", "danger");
      }
    } catch (error) {
      console.log("Save error:", error);
      AlertHandler("Save failed", "danger");
    }
  }, [post, loadInvoiceTypes]);
  /* ---------------- Delete Invoice Type ---------------- */
  const deleteInvoiceType = useCallback(async (id) => {
    await del(api + "/invoiceType/delete/" + id);

    if (response.ok) {
      AlertHandler("Deleted successfully", "success");
      setInvoiceTypes((prev) =>
        prev.filter((i) => i.invoiceTypId !== id)
      );
       await loadInvoiceTypes();
    }
  }, [del, response]);

  /* ---------------- Slide Form Handlers - FIXED ---------------- */
  const handleAddInvoiceType = useCallback(() => {
    // ? FORCE EMPTY FORM - No prefill, unique key every time
    const resetKey = `add-invoice-${Date.now()}`;
    setActiveForm(
      <NewInvoiceType
        key={resetKey}  // ? CRITICAL: Forces complete remount, no stale state
        selectedItem={{}}  // Empty object
        validate={validate}
        onCancel={() => {
          setIsSlideOpen(false);
          setActiveForm(null);
        }}
        saveInvoiceType={saveInvoiceType}
        template={template}
      />
    );
    setIsSlideOpen(true);
  }, [saveInvoiceType]);

  const handleEditInvoiceType = useCallback((item) => {
    // ? EDIT with actual data, unique key
    const resetKey = `edit-invoice-${Date.now()}-${item.invoiceTypId}`;
    setActiveForm(
      <NewInvoiceType
        key={resetKey}  // ? Fresh component instance
        selectedItem={item}  // Correct edit data
        validate={validate}
        onCancel={() => {
          setIsSlideOpen(false);
          setActiveForm(null);
        }}
        saveInvoiceType={saveInvoiceType}
        template={template}
      />
    );
    setIsSlideOpen(true);
  }, [saveInvoiceType]);

  const handleDeleteInvoiceType = useCallback((item) => {
    deleteInvoiceType(item.invoiceTypId);
  }, [deleteInvoiceType]);

  const showFormHandler = (item = {}, action) => {
    if (action === "Delete") {
      handleDeleteInvoiceType(item);
      return;
    }

    if (action === "Add") {
      handleAddInvoiceType();
    } else if (action === "Edit") {
      handleEditInvoiceType(item);
    }
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
          cols={InvoiceTypeTable({
            showFormHandler,
            actions,
            handleEdit: handleEditInvoiceType,  // ? Pass direct handler if needed
            handleDelete: handleDeleteInvoiceType
          })}
          template={template}
          data={invoiceTypes}
          striped
          rows={10}
          title="Invoice Type"
          showPlusCircle={true}
          rowwise={3}
          handleAddClick={handleAddInvoiceType}  // ? Direct stable reference
          onSubmit={onSubmit}
          buttonName="Search"
          validate={validate}
        />
      </div>

      {/* ? Slide Popup */}
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

export default InvoiceTypeMaster;
