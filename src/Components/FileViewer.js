import { useState, useEffect } from "react";
import Popupcard from "../UI/cards/Popupcard";
import { Button, Form, Spinner } from "react-bootstrap";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { useFetch } from "use-http";
import api from "../Api";
import { generateToken } from "./GenerateToken";
import { useDispatch, useSelector } from "react-redux";
import { alertActions } from "../store/alert-slice";

const FileViewer = ({
  fileUrl,
  fileType,
  fileName,
  rowData,
  showAcceptButton = false,
  onAccept,
  showBtn = true,
  showBottomLine = false
}) => {

    const { get, post,  cache,response, error } = useFetch({ data: [] });


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


  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Excel states
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);

  const lowerFile = fileName?.toLowerCase() || "";

  // ===== FILE TYPE DETECTION =====
  const isPdf = fileType?.includes("pdf") || lowerFile.endsWith(".pdf");

  const isImage =
    fileType?.startsWith("image/") ||
    /\.(png|jpg|jpeg|gif|bmp|webp)$/i.test(lowerFile);

  const isExcel = /\.(xlsx|xls)$/i.test(lowerFile);

  const isWord = /\.(doc|docx)$/i.test(lowerFile);

  const isPpt = /\.(ppt|pptx)$/i.test(lowerFile);

  const isOfficeFile = isWord || isPpt;

  const isTextFile = /\.(txt|csv|json)$/i.test(lowerFile);

  // ===== EFFECT =====
  useEffect(() => {
    if (isExcel) {
      loadExcelPreview();
    } else {
      setLoading(false);
    }
  }, [fileUrl]);

  // ===== EXCEL LOADER =====
  const loadExcelPreview = async () => {
    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      const workbook = XLSX.read(data, { type: "array" });

      const parsedSheets = workbook.SheetNames.map((name) => {
        const sheet = workbook.Sheets[name];
        return {
          name,
          html: XLSX.utils.sheet_to_html(sheet)
        };
      });

      setSheets(parsedSheets);
      setActiveSheet(0);
      setLoading(false);
    } catch (error) {
      console.error("Excel parsing error:", error);
      setLoading(false);
    }
  };

  // ===== OFFICE VIEWER URL =====
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    fileUrl
  )}`;


  const handleOriginalDownload = async (rowData) => {
    try {
        const docReport = await post(api + '/poQuotes/downloadFile', 
            {poQuotesId:rowData.poQuotesId,preview: false, "random" : generateToken()});
  
        // Log the entire response object for 
      
       
        if (docReport) {
           
       
  
              const blob = await response.blob();
              const fileType = blob.type || "";
              const fileName = rowData.fileName;
         
             
                //  DOWNLOAD DIRECTLY (Excel, Word)
                saveAs(blob, fileName);
            
          
        
        } else {
          AlertHandler("Error downloading the document", "danger");
            // console.log('Error downloading the document: Response data is undefined.');
        }
    } catch (error) {
        console.error('Error during download:', error);
    }
  };
  return (
    <Popupcard title="Preview File" showBtn={showBtn}>
      <div style={{ position: "relative", minHeight: "200px" }}>

        {/* ===== LOADER ===== */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spinner animation="border" />
          </div>
        )}

        {/* ===== PDF ===== */}
        {isPdf && (
          <iframe
            src={fileUrl}
            width="100%"
            height="800px"
            title="PDF Viewer"
            onLoad={() => setLoading(false)}
          />
        )}

        {/* ===== IMAGE ===== */}
        {isImage && (
          <div style={{ textAlign: "center" }}>
            <img
              src={fileUrl}
              alt="preview"
              style={{ maxWidth: "100%", maxHeight: "800px" }}
              onLoad={() => setLoading(false)}
            />
          </div>
        )}

        {/* ===== EXCEL (CUSTOM PREVIEW) ===== */}
        {isExcel && sheets.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #ccc",
                marginBottom: "10px",
                overflowX: "auto"
              }}
            >
              {sheets.map((sheet, index) => (
                <div
                  key={index}
                  onClick={() => setActiveSheet(index)}
                  style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    borderBottom:
                      activeSheet === index
                        ? "3px solid #007bff"
                        : "none",
                    fontWeight:
                      activeSheet === index ? "bold" : "normal",
                    whiteSpace: "nowrap"
                  }}
                >
                  {sheet.name}
                </div>
              ))}
            </div>

            <div
              style={{
                overflow: "auto",
                maxHeight: "750px",
                border: "1px solid #dee2e6",
                padding: "10px",
                background: "#fff"
              }}
              dangerouslySetInnerHTML={{
                __html: sheets[activeSheet]?.html
              }}
            />
          </div>
        )}

        {/* ===== WORD / PPT / OFFICE FILES ===== */}
        {isOfficeFile && (
          <iframe
            src={officeViewerUrl}
            width="100%"
            height="800px"
            title="Office Viewer"
            onLoad={() => setLoading(false)}
          />
        )}

        {/* ===== TEXT FILE ===== */}
        {isTextFile && (
          <iframe
            src={fileUrl}
            width="100%"
            height="800px"
            title="Text Viewer"
            onLoad={() => setLoading(false)}
          />
        )}

        {/* ===== FALLBACK ===== */}
        {!isPdf &&
          !isImage &&
          !isExcel &&
          !isOfficeFile &&
          !isTextFile &&
          !loading && (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <h5>Preview not available</h5>
              <p>This file type cannot be previewed.</p>
            </div>
          )}

        {/* ===== DOWNLOAD BUTTON ===== */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "10px"
          }}
        >
          <Button /* onClick={() => saveAs(fileUrl, fileName)} */
          onClick={() => handleOriginalDownload(rowData)}>
            Download
          </Button>
        </div>

        {/* ===== ACCEPT SECTION ===== */}
        {showBottomLine && (
          showAcceptButton ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "10px"
              }}
            >
              <strong style={{ color: "green" }}>
                {`Accepted By : ${localStorage.userName}`}
              </strong>
            </div>
          ) : (
            <>
              <Form.Check
                type="checkbox"
                label="I acknowledge and accept the document"
                checked={isChecked}
                onChange={(e) =>
                  setIsChecked(e.target.checked)
                }
                style={{
                  marginLeft: "25px",
                  marginTop: "10px"
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: "10px"
                }}
              >
                <Button onClick={onAccept} disabled={!isChecked}>
                  I Accept
                </Button>
              </div>
            </>
          )
        )}
      </div>
    </Popupcard>
  );
};

export default FileViewer;