import React, { Component } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { getFromStorage } from "../../../utils/storage";
import { CircularProgress } from "@material-ui/core";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";

class SecretKey extends Component {
  state = {
    secretKey: "",
    retypesecretKey: "",
    requireError: "",
    secretKeyLengthError: "",
    secretKeyContainError: "",
    secretKeyEqualError: "",
    error: "",
    success: "",
    oldsecretKey: "",
    oldPassError: "",
    isLoading: true
  };

  whenChangeHandler = e => {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
      requireError: "",
      secretKeyLengthError: "",
      secretKeyContainError: "",
      secretKeyEqualError: "",
      error: "",
      success: "",
      oldPassError: ""
    });
  };

  updatePostRequest = () => {
    fetch(process.env.REACT_APP_UPDATE_KEY_API, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ key: this.state.secretKey })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ isLoading: true }, () => {
          if (json.success) {
            this.setState({
              success: "Secret Key Changed Successfully",
              error: "",
              oldPassError: "",
              secretKey: "",
              oldsecretKey: "",
              retypesecretKey: ""
            });
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

  checkOldsecretKey = () => {
    fetch(process.env.REACT_APP_OLD_KEY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        key: this.state.oldsecretKey
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.updatePostRequest();
          this.setState({
            oldPassError: "",
            error: ""
          });
        } else {
          this.setState({
            oldPassError: "Old Secret Key wrong",
            success: "",
            error: "",
            isLoading: true
          });
        }
      })
      .catch(err => {
        this.setState({
          error: "Something went wrong",
          oldPassError: "",
          success: "",
          isLoading: true
        });
      });
  };

  updateHandler = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (
        this.state.secretKey.trim() === "" ||
        this.state.retypesecretKey.trim() === "" ||
        this.state.oldsecretKey.trim() === ""
      ) {
        this.setState({ requireError: "All Fields Required" });
      } else if (this.state.secretKey.length < 8) {
        this.setState({
          secretKeyLengthError:
            "New Secret Key must be greater than or equal to 8 characters"
        });
      } else if (this.state.secretKey.length >= 8) {
        let flag = false;
        if (
          this.state.secretKey.match(/[A-Z]/) &&
          this.state.secretKey.match(/[0-9]/)
        ) {
          flag = true;
          this.setState({
            secretKeyContainError: ""
          });
          if (this.state.secretKey !== this.state.retypesecretKey) {
            this.setState({
              secretKeyEqualError: "New Secret Keys are not equal"
            });
          }
        } else if (
          !(
            this.state.secretKey.match(/[A-Z]/) &&
            this.state.secretKey.match(/[0-9]/)
          )
        ) {
          flag = false;
          this.setState({
            secretKeyContainError:
              "New Secret Key must contain 1 numeric value and 1 capital letter"
          });
        }
        if (flag) {
          this.setState({ isLoading: false }, () => {
            this.checkOldsecretKey();
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
        <Sidebar />
        <Navbar />
        <div className="dashboard">
          <h4 style={{ marginTop: "70px" }}>Secret Key</h4>
          <br />
          <Card
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              overflow: "auto"
            }}
            align="center"
          >
            <Card.Body>
              {(this.state.requireError !== "" ||
                this.state.secretKeyLengthError !== "" ||
                this.state.secretKeyContainError !== "" ||
                this.state.secretKeyEqualError !== "" ||
                this.state.oldPassError !== "" ||
                this.state.error !== "") && (
                <Alert variant="danger" style={{ fontSize: "12px" }}>
                  {this.state.oldPassError}
                  {this.state.oldPassError !== "" && <br />}
                  {this.state.error}
                  {this.state.error !== "" && <br />}
                  {this.state.requireError}
                  {this.state.requireError !== "" && <br />}
                  {this.state.secretKeyLengthError}
                  {this.state.secretKeyLengthError !== "" && <br />}
                  {this.state.secretKeyContainError}
                  {this.state.secretKeyContainError !== "" && <br />}
                  {this.state.secretKeyEqualError}
                </Alert>
              )}

              {this.state.success.trim() !== "" && (
                <Alert variant="success" style={{ fontSize: "12px" }}>
                  {this.state.success}
                </Alert>
              )}

              <Form style={{ textAlign: "left", width: "300px" }}>
                <Form.Group>
                  <Form.Label>Old Secret Key:</Form.Label>
                  <Form.Control
                    type="password"
                    name="oldsecretKey"
                    value={this.state.oldsecretKey}
                    onChange={this.whenChangeHandler}
                    placeholder="Old Secret Key*"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>New Secret Key:</Form.Label>
                  <Form.Control
                    type="password"
                    name="secretKey"
                    value={this.state.secretKey}
                    onChange={this.whenChangeHandler}
                    placeholder="New Secret Key*"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Retype New Secret Key:</Form.Label>
                  <Form.Control
                    type="password"
                    name="retypesecretKey"
                    value={this.state.retypesecretKey}
                    onChange={this.whenChangeHandler}
                    placeholder="Retype New Secret Key*"
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
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default SecretKey;
