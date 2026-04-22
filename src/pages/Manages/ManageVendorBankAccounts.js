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
import ManageVendorBankAccountsTable from "./ManageVendorBankAccountsTable";
import NewVendorBankAccounts from "./NewVendorBankAccounts";

const ManageVendorBankAccounts = (props) => {
  const { get, del, put, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [company, setCompany] = useState([]);
  const [allBankAccounts, setAllBankAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);

  /* ? Slider State */
  const [showSlider, setShowSlider] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  /* Alert Handler */
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  /* Load Vendor Bank Accounts */
  const loadBankAccounts = useCallback(async () => {
    const data = await get(api + "/companyBankAccounts/getAll");

    if (response.ok && Array.isArray(data)) {
      const vendorOnly = data.filter(
        (item) => item.referenceType === "VENDOR"
      );
      setAllBankAccounts(vendorOnly);
      setFilteredAccounts(vendorOnly);
    }
  }, [get, response]);

  useEffect(() => {
    loadBankAccounts();
  }, [loadBankAccounts]);

  /* Load Vendors */
  const loadVendor = useCallback(async () => {
    const res = await get(api + "/customer/getall");
    if (response.ok && Array.isArray(res)) {
      const data = res.filter((item) => item.referenceType === "VENDOR");
      setCompany([
        { label: "Select", value: "" },
        ...data.map((item) => ({
          label: item.customerName,
          value: item.customerId,
        })),
      ]);
    }
  }, [get, response]);

  useEffect(() => {
    loadVendor();
  }, [loadVendor]);

  /* Save Vendor Bank Account */
  const saveBankAccount = async (values) => {
    const val = {
      ...values,
      referenceType: "VENDOR",
      customer: {
        customerId: values.referenceId,
      },
    };

    /* Update */
    if (values.companyBankAccountId) {
      const updated = await put(
        api + "/companyBankAccounts/update/" + val.companyBankAccountId,
        val
      );

      if (response.ok) {
        AlertHandler("Bank account updated successfully", "success");

        // setAllBankAccounts((prev) =>
        //   prev.map((acc) =>
        //     acc.companyBankAccountId === updated.companyBankAccountId
        //       ? updated
        //       : acc
        //   )
        // );

        // setFilteredAccounts((prev) =>
        //   prev.map((acc) =>
        //     acc.companyBankAccountId === updated.companyBankAccountId
        //       ? updated
        //       : acc
        //   )
        // );

        await loadBankAccounts()
        setShowSlider(false);
      } else {
        AlertHandler("Update failed", "danger");
      }
    }

    /* Create */
    else {
      const created = await post(api + "/companyBankAccounts/create", val);

      if (response.ok) {
        AlertHandler("Bank account saved successfully", "success");
        await loadBankAccounts()
        // setAllBankAccounts((prev) => [...prev, created]);
        // setFilteredAccounts((prev) => [...prev, created]);

        setShowSlider(false);
      } else {
        AlertHandler("Save failed", "danger");
      }
    }
  };

  /* Delete Vendor Bank Account */
  const deleteBankAccount = async (id) => {
    await del(api + "/companyBankAccounts/delete/" + id);

    if (response.ok) {
      AlertHandler("Bank account deleted successfully", "success");

      setAllBankAccounts((prev) =>
        prev.filter((acc) => acc.companyBankAccountId !== id)
      );

      setFilteredAccounts((prev) =>
        prev.filter((acc) => acc.companyBankAccountId !== id)
      );
    }
    else {
      AlertHandler("Bank account delete failed", "danger");

    }
  };

  /* Search Filter */
  const onSubmit = (values) => {
    const accountNo = values.accountNo?.toLowerCase() || "";

    if (!accountNo) {
      setFilteredAccounts(allBankAccounts);
      return;
    }

    const filtered = allBankAccounts.filter((acc) =>
      acc.accountNo?.toLowerCase().includes(accountNo)
    );

    setFilteredAccounts(filtered);
  };

  /* Form Template */
  const template = () => ({
    fields: [
      {
        title: "Vendor Name",
        type: "select",
        name: "referenceId",
        validationProps: "Vendor name is required",
        options: company,
      },
      {
        title: "Bank Name",
        type: "text",
        name: "bankName",
      },
      {
        title: "Account No",
        type: "text",
        name: "accountNo",
        inpprops: {
          required: true,
          pattern: {
            value: /^\d{9,18}$/,
            message: "Account number must be 9 to 18 digits",
          },
        },
      },
      {
        title: "IFSC Code",
        type: "text",
        name: "ifscCode",
        inpprops: {
          required: true,
          pattern: {
            value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
            message: "Invalid IFSC format (e.g., SBIN0123456)",
          },
        },
      },
      {
        title: "Address",
        type: "text",
        name: "address",
      },
      {
        title: "Contact Person",
        type: "text",
        name: "contactPerson",
      },
      {
        title: "Official Email ID",
        type: "text",
        name: "emailId",
        inpprops: {
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Invalid Email format"
          }
        },
      },
    ],
  });

  /* Filter Template */
  const templateforfilter = {
    fields: [
      {
        title: "Account No",
        type: "text",
        name: "accountNo",
      },
    ],
  };

  function validate() { }

  /* ? Slider Handler */
  const showFormHandler = (item, action) => () => {
    if (action === "Add") {
      setSelectedItem({});
      setShowSlider(true);
    }

    if (action === "Edit") {
      setSelectedItem({ ...item });
      setShowSlider(true);
    }
    if (action = "Delete") {
      deleteBankAccount(item.companyBankAccountId)
    }
  };

  const actions = ["Edit", "Add", "Delete"];

  return (
    <div className={classes.container}>
      {/* ? Slider Wrapper */}
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "650px",
          overflow: "hidden",
        }}
      >
        {/* ? Table View */}
        {!showSlider && (
          <NewTable
            cols={ManageVendorBankAccountsTable({
              showFormHandler,
              actions,
            })}
            data={filteredAccounts}
            striped
            rows={25}
            title="Manage Vendor Bank Accounts"
            showPlusCircle={true}
            handleAddClick={showFormHandler({}, "Add")}
            template={templateforfilter}
            validate={validate}
            onSubmit={onSubmit}
            onCancel={props.onCancel}
            buttonName="Search"
          />
        )}

        {/* ? Sliding Form */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#fff",
            padding: "20px",
            overflowY: "auto",
            boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",

            transform: showSlider
              ? "translateX(0%)"
              : "translateX(100%)",
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {showSlider && (
            <NewVendorBankAccounts
              selectedItem={selectedItem}
              saveBankAccount={saveBankAccount}
              template={template()}
              validate={validate}
              rowWiseFields={4}
              onCancel={() => setShowSlider(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageVendorBankAccounts;
