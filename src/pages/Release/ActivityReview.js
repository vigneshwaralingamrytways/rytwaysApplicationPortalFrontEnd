import React, { useEffect, useState, useCallback } from 'react';
import {
    CreateForm,
    PopupSimpleCard,
    Popupcard,
    Table,
    alertActions,
    classes,
    useDispatch,
    useFetch,
    useSelector,
    api,
    modalActions
} from '../../Components/CommonImports/CommonImports';
import ActivityReviewTable from './ActivityReviewTable';
import { generateToken } from '../../Components/GenerateToken';




const rowWiseFields = 1;

function ActivityReview(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
     
  const [data, setData] = useState ([ ]);
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


    const actions = ["Add","AddBooking","status","payment","document"];
    const showFormHandler = (item, action) => () => {
      console.log(action);
      
    };

    const template = {
        fields: [

            {
                title: "Comment",
                type: "text",
                name: "commentName",
                contains: "text",
                inpprops: {
                    // md:4,
                },
            },{
                type: "hidden",
                name: "commentId",
                contains: "text",
                inpprops: {
                 
                },
              },
          
          
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    const loadInitialCustomers = useCallback(async () => {

        const loadItemComment = await post(api+"/releaseTrackItem/loadTrackItemComments"  , {trackItemId:props?.selectedItem?.trackItemId,random : generateToken()})
        
       
        if(loadItemComment){
            setData(loadItemComment)
        }
    }, [get, post, response]);
  
    useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount
  
    
  
    const saveOrder = async (values) => {
        const newTransac = await post(api+"/releaseTrackItem/create"  , {...values,random : generateToken()})
        
          
          if(response.ok){
          setData([...data, newTransac]);
          dispatch(modalActions.hideModalHandler())
      AlertHandler("Comments Saved Successfully","success")
      
      }else{
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Comments Failed To Save","danger")
       
      }
      };
    function onSubmit(values) {
     
        
        values.commentType ="ActivityReleaseBug"
        values.trackItemId=props?.selectedItem?.trackItemId || ""
        values.commentStatus = "Open"
        saveOrder(values)


    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Comment"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={props.selectedItem}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>

<PopupSimpleCard md={12}>
        {<Table
          cols={ActivityReviewTable(showFormHandler, actions)}
          data={data}
          rows={10}
         
        />}
      </PopupSimpleCard>

            </Popupcard>

        </div>
    );
}

export default ActivityReview;


