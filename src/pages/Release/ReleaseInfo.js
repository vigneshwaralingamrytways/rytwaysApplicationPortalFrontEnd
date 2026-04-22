import React, { useEffect, useCallback, useState, useContext, Suspense } from 'react';
import { FaRegCommentDots, FaHome, FaPlusCircle, FaSearch } from "react-icons/fa";
import { useHistory, useLocation } from "react-router-dom";
import classes from "./ReleaseInfo.module.css";
import DevPathLayout from "./DevPathLayout";
import {
    CreateForm,
    SearchCard, SimpleCard,
    Table, alertActions,
    api,
    modalActions,
    useDispatch,
    useFetch,
    useSelector, AuthContext
} from "../../Components/CommonImports/CommonImports";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import AddRelease from './AddRelease';
import AddActivity from './AddActivity';
import ActivityReview from './ActivityReview';
import AddNewActivity from './AddNewActivity';
import Spinner from '../../Components/loader/Spinner';
import { generateToken } from '../../Components/generateToken';



// Map devPath strings to their corresponding components
// Map devPath strings to their corresponding components
const componentMap = {
    "/master/customer": React.lazy(() => import("../Master/Customer/CustomerMaster")),
    "/sales/order": React.lazy(() => import("../Sales/NewOrder/OrderSearch")),
    "/sales/customerOrder" : React.lazy(() => import("../Sales/CoHdr/CoHdrSearch")),

    "/sales/reviewOrder" : React.lazy(() => import("../Sales/AddOrder/ReviewOrder/ReviewOrderSearch")),
    "/sales/orderApproval" : React.lazy(() => import("../Sales/AddOrder/ApprovalUI/OrderApprovalSearch")),
    "/sales/sendToProduction" : React.lazy(() => import("../Sales/SendToProduction/STPSearch")),
    "/sales/confirmOrder" : React.lazy(() => import("../Sales/ConfirmedOrder/ConfirmOrderSearch"))
};

