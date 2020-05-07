import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import "tachyons";
import validator from "validator";
import { withRouter } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { setInStorage, getFromStorage } from "../../utils/storage";
import { CircularProgress } from "@material-ui/core";

class Signup extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    retypePassword: "",
    requireError: "",
    emailError: "",
    passwordLengthError: "",
    passwordContainError: "",
    nameError: "",
    passwordEqualError: "",
    error: "",
    isLoggedIn: true,
    isLoading: true
  };

  whenChangeHanlder = e => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      requireError: "",
      passwordLengthError: "",
      passwordContainError: "",
      emailError: "",
      nameError: "",
      passwordEqualError: "",
      error: ""
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

  signupHandler = () => {
    if (!getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (
        this.state.name.trim() === "" ||
        this.state.email.trim() === "" ||
        this.state.password.trim() === "" ||
        this.state.retypePassword.trim() === ""
      ) {
        this.setState({ requireError: "All Fields Required" });
      } else if (!validator.isEmail(this.state.email)) {
        this.setState({ emailError: "Please provide valid email" });
      } else if (this.state.password.length < 8) {
        this.setState({
          passwordLengthError:
            "Password must be greater than or equal to 8 characters"
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
            this.signupPostRequest();
          });
        }
      }
    } else {
      this.authenticateUser();
    }
  };

  backToLoginHandler = () => {
    this.props.history.push("/");
  };

  signupPostRequest = () => {
    fetch(process.env.REACT_APP_CREATE_PROFILE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password
      })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ isLoading: true }, () => {
          if (json.success) {
            setInStorage(process.env.REACT_APP_TOKEN_KEY, json.token);
            this.props.history.replace("/Dashboard");
          } else {
            this.setState({ error: "Email Already Exists" });
          }
        });
      })
      .catch(err => {
        this.setState({ error: "Email Already Exists", isLoading: true });
      });
  };

  authenticateUser = () => {
    fetch(process.env.REACT_APP_AUTHENTICATE_PROFILE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getFromStorage(
          process.env.REACT_APP_TOKEN_KEY
        )}`
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (json.profile.isAdmin) {
            this.setState({ isLoggedIn: true }, () => {
              this.props.history.push("/AdminDashboard");
            });
          } else {
            this.props.history.push("/Dashboard");
          }
        }
      })
      .catch(err => {
        this.setState({ error: "User not authenticated", isLoggedIn: false });
      });
  };

  componentDidMount() {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      this.authenticateUser();
    } else {
      this.setState({ isLoggedIn: false });
    }
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <div className="signup">
          <section
            className="pa4 shadow-4"
            style={{
              position: "fixed",
              width: "360px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#f7f7f7",
              borderRadius: "5px"
            }}
          >
            <Button
              variant="success"
              onClick={this.backToLoginHandler}
              style={{ width: "300px" }}
            >
              {" "}
              {"<-"} Back To Login
            </Button>
            <br />
            <br />
            <h2>Signup</h2>
            <br />
            {(this.state.requireError !== "" ||
              this.state.nameError !== "" ||
              this.state.emailError !== "" ||
              this.state.passwordLengthError !== "" ||
              this.state.passwordContainError !== "" ||
              this.state.passwordEqualError !== "" ||
              this.state.error !== "") && (
              <Alert variant="danger" style={{ fontSize: "12px" }}>
                {this.state.error}
                {this.state.requireError}
                {this.state.nameError}
                {this.state.emailError}
                {this.state.passwordLengthError}
                {this.state.passwordContainError}
                {this.state.passwordEqualError}
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
                  style={{ width: "300px" }}
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
                  style={{ width: "300px" }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.whenChangeHanlder}
                  placeholder="Password*"
                  style={{ width: "300px" }}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Retype Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="retypePassword"
                  value={this.state.retypePassword}
                  onChange={this.whenChangeHanlder}
                  placeholder="Retype Password*"
                  style={{ width: "300px" }}
                />
              </Form.Group>
              <br />
              {this.state.isLoading ? (
                <Form.Group>
                  <Button
                    variant="danger"
                    style={{ width: "300px" }}
                    onClick={this.signupHandler}
                  >
                    Signup
                  </Button>
                </Form.Group>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <CircularProgress />
                </div>
              )}
            </Form>
          </section>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default withRouter(Signup);
