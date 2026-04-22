import React, { useCallback, useEffect, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  modalActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import NewProject from "./NewProject";
import ProjectTable from "./ProjectTable";

import Upload from "./Upload";
import NewBill from "./NewBill";
import ProjectProposal from "./ProjectProposal";

import { saveAs } from "file-saver";

const BookProject = (props) => {
  const { get, del, post, put, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [Project, setProject] = useState([]);

  const [customerList, setCustomerList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [projectCategoryList, setProjectCategoryList] = useState([]);
  const [projectTypeList, setProjectTypeList] = useState([]);

  // ? SLIDE STATES
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

  // ? FIXED VALIDATE FUNCTION
  const validate = () => {
    return true;
  };

  // ? CLOSE SLIDE
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  // ============================
  // LOAD DROPDOWNS
  // ============================

  const loadCustomers = useCallback(async () => {
    const data = await get(api + "/customer/getall?t=" + Date.now());
    if (response.ok) {
      setCustomerList(
        data.map((item) => ({
          label: item.customerName,
          value: item.customerId,
        }))
      );
    }
  }, [get, response]);

  const loadStatuses = useCallback(async () => {
    const data = await get(api + "/status/getAllByStatusType/PROJECT?t=" + Date.now());
    if (response.ok) {
      setStatusList(
        data.map((item) => ({
          label: item.statusName,
          value: item.statusId,
        }))
      );
    }
  }, [get, response]);

  const loadProjectCategories = useCallback(async () => {
    const data = await get(api + "/projectCategory/getall?t=" + Date.now());
    if (response.ok) {
      setProjectCategoryList(
        data.map((item) => ({
          label: item.projectCatagoryName,
          value: item.projectCatagoryId,
        }))
      );
    }
  }, [get, response]);

  const loadProjectTypes = useCallback(async () => {
    const data = await get(api + "/projectType/getall?t=" + Date.now());
    if (response.ok) {
      setProjectTypeList(
        data.map((item) => ({
          label: item.projecTypeName,
          value: item.projectTypeId,
        }))
      );
    }
  }, [get, response]);

  useEffect(() => {
    loadCustomers();
    loadStatuses();
    loadProjectCategories();
    loadProjectTypes();
  }, []);

  // ============================
  // TEMPLATE
  // ============================

  const templatefilter = {
    fields: [
      {
        title: "Customer Name",
        type: "select",
        name: "customerId",
        options: customerList,
      },
      {
        title: "Project Name",
        type: "text",
        name: "projectName",
      },
      {
        title: "Project Category",
        type: "select",
        name: "projectCategoryId",
        options: projectCategoryList,
      },
      {
        title: "From Date",
        type: "date",
        name: "fromDate",
      },
      {
        title: "To Date",
        type: "date",
        name: "toDate",
      },
    ],
  };

  const template = (isEdit = false) => ({
    fields: [
      {
        inpprops: {},
        title: "Proj Enq Date",
        type: "date",
        contains: "date",
        inpprops: { format: "dd/mm/yyyy" },
        name: "projectEnquiryDate",
      },
      {
        inpprops: {},
        title: "Customer Name",
        type: "select",
        name: "customerId",
        contains: "text",
        options: customerList,
      },
      {
        inpprops: {},
        title: "Project Name",
        type: "text",
        contains: "text",
        name: "projectName",
      },
      {
        inpprops: {},
        title: "Project Desc",
        type: "text",
        contains: "text",
        name: "projectDescription",
      },
      {
        inpprops: {},
        title: "Project Value",
        type: "number",
        contains: "number",
        name: "projectValue",
      },
      {
        inpprops: {},
        title: "Project Start Date",
        type: "date",
        contains: "date",
        inpprops: { format: "dd/mm/yyyy" },
        name: "projectStartDate",
        contains: "date",
      },
      {
        inpprops: {},
        title: "Project End Date",
        type: "date",
        contains: "date",
        inpprops: { format: "dd/mm/yyyy" },
        name: "projectEndDate",
        contains: "date",
      },

      ...(isEdit
        ? [{
          inpprops: {},
          title: "Status",
          type: "select",
          name: "statusId",
          options: statusList,
        },
        {
          title: "Invoiced Amount",
          type: "disabled",
          contains: "number",
          name: "invoicedAmount",
        },
        ]
        : []),
      // {
      //   inpprops: {},
      //   contains: "number",
      //   title: "Invoiced Amount",
      //   type: "number",
      //   name: "invoicedAmount",
      // },
      {
        inpprops: {},
        title: "Project Category",
        type: "select",
        name: "projectCategoryId",
        contains: "text",
        options: projectCategoryList,
      },
      {
        inpprops: {},
        title: "Project Type",
        type: "select",
        name: "projectTypeId",
        contains: "text",
        options: projectTypeList,
      },
    ],
  });

  // ============================
  // LOAD PROJECTS
  // ============================

  const loadProjects = useCallback(async () => {
    const allProjects = await get(api + "/manageProject/getall?t=" + Date.now());
    console.table(allProjects)
    if (response.ok) {
      setProject(allProjects);
    }
  }, [get, response]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // ============================
  // SAVE PROJECT
  // ============================

  const saveProject = async (values) => {
    let res;
    console.log("valeues for save", values)
    if (values.projectId) {
      res = await put(api + "/manageProject/update/" + values.projectId, values);
      console.log(" update res:", res)
      if (response.ok) {
        await loadProjects();
        AlertHandler("Project Updated", "success");
        closeSlide();
      } else {
        AlertHandler("Project failed to update", "success");
        closeSlide();
      }

    } else {
      res = await post(api + "/manageProject/create?t=" + Date.now(), values);
      console.log(" save res:", res)
      if (response.ok) {
        await loadProjects();
        AlertHandler("Project created", "success");
        closeSlide();
      } else {
        AlertHandler("Project Failed to create", "danger");
        closeSlide();
      }

    }

    // ? close slide after save

  };

  // ============================
  // DELETE PROJECT
  // ============================

  const deleteProject = async (id) => {
    await del(api + "/manageProject/delete/" + id);

    if (response.ok) {
      AlertHandler("Project deleted", "success");
      loadProjects();
    }
    else {
      AlertHandler("Project delete failed", "danger");
    }
  };

  // ============================
  // SEARCH FILTER
  // ============================

  function onSubmit(values) {
    console.log("filter", values)
    const isSearchEmpty = !values.projectName &&
      !values.customerId &&
      !values.projectCategoryId &&
      !values.fromDate &&
      !values.toDate;

    if (isSearchEmpty) {
      loadProjects();
      return;
    }
    let filtered = [...Project];
    if (values.projectName && values.projectName.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.projectName.toLowerCase().includes(values.projectName.toLowerCase())
      );
    }
    if (values.customerId) {
      filtered = filtered.filter((p) =>
        String(p.customerId) === String(values.customerId)
      );
    }
    if (values.projectCategoryId) {
      filtered = filtered.filter((p) =>
        String(p.projectCategoryId) === String(values.projectCategoryId)
      );
    }
    if (values.fromDate) {
      const searchDate = new Date(values.fromDate).setHours(0, 0, 0, 0);
      filtered = filtered.filter((p) => {
        if (!p.projectStartDate) return false;
        return new Date(p.projectStartDate).setHours(0, 0, 0, 0) >= searchDate;
      });
    }
    if (values.toDate) {
      const searchDate = new Date(values.toDate).setHours(23, 59, 59, 999);
      filtered = filtered.filter((p) => {
        if (!p.projectStartDate) return false;
        return new Date(p.projectStartDate).setHours(0, 0, 0, 0) <= searchDate;
      });
    }
    // if (!values.projectName && !values.customerId && !values.projectCategoryId && !values.fromDate && !values.toDate) {
    //   loadProjects();
    //   return;
    // }
    console.log(filtered)
    setProject(filtered);
  }

  // ============================
  // PDF DOWNLOAD
  // ============================

  const handleProposalPdf = async (rowData) => {
    try {
      await get(api + `/manageProject/printProposal/${rowData.projectId}`);

      if (response.ok) {
        const blob = await response.blob();
        saveAs(blob, `Proposal_${rowData.projectName}.pdf`);
        AlertHandler("Proposal PDF Downloaded", "success");
      }
    } catch (err) {
      console.log("PDF Error:", err);
    }
  };

  // ============================
  // SHOW FORM HANDLER
  // ============================

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    // const formData = isEdit ? { ...item } : {};
    const getToday = () => {
      const d = new Date();
      return d.toISOString().split("T")[0];
    }
    const formData = isEdit
      ? { ...item }
      : {
        projectEnquiryDate: getToday(),
        projectStartDate: getToday(),
        projectEndDate: getToday()
      }
    // const d = new Date();
    // return d.toISOString().split("T")[0];

    // ? SLIDE FOR ADD + EDIT ONLY
    if (action === "Add" || isEdit) {
      setActiveForm(
        <NewProject
          selectedItem={formData}
          saveProject={saveProject}
          template={template(isEdit)}
          validate={validate}
          onCancel={closeSlide}
        />
      );

      setIsSlideOpen(true);
      return;
    }

    // DELETE
    if (action === "Delete") deleteProject(item.projectId);

    // PDF
    if (action === "Pdf") handleProposalPdf(item);

    // OTHER ACTIONS STILL MODAL
    if (action === "Upload") {
      setActiveForm(
        <Upload
          referenceId={item.projectId}
          referenceType="PROJECT"
          uploadTitle="PROJECT Upload"
          onCancel={closeSlide}
        />
      )
      setIsSlideOpen(true);
      return;
    }

    if (action === "Bill") {
      setActiveForm(
        <NewBill
          selectedItem={item}
          onCancel={closeSlide}
          actions={actions}
          loadProjects={loadProjects}
        />
      )
      setIsSlideOpen(true);
      return;
    }

    if (action === "ProjectProposal") {
      setActiveForm(
        <ProjectProposal
          selectedItem={item}
          onCancel={closeSlide}
        />
      )
      setIsSlideOpen(true);
      return;
    }
  };

  const actions = ["Edit", "Delete", "Upload", "Bill", "ProjectProposal", "Pdf"];

  // ============================
  // RETURN UI
  // ============================

  return (
    <div className={classes.container}>
      {/* ? TABLE SHOW ONLY WHEN SLIDE CLOSED */}
      {!isSlideOpen && (
        <NewTable
          cols={ProjectTable(showFormHandler, actions)}
          data={Project}
          striped
          rows={25}
          title="Manage Project"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={templatefilter}
          rowwise={3}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
        />
      )}

      {/* ? SLIDE POPUP */}
      <div
        className={`${classes.sliderPopup} ${isSlideOpen ? classes.open : ""
          }`}
      >
        {activeForm}
      </div>
    </div>
  );
};

export default BookProject;
