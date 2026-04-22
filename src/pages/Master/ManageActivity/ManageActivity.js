import React, { useState, useEffect, useCallback } from "react";
import SimpleCard from "../../../UI/cards/SimpleCard";
import classes from "../ManageActivity/Master.module.css";
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from "../../../store/alert-slice";
import api from "../../../Api";
import useFetch from "use-http";

import ManageActivityTable from "./ManageActivityTable";
import { NewTable } from "../../../Components/CommonImports/CommonImports";
import RoleForm from "../../QueryAndSolution/RoleForm";

function ManageActivity(props) {
  const { post } = useFetch({ data: [] });

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  // ? SLIDE STATE
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  const searchFields = [
    {
      label: "Activity Name",
      type: "text",
      name: "activityName",
      required: true,
    },
  ];

  const [filters, setFilters] = useState({
    activityName: "",
  });

  const dispatch = useDispatch();

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
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

  // ? CLOSE SLIDE
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  // ===========================
  // LOAD DATA
  // ===========================

  const loadInitialCustomers = useCallback(async () => {
    const obj = await post(api + "/activityMaster/activityMaster", {
      rand: Math.random(),
    });

    if (obj.length > 0) {
      const sortedData = obj.sort((a, b) =>
        a.function?.process?.processName.localeCompare(
          b.function?.process?.processName
        )
      );

      setAllData(sortedData);
      setData(sortedData);
    }
  }, [post]);

  useEffect(() => {
    loadInitialCustomers();
  }, [loadInitialCustomers]);

  // ===========================
  // FILTER HANDLERS
  // ===========================

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = () => {
    const filtered = allData.filter((item) =>
      item.activityName
        .toLowerCase()
        .includes(filters.activityName.toLowerCase())
    );

    setData(filtered);
    handleClose();
  };

  // ===========================
  // ? SLIDE FORM HANDLER
  // ===========================

  const showFormHandler = (item, action) => () => {
    if (action === "add") {
      setActiveForm(
        <RoleForm
          selectedItem={{ ...item }}
          onCancel={closeSlide} // ? Slide Close
        />
      );

      setIsSlideOpen(true);
    }
  };

  return (
    <div className={classes.container}>
      {/* ? TABLE SHOW ONLY WHEN SLIDE CLOSED */}
      {!isSlideOpen && (
        <SimpleCard md={12}>
          <NewTable
            cols={ManageActivityTable(showFormHandler)}
            data={data}
            striped
            title="Manage Activity"
            showPlusCircle={true}
            handleAddClick={showFormHandler({}, "add")}
            searchFields={searchFields}
            handleFilterClick={handleFilterClick}
            anchorEl={anchorEl}
            handleClose={handleClose}
            filters={filters}
            handleFilterChange={handleFilterChange}
            setFilters={setFilters}
            handleApplyFilter={handleApplyFilter}
            filterColor={filters?.activityName ? "red" : "green"}
            rows={25}
          />
        </SimpleCard>
      )}

      {/* ? SLIDE POPUP FORM */}
      <div
        className={`${classes.sliderPopup} ${
          isSlideOpen ? classes.open : ""
        }`}
      >
        {activeForm}
      </div>
    </div>
  );
}

export default ManageActivity;
