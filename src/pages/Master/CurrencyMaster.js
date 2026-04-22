import React, { useCallback, useEffect, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import CurrencyMasterTable from "./CurrencyMasterTable";
import NewCurrency from "./NewCurrency";
import NewTable from "../../Components/NewTable/NewTable";

const CurrencyMaster = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [currencies, setCurrencies] = useState([]);

  // ? Slide State
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

  // ? Alert Handler
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  // ? Template
  const template = {
    fields: [
      {
        title: "Currency Name",
        type: "text",
        name: "currencyName",
        contains: "text",
        validationProps: "Currency name is required",
      },
      {
        title: "Currency Rate",
        type: "number",
        name: "currencyRate",
        contains: "number",
        validationProps: "Currency rate is required",
      },
      {
        title: "Currency Symbol",
        type: "text",
        name: "currencySymbol",
        contains: "text",
        validationProps: "symbol name is required",
      },
    ],
  };

  // ? Load Currency
  const loadCurrencies = useCallback(async () => {
    const allcurencies = await get(api + "/currency/getall");

    if (response.ok) {
      setCurrencies(allcurencies);
    } else {
      AlertHandler("failed to get the currency", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadCurrencies();
  }, [loadCurrencies]);

  // ? Close Slide
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  // ? Save Currency
  const savecurency = async (val) => {
    if (val.id) {
      const updatcurrency = await post(
        api + "/currency/update/" + val.id,
        val
      );

      if (response.ok) {
        AlertHandler("currency updated", "success");

        setCurrencies((prev) =>
          prev.map((c) =>
            c.id === updatcurrency.id ? updatcurrency : c
          )
        );

        closeSlide();
      } else {
        AlertHandler("updation failed", "danger");
      }
    } else {
      const newcurency = await post(api + "/currency/create", val);

      if (response.ok) {
        AlertHandler("currency saved", "success");
        setCurrencies([...currencies, newcurency]);

        closeSlide();
      } else {
        AlertHandler("currency not saved", "danger");
      }
    }
  };

  // ? Delete Currency
  const deleteCurrency = async (id) => {
    await del(api + "/currency/delete/" + id);

    if (response.ok) {
      AlertHandler("Currency deleted", "success");
      setCurrencies((prev) => prev.filter((c) => c.id !== id));
    } else {
      AlertHandler("Failed to delete currency", "danger");
    }
  };

  // ? Search Currency
  const searchDetails = async (values) => {
    try {
      const returnObject = await post(
        api + "/currency/searchCurrency",
        values
      );

      if (returnObject.length > 0) {
        setCurrencies(returnObject);
      } else {
        setCurrencies([]);
      }
    } catch (err) {
      setCurrencies([]);
    }
  };

  function onSubmit(values) {
    searchDetails(values);
  }

  // ? Slide Popup Handler
  const actions = ["Edit", "Delete"];

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    if (action === "Add" || isEdit) {
      setActiveForm(
        <NewCurrency
          selectedItem={formData}
          onCancel={closeSlide}
          saveCurrency={savecurency}
          template={template}
          validate={() => {}}
        />
      );

      setIsSlideOpen(true);
    }

    if (action === "Delete") {
      deleteCurrency(item.id);
    }
  };

  return (
    <div className={classes.container}>
      {/* ? Table hides when slide opens */}
      {!isSlideOpen && (
        <NewTable
          cols={CurrencyMasterTable(showFormHandler, actions)}
          data={currencies}
          striped
          rows={25}
          title="Currency Master"
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

      {/* ? Slide Popup */}
      {isSlideOpen && (
        <div className="slidePopupContainer">
          {activeForm}
        </div>
      )}
    </div>
  );
};

export default CurrencyMaster;
