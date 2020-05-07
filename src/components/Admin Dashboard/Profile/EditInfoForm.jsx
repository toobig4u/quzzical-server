import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { getFromStorage } from "../../../utils/storage";
import { withRouter } from "react-router";
import { CircularProgress } from "@material-ui/core";

class EditInfoForm extends Component {
  state = {
    name: "",
    email: "",
    requireError: "",
    emailError: "",
    nameError: "",
    error: "",
    success: "",
    isLoading: true
  };

  whenChangeHanlder = e => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      requireError: "",
      emailError: "",
      nameError: "",
      error: "",
      success: ""
    });
  };

  nameError = () => {
    for (let i = 0; i < 10; i++) {
      if (this.state.name.includes(i)) {
        this.setState({
          nameError: "Name cannot be a number"
        });
        return false;
      }
    }
    return true;
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
      body: JSON.stringify({ name: this.state.name, email: this.state.email })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ isLoading: true }, () => {
          if (json.success) {
            if (!json.profile.isAdmin) {
              this.props.history.push("/Dashboard");
            } else {
              this.setState(
                { success: "Updated Successfully", error: "" },
                () => {
                  this.props.authenticateUser();
                }
              );
            }
          } else {
            this.setState({
              error: "Email/Username Already Exists",
              success: ""
            });
          }
        });
      })
      .catch(err => {
        this.setState({
          error: "Something went wrong",
          success: "",
          isLoading: true
        });
      });
  };

  updateHandler = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (this.state.name.trim() === "" || this.state.email.trim() === "") {
        this.setState({ requireError: "All Fields Required" });
      } else if (this.nameError()) {
        this.setState({ isLoading: false }, () => {
          this.updatePostRequest();
        });
      }
    } else {
      this.props.history.push("/");
    }
  };

  componentDidMount() {
    this.setState({ name: this.props.name, email: this.props.email });
  }

  render() {
    return (
      <div>
        {(this.state.requireError !== "" ||
          this.state.nameError !== "" ||
          this.state.emailError !== "" ||
          this.state.error) && (
          <Alert variant="danger" style={{ fontSize: "12px" }}>
            {this.state.requireError}
            {this.state.nameError}
            {this.state.emailError}
            {this.state.error}
          </Alert>
        )}
        {this.state.success !== "" && (
          <Alert variant="success" style={{ fontSize: "12px" }}>
            {this.state.success}
          </Alert>
        )}

        <Form style={{ textAlign: "left" }}>
          <Form.Group>
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.whenChangeHanlder}
              placeholder="Name*"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.whenChangeHanlder}
              placeholder="Email*"
            />
          </Form.Group>
          <br />
          {this.state.isLoading ? (
            <Form.Group style={{ textAlign: "center" }}>
              <Button
                variant="danger"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: "100%"
                }}
                align="center"
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

export default withRouter(EditInfoForm);
