import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  // InputGroup,
  // FormControl
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import classes from "./CreateForm.module.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import AuthContext from "../../store/auth-context";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typeahead from "react-bootstrap-typeahead/types/core/Typeahead";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';


const getRowwise = (array, rowWise) => {
  let result = [],
    i = 0;
  while (i < array.length) result.push(array.slice(i, (i += rowWise)));
  //  i.log(result)
  return result;
};

const renderFields = (
    fields,
    rowwise,
    watchValues,
    register,
    errors,
    setValue,
    onBlurFuntion,rowColors, defaultRowColor
  ) => {
    const mdSize = parseInt(12 / rowwise);

    const groupedFields = fields.reduce((acc, field) => {
      acc[field.legend] = acc[field.legend] || [];
      acc[field.legend].push(field);
      return acc;
    }, {});
  
  
    return Object.entries(groupedFields).map(([legend, legendFields], index) => (
      <div key={index} style={legend && legend !== "undefined" ? { marginBottom: "10px", } : {}}>
        {/*padding: "0rem 6rem" */}
        {legend && legend !== "undefined" && (
          <fieldset style={{
            border: "1px solid black", backgroundColor: "#3d3c40", color: "white",
            borderRadius: ".5rem .5rem 0 0", display: "flex", justifyContent: "center"
          }}>
            <legend style={{
              display: "flex", justifyContent: "center"
            }}>{legend}</legend>
          </fieldset>
        )}
        <Container fluid
          key={index}
          style={{
            backgroundColor: (rowColors && rowColors[index]) || (defaultRowColor &&
              defaultRowColor), borderRadius: "0 0  .5rem .5rem", paddingBottom: "1rem"
          }}
  
  
        >
          <Row className={classes.formmainRow} >
          {legendFields.map((field, fieldIndex) => {
            let {
              title,
              type,
              name,
              contains,
              validationProps,
              capitalizedtext,
              dynamic,
              options,
              inpprops,
              value,
              colMdSize,
            } = field;
  
            let showField = dynamic
              ? watchValues[dynamic["field"]] === dynamic["value"]
              : true;
  
            if (!showField) return null;
  
            switch (type) {
              case 'autocomplete':
                            return (
                              <Col md={colMdSize ? colMdSize : mdSize} key={name}>
                                <Form.Group>
                                  <Form.Label htmlFor={name}>{title}</Form.Label>
                                  <Autocomplete
                                    id={name}
                                    options={options}
                                    disableClearable
                                    getOptionLabel={(option) => option.label}
                                    onChange={(event, newValue) => {
                                    
                                      setValue(name, newValue?.value || null);
                                    }}
                                    onBlur = {onBlurFuntion}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        variant="standard"
                                        margin="dense"
                                         fullWidth
                                        error={!!errors[name]}
                                      />
                                    )}
                                  />
                                  {errors[name] && (
                                    <Form.Text className="text-danger">
                                      {errors[name]['message']}
                                    </Form.Text>
                                  )}
                                </Form.Group>
                              </Col>
                            );
              case "text":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type={contains}
                        id={name}
                       {...register(name, validationProps)}
                        minLength={inpprops.minlength}
                        maxLength={inpprops.maxlength}
                        onBlur = {onBlurFuntion}
                        // pattern={inpprops.pattern}
                        {...(capitalizedtext && {
                          onChange: (event) => {
                            const capitalizedValue = event.target.value.toUpperCase();
                            setValue(name, capitalizedValue);
                          },
                        })}
                        className={classes.formBorder}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
               
              case "disabled":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type={contains}
                        id={name}
                        {...register(name)}
                        readOnly
                        value={value}
                        disabled
                        className={classes.formBorder}
                      />
                    </Form.Group>
                  </Col>
                );
              case "hidden":
                return (
                  <Form.Group key={name}>
                    <Form.Control
                     type="hidden"
                      id={name}
                      {...register(name)}
                      value={value ? value : ""}
                      className={classes.formBorder}
                    />
                  </Form.Group>
                );
              case "textarea":
                return (
                  <Col md={inpprops.md}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        as={contains}
                        id={name}
                        {...register(name, { required: validationProps })}
                        maxLength={inpprops.maxlength}
                        className={classes.formBorder}
                        onBlur = {onBlurFuntion}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              case "number":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type={contains}
                        id={name}
                        min={inpprops?.min ? inpprops.min : 0}
                        step={inpprops?.step ? inpprops.step : 0.0000001}
                       max={(inpprops?.max || inpprops?.max >=0)  && inpprops.max }
                        {...register(name, { required: validationProps })}
                        className={classes.formBorder}
                        onBlur = {onBlurFuntion}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              case "date":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type={contains}
                        id={name}
                        format={inpprops.format}
                        {...register(name, validationProps)}
                        className={classes.formBorder}
                        onBlur = {onBlurFuntion}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
                case "checkboxdropdown":
                  return (
                    <Col md={colMdSize ? colMdSize : mdSize} key={name}>
                      <Form.Group>
                        <Form.Label htmlFor={name}>{title}</Form.Label>
                        <FormControl sx={{ m: 1, width: "100%" }}>
                          <InputLabel id={`${name}-label`}>{title}</InputLabel>
                          <Select
                            labelId={`${name}-label`}
                            id={name}
                            multiple
                            value={watchValues[name] || []}
                            onChange={(event) => {
                              const selectedOptions = Array.from(event.target.options)
                                .filter((option) => option.selected)
                                .map((option) => option.value);
                              setValue(name, selectedOptions.length ? selectedOptions : null);
                            }}
                            
                          >
                            {options.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                <Checkbox
                                  checked={watchValues[name] && watchValues[name].includes(option.value)}
                                />
                                <ListItemText primary={option.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {errors[name] && (
                          <Form.Text className="text-danger">
                            {errors[name]["message"]}
                          </Form.Text>
                        )}
                      </Form.Group>
                    </Col>
                  );
                
              case 'typehead':
                  return (
                    <Col md={colMdSize ? colMdSize : mdSize}>   <Form.Group key={name}>
                    <Form.Label htmlFor={name}>{title}</Form.Label>
                    <Typeahead
                     id={name}   {...register(name,{ required: validationProps })} className={classes.formBorder}
                      labelKey={name}
                     
                      options={options}
                      placeholder="Choose a state..."
                 
                    />
                  </Form.Group></Col>
                  )
                  case "select":
                    return (
                      <Col md={colMdSize ? colMdSize : mdSize}>
                        <Form.Group key={name}>
                          <Form.Label htmlFor={name}>{title}</Form.Label>
                          <Form.Select
                            id={name}
                            {...register(name, validationProps)}
                            onBlur = {onBlurFuntion}
                            className={classes.formBorder}
                          >
                            {options.map(({ value, label, groupName }, index) => {
                              if (groupName) {
                                const isGroupRendered = options.slice(0, index).some(opt => opt.groupName === groupName);
                                return isGroupRendered ? null : (
                                  <optgroup label={groupName} key={groupName}>
                                    {options.filter(opt => opt.groupName === groupName).map(opt => (
                                      <option value={opt.value} key={opt.value}>
                                        {opt.label}
                                      </option>
                                    ))}
                                  </optgroup>
                                );
                              } else {
                                return <option value={value} key={index}>{label}</option>;
                              }
                            })}
                          </Form.Select>
                          {errors[name] && (
                            <Form.Text className="text-danger">
                              {errors[name]["message"]}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    );
                  
             /* case "select":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Select
                        id={name}
                        {...register(name, { required: validationProps })}
                        className={classes.formBorder}
                        onBlur = {onBlurFuntion}
                      >
                        {options.map(({ value, label }, index) => (
                          <option value={value}>{label}</option>
                        ))}
                      </Form.Select>
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                ); */
              case "Document":
                return (
                  <Col md={colMdSize ? colMdSize : mdSize}>
                    {" "}
                    <Form.Group key={name}>
                      <Form.Label htmlFor={name}>{title}</Form.Label>
                      <Form.Control
                        type="file"
                        id={name}
                        format={inpprops.format}
                        {...register(name, { required: validationProps })}
                        className={classes.formBorder}
                      />
                      {errors[name] && (
                        <Form.Text className="text-danger">
                          {errors[name]["message"]}
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                );
              case "checkbox":
                return (
                  <div key={name}>
                    <label>
                      <input
                        type="checkbox"
                        id={name}
                        {...register(name, { required: validationProps })}
                        className={classes.formBorder}
                      />
                      <span>{title}</span>
                      {errors[name] && (
                        <span className="red-text">
                          {errors[name]["message"]}
                        </span>
                      )}
                    </label>
                  </div>
                );
                default:
                  return (
                    <div key={name}>
                      <span className="red-text">Invalid Field</span>
                    </div>
                  );
              }
            })}
          </Row>
        </Container>
      </div>
    ));
  };
  

function CreateFormNew({
  template,
  watchFields,
  rowwise,
  validate,
  onSubmit,
  onCancel,
  buttonName,
  btButtons,
  defaultValues,
  styles,rowcolumns, rowColors, defaultRowColor,
}) {
  // useEffect(() => { console.log({...values}) }, [])
  // const defValues = defaultValues;
  const [lock, setLock] = useState(true);

  const showButton = () => setLock(!lock);
  //const [defValues,setDefValues] = useState(defaultValues);

  const authCtx = useContext(AuthContext);
  //  let userId =authCtx.userId;

  let {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
    reset,
  } = useForm({
    defaultValues: { ...defaultValues },
  });
  let { heading, fields } = template;
  fields = [
    ...fields,
    {
      type: "hidden",
      name: "updatedBy",
      contains: "hidden",
      value: localStorage.userId,
    }, 
    //{
    //   type: "hidden",
    //   name: "updatedOn",
    //   contains: "datetime",
    //   value: new Date().toISOString(),
    // },
  ];
  let watchValues = watchFields ? watch(watchFields) : watch([]);
  
  //validate(watchValues, { errors, setError, clearErrors });
  //console.log({...defaultValues})
  const resetForm = (defValues) => {
    var time = Date().toLocaleString();
    JSON.stringify(defaultValues) === "{}"
      ? reset({ time: Date().toLocaleString() })
      : reset(defaultValues);
  };

  const onBlurFuntion = (event)=>{
    console.log(watchValues)
    watchFields.includes(event.target.name) && validate(watchValues, { errors, setError, clearErrors })
   }

  useEffect(() => {
    resetForm(defaultValues);
  }, [defaultValues]);

  
  const onSubmitForm = (values, e) => {
    values.clicked = e.nativeEvent.submitter.name;
    console.log(e.nativeEvent.submitter.name)
    console.log(values);
    onSubmit(values);
    if(!["Search","Export Excel","excel"].includes(e.nativeEvent.submitter.name)){
        e.target.reset();
    }    
  };
  const dynamicStyles = typeof styles === "undefined" ? {} : styles;
  return (
    <Row className={classes.formholder}
    >
      <Form
        onSubmit={handleSubmit(onSubmitForm)}
        className={classes.formcon}
        style={{
          ...dynamicStyles?.upper,
          ...(dynamicStyles?.upper ? {} : { background: "transparent" }),
        }}
      >
        {heading && (
          <>
            <div className={classes.tlhead}>
              <Card
                body
                className={classes.title}
                style={{
                  ...dynamicStyles?.uppertitle,
                  ...(dynamicStyles?.uppertitle ? {} : { padding: "0" }),
                }}
              >
                <Row>
                  <Col md={12}>
                    {" "}
                    <h4>{heading}</h4>{" "}
                  </Col>
                </Row>
              </Card>
            </div>
          </>
        )}{" "}
        <Row
          style={{
            ...dynamicStyles?.upperRow,
            ...(dynamicStyles?.upperRow ? {} : { background: "transparent" }),
            border: "none",
          }}
        >
          {renderFields(
            fields,
            rowwise,
            watchValues,
            register,
            errors,
            setValue,
            onBlurFuntion,rowcolumns, rowColors, defaultRowColor,
          )}
       </Row>
        <Row>{btButtons && btButtons}</Row>
        {buttonName && (<div style={{
          display: 'flex', flexDirection: "row",
          justifyContent: 'space-between', padding: "0 2rem", alignItems: "center"
        }}>
          <div onClick={showButton}> <label className={classes.checkboxContainer}
          >
            <input type='checkbox' name='' className={classes.checkbox} />
            {/* <FaIcons.FaLock style={{ color: 'black' }} className={classes.lockIcon} 
     onClick={showButton}/> */}

          </label></div>
          <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}> {buttonName && (
            <Button type="submit" name={buttonName}

              className={classes.btn}
              disabled={lock}>
              {buttonName}
            </Button>
          )}
            {buttonName && (
              <Button
                type="button"
                variant="danger" name="cancelButt"
                className={classes.btn}
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div> 
        </div>)}
      </Form>
    </Row>
  );
}
export default CreateFormNew;