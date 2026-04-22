import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Row, Form, Button, FormGroup } from "react-bootstrap";
import { Label } from "reactstrap";
import classes from "./SlidingChangePassword.module.css";

function SlidingChangePassword(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = (data) => {
    props.onSubmit(data);
  };

  return (
    <div className={classes.slideContainer}>
      <p className={classes.slideTitle}>Change Password</p>
      <Row className={classes.slideFormRow}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="currentPassword">
            <Form.Label className={classes.slideLabel}>Old Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Current Password"
              className={classes.slideInput}
              {...register("oldPassword", {
                required: "Old Password is required",
              })}
            />
            {errors.oldPassword && (
              <Form.Text className="text-danger">
                {errors.oldPassword.message}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="newPassword">
            <Form.Label className={classes.slideLabel}>New Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className={classes.slideInput}
              {...register("newPassword", {
                required: "New Password is required",
              })}
            />
            {errors.newPassword && (
              <Form.Text className="text-danger">
                {errors.newPassword.message}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label className={classes.slideLabel}>Confirm Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={classes.slideInput}
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: {
                  matchesNewPassword: (value) =>
                    value === getValues("newPassword") || "Password Does Not Match",
                },
              })}
            />
            {errors.confirmPassword && (
              <Form.Text className="text-danger">
                {errors.confirmPassword.message}
              </Form.Text>
            )}
          </Form.Group>

          <FormGroup className="mt-2">
            <Label className={classes.slideCheckbox}>
              <input type="checkbox" onClick={togglePasswordVisibility} />{" "}
              {showPassword ? "Hide" : "Show"} Password
            </Label>
          </FormGroup>

          <Button className={classes.slideSubmitButton} type="submit">
            Submit
          </Button>
        </Form>
      </Row>
    </div>
  );
}

export default SlidingChangePassword;
