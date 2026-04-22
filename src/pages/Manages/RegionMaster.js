import React, { useState, useEffect, useCallback } from "react";
import classes from "../Master/Master.module.css";
import { useDispatch } from "react-redux";
import RegionTable from "./RegionTable";
import NewTable from "../../Components/NewTable/NewTable";
import {
  api,
  useFetch,
  alertActions,
  useSelector,
} from "../../Components/CommonImports/CommonImports";
import NewRegion from "./NewRegion";
import NewTerms from "./NewTerm";
import NewDiscount from "./NewDiscount";

const rowWiseFields = 4;

function RegionMaster(props) {
  const { get, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [regions, setRegions] = useState([]);
  const [allRegions, setAllRegions] = useState([]);
  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  /* ? Slide State */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  /* ---------------- Alert Handler ---------------- */
  const AlertHandler = useCallback((alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  }, [dispatch]);

  /* ---------------- Save Region ---------------- */
  const regionSave = useCallback(async (Region) => {
    try {
      const newRegion = await post(`${api}/regionMaster/create?t=${Date.now()}`, Region);
      // const newRegion = await post(api + "/regionMaster/create", Region);

      if (response.ok) {
        if (Region.id) {
          setRegions((prev) =>
            prev.map((reg) => (reg.id === Region.id ? newRegion : reg))
          );
          AlertHandler("Region Updated Successfully", "success");
        } else {
          setRegions((prev) => [...prev, newRegion]);
          AlertHandler("Region Created Successfully", "success");
        }
        setIsSlideOpen(false);
        setActiveForm(null);
      } else {
        AlertHandler("Region Failed To Save", "danger");
      }
    } catch (err) {
      console.log(err);
      AlertHandler("Region Failed To Save", "danger");
    }
  }, [post, api, response, AlertHandler]);

  /* ---------------- Load Region ---------------- */
  const loadInitialRegion = useCallback(async () => {
    try {
      const initialRegions = await get(api + "/regionMaster/regionMaster");
      if (response.ok) {
        setAllRegions(initialRegions);
        setRegions(initialRegions);
      }
    } catch (err) {
      console.log("Failed to load regions", err);
    }
  }, [get, response]);

  /* ?? FIXED Add New Region - EMPTY DROPDOWNS GUARANTEED */
  const handleAddRegion = useCallback(() => {
    const resetKey = `add-${Date.now()}`; // Unique key every time

    setActiveForm(
      <NewRegion
        key={resetKey} // ? Forces complete remount
        selectedItem={{
          regionName: "",
          groupName: "",
          stateId: null,     // ? NULL = empty dropdown
          countryId: null,   // ? NULL = empty dropdown
          id: null
        }}
        onCancel={() => {
          setIsSlideOpen(false);
          setActiveForm(null);
        }}
        regionSave={regionSave}
      />
    );
    setIsSlideOpen(true);
  }, [regionSave]);

  /* ---------------- Edit Region ---------------- */
  const handleEditRegion = useCallback((region) => {
    return () => {
      const editKey = `edit-${region.id}-${Date.now()}`;

      setActiveForm(
        <NewRegion
          key={editKey} // ? Unique key for edit
          selectedItem={region} // ? Full region data
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
          }}
          regionSave={regionSave}
        />
      );
      setIsSlideOpen(true);
    };
  }, [regionSave]);

  /* ---------------- New Terms ---------------- */
  const handleNewTerms = useCallback((region) => {
    return () => {
      setActiveForm(
        <NewTerms
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
          }}
          selectedItem={region}
          regionSave={regionSave}
          regionId={region.id}
        />
      );
      setIsSlideOpen(true);
    };
  }, [regionSave]);

  /* ---------------- New Discount ---------------- */
  const handleNewDiscount = useCallback((region) => {
    return () => {
      setActiveForm(
        <NewDiscount
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
          }}
          selectedItem={region}
          regionId={region.id}
        />
      );
      setIsSlideOpen(true);
    };
  }, []);

  useEffect(() => {
    loadInitialRegion();
  }, [loadInitialRegion]);

  /* ---------------- Search Template ---------------- */
  const template = {
    fields: [
      {
        title: "Region Name",
        type: "text",
        name: "regionName",
        contains: "text",
        inpprops: {},
      },
    ],
  };

  function validate() {
    return true;
  }

  function onSubmit(values) {
    const { regionName } = values;
    const filtered = allRegions.filter((region) => {
      if (!regionName) return true;
      return region.regionName
        ?.toLowerCase()
        .includes(regionName.toLowerCase());
    });
    setRegions(filtered);
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
          cols={RegionTable(handleEditRegion, handleNewTerms, handleNewDiscount, regions)}
          data={regions}
          striped
          rows={25}
          title="Region Search"
          showPlusCircle={true}
          handleAddClick={handleAddRegion} // ? Fixed - Always empty form
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
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
}

export default RegionMaster;
