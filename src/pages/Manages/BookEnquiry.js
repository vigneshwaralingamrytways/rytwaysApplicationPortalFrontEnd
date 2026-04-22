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
import Upload from "./Upload";
import NewEnquiry from "./NewEnquiry";
import BookEnquiryTable from "./BookEnquiryTable";

const BookEnquiry = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [Enquiry, setEnquiry] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  /* ? Slide Popup States */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert] = useSelector((state) => [state.alertProps.showAlert]);

  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  /* ---------------- Load Customers ---------------- */
  const loadCustomers = useCallback(async () => {

    try {
      const data = await get(`${api}/customer/getall?t=${Date.now()}`);

      if (response.ok) {
        setCustomerList([
          { label: "Select", value: "" },
          ...data.map((c) => ({
            label: c.customerName,
            value: c.customerId,
          })),
        ]);
      }
    }
    catch (e) {
      console.log(" err", e)
    }
  }, [get, response]);

  /* ---------------- Template ---------------- */
  const template = {
    fields: [
      {
        title: "Customer Type",
        type: "select",
        name: "customerType",
        options: [
          { label: "Select", value: "" },
          { label: "Existing Customer", value: "EXISTING" },
          { label: "New Customer", value: "NEW" },
        ],
        // defaultValue: "EXISTING",
        inpprops: {},
      },
      {
        title: "Customer Name",
        type: "select",
        name: "customerId",
        options: customerList,
        validationProps: "Customer is required",
        dynamic: {
          field: "customerType",
          value: "EXISTING",
        },
        inpprops: {},
      },
      {
        title: "Customer Name",
        type: "text",
        name: "customerName",
        validationProps: "Customer name is required",
        dynamic: {
          field: "customerType",
          value: "NEW",
        },
        inpprops: {},
      },
      {
        title: "Enquiry Date",
        type: "date",
        contains: "date",
        inpprops: {},
        name: "enquiryDate",
        // defaultValue: new Date().toISOString().split("T")[0],
        validationProps: "Enquiry date is required",
      },
      {
        title: "Enquiry Description",
        type: "text",
        name: "enquiryDescription",
        validationProps: "Description is required",
      },
    ],
  };

  /* ---------------- Filter Template ---------------- */
  const filterTemplate = {
    fields: [
      { title: "From Date", name: "fromDate", contains: "date", type: "date" },
      { title: "To Date", name: "toDate", contains: "date", type: "date" },
      {
        title: "Customer Name",
        name: "customerId",
        type: "select",
        options: customerList,
      },
    ],
  };

  /* ---------------- Load Enquiries ---------------- */
  const loadEnquiries = useCallback(async () => {
    try {
      const allEnquirys = await get(`${api}/bookEnquiry/getall?t=${Date.now()}`);

      if (allEnquirys) {
        setEnquiry(allEnquirys);
      }
    }
    catch (e) {
      console.log(" err", e)
    }
  }, [get, response]);

  useEffect(() => {
    loadEnquiries();
    loadCustomers();
  }, [loadEnquiries, loadCustomers]);

  /* ---------------- Save Enquiry ---------------- */
  const saveEnquiry = async (val) => {
    const value = { ...val };

    // if (value.customerType === "NEW") delete value.customerId;
    // if (value.customerType === "EXISTING") delete value.customerName;

    if (value.customerType === "EXISTING") {
      const selectedCust = customerList.find(c => String(c.value) === String(value.customerId));
      if (selectedCust) {
        value.customerName = selectedCust.label;
      }
    }
    if (value.enquiryId) {
      const updateEnquiry = await post(
        api + "/bookEnquiry/update/" + value.enquiryId,
        value
      );

      if (response.ok) {
        AlertHandler("Enquiry updated", "success");
        await loadCustomers();

        // setEnquiry((prev) =>
        //   prev.map((c) =>
        //     c.enquiryId === updateEnquiry.enquiryId
        //       ? updateEnquiry
        //       : c
        //   )
        // );

        await loadEnquiries();

        /* ? Close Slide */
        setIsSlideOpen(false);
      }
    } else {
      const newEnquiry = await post(api + "/bookEnquiry/create", value);

      if (response.ok) {
        AlertHandler("Enquiry saved", "success");

        // setEnquiry((prev) => [...prev, newEnquiry]);
        await loadEnquiries();
        await loadCustomers();
        /* ? Close Slide */
        setIsSlideOpen(false);
      }
    }
  };

  function validate() {
    return true;
  }

  /* ---------------- Delete Enquiry ---------------- */
  const deleteEnquiry = async (enquiryId) => {
    await del(api + "/bookEnquiry/delete/" + enquiryId);

    if (response.ok) {
      AlertHandler("Enquiry deleted", "success");

      setEnquiry((prev) =>
        prev.filter((c) => c.enquiryId !== enquiryId)
      );
    }
  };
  useEffect(() => {
    if (!isSlideOpen) {
      setActiveForm(null);
    }
  }, [isSlideOpen]);

  /* ---------------- Search Submit ---------------- */
  function onSubmit(values) {
    const { fromDate, toDate, customerId } = values;

    if (!fromDate && !toDate && !customerId) return;

    const filtered = Enquiry.filter((item) => {
      const customerMatch = customerId
        ? String(item.customerId) === String(customerId)
        : true;

      let dateMatch = true;
      if (item.enquiryDate) {
        const itemDate = new Date(item.enquiryDate).setHours(0, 0, 0, 0);
        const from = fromDate
          ? new Date(fromDate).setHours(0, 0, 0, 0)
          : null;
        const to = toDate
          ? new Date(toDate).setHours(0, 0, 0, 0)
          : null;

        dateMatch =
          (!from || itemDate >= from) &&
          (!to || itemDate <= to);
      }

      return customerMatch && dateMatch;
    });

    setEnquiry(filtered);
  }

  /* ---------------- Slide Handler ---------------- */
  const actions = ["Edit", "Delete", "Upload"];

  const showFormHandler = (item, action) => () => {
    if (action === "Delete") {
      deleteEnquiry(item.enquiryId);
      return;
    }

    if (action === "Add" || action === "Edit") {
      setActiveForm(
        <NewEnquiry
          // selectedItem={action === "Edit" ? item : {}}
          selectedItem={
            action === "Edit"
              ? {
                ...item,
                customerType: item.customerId ? "EXISTING" : "NEW",
                // enquiryDate: new Date().toISOString().split("T")[0]

              }
              : { enquiryDate: new Date().toISOString().split("T")[0] }
          }
          // selectedItem={
          //   action === "Edit"
          //     ? item
          //     : { enquiryDate: new Date().toISOString().split("T")[0] }}
          saveEnquiry={saveEnquiry}
          template={template}
          validate={validate}
          rows={4}
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
          }}
        />
      );

      setIsSlideOpen(true);
    }
  };

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        minHeight: "600px",
      }}
    >
      {/* ? Table */}
      <div
        style={{
          opacity: isSlideOpen ? 0 : 1,
          pointerEvents: isSlideOpen ? "none" : "auto",
          transition: "0.4s ease",
        }}
      >
        <NewTable
          cols={BookEnquiryTable(showFormHandler, actions)}
          data={Enquiry}
          striped
          rows={25}
          title="Book Enquirys"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={filterTemplate}
          rowwise={4}
          validate={validate}
          onSubmit={onSubmit}
          buttonName="Search"
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

export default BookEnquiry;
