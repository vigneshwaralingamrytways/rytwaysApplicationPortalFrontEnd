import React, { useCallback, useEffect, useState } from "react";
import {
  CreateForm,
  SimpleCard,
  Table,
  api,
  useFetch,
  alertActions,
  modalActions,
  useDispatch,
  useSelector,
  classes,
  Popupcard,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import NewParagraph from "./NewParagraph";
import NewDocuments from "./NewDocuments";
import DocumentsTable from "./DocumentsTable";
import NewFeilds from "./NewFeilds";
import GenerateDocument from "./GenerateDocument";

const CreateDocuments = (props) => {
  const { get, del, post, put, response, loading, error } = useFetch({
    data: [],
  });

  const dispatch = useDispatch();

  const [defaultValues, setDefaultValues] = useState({});

  const [documents, SetDocuments] = useState([]);
  const [allDocuments, SetAllDocuments] = useState([]);

  /* ? SLIDE STATE */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

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

  /* ---------------- TEMPLATE CODE UNCHANGED ---------------- */

  const templatefilter = {
    fields: [
      {
        title: "Documents Type",
        type: "select",
        name: "documentType",
        contains: "select",
        options: [
          { value: "", label: "select" },
          { value: "offerLetter", label: "offerLetter" },
          { value: "AppointmentLetter", label: "Appointment Letter" },
          { value: "JoiningLetter", label: "Joining Letter" },
          { value: "IncrementLetter", label: "Increment Letter" },
        ],
        validationProps: "Doc Type  is required",
      },
      {
        title: "Documents Title",
        type: "text",
        name: "documentTitle",
        contains: "text",
        validationProps: "Doc Title  is required",
      },
    ],
  };

  const template = (isEdit, isFeild, isPara) => {
    if (isPara) {
      return {
        fields: [
          {
            inpprops: { md: 12, rows: 20, minHeight: "300px" },
            title: "Paragraph",
            type: "textarea",
            name: "paragraphText",
            contains: "textarea",
            validationProps: "Paragraph is required",
          },
        ],
      };
    }

    if (isFeild) {
      return {
        fields: [
          {
            title: "Feild Name",
            type: "text",
            name: "feildName",
            validationProps: "Feild Name is required",
          },
          {
            title: "Feild Value",
            type: "text",
            name: "feildValue",
            validationProps: "Feild Value is required",
          },
        ],
      };
    }

    return {
      fields: [
        {
          title: "Documents Type",
          type: "select",
          name: "documentType",
          validationProps: "Document type is required",
          options: [
            { value: "", label: "select" },
            { value: "offerLetter", label: "offerLetter" },
            { value: "AppointmentLetter", label: "Appointment Letter" },
            { value: "JoiningLetter", label: "Joining Letter" },
            { value: "IncrementLetter", label: "Increment Letter" },
          ],
        },
        {
          title: "Document Title",
          type: "text",
          name: "documentTitle",
          validationProps: "Document Title is required",
        },
        {
          inpprops: { md: 12 },
          title: "Paragraph",
          type: "textarea",
          name: "paragraph",
          contains: "textarea",
          validationProps: "Paragraph is required",
        },
      ],
    };
  };

  function validate() {}

  function onSubmit(values) {
    let filteredData = [...allDocuments];

    if (!values?.documentType && !values?.documentTitle) {
      SetDocuments(filteredData);
      return;
    }

    filteredData = filteredData.filter((doc) => {
      const typeMatch = values.documentType
        ? doc.documentType === values.documentType
        : true;

      const titleMatch = values.documentTitle
        ? doc.documentTitle
            .toLowerCase()
            .includes(values.documentTitle.toLowerCase())
        : true;

      return typeMatch && titleMatch;
    });

    SetDocuments(filteredData);
  }

  const deleteDocument = async (item) => {
    const deleted = await del(api + "/document/delete/" + item.documentId);

    if (response.ok) {
      AlertHandler("documents is deleted", "success");
      SetDocuments((prev) =>
        prev.filter((c) => c.documentId !== item.documentId)
      );
    } else {
      AlertHandler("Failed to delete documents", "danger");
    }
  };

  const loadDocuments = useCallback(async () => {
    const res = await get(api + "/document/getAll/document?t=" + Date.now());

    if (Array.isArray(res)) {
      const result = Array.isArray(res) ? res : [];
      SetDocuments(result);
      SetAllDocuments(result);
    }
  }, [get, response]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  /* ? SLIDE CLOSE */
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  /* ? SHOW FORM HANDLER WITH SLIDE */
  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    const isPara = action === "Paragraph";
    const isFeild = action === "Feild";

    /* DELETE */
    if (action === "Delete") {
      deleteDocument(item);
      return;
    }

    /* ? SLIDE FORMS */
    let selectedComponent = null;

    if (action === "Add" || isEdit) {
      selectedComponent = (
        <NewDocuments
          selectedItem={item}
          isEdit={isEdit}
          isFeild={isFeild}
          defaultValues={defaultValues}
          onCancel={closeSlide}
          template={template(isEdit, isFeild, isPara)}
          validate={validate}
          rowwise={2}
          showFormHandler={showFormHandler}
          actions={actions}
          Title={isEdit ? "Edit Document" : "Add Document"}
          refreshData={loadDocuments}
        />
      );
    }

    if (action === "Paragraph") {
      selectedComponent = (
        <NewParagraph
          selectedItem={item}
          isPara={isPara}
          defaultValues={defaultValues}
          onCancel={closeSlide}
          template={template(isEdit, isFeild, isPara)}
          validate={validate}
          rowwise={2}
          showFormHandler={showFormHandler}
          actions={actions}
          Title="Add Paragraph"
        />
      );
    }

    if (action === "Feild") {
      selectedComponent = (
        <NewFeilds
          selectedItem={item}
          isFeild={isFeild}
          defaultValues={defaultValues}
          onCancel={closeSlide}
          template={template(isEdit, isFeild, isPara)}
          validate={validate}
          rowwise={2}
          showFormHandler={showFormHandler}
          actions={actions}
          Title="Add Feild"
        />
      );
    }

    if (action === "Generate") {
      selectedComponent = (
        <GenerateDocument
          document={item}
          selectedItem={item}
          defaultValues={defaultValues}
          onCancel={closeSlide}
          validate={validate}
        />
      );
    }

    /* ? OPEN SLIDE */
    setActiveForm(selectedComponent);
    setIsSlideOpen(true);
  };

  const actions = ["Edit", "Delete", "Add", "Feild", "Paragraph", "Generate"];

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "650px",
      }}
    >
      {/* ? TABLE */}
      {!isSlideOpen && (
        <NewTable
          cols={DocumentsTable(showFormHandler, actions)}
          data={documents}
          striped
          rows={25}
          title="Create Documents"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={templatefilter}
          rowwise={2}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
        />
      )}

      {/* ? SLIDE PANEL */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: 0,
          width: "100%",
          height: "calc(100% - 60px)",

          transform: isSlideOpen
            ? "translateX(0%)"
            : "translateX(110%)",

          transition: "transform 0.4s ease-in-out",
          overflowY: "auto",
        }}
      >
        {activeForm}
      </div>
    </div>
  );
};

export default CreateDocuments;
