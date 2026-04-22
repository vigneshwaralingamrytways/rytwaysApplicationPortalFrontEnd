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
import NewCustomerCatagory from "./NewCustomerCatagory";
import CustomerCatagoryTable from "./CustomerCatagoryTable";

const ManagecustomerCatagory = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [customerCatagory, setcustomerCatagory] = useState([]);
  const [showAlert] = useSelector((state) => [state.alertProps.showAlert]);

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

  /* ---------------- Templates ---------------- */
  const templatefilter = {
    fields: [
      {
        title: "Customer Category",
        type: "text",
        name: "customerCatagory",
        contains: "text",
      },
    ],
  };

  const template = {
    fields: [
      {
        title: "Customer Category",
        type: "text",
        name: "customerCatagory",
        contains: "text",
        validationProps: "Customer Category is required",
      },
      {
        title: "Description",
        type: "text",
        name: "description",
        contains: "text",
        validationProps: "Description is required",
      },
    ],
  };

  /* ---------------- Save Customer Category ---------------- */
  const savecustomerCatagory = useCallback(async (val) => {
    try {
      const result = await post(api + "/customerCatagory/create", val);

      if (response.ok) {
        if (val.customerCatagoryId) {
          setcustomerCatagory((prev) =>
            prev.map((x) =>
              x.customerCatagoryId === val.customerCatagoryId ? result : x
            )
          );
          AlertHandler("Customer Category updated", "success");
        } else {
          setcustomerCatagory((prev) => [...prev, result]);
          AlertHandler("Customer Category created", "success");
        }
        setIsSlideOpen(false);
        setActiveForm(null);
      } else {
        AlertHandler("Save failed", "danger");
      }
    } catch (err) {
      console.log(err);
      AlertHandler("Save failed", "danger");
    }
  }, [post, api, response, AlertHandler]);

  /* ---------------- Delete Customer Category ---------------- */
  const deletecustomerCatagory = useCallback(async (id) => {
    try {
      await del(`${api}/customerCatagory/delete/${id}?t=${Date.now()}`);
      if (response.ok) {
        setcustomerCatagory((prev) =>
          prev.filter((x) => x.customerCatagoryId !== id)
        ); AlertHandler("Customer Category deleted", "success");
      } else {
        AlertHandler("Delete failed", "danger");
      }
    } catch (err) {
      console.log(err);
      AlertHandler("Delete failed", "danger");
    }
  }, [del, response, AlertHandler]);

  /* ---------------- Load Data ---------------- */
  const loadCustomerCategories = useCallback(async () => {
    try {
      const data = await get(
        `${api}/customerCatagory/getAll?t=${Date.now()}`
      );
      if (response.ok) {
        setcustomerCatagory(data);
      }
    } catch (err) {
      console.log("Failed to load categories", err);
    }
  }, [get, response]);

  /* ---------------- Add New Category ---------------- */
  const handleAddCategory = useCallback(() => {
    setActiveForm(
      <NewCustomerCatagory
        selectedItem={{}}
        savecustomerCatagory={savecustomerCatagory}
        onCancel={() => {
          setIsSlideOpen(false);
          setActiveForm(null);
        }}
        template={template}
        validate={validate}
      />
    );
    setIsSlideOpen(true);
  }, [savecustomerCatagory, template]);

  /* ---------------- Edit Category ---------------- */
  const handleEditCategory = useCallback((item) => {
    return () => {
      setActiveForm(
        <NewCustomerCatagory
          selectedItem={item}

          savecustomerCatagory={savecustomerCatagory}
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
          }}
          template={template}
          validate={validate}
        />
      );
      setIsSlideOpen(true);
    };
  }, [savecustomerCatagory, template]);

  useEffect(() => {
    loadCustomerCategories();
  }, [loadCustomerCategories]);

  /* ---------------- Validate + Search ---------------- */
  const validate = () => true;

  const onSubmit = async () => {
    loadCustomerCategories();
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
      {/* ? Table View */}
      <div
        style={{
          transition: "0.4s ease",
          opacity: isSlideOpen ? 0 : 1,
          pointerEvents: isSlideOpen ? "none" : "auto",
        }}
      >
        <NewTable
          cols={CustomerCatagoryTable(handleEditCategory, deletecustomerCatagory)}
          data={customerCatagory}
          title="Manage Customer Category"
          showPlusCircle
          handleAddClick={handleAddCategory} // ? Direct function - No stale closure
          template={templatefilter}
          rowwise={2}
          validate={validate}
          onSubmit={onSubmit}
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

export default ManagecustomerCatagory;
