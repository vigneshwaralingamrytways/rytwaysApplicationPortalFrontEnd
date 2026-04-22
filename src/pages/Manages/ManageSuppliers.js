import React, { useState, useEffect, useCallback } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
  modalActions,
} from "../../Components/CommonImports/CommonImports";

import NewSupplier from "./NewSupplier";
import SupplierTable from "./SupplierTable";
import NewTable from "../../Components/NewTable/NewTable";

const ManageSuppliers = () => {
  const dispatch = useDispatch();
  const { get, post, del, response } = useFetch({ data: [] });

  const [suppliers, setSuppliers] = useState([]);

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);

  /* ? Slide State */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  /* ---------------- Load States ---------------- */
  const loadStates = useCallback(async () => {
    try {
      const data = await get(api + "/state/getall");
      if (data && Array.isArray(data)) {

        console.table(data);
        setStateOptions(
          data.map((item) => ({
            value: item.stateId,
            label: item.stateName,
          }))
        );
        setState(data);
      }
    } catch (err) {
      console.log("Failed to load states", err);
    }
  }, [get]);

  /* ---------------- Load Countries ---------------- */
  const loadCountries = useCallback(async () => {
    try {
      const data = await get(api + "/country/getall");
      if (data && Array.isArray(data)) {
        setCountryOptions(
          data.map((item) => ({
            value: item.countryId,
            label: item.countryName,
          }))
        );
        setCountry(data);
      }
    } catch (err) {
      console.log("Failed to load countries", err);
    }
  }, [get]);

  useEffect(() => {
    loadStates();
    loadCountries();
  }, [loadStates, loadCountries]);

  /* ---------------- Load Suppliers ---------------- */
  const loadSuppliers = useCallback(async () => {
    const data = await get(`${api}/supplier/getall?t=${Date.now()}`);
    if (data && Array.isArray(data)) {
      setSuppliers(data);
    }
  }, [get]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  /* ---------------- Validate ---------------- */
  const validate = () => {
    return true;
  };

  /* ---------------- Template ---------------- */
  const template = {
    fields: [
      {
        title: "Supplier Name",
        type: "text",
        name: "supplierName",
        validationProps: "Supplier name is required",
      },
      {
        title: "Address",
        type: "text",
        name: "address",
        // validationProps: "Address is required",
      },
      {
        title: "City",
        type: "text",
        name: "city",
        // validationProps: "City is required",
      },
      {
        title: "State",
        type: "select",
        name: "stateId",
        contains: "text",
        options: stateOptions,
        inpprops: {},
        // validationProps: "State name is required",
      },
      {
        title: "Country",
        inpprops: {},
        type: "select",
        name: "countryId",
        contains: "text",
        options: countryOptions,
      },
      {
        title: "PinCode",
        type: "text",
        name: "pincode",
        contains: "text",
        //  inpprops: { md: 2 },
        // validationProps: "pincode is required",
        inpprops: {
          pattern: {
            value: /^[1-9][0-9]{5}$/,
            message: "Invalid Pincode (Exactly 6 digits)"
          },
          maxlength: 6
        }
      },
      {
        title: "Contact No",
        type: "text",
        name: "contactNo",
        contains: "text",
        // validationProps: "Contact No is required",
        inpprops: {
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Invalid Mobile Number (10 digits starting with 6-9)"
          },
          maxlength: 10
        },
      },
      {
        title: "Email",
        type: "text",
        name: "email",
        // validationProps: "Email Id is required",
        inpprops: {
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Invalid Email format"
          }
        },
      },
      {
        title: "Contact Person",
        type: "text",
        name: "contactPerson",
      },
      {
        title: "GST No",
        type: "text",
        name: "gstNo",
        // validationProps: "GST NO is required",
        inpprops: {
          pattern: {
            value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/,
            message: "Invalid GST Format (e.g. 22AAAAA0000A1Z5)"
          }
        },
      },
      {
        title: "PAN No",
        type: "text",
        name: "panNo",
        // validationProps: "PAN NO is required",
        inpprops: {
          pattern: {
            value: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
            message: "Invalid PAN Format (e.g. ABCDE1234F)"
          }
        },
      }
    ],
  };

  /* ---------------- Filter Template ---------------- */
  const templatefilter = {
    fields: [
      {
        title: "Supplier Name",
        type: "text",
        name: "supplierName",
      },
    ],
  };

  /* ---------------- Save Supplier ---------------- */
  const saveSupplier = async (supplier) => {
    try {
      const res = await post(`${api}/supplier/create?t=${Date.now()}`, supplier);
      if (response.ok) {
        await loadSuppliers();
        setIsSlideOpen(false);
        setActiveForm(null);
        AlertHandler(

          supplier.supplierId
            ? "Supplier updated successfully"
            : "Supplier created successfully",
          "success"
        );


      }
      else {
        AlertHandler(

          supplier.supplierId
            ? "Supplier update failed"
            : "Supplier create failed",
          "danger"
        );
        await loadSuppliers();
        setIsSlideOpen(false);
        setActiveForm(null);
      }


    } catch (err) {
      AlertHandler("Supplier failed to save", "danger");
    }
  };

  /* ---------------- Delete Supplier ---------------- */
  const deleteSupplier = async (id) => {
    const deleted = await del(
      `${api}/supplier/delete/${id}?t=${Date.now()}`
    );

    if (response.ok) {
      AlertHandler("Supplier deleted", "success");
      await loadSuppliers();
    }
  };

  /* ---------------- Slide Form Handler ---------------- */
  const showFormHandler = (supplier, action) => () => {
    if (action === "Add" || action === "Edit") {
      setActiveForm(
        <NewSupplier
          selectedItem={supplier || {}}
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
          }
          } // ? Close Slide
          saveSupplier={saveSupplier}

          // onCancel={() => dispatch(modalActions.hideModalHandler())}
          validate={validate}
          template={template}
        />
      );

      setIsSlideOpen(true); // ? Open Slide
    }

    if (action === "Delete") {
      deleteSupplier(supplier.supplierId);
    }
  };

  const actions = ["Edit", "Delete"];

  function onSubmit(values) {
    console.log(values);
  }

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "600px",
        overflow: "hidden",
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
          cols={SupplierTable({ showFormHandler, actions })}
          data={suppliers}
          striped
          title="Manage Suppliers"
          showPlusCircle={true}
          handleAddClick={() => showFormHandler({}, "Add")()}
          rows={20}
          onSubmit={onSubmit}
          template={templatefilter}
          rowwise={3}
          showFilter={true}
          buttonName="Search"
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

export default ManageSuppliers;
