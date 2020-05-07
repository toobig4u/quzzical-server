import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import EditDialog from "./EditDialog";
import { getFromStorage } from "../../../utils/storage";
import { withRouter } from "react-router";
import { CircularProgress } from "@material-ui/core";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";

class Profile extends Component {
  state = {
    openEditInfo: false,
    openChangePass: false,
    isLoggedIn: true,
    error: "",
    name: "",
    email: ""
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
          if (!json.profile.isAdmin) {
            this.props.history.push("/Dashboard");
          } else {
            this.setState({
              name: json.profile.name,
              email: json.profile.email,
              isLoggedIn: false
            });
          }
        } else {
          this.setState({ isLoggedIn: false }, () => {
            this.props.history.push("/");
          });
        }
      })
      .catch(err => {
        this.setState({ isLoggedIn: false });
      });
  };

  componentDidMount() {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      this.authenticateUser();
    } else {
      this.setState({ isLoggedIn: false }, () => {
        this.props.history.push("/");
      });
    }
  }

  render() {
    if (!this.state.isLoggedIn) {
      return (
        <div>
          <Sidebar />
          <Navbar />
          <div className="profile">
            <h4 style={{ marginTop: "70px" }}>Profile Information</h4>
            <br />
            <Card>
              <Card.Body>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                    align="center"
                  >
                    <tbody>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <strong>Name:</strong>
                        </td>
                        <td style={{ padding: "20px", textAlign: "left" }}>
                          {this.state.name}
                        </td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: "left" }}>
                          <strong>Email:</strong>
                        </td>
                        <td
                          style={{
                            paddingLeft: "20px",

                            textAlign: "left"
                          }}
                        >
                          {this.state.email}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{
                            textAlign: "left",
                            paddingTop: "20px",
                            paddingBottom: "20px"
                          }}
                        >
                          <Button
                            variant="outline-success"
                            onClick={() => {
                              if (
                                getFromStorage(process.env.REACT_APP_TOKEN_KEY)
                              ) {
                                this.setState({ openEditInfo: true });
                              } else {
                                this.props.history.push("/");
                              }
                            }}
                          >
                            Edit Information
                          </Button>
                          <EditDialog
                            show={this.state.openEditInfo}
                            namee={this.state.name}
                            email={this.state.email}
                            onHide={() =>
                              this.setState({ openEditInfo: false })
                            }
                            name="Edit Information"
                            authenticateuser={() => this.authenticateUser()}
                          />
                        </td>
                        <td
                          style={{
                            paddingLeft: "20px",
                            textAlign: "left",
                            paddingTop: "20px",
                            paddingBottom: "20px"
                          }}
                        >
                          <Button
                            variant="outline-danger"
                            onClick={() => {
                              if (
                                getFromStorage(process.env.REACT_APP_TOKEN_KEY)
                              ) {
                                this.setState({ openChangePass: true });
                              } else {
                                this.props.history.push("/");
                              }
                            }}
                          >
                            Change Password
                          </Button>
                          <EditDialog
                            show={this.state.openChangePass}
                            onHide={() =>
                              this.setState({ openChangePass: false })
                            }
                            name="Change Password"
                            email={this.state.email}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{ textAlign: "center", marginTop: "100px" }}
          className="profile"
        >
          <CircularProgress />
          <br />
          Loading, Please Wait...
        </div>
      );
    }
  }
}
export default withRouter(Profile);
