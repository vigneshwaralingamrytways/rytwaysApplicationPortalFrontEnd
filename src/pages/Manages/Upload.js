import React, { useState, useEffect, useCallback } from 'react';
import SearchCard from '../../UI/cards/SearchCard';
import CreateForm from '../../Components/Forms/CreateForm';
import classes from '../Master/Master.module.css';
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from '../../store/alert-slice';
import { modalActions } from '../../store/modal-Slice';
import api, { downloadLink } from '../../Api';
import useFetch, { Provider } from "use-http";
import Popupcard from '../../UI/cards/Popupcard';
import UploadTable from './UploadTable';
import PopupSimpleCard from '../../UI/cards/PopupSimpleCard';
import Table from '../../Components/tables/Table';
import { NewTable } from '../../Components/CommonImports/CommonImports';
import { saveAs } from 'file-saver';
import { useRef } from "react";
import {
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaComment,
    FaDownload,
    FaHistory,
    FaEye,
    FaTimes,
    FaFile,
    FaFileExcel,
    FaFileAlt,
    FaImage,
    FaFilePowerpoint,
    FaFileWord,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import FileViewer from "../../Components/FileViewer";
const rowWiseFields = 3;
const rowcolumns = [2, 2, 3, 3, 3];
// --- helpers ----------------------------------------------------------------
const getFileExtension = (name) => (name || "").split(".").pop().toLowerCase();

function Upload(props) {
    const [showViewer, setShowViewer] = useState(false);
    const [viewerData, setViewerData] = useState(null);
    const [records, setRecords] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    // -- view popup state ---------------------------------------------------
    const [viewPopup, setViewPopup] = useState(null);   // record index
    const [viewBlobUrl, setViewBlobUrl] = useState(null);
    const [viewMimeType, setViewMimeType] = useState("");
    const [viewLoading, setViewLoading] = useState(false);

    // -- Excel sheet state (from FileViewer) --------------------------------
    const [sheets, setSheets] = useState([]);
    const [activeSheet, setActiveSheet] = useState(0);

    // keep track of blob URL to revoke on close
    const blobUrlRef = useRef(null);

    // const getDynamicFinancialYear = () => {
    //     const today = new Date();
    //     const month = today.getMonth() + 1;
    //     const year = today.getFullYear();

    //     let startYear, endYear;

    //     if (month < 4) {
    //         startYear = year - 1;
    //         endYear = year;
    //     } else {
    //         startYear = year;
    //         endYear = year + 1;
    //     }
    //     const startStr = startYear.toString().slice(-2);
    //     const endStr = endYear.toString().slice(-2);

    //     return startStr + endStr;
    // }
    // const dynamicFY = getDynamicFinancialYear();

    const { referenceId, referenceType, uploadTitle } = props;
    // const { regionId, uploadTitle, action } = props;

    const { get, post, del, put, response, loading, error } = useFetch({ cachePolicy: 'no-cache', data: [] });
    const [defaultValues, setDefaultValues] = useState({});
    const [data, setData] = useState([]);
    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);

    const [showModal, selectedForm, selectedData, modalWidth, modalLeft] = useSelector((state) => [
        state.modalProps.showModal,
        state.modalProps.selectedForm,
        state.modalProps.selectedData,
        state.modalProps.modalWidth,
        state.modalProps.modalLeft,
    ]);

    const dispatch = useDispatch();
    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };
    const handleView = async (rowData) => {
        // reset any previous state
        setSheets([]);
        setActiveSheet(0);
        setViewPopup(rowData);
        setViewBlobUrl(null);

        setViewMimeType("");
        setViewLoading(true);


        try {

            const res = await get(api + `/docsUpload/download/${rowData.generatedFileName}`);
            console.log(" resFor view File", res)

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                if (blobUrlRef.current) window.URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = url;

                const ext = getFileExtension(rowData.name || "");

                // parse Excel sheets before revealing the viewer
                if (["xls", "xlsx", "csv"].includes(ext)) {
                    await loadExcelPreview(blob);
                }

                setViewBlobUrl(url);
                setViewMimeType(blob.type || "");

                const now = new Date();
                const istDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);




            }
        } catch (err) {
            console.error("View error:", err);
        } finally {
            setViewLoading(false);
        }
    };

    const actions = ["Priceupload", "TermsUpload"];
    // const showFormHandler = (item, action) => () => { }
    // -- Excel parser (same logic as FileViewer) ----------------------------
    const loadExcelPreview = async (blob) => {
        try {
            const arrayBuffer = await blob.arrayBuffer();
            const data = new Uint8Array(arrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });
            const parsedSheets = workbook.SheetNames.map((name) => ({
                name,
                html: XLSX.utils.sheet_to_html(workbook.Sheets[name]),
            }));
            setSheets(parsedSheets);
            setActiveSheet(0);
        } catch (err) {
            console.error("Excel parsing error:", err);
        }
    };
    const template = {
        fields: [

            {
                title: "Upload Document",
                type: "Document",
                name: "file",
                contains: "Document",
                inpprops: {
                    md: 4,
                },
            },
            {
                title: "description",
                type: "textarea",
                name: "description",
                contains: "textarea",
                validationProps: "description is required",
                inpprops: {
                    md: 4
                },
            },


        ],
    };


    const loadInitialData = useCallback(async () => {
        const payload = { id: referenceId, docType: referenceType, random: Math.random() };
        // const result = await get(api + `/docsUpload/getUploadedFiles/${referenceId}`);
        const result = await get(`${api}/docsUpload/getUploadedFiles/${referenceId}?t=${Date.now()}`);
        // const result = await post(api + `/docsUpload/getDocsById`, payload);
        console.log(" res", result)
        if (response.ok && result) {
            setData(result);
            setRecords(result);
        }
        else {
            setData([]);
            setRecords([]);
        }
    }, [referenceId, referenceType, post, response]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handleDownload = async (rowData) => {
        try {

            const res = await get(api + `/docsUpload/download/${rowData.generatedFileName}`);
            if (response.ok) {
                const blob = await response.blob();
                saveAs(blob, rowData.fileName);
            } else {
                AlertHandler("Failed to download file", "danger");
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handlePreview = async (rowData) => {
        try {

            const res = await get(
                api + `/docsUpload/download/${rowData.generatedFileName}`
            );

            if (response.ok) {

                const blob = await response.blob();

                const url = window.URL.createObjectURL(blob);

                setViewerData({
                    fileUrl: url,
                    fileName: rowData.fileName,
                    fileType: blob.type,
                    rowData: rowData
                });

                setShowViewer(true);

            } else {
                AlertHandler("Preview failed", "danger");
            }


        } catch (err) {
            console.log(err);
        }
    };
    const handleDelete = async (rowData) => {
        const res = await post(api + `/docsUpload/deleteDocs`, rowData);
        if (response.ok) {
            setData(prev => prev.filter(item => item.docsId !== rowData.docsId));
            AlertHandler("Document Deleted Successfully", "success");
        } else {
            AlertHandler("Failed to delete document", "danger");
        }
    };
    const showFormHandler = (item, action) => () => {
        if (action === "view") {
            // handleView(item);
            handleDownload(item)
        } else if (action === "delete") {
            handleDelete(item);
        }
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    const handleUpload = async (values) => {
        console.log("Submit clicked! Values:", values);
        if (!values.file || values.file.length === 0) {
            AlertHandler("Please select a file to upload", "warning");
            return;
        }
        const formData = new FormData();
        console.log("line 1");
        formData.append("file", values.file[0]);
        console.log("line 2");
        formData.append("referenceId", referenceId);
        console.log("line 3");
        formData.append("remarks", values.description);
        console.log("line 4");
        formData.append("referenceType", referenceType);
        console.log("line 5");
        // formData.append("financialYear", dynamicFY)
        formData.append("financialYear", new Date().toISOString().split('T')[0]);
        console.log("line 6form data", formData);
        const res = await post(api + `/docsUpload/uploadFile?t=${Date.now()}`, formData);
        console.log("line 7 form data..", res)
        if (response.ok && res.retValues && res.retValues.status === 1) {
            console.log("resp is ok..", res)
            AlertHandler(res.retValues.message, "success");
            setData(prev => [...prev, res.retValues.invoiceDocs]);
        } else {
            console.log("res is failed ,,", res)
            AlertHandler("Upload Failed", "danger");
        }
    }
    const renderDocViewer = () => {

        // -- LOADING --
        if (viewLoading) {
            return (
                <div style={styles.docPlaceholder}>
                    <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.5 }}>?</div>
                    <div style={styles.docPlaceholderTitle}>Loading preview</div>
                </div>
            );
        }

        const record = viewPopup;
        // const lowerFile = (lowerFile || "").toLowerCase();
        const lowerFile = (record.fileName || record.name || "").toLowerCase();
        const ext = getFileExtension(lowerFile);
        console.log("File Name:", lowerFile, "Extension:", ext);
        // -- FILE TYPE FLAGS  (same as FileViewer) --
        const isPdf = viewMimeType?.includes("pdf") || lowerFile.endsWith(".pdf");
        const isImage = viewMimeType?.startsWith("image/") || /\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i.test(lowerFile);
        const isExcel = /\.(xlsx|xls)$/i.test(lowerFile);
        const isCsv = lowerFile.endsWith(".csv");
        const isWord = /\.(doc|docx)$/i.test(lowerFile);
        const isPpt = /\.(ppt|pptx)$/i.test(lowerFile);
        const isOfficeFile = isWord || isPpt;
        const isTextFile = /\.(txt|csv|json)$/i.test(lowerFile);
        const isVideo = viewMimeType?.startsWith("video/") || /\.(mp4|webm|ogg)$/i.test(lowerFile);

        // Office Online viewer URL (Word / PPT)
        const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(viewBlobUrl || "")}`;

        // no blob yet
        if (!viewBlobUrl) {
            return (
                <div style={styles.docPlaceholder}>
                    <div style={styles.docPlaceholderIcon}><FaFile /></div>
                    <div style={styles.docPlaceholderTitle}>Preview unavailable</div>
                    <div style={styles.docPlaceholderSub}>Could not load the file. Try downloading instead.</div>
                </div>
            );
        }

        // -- PDF --
        if (isPdf) {
            return (
                <iframe
                    src={viewBlobUrl}
                    style={{ width: "100%", height: "100%", border: "none", borderRadius: "10px" }}
                    title={lowerFile}
                    allow="fullscreen"
                />
            );
        }

        // -- IMAGE --
        if (isImage) {
            return (
                <div style={{
                    width: "100%", height: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "auto",
                }}>
                    <img
                        src={viewBlobUrl}
                        alt={lowerFile}
                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: "10px" }}
                    />
                </div>
            );
        }

        // -- EXCEL  (sheet tabs  same as FileViewer) --
        if (isExcel || isCsv) {
            if (sheets.length === 0) {
                return (
                    <div style={styles.docPlaceholder}>
                        <div style={styles.docPlaceholderIcon}><FaFileExcel style={{ color: "#4ade80" }} /></div>
                        <div style={styles.docPlaceholderTitle}>Parsing spreadsheet</div>
                    </div>
                );
            }
            return (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {/* Sheet tab bar */}
                    <div style={{
                        display: "flex",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                        overflowX: "auto",
                        flexShrink: 0,
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: "8px 8px 0 0",
                    }}>
                        {sheets.map((sheet, idx) => (
                            <div
                                key={idx}
                                onClick={() => setActiveSheet(idx)}
                                style={{
                                    padding: "8px 16px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                    fontSize: "13px",
                                    fontWeight: activeSheet === idx ? 700 : 400,
                                    color: activeSheet === idx ? "#fff" : "rgba(255,255,255,0.5)",
                                    borderBottom: activeSheet === idx
                                        ? "3px solid #667eea"
                                        : "3px solid transparent",
                                    transition: "all 0.15s",
                                }}
                            >
                                {sheet.name}
                            </div>
                        ))}
                    </div>
                    {/* Sheet content */}
                    <div
                        className="excel-preview-wrapper"
                        style={{
                            flex: 1,
                            overflow: "auto",
                            background: "#fff",
                            borderRadius: "0 0 10px 10px",
                            padding: "10px",
                        }}
                        dangerouslySetInnerHTML={{ __html: sheets[activeSheet]?.html }}
                    />
                </div>
            );
        }

        // -- WORD / PPT  via Office Online --
        if (isOfficeFile) {
            return (
                <iframe
                    src={officeViewerUrl}
                    style={{ width: "100%", height: "100%", border: "none", borderRadius: "10px" }}
                    title={lowerFile}
                    allow="fullscreen"
                />
            );
        }

        // -- TEXT / CSV / JSON --
        if (isTextFile) {
            return (
                <iframe
                    src={viewBlobUrl}
                    style={{ width: "100%", height: "100%", border: "none", borderRadius: "10px", background: "#fff" }}
                    title={lowerFile}
                />
            );
        }

        // -- VIDEO --
        if (isVideo) {
            return (
                <video controls style={{ width: "100%", borderRadius: "10px", maxHeight: "100%" }}>
                    <source src={viewBlobUrl} type={viewMimeType} />
                </video>
            );
        }

        // -- FALLBACK (coloured icon + name) --
        const iconMap = {
            pdf: <FaFile style={{ color: "#f87171" }} />,
            doc: <FaFileWord style={{ color: "#60a5fa" }} />,
            docx: <FaFileWord style={{ color: "#60a5fa" }} />,
            xls: <FaFileExcel style={{ color: "#4ade80" }} />,
            xlsx: <FaFileExcel style={{ color: "#4ade80" }} />,
            ppt: <FaFilePowerpoint style={{ color: "#fb923c" }} />,
            pptx: <FaFilePowerpoint style={{ color: "#fb923c" }} />,
            png: <FaImage style={{ color: "#a78bfa" }} />,
            jpg: <FaImage style={{ color: "#a78bfa" }} />,
            jpeg: <FaImage style={{ color: "#a78bfa" }} />,
            gif: <FaImage style={{ color: "#a78bfa" }} />,
            webp: <FaImage style={{ color: "#a78bfa" }} />,
        };
        return (
            <div style={styles.docPlaceholder}>
                <div style={styles.docPlaceholderIcon}>
                    {iconMap[ext] || <FaFileAlt />}
                </div>
                <div style={styles.docPlaceholderTitle}>{lowerFile}</div>
                <div style={styles.docPlaceholderSub}>
                    Preview not available for this file type.<br />
                    Use the Download button to open it locally.
                </div>
            </div>
        );
    };

    const styles = {
        page: {
            minHeight: "100vh",
            width: "100vw",
            marginLeft: 0,
            overflowX: "hidden",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)",
        },
        body: { padding: "20px 40px 30px 60px", boxSizing: "border-box" },
        backBtn: {
            display: "flex", alignItems: "center", gap: "8px",
            color: "rgba(255,255,255,0.55)", cursor: "pointer",
            fontSize: "13px", padding: "10px 18px", borderRadius: "12px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.11)", width: "fit-content",
        },
        container: {
            maxWidth: "1200px", margin: "0 auto",
            marginTop: "-28px", marginLeft: "10%", padding: "26px",
            borderRadius: "18px", background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)",
        },
        title: { color: "#fff", fontWeight: 700, marginBottom: "15px" },
        dropZone: {
            width: "98%",
            border: dragActive ? "2px dashed #667eea" : "2px dashed rgba(255,255,255,0.25)",
            borderRadius: "12px", padding: "20px", textAlign: "center",
            marginBottom: "10px", color: "#aaa", cursor: "pointer",
            transition: "border-color 0.2s", boxSizing: "border-box",
        },
        remarksTextarea: {
            width: "98%", minHeight: "70px", padding: "10px",
            borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)", color: "#fff",
            fontSize: "13px", fontFamily: "inherit", resize: "vertical",
            marginBottom: "15px", boxSizing: "border-box", outline: "none",
        },
        uploadActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" },
        tableScrollWrapper: {
            maxHeight: "420px", overflowY: "auto", overflowX: "auto",
            borderRadius: "10px", position: "relative", scrollbarWidth: "thin",
        },
        commentBadge: {
            marginLeft: "6px", fontSize: "10px", padding: "2px 6px",
            borderRadius: "10px", background: "#667eea", color: "#fff",
        },
        // -- overlays --
        popupOverlay: {
            position: "fixed", top: 0, right: 10,
            width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 99999,
        },
        // -- view popup --
        viewPopupBox: {
            width: "min(1100px, 90vw)", height: "min(680px, 88vh)",
            padding: "24px", borderRadius: "18px",
            background: "rgba(15,15,40,0.97)", backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex", flexDirection: "column", gap: "16px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            position: "relative", zIndex: 100000,
            marginLeft: "250px"
        },
        viewHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 },
        viewTitle: { color: "#fff", fontWeight: 700, fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" },
        viewBody: {
            flex: 1, borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        },
        closeBtn: {
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", borderRadius: "8px", padding: "6px 12px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "13px", fontFamily: "inherit",
        },
        // -- comment popup --
        commentPopupBox: {
            width: "min(860px, 90vw)", height: "min(520px, 85vh)", padding: "28px",
            borderRadius: "18px", background: "rgba(20,20,50,0.97)",
            backdropFilter: "blur(28px)", border: "1px solid rgba(255,255,255,0.18)",
            display: "flex", gap: "24px", boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            position: "relative", zIndex: 100000, overflow: "hidden",
        },
        commentLeft: {
            flex: 1, borderRight: "1px solid rgba(255,255,255,0.15)",
            paddingRight: "20px", display: "flex", flexDirection: "column", overflow: "hidden",
        },
        commentRight: { flex: 1, display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden" },
        commentItem: { padding: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "14px", color: "#ddd" },
        commentDate: { fontSize: "11px", color: "#888", marginTop: "4px" },
        textarea: {
            width: "100%", boxSizing: "border-box", minHeight: "70px", padding: "10px",
            borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px",
            resize: "vertical", fontFamily: "inherit", outline: "none",
        },
        // -- history popup --
        historyPopupBox: {
            width: "min(420px, 90vw)", maxHeight: "80vh", padding: "24px",
            borderRadius: "15px", background: "rgba(20,20,50,0.97)",
            backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
            position: "relative", zIndex: 100000,
            display: "flex", flexDirection: "column", gap: "12px",
        },
        historyItem: { padding: "8px", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "#ddd", fontSize: "14px" },
        historyDate: { fontSize: "12px", color: "#888" },
        // -- buttons --
        btnPrimary: {
            padding: "8px 16px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: "13px",
        },
        btnSecondary: {
            padding: "8px 16px", borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "transparent", color: "#aaa",
            cursor: "pointer", fontFamily: "inherit", fontSize: "13px",
        },
        // -- placeholder --
        docPlaceholder: {
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: "12px", color: "#aaa", textAlign: "center", padding: "40px",
        },
        docPlaceholderIcon: { fontSize: "64px", lineHeight: 1 },
        docPlaceholderTitle: { color: "#fff", fontWeight: 600, fontSize: "18px" },
        docPlaceholderSub: { fontSize: "13px", color: "#888", lineHeight: 1.6 },
    };
    const closeViewPopup = () => {
        setViewPopup(null);
        setViewBlobUrl(null);
        setViewMimeType("");
        setSheets([]);
        setActiveSheet(0);
        if (blobUrlRef.current) {
            window.URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
    };
    return (
        <div className={classes.container}>
            <Popupcard
                title={uploadTitle}
                showBack onBack={props.onCancel}


            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    // rowcolumns={rowcolumns}
                    validate={validate}
                    onSubmit={handleUpload}
                    onCancel={props.onCancel}
                    defaultValues={defaultValues}
                    buttonName="Save"

                ></CreateForm>
                <PopupSimpleCard>

                    <NewTable cols={UploadTable(showFormHandler, actions)}
                        data={data} striped
                        rows={10} />
                </PopupSimpleCard>
                {/* {viewPopup !== null && (
                    <div style={styles.popupOverlay} onClick={closeViewPopup}>
                        <div style={styles.viewPopupBox} onClick={(e) => e.stopPropagation()}>

                          
                            <div style={styles.viewHeader}>
                                <div style={styles.viewTitle}>
                                   
                                   { uploadTitle}
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        style={{ ...styles.btnPrimary, display: "flex", alignItems: "center", gap: "8px" }}
                                        onClick={() => { closeViewPopup(); handleDownload(viewPopup); }}
                                    >
                                        <FaDownload /> Download
                                    </button>
                                    <button style={styles.closeBtn} onClick={closeViewPopup}>
                                        <FaTimes /> Close
                                    </button>
                                </div>
                            </div>
 
                            <div style={styles.viewBody}>
                                {renderDocViewer()}
                            </div>

                        </div>
                    </div>
                )} */}

            </Popupcard>

        </div>
    );
}

export default Upload;


