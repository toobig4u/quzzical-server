import React, { Component } from "react";
import QuizForm from "./QuizForm";
import { getFromStorage } from "../../../utils/storage";
import { withRouter } from "react-router";
import { CircularProgress } from "@material-ui/core";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";

class Quiz extends Component {
  state = { isLoggedIn: true };

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
            this.setState({ isLoggedIn: false });
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
            <h4 style={{ marginTop: "70px" }}>Quiz</h4>
            <br />
            <QuizForm />
            <br />
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

export default withRouter(Quiz);
