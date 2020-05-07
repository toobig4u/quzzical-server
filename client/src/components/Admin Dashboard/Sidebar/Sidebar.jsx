import React, { Component } from "react";
import {
  Home,
  QuestionAnswer,
  Person,
  ExitToApp,
  Dashboard,
  Book,
  Lock
} from "@material-ui/icons";
import { Link, withRouter } from "react-router-dom";
import { removeFromStorage, getFromStorage } from "../../../utils/storage";

class Sidebar extends Component {
  logoutPostRequest = () => {
    fetch(process.env.REACT_APP_LOGOUT_PROFILE_API, {
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
          removeFromStorage(process.env.REACT_APP_TOKEN_KEY);
          this.props.history.replace("/");
        } else {
          alert("Something went wrong");
        }
      })
      .catch(err => {
        alert("Something went wrong");
      });
  };

  logoutHandler = () => {
    this.logoutPostRequest();
  };
  render() {
    return (
      <div className="sidebar">
        <div
          style={{
            paddingLeft: "15px",
            paddingTop: "12px",
            paddingBottom: "12px",
            backgroundColor: "teal"
          }}
        >
          <Link
            to="/AdminDashboard"
            style={{ textDecoration: "none", color: "white" }}
          >
            <Dashboard />
          </Link>
        </div>

        <ul>
          <Link
            to="/AdminDashboard"
            style={{ textDecoration: "none", color: "white" }}
          >
            <li>
              <Home />
              <span> Dashboard</span>
            </li>
          </Link>
          <Link
            to="/AdminKnowledgeArea"
            style={{ textDecoration: "none", color: "white" }}
          >
            <li>
              <Book />
              <span> Area</span>
            </li>
          </Link>
          <Link
            to="/AdminQuiz"
            style={{ textDecoration: "none", color: "white" }}
          >
            <li>
              <QuestionAnswer />
              <span> Quiz</span>
            </li>
          </Link>
          <Link
            to="/AdminSecretKey"
            style={{ textDecoration: "none", color: "white" }}
          >
            <li>
              <Lock />
              <span> Key</span>
            </li>
          </Link>
          <Link
            to="/AdminProfile"
            style={{ textDecoration: "none", color: "white" }}
          >
            <li>
              <Person />
              <span> Profile</span>
            </li>
          </Link>

          <li onClick={this.logoutHandler}>
            <ExitToApp />
            <span> Logout</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(Sidebar);
