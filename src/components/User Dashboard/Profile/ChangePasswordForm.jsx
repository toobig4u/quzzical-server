import React, { Component } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { getFromStorage } from "../../../utils/storage";
import { CircularProgress } from "@material-ui/core";

class ChangePasswordForm extends Component {
  state = {
    password: "",
    retypePassword: "",
    requireError: "",
    passwordLengthError: "",
    passwordContainError: "",
    passwordEqualError: "",
    error: "",
    success: "",
    oldPassword: "",
    oldPassError: "",
    isLoading: true
  };

  whenChangeHandler = e => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      requireError: "",
      passwordLengthError: "",
      passwordContainError: "",
      passwordEqualError: "",
      error: "",
      success: "",
      oldPassError: ""
    });
  };

  updatePostRequest = () => {
    fetch(process.env.REACT_APP_UPDATE_PROFILE_API, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getFromStorage(
          process.env.REACT_APP_TOKEN_KEY
        )}`
      },
      body: JSON.stringify({ password: this.state.password })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ isLoading: true }, () => {
          if (json.success) {
            if (json.profile.isAdmin) {
              this.props.history.push("/AdminDashboard");
            } else {
              this.setState({
                success: "Password Changed Successfully",
                error: "",
                oldPassError: "",
                password: "",
                retypePassword: "",
                oldPassword: ""
              });
            }
          } else {
            this.setState({
              error: "Something went wrong",
              success: "",
              oldPassError: ""
            });
          }
        });
      })
      .catch(err => {
        this.setState({
          error: "Something went wrong",
          success: "",
          oldPassError: "",
          isLoading: true
        });
      });
  };

  checkOldPassword = () => {
    fetch(process.env.REACT_APP_OLD_PASS_PROFILE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getFromStorage(
          process.env.REACT_APP_TOKEN_KEY
        )}`
      },
      body: JSON.stringify({
        email: this.props.email,
        password: this.state.oldPassword
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (json.profile.isAdmin) {
            this.props.history.push("/AdminDashboard");
          } else {
            this.updatePostRequest();
            this.setState({
              oldPassError: "",
              error: ""
            });
          }
        } else {
          this.setState({
            oldPassError: "Old Password wrong",
            success: "",
            error: "",
            isLoading: true
          });
        }
      })
      .catch(err =>
        this.setState({
          error: "Something went wrong",
          oldPassError: "",
          success: "",
          isLoading: true
        })
      );
  };

  updateHandler = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (
        this.state.password.trim() === "" ||
        this.state.retypePassword.trim() === "" ||
        this.state.oldPassword.trim() === ""
      ) {
        this.setState({ requireError: "All Fields Required" });
      } else if (this.state.password.length < 8) {
        this.setState({
          passwordLengthError:
            "New Password must be greater than or equal to 8 characters"
        });
      } else if (this.state.password.length >= 8) {
        let flag = false;
        if (
          this.state.password.match(/[A-Z]/) &&
          this.state.password.match(/[0-9]/)
        ) {
          flag = true;
          this.setState({
            passwordContainError: ""
          });
          if (this.state.password !== this.state.retypePassword) {
            this.setState({
              passwordEqualError: "New Passwords are not equal"
            });
          }
        } else if (
          !(
            this.state.password.match(/[A-Z]/) &&
            this.state.password.match(/[0-9]/)
          )
        ) {
          flag = false;
          this.setState({
            passwordContainError:
              "New Password must contain 1 numeric value and 1 capital letter"
          });
        }
        if (flag) {
          this.setState({ isLoading: false }, () => {
            this.checkOldPassword();
          });
        }
      }
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <div>
        {(this.state.requireError !== "" ||
          this.state.passwordLengthError !== "" ||
          this.state.passwordContainError !== "" ||
          this.state.passwordEqualError !== "" ||
          this.state.oldPassError !== "" ||
          this.state.error !== "") && (
          <Alert variant="danger" style={{ fontSize: "12px" }}>
            {this.state.oldPassError}
            {this.state.oldPassError !== "" && <br />}
            {this.state.error}
            {this.state.error !== "" && <br />}
            {this.state.requireError}
            {this.state.requireError !== "" && <br />}
            {this.state.passwordLengthError}
            {this.state.passwordLengthError !== "" && <br />}
            {this.state.passwordContainError}
            {this.state.passwordContainError !== "" && <br />}
            {this.state.passwordEqualError}
          </Alert>
        )}

        {this.state.success.trim() !== "" && (
          <Alert variant="success" style={{ fontSize: "12px" }}>
            {this.state.success}
          </Alert>
        )}

        <Form style={{ textAlign: "left" }}>
          <Form.Group>
            <Form.Label>Old Password:</Form.Label>
            <Form.Control
              type="password"
              name="oldPassword"
              value={this.state.oldPassword}
              onChange={this.whenChangeHandler}
              placeholder="Old Password*"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>New Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.whenChangeHandler}
              placeholder="New Password*"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Retype New Password:</Form.Label>
            <Form.Control
              type="password"
              name="retypePassword"
              value={this.state.retypePassword}
              onChange={this.whenChangeHandler}
              placeholder="Retype New Password*"
            />
          </Form.Group>
          <br />
          {this.state.isLoading ? (
            <Form.Group>
              <Button
                variant="danger"
                style={{ width: "100%" }}
                onClick={this.updateHandler}
              >
                Update
              </Button>
            </Form.Group>
          ) : (
            <div style={{ textAlign: "center" }}>
              <CircularProgress />
            </div>
          )}
        </Form>
      </div>
    );
  }
}

export default ChangePasswordForm;
