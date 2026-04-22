import { Suspense, useCallback, useEffect, useState } from 'react';
import { FaHome, FaPrint } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import {
    CreateForm,
    alertActions,
    api,
    modalActions,
    useDispatch,
    useFetch,
    useSelector
} from "../../Components/CommonImports/CommonImports";
import { generateToken } from '../../Components/GenerateToken';
import Spinner from '../../Components/loader/Spinner';
import PdfViewer from '../../Components/PdfViewer';
import { moduleActions } from '../../store/module-slice';
import ActivityReview from './ActivityReview';
import DevPathLayout from "./DevPathLayout";
import ReleaseActionMenu from './ReleaseActionMenu';
import classes from "./ReleaseInformation.module.css";


// Map devPath strings to their corresponding components
const componentMap = {
   };


const rowWiseFields = 1;
const rowWiseFieldsTwo = 3;
const rowColors = ["#fff"];
const ReleaseInformation = () => {


    const { post, get, response } = useFetch({ data: [] });

    const history = useHistory();
    const location = useLocation();

    const [selectedReleaseId, setSelectedReleaseId] = useState(null);
    const [previousPageReleaseId, setPreviousPageReleaseId] = useState(null);
    const [selectedDevPath, setSelectedDevPath] = useState(null);
    const [processOption, setProcessOption] = useState([{ value: "", label: "Select" }]);
    const [statusOption, setStatusOption] = useState([{ value: "", label: "Select" }]);
    const [releases, setReleases] = useState([])
    const [activityList, setActivityList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [waiting, setWaiting] = useState(false);
    const [prevWatchValues, setPrevWatchValues] = useState([]);
    const [defaultValues, setDefaultValues] = useState({});

    const cardsPerPage = 4;


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

    /*   const releases = [
       { releaseTrackId: 1, name: "Release 1", description: "Customer Portal  Ordering and Tracking" },
       { releaseTrackId: 2, name: "Release 2", description: "Mobile App Enhancements" },
     ]; 
*/

    const loadInitialDatas = useCallback(async () => {
        const features = await post(api + "/releaseTrack/loadTrack", { random: generateToken() });

        const loadOption = await post(api + "/processMaster/loadOptions", { random: generateToken() });

        const loadStatusOption = await post(api + "/commentStatus/loadOptions", { random: generateToken() });


        if (loadOption) {
            setProcessOption([{ value: "", label: "Select" }, ...loadOption])
        }


        if (loadStatusOption) {
            setStatusOption([{ value: "", label: "Select" }, ...loadStatusOption])
        }

        if (features) {
            setReleases(features)
        }
    }, [get, response]);
    useEffect(() => { loadInitialDatas() }, [loadInitialDatas])
    /*  const activityList = [
         {
             track: {
                 objective: `Customers:
  Should be able to book orders across units and request a delivery date for order item
  Should be able to get confirmed delivery schedules and track progress
 
 Sri Pathi:
  Should be able to set up and enable customers for portal access
  Should be able to book orders for customers
  Should be able to review and accept orders with confirmed delivery schedule, price, and payment terms
  Handle order production prioritized by delivery schedule and provide detailed tracking across stages`,
             },
             trackItemId: 1,
             releaseTrackId: 1,
             activityId: 36,
             activity: {
                 activityName: "Onboard Customer",
                 description: "To onboard new customers and enable portal access",
                 devPath: "/master/customer",
                 function: {
                     functionName: "Order Handling",
                     process: {
                         processName: "Customer Relationship Management",
                     },
                 },
             },
         },
         {
             track: { objective: "" },
             trackItemId: 2,
             releaseTrackId: 1,
             activityId: 40,
             activity: {
                 activityName: "Book Order",
                 description: "Customer booking orders across units",
                 devPath: "/sales/neworder",
                 function: {
                     functionName: "Ordering and Tracking",
                     process: {
                         processName: "Customer Portal",
                     },
                 },
             },
         },
         {
             track: { objective: "" },
             trackItemId: 3,
             releaseTrackId: 1,
             activityId: 37,
             activity: {
                 activityName: "Book Order for Customer",
                 description: "Front office books orders for customers who prefer calling",
                 devPath: "",
                 function: {
                     functionName: "Order Handling",
                     process: {
                         processName: "Customer Relationship Management",
                     },
                 },
             },
         },
         {
             track: { objective: "" },
             trackItemId: 4,
             releaseTrackId: 1,
             activityId: 37,
             activity: {
                 activityName: "Review and Confirm",
                 description: "Sri Pathi reviews and confirms delivery schedule, price, and payment terms",
                 devPath: "",
                 function: {
                     functionName: "Order Handling",
                     process: {
                         processName: "Customer Relationship Management",
                     },
                 },
             },
         },
         {
             track: { objective: "" },
             trackItemId: 5,
             releaseTrackId: 1,
             activityId: 37,
             activity: {
                 activityName: "Approve Order",
                 description: "Management approves orders with required conditions",
                 devPath: "",
                 function: {
                     functionName: "Order Handling",
                     process: {
                         processName: "Customer Relationship Management",
                     },
                 },
             },
         },
     ];
  */


    const selectedRelease = releases.find(r => r.releaseTrackId === selectedReleaseId);
    // const filteredActivities = activityList?.filter(item => item.releaseTrackId === selectedReleaseId);
    /*   const filteredActivities = Array.isArray(activityList) && activityList.length > 0
    ? activityList.filter(item => item.releaseTrackId === selectedReleaseId)
    : [];
   */
    const objective = activityList[0]?.track?.objective || "No objective found";

    useEffect(() => {
        // Restore selected release when user comes back
        if (previousPageReleaseId && !selectedReleaseId) {
            setSelectedReleaseId(previousPageReleaseId);
            setPreviousPageReleaseId(null); // Clear after restoring
        }
    }, [location]);


    // If a devPath is selected, render it inside DevPathLayout
    if (selectedDevPath && componentMap[selectedDevPath]) {
        const SelectedComponent = componentMap[selectedDevPath];
        return (
            <DevPathLayout onBack={() => setSelectedDevPath(null)} onComment={() => alert("Comment icon clicked!")}>
                <Suspense fallback={<Spinner />}>
                <SelectedComponent selectedDevPath={selectedDevPath} componentMap={componentMap} setSelectedDevPath={setSelectedDevPath} />
                </Suspense>
            </DevPathLayout>
        );
    }


    const releaseItemSave = async (values) => {
        const updatedValues = { ...values, releaseTrackId: selectedReleaseId, random: generateToken() }
        console.log("updated item ", updatedValues)

        const saveUrl = values.trackItemId > 0 ? '/releaseTrackItem/createTrackItem' : '/releaseTrackItem/updateTrackItem'

        const newDoc = await post(api + saveUrl, updatedValues)

        if (response.ok) {
            if(newDoc.trackItemId){
                setActivityList(activityList.map((act) => act.trackItemId === values.trackItemId ? newDoc : act))
                dispatch(modalActions.hideModalHandler())
                AlertHandler("Item Updated Successfully","success")
              }else{

            setActivityList([...activityList, newDoc])
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Item Created Succesfully", "success")
              }
        } else {
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Item Details Failed To Save", "danger")
        }
    }


    const actions = ["ActivityReview" , "pdfReport"];
    const showFormHandler = (item, action) => () => {
        console.log(action);
        
        if (action === "ActivityReview") {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: { ...item },

                    selectedForm: (
                        <ActivityReview
                            onCancel={() => dispatch(modalActions.hideModalHandler())}
                            selectedItem={{ ...item }}
                            processOption={processOption}
                            saveFunction={releaseItemSave}

                        />
                    ),
                    showModal: true,
                })
            );
        }

        if(action === "pdfReport"){
            handleSingleViewPdf(item)
        }
       
    };
    const template = {
        fields: [


            { /*  legend: `${processTittle || "Details"}`, */

                title: "Objective",
                type: "richtext",
                name: "relObjective",
                contains: "richtext",
                //validationProps: "projectDescribtion is required",
                inpprops: {
                    // md: 3
                },
            }, {
                type: "hidden",
                name: "releaseTrackId",
                contains: "text",
                inpprops: {

                },
            }

        ],
    };


    const templateTwo = {
        fields: [


            { /*  legend: `${processTittle || "Details"}`, */

                title: "Release Note",
                type: "richtext",
                name: "releaseNote",
                contains: "richtext",
                //validationProps: "projectDescribtion is required",
                inpprops: {
                    // md: 3
                },
            }, {
                type: "hidden",
                name: "releaseTrackId",
                contains: "text",
                inpprops: {

                },
            }

        ],
    };


    const releaseUpdate = async (values) => {


        const saveUrl = values.releaseTrackId > 0 ? '/releaseTrack/update' : '/releaseTrack/update'

        const newDoc = await post(api + saveUrl, values)

        
        if (response.ok) {

            setDefaultValues(newDoc)
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Objective Updated Successfully", "success")

        } else {
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Objective Details Failed To Save", "danger")
        }
    }


    const loadobjectItemdata = async (relId) => {

        console.log(" rel id", relId)
        setSelectedReleaseId(relId)

        const features = await post(api + "/releaseTrack/loadTrackById", { releaseTrackId: relId, random: generateToken() });

        const loadItem = await post(api + "/releaseTrackItem/loadTrackItem", { releaseTrackId: relId, random: generateToken() });

        if (features) {
            console.log("values", features)
            setDefaultValues(features)
        }

        if (loadItem) {
            setActivityList(loadItem)
        }
    }
    const loadBack = async (relId) => {
        setSelectedReleaseId(null)
        setDefaultValues({})
    }


    const AddActivityDetail =  (item) => {
        

     

        dispatch(
            moduleActions.selectModuleId({
                
                activityId: item?.activityId,
              moduleId: item?.activity?.functionId,
              activityTittle: item?.activity.activityName,
              functionPath: item?.activity?.function?.functionPath,
              functionTittle: item?.activity?.function?.functionName,
              processTittle: item?.activity?.function?.process?.processName,
              
            })
          );

          console.log("item?.activity?.devLinkType", item?.activity?.devLinkType, "item?.activity?.devPath", item?.activity?.devPath )

          if (item?.activity?.devLinkType === "Sripathi Customer Portal") {
            if (item?.activity?.devPath) {
              window.open(item?.activity?.devPath, "_blank");
            } else {
              console.warn("URL not found");
            }
          } else {
            setSelectedDevPath(item?.activity?.devPath);
          }
          
        
    }

    function onSubmit(values) {
        // console.log(values);
        values.releaseTrackId = values.releaseTrackId || selectedReleaseId
        releaseUpdate(values)
    }
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;

        if (
            watchValues.some(
                (value, index) =>
                    value !== prevWatchValues[index] &&
                    value !== "" &&
                    value !== undefined
            )
        ) {

            setPrevWatchValues([...watchValues]);
        }
    }



    const handleDownload = async (item) => {
        try {
          const orderApi = "/jasperReports/releaseReportForEveryActivity";
          const returnObject = await post(api + orderApi, { releaseTrackId: selectedReleaseId, random: generateToken() });
      
          if (returnObject) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            return url; // Return the URL to be used in the modal
          }
        } catch (error) {
          console.error("Error downloading PDF:", error);
          throw error; // Rethrow the error for further handling
        }
      };
      
      const handleViewPdf = async () => {

        setWaiting(true);
        console.log("Called")
        try {
          // Fetch the PDF URL
          const pdfUrl = await handleDownload({ releaseTrackId: selectedReleaseId,activityId:36, random: generateToken()});
          setWaiting(false);
          // Dispatch the modal with the fetched PDF URL
          dispatch(
            modalActions.showModalHandler({
              selectedData: { releaseTrackId: selectedReleaseId, random: generateToken() },
              modalWidth: "92%",
              modalLeft: "6.5%",
              selectedForm: <PdfViewer pdfUrl={pdfUrl} />,
              showModal: true,
            })
          );
        } catch (error) {
          alert("Failed to load the PDF. Please try again."); // Notify the user about the failure
        }
      };
      


    const handleSingleDownload = async (item) => {
        try {
          const orderApi = "/jasperReports/releaseReport";
          const returnObject = await post(api + orderApi, { releaseTrackId: selectedReleaseId,activityId:item.activityId,issueType:"Activity", random: generateToken() });
      
          if (returnObject) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            return url; // Return the URL to be used in the modal
          }
        } catch (error) {
          console.error("Error downloading PDF:", error);
          throw error; // Rethrow the error for further handling
        }
      };
      
      const handleSingleViewPdf = async (item) => {

        setWaiting(true);

        console.log("Called")
        try {
          // Fetch the PDF URL
          const pdfUrl = await handleSingleDownload(item);
      
          setWaiting(false);

          // Dispatch the modal with the fetched PDF URL
          dispatch(
            modalActions.showModalHandler({
              selectedData: { releaseTrackId: selectedReleaseId, random: generateToken() },
              modalWidth: "92%",
              modalLeft: "6.5%",
              selectedForm: <PdfViewer pdfUrl={pdfUrl} />,
              showModal: true,
            })
          );
        } catch (error) {
          alert("Failed to load the PDF. Please try again."); // Notify the user about the failure
        }
      };

      

    return (
        <div className={classes.container}>

        {waiting && <Spinner />}
        
            {/* Top Right Add Icon */}
           {/*  <div className={classes.topRightIcons}>
                {!selectedReleaseId ? (
                    <FaPlusCircle
                        title="Add Release"
                        className={classes.addIcon}
                      
                    />
                ) : (
                     <FaPrint
                        title="Add Activity"
                        
                    /> 
                )}
            </div> */}
            {/* All Releases */}
            {!selectedReleaseId ? (
                <>
                    <h2 className={classes.title}>Release</h2>
                    <div className={classes.releaseList}>
                        {releases.map((release) => (
                            <div
                                key={release.releaseTrackId}
                                className={classes.releaseCard}
                                onClick={() => loadobjectItemdata(release.releaseTrackId)}
                            >
                                <h3 className={classes.releaseTitle}>{release.releaseName}</h3>
                                <p className={classes.releaseDescription}>{release.relDecription}</p>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* Header Row */}
                    <div className={classes.headerRow}>
                        <FaHome
                            className={classes.homeIcon}
                            title="Go Back to All Releases"
                            style={{
                                fontSize: "24px",
                                cursor: "pointer",
                                color: "#007bff",
                                marginRight: "12px",
                                filter: "drop-shadow(0 0 1px #007bff)",
                            }}
                            onClick={() => loadBack("test")}
                        />
                        <h2 className={classes.title}>{selectedRelease?.releaseName}</h2>
                    </div>

                    {/* Objective */}
                    <section className={classes.section}>
                        <h3 className={classes.subTitle}>Objective</h3>
                        <div
    className={classes.objective}
    dangerouslySetInnerHTML={{ __html: defaultValues.relObjective }}
  />
                    </section>
 
                  
<section className={classes.section}>
  <div className={classes.businessHeader}>
    <h3 className={classes.subTitle}>Business Activities</h3>
    <div className={classes.businessHeaderIcons}>

    <FaPrint
                        title="Print"
                        className={classes.businessHeaderIcon}
                        style={{ color: "#007bff" }}
                        onClick={handleViewPdf}
                    /> 

   
    </div>
  </div>

  {/* Column Headers */}
  <div className={classes.cardRowHeader}>
  <div className={classes.column}><strong>Activity</strong></div>
  <div className={classes.column}><strong>Description</strong></div>
  <div className={classes.column}><strong>Process</strong></div>
  <div className={classes.column}><strong>Function</strong></div>
  <div className={classes.column}><strong>Status</strong></div> {/* New Header */}
  <div className={classes.commentIconColumn}></div>
</div>


  {/* Row Data */}
  {activityList.length > 0 ? (
    activityList.map((item, idx) => (
      <div
        key={idx}
        className={classes.cardRow}
        style={{ cursor: item.activity.devPath  && ["Release test Ready","Prodcution Ready","Enhancement in Progress","E Unit test Ready","E Release test Ready"].includes(item.statusName) ? "pointer" : "default" }}
      >
        <div
          className={classes.column}
          onClick={() => {

            console.log("item?.activity?.devLinkType",item?.activity?.devLinkType , "item.activity.devPath",item.activity.devPath )
            if (item?.activity?.devLinkType === "Sripathi Customer Portal") {
                if (item?.activity?.devPath) {
                  window.open(item?.activity?.devPath, "_blank");
                } else {
                  console.warn("URL not found");
                }
              }else if (item.activity.devPath && componentMap[item.activity.devPath] && ["Release test Ready","Prodcution Ready","Enhancement in Progress","E Unit test Ready","E Release test Ready"].includes(item.statusName)) {
                AddActivityDetail(item);
            }
          }}
        >
          <span   style={{ color: ["Release test Ready","Prodcution Ready","Enhancement in Progress","E Unit test Ready","E Release test Ready"].includes(item.statusName) ? "blue" : "" }}>{item.activity.activityName}</span>
        </div>
        <div className={classes.column}>
          <span>{item.activity.description}</span>
        </div>
        <div className={classes.column}>
          <span>{item.activity.function.process.processName}</span>
        </div>
        <div className={classes.column}>
          <span>{item.activity.function.functionName}</span>
        </div>
        <div className={classes.column}> {/* New: Status column */}
        <span>{item.statusName}</span>
      </div>
      
        <div className={classes.commentIconColumn}>
          <ReleaseActionMenu rowData={item} showFormHandler={showFormHandler} />
        </div>
      </div>
    ))
  ) : (
    <p className={classes.emptyMessage}>No activities found for this release.</p>
  )}
</section>

<section className={classes.section}>
                        {/* <h3 className={classes.subTitle}>Objective</h3>
                        <pre className={classes.objective}>{objective}</pre> */}
                        <CreateForm
                            template={templateTwo}
                            rowwise={rowWiseFields}
                            rowColors={rowColors}
                            //   watchFields={[""]}
                            validate={validate}
                            onSubmit={onSubmit}
                            /*  onCancel={props?.onCancel} */
                            defaultValues={defaultValues}

                            buttonName="Save"

                        ></CreateForm>
                    </section>

                </>
            )}
        </div>
    );
};

export default ReleaseInformation;