const rowWiseFields = 1;
const rowWiseFieldsTwo = 3;
const rowColors = ["#fff"];
const ReleaseInfo = () => {


    const { post, get, response } = useFetch({ data: [] });

    const history = useHistory();
    const location = useLocation();

    const [selectedReleaseId, setSelectedReleaseId] = useState(null);
    const [previousPageReleaseId, setPreviousPageReleaseId] = useState(null);
    const [selectedDevPath, setSelectedDevPath] = useState(null);
    const [processOption, setProcessOption] = useState([{ value: "", label: "Select" }]);
    const [releases, setReleases] = useState([])
    const [activityList, setActivityList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
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


        if (loadOption) {
            setProcessOption([{ value: "", label: "Select" }, ...loadOption])
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
            <DevPathLayout onBack={() => setSelectedDevPath(null)}>
                <Suspense fallback={<Spinner />}>
                    <SelectedComponent />
                </Suspense>
            </DevPathLayout>
        );
    }


    const releaseSave = async (values) => {


        const saveUrl = values.releaseTrackId > 0 ? '/releaseTrack/create' : '/releaseTrack/create'

        const newDoc = await post(api + saveUrl, values)

        if (response.ok) {
            if (values.releaseTrackId) {
                setReleases(releases.map((doc) => doc.releaseTrackId === values.releaseTrackId ? values : doc))
                dispatch(modalActions.hideModalHandler())
                AlertHandler("Release Updated Successfully", "success")
            } else {
                setReleases([...releases, newDoc])
                dispatch(modalActions.hideModalHandler())
                AlertHandler("Release Created Succesfully", "success")
            }
        } else {
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Release Details Failed To Save", "danger")
        }
    }

    const releaseItemSave = async (values) => {
        const updatedValues = { ...values, releaseTrackId: selectedReleaseId, random: generateToken() }
        console.log("updated item ", updatedValues)

        const saveUrl = values.trackItemId > 0 ? '/releaseTrackItem/createTrackItem' : '/releaseTrackItem/createTrackItem'

        const newDoc = await post(api + saveUrl, updatedValues)

        if (response.ok) {


            setActivityList([...activityList, newDoc])
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Item Created Succesfully", "success")

        } else {
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Item Details Failed To Save", "danger")
        }
    }


    const actions = ["add", "Activity", "ActivityReview", "AddNewActivity"];
    const showFormHandler = (item, action) => () => {
        console.log(action);
        if (action === "add") {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: { ...item },
                    modalWidth: '24%',
                    modalLeft: '38%',
                    selectedForm: (
                        <AddRelease
                            onCancel={() => dispatch(modalActions.hideModalHandler())}
                            selectedItem={{ ...item }}

                            saveFunction={releaseSave}

                        />
                    ),
                    showModal: true,
                })
            );
        } if (action === "Activity") {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: { ...item },

                    selectedForm: (
                        <AddActivity
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
        if (action === "AddNewActivity") {
            dispatch(
                modalActions.showModalHandler({
                    selectedData: { ...item },

                    selectedForm: (
                        <AddNewActivity
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



    return (
        <div className={classes.container}>

            {/* Top Right Add Icon */}
         {/*    <div className={classes.topRightIcons}>
                {!selectedReleaseId && (
                    <FaPlusCircle
                        title="Add Release"
                        className={classes.addIcon}
                        style={{ color: "#28a745" }}
                        onClick={showFormHandler({}, actions[0])}
                    />
                ) }


                
            </div> */}

            {/* 
<div className={classes.topRightIcons}>
{!selectedReleaseId ? (
                    <FaPlusCircle
                        title="Add Release"
                        className={classes.addIcon}
                        style={{ color: "#28a745" }}
                        onClick={showFormHandler({}, actions[0])}
                    />
                ) : (
                    <FaPlusCircle
                        title="Add Activity"
                        className={classes.addIcon}
                        style={{ color: "#2c3e50" }}
                        onClick={() => console.log("Add Activity clicked")}
                    />
                )}
            </div> */}
            {/* All Releases */}
            {!selectedReleaseId ? (
                <>
                    <h2 className={classes.title}>All Releases</h2>
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
                        <h2 className={classes.title}>{selectedRelease?.name}</h2>
                    </div>

                    {/* Objective */}
                    <section className={classes.section}>
                        <h3 className={classes.subTitle}>Objective</h3>
                        <div
    className={classes.objective}
    dangerouslySetInnerHTML={{ __html: defaultValues.relObjective }}
  />
                        {/* <pre className={classes.objective}>{defaultValues.relObjective}</pre> */}
                        {/* <CreateForm
                            template={template}
                            rowwise={rowWiseFields}
                            rowColors={rowColors}
                            //   watchFields={[""]}
                            validate={validate}
                            onSubmit={onSubmit}
                            
                            defaultValues={defaultValues}

                            buttonName="Save"

                        ></CreateForm> */}
                    </section>

                    {/* Activities */}
                    <section className={classes.section}>
                        <div className={classes.businessHeader}>
                            <h3 className={classes.subTitle}>Business Activities</h3>
                            <div className={classes.businessHeaderIcons}>
                               {/*  <FaPlusCircle
                                    className={classes.businessHeaderIcon}
                                    title="Add New Business Activity"
                                    style={{ color: "#2c3e50" }}
                                    onClick={showFormHandler({}, actions[1])}
                                />
                                <FaSearch
                                    className={classes.businessHeaderIcon}
                                    title="Add Another Activity"
                                    style={{ color: "#007bff", marginLeft: "16px" }}
                                    onClick={showFormHandler({}, actions[3])}
                                /> */}
                            </div>
                        </div>


                        {activityList.length > 0 ? (
                            activityList.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={classes.cardRow}
                                    style={{ cursor: item.activity.devPath ? "pointer" : "default" }}

                                >
                                    <div className={classes.column}
                                        onClick={() => {
                                            console.log("path ==>", item.activity.devPath)
                                            if (item.activity.devPath && componentMap[item.activity.devPath]) {
                                                console.log("path ==>", item.activity.devPath)
                                                setSelectedDevPath(item.activity.devPath);
                                            }
                                        }}>
                                        <label>Activity</label>
                                        <span>{item.activity.activityName}</span>
                                    </div>
                                    <div className={classes.column}>
                                        <label>Description</label>
                                        <span>{item.activity.description}</span>
                                    </div>
                                    <div className={classes.column}>
                                        <label>Process</label>
                                        <span>{item.activity.function.process.processName}</span>
                                    </div>
                                    <div className={classes.column}>
                                        <label>Function</label>
                                        <span>{item.activity.function.functionName}</span>
                                    </div>

                                    <div className={classes.commentIconColumn}>
                                        <FaRegCommentDots style={{ color: "#4b6cb7" }} title="Add Comment" onClick={showFormHandler({ ...item }, actions[2])} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className={classes.emptyMessage}>No activities found for this release.</p>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default ReleaseInfo;
