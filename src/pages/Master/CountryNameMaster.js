import React, { useCallback, useEffect, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import CountryNameMasterTable from "./CountryNameMasterTable";
import NewTable from "../../Components/NewTable/NewTable";
import NewCountry from "./NewCountry";

const CountryNameMaster = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [country, SetCountry] = useState([]);

  // ? Slide State
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

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
        title: "Country Name",
        type: "text",
        name: "countryName",
        contains: "text",
        validationProps: "Country name is required",
      },
    ],
  };

  // ? Load Countries
  const loadcountries = useCallback(async () => {
    const allcountries = await get(api + "/country/getall");

    if (response.ok) {
      SetCountry(allcountries);
    } else {
      AlertHandler("failed to get the country", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadcountries();
  }, [loadcountries]);

  // ? Save Country
  const savecountry = async (val) => {
    if (val.countryId) {
      const updatecountry = await post(
        api + "/country/update/" + val.countryId,
        val
      );

      if (response.ok) {
        AlertHandler("country updated", "success");

        SetCountry((prev) =>
          prev.map((c) =>
            c.countryId === updatecountry.countryId ? updatecountry : c
          )
        );

        closeSlide();
      } else {
        AlertHandler("updation failed", "danger");
      }
    } else {
      const newcountry = await post(api + "/country/create", val);

      if (response.ok) {
        AlertHandler("country saved", "success");
        SetCountry([...country, newcountry]);

        closeSlide();
      } else {
        AlertHandler("country not saved", "danger");
      }
    }
  };

  // ? Delete Country
  const deletecountry = async (countryId) => {
    const deleted = await del(api + "/country/deleteone/" + countryId);

    if (response.ok) {
      AlertHandler("country deleted", "success");
      SetCountry((prev) => prev.filter((c) => c.countryId !== countryId));
    } else {
      AlertHandler("Failed to delete country", "danger");
    }
  };

  // ? Search
  const searchDetails = async (values) => {
    try {
      const returnObject = await post(
        api + "/country/searchcountry",
        values
      );

      if (returnObject.length > 0) {
        SetCountry(returnObject);
      } else {
        SetCountry([]);
      }
    } catch (err) {
      SetCountry([]);
    }
  };

  function onSubmit(values) {
    searchDetails(values);
  }

  // ? Close Slide
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  // ? Slide Popup Handler
  const actions = ["Edit", "Delete"];

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    if (action === "Add" || isEdit) {
      setActiveForm(
        <NewCountry
          selectedItem={formData}
          onCancel={closeSlide}
          saveCountry={savecountry}
          template={template}
          validate={() => {}}
        />
      );

      setIsSlideOpen(true);
    }

    if (action === "Delete") {
      deletecountry(item.countryId);
    }
  };

  return (
    <div className={classes.container}>
      {/* ? TABLE disappears when Slide opens */}
      {!isSlideOpen && (
        <NewTable
          cols={CountryNameMasterTable(showFormHandler, actions)}
          data={country}
          striped
          rows={25}
          title="Country Master"
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

export default CountryNameMaster;
