import React, { useState, useEffect, useCallback } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewCustomer from "./NewCustomer";
import CustomerTable from "./CustomerTable";
import NewTable from "../../Components/NewTable/NewTable";

const ManageCustomers = () => {
  const dispatch = useDispatch();
  const { get, post, put, del, response } = useFetch({ data: [] });

  const [customers, setCustomers] = useState([]);
  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);

  /* ? Slide State */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  /* ---------------- Alert Handler ---------------- */
  const AlertHandler = useCallback((msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,
        alertMessage: msg,
        alertVariant: type,
      })
    );
  }, [dispatch]);

  const [customerCatagory, setcustomerCatagory] = useState([]);
  /* ---------------- Load Data ---------------- */
  const loadCustomerCategories = useCallback(async () => {
    try {
      const data = await get(
        `${api}/customerCatagory/getAll?t=${Date.now()}`
      );
      if (response.ok) {

        setcustomerCatagory(
          data.map((item) => (
            {
              value: item.customerCatagoryId,
              label: item.customerCatagory 
            }

          ))

        );
      }
    } catch (err) {
      console.log("Failed to load categories", err);
    }
  }, [get, response]);
  useEffect(() => {
    loadCustomerCategories();
  }, [loadCustomerCategories]);

  /* ---------------- Load States ---------------- */
  const loadStates = useCallback(async () => {
    try {
      const data = await get(api + "/state/getall?t=" + Date.now());
      console.log(" all state", data)
      if (data && Array.isArray(data)) {
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
  }, [get, response]);

  /* ---------------- Load Countries ---------------- */
  const loadCountries = useCallback(async () => {
    try {
      const data = await get(api + "/country/getall?t=" + Date.now());
      console.log(" all country", data)
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
  }, [get, response]);

  /* ---------------- Load Customers ---------------- */
  const loadCustomers = useCallback(async () => {
    try {
      const data = await get(api + "/customer/getall?t=" + Date.now());
      console.log(" all customer", data)
      if (data && Array.isArray(data)) {
        setCustomers(data);
      }
    } catch (err) {
      console.log("Failed to load customers", err);
    }
  }, [get, response]);
  useEffect(() => {
    loadStates();
    loadCountries();
  }, [loadStates, loadCountries]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  /* ---------------- Save Customer ---------------- */
  const saveCustomer = useCallback(async (values) => {
    try {
      let result;

      if (values.customerId) {
        result = await put(`${api}/customer/update/${values.customerId}?t=${Date.now()}`, values);
        console.log("update res", result)
        if (result) {
          // setCustomers(prev =>
          //   prev.map(c => (c.customerId === values.customerId ? result : c))
          // );
          await loadCustomers();
          AlertHandler("Customer updated successfully", "success");
        }
        else {
          AlertHandler("Customer updated failed", "danger");

        }
      } else {
        result = await post(`${api}/customer/create?t=${Date.now()}`, values);
        console.log("save res", result)
        if (result) {
          await loadCustomers();
          // setCustomers(prev => [...prev, result]);
          AlertHandler("Customer created successfully", "success");
        }
        else {
          AlertHandler("Customer creation failed", "danger");
        }
      }

      setIsSlideOpen(false);
      setActiveForm(null);
    } catch (err) {
      console.error("Save error:", err);
    }
  }, [post, put, api, loadCustomers]);
  /* ---------------- Filter Template ---------------- */
  const templateForFilter = {
    fields: [
      {
        title: "Customer Name",
        type: "text",
        name: "customerName",
        // validationProps: "Customer name is required",
      },
    ],
  };

  /* ---------------- Main Template ---------------- */
  const template = {
    fields: [
      {
        title: "Customer Name",
        type: "text",
        name: "customerName",
        validationProps: "Customer name is required",
      },
      {
        title: "Customer Code",
        type: "text",
        name: "customerCode",
        validationProps: "Customer Code is required",
      },

      {
        title: "Customer Catagory",
        type: "select",
        contains: "text",
        name: "customerCatagoryId",
        options: customerCatagory,
        validationProps: "Customer Catagory is required",
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
        validationProps: "pincode is required",
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
        validationProps: "GST NO is required",
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



  const validate = () => true;

  const onSubmit = (values) => {
    console.log("Search/filter values:", values);
  };



  /* ---------------- Add New Customer ---------------- */
  const handleAddCustomer = useCallback(() => {
    setActiveForm(
      <NewCustomer
        selectedItem={{}}
        onCancel={() => {
          setIsSlideOpen(false);
          setActiveForm(null);
        }}
        saveCustomer={saveCustomer}
        template={template}
      />
    );
    setIsSlideOpen(true);
  }, [saveCustomer, stateOptions, countryOptions]);

  /* ---------------- Edit Customer ---------------- */
  const handleEditCustomer = useCallback((customer) => {
    return () => {
      setActiveForm(
        <NewCustomer
          selectedItem={customer}
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
          }}
          saveCustomer={saveCustomer}
          template={template}
        />
      );
      setIsSlideOpen(true);
    };
  }, [saveCustomer, stateOptions, countryOptions]);

  /* ---------------- Delete Customer ---------------- */
  const handleDeleteCustomer = useCallback(async (customerId) => {
    try {
      await del(api + "/customer/delete/" + customerId);
      if (response.ok) {

        setCustomers((prev) => prev.filter((c) => c.customerId !== customerId));
        AlertHandler("Customer deleted successfully", "success");
      } else {
        AlertHandler("Failed to delete customer", "danger");
      }
    } catch (err) {
      console.log(err);

    }
  }, [del, AlertHandler]);

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
          cols={CustomerTable(handleEditCustomer, handleDeleteCustomer, state, country)}
          data={customers}
          striped
          title="Manage Customers"
          showPlusCircle={true}
          handleAddClick={handleAddCustomer}
          template={templateForFilter}
          rowwise={3}
          rows={10}
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
          transform: isSlideOpen ? "translateX(0%)" : "translateX(100%)",
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

export default ManageCustomers;
