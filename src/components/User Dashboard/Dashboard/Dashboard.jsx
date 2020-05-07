import React, { Component } from "react";
import { Card } from "react-bootstrap";
import { QuestionAnswer, Person } from "@material-ui/icons";
import { Link, withRouter } from "react-router-dom";
import { getFromStorage } from "../../../utils/storage";
import { CircularProgress } from "@material-ui/core";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../../Navbar/Navbar";
import data from "../../../data/data.json";

class Dashboard extends Component {
  state = { isLoggedIn: true, questions: [], areas: [] };

  //Get list of knowledge area
  areaGetRequest = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      fetch(process.env.REACT_APP_GET_AREA_API, {
        method: "GET",
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
            this.setState({ areas: json.area });
          } else {
            this.setState({ error: "Something went wrong" });
          }
        })
        .catch(err => this.setState({ error: "Something went wrong" }));
    } else {
      this.props.history.push("/");
    }
  };

  //Get list of question and answers
  questionAndAnswersGetRequest = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      fetch(process.env.REACT_APP_GET_QUIZ_API, {
        method: "GET",
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
            this.setState({ questions: json.quiz });
          }
        })
        .catch(err => this.setState({ error: "Something went wrong" }));
    } else {
      this.props.history.push("/");
    }
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
            this.props.history.push("/AdminDashboard");
          } else {
            this.areaGetRequest();
            this.questionAndAnswersGetRequest();
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
          <div className="dashboard">
            <h4 style={{ marginTop: "70px" }}>Dashboard</h4>
            <br />

            <span
              style={{
                paddingBottom: "40px",
                borderBottom: "1px solid silver"
              }}
            >
              <Link to="/Quiz" style={{ textDecoration: "none" }}>
                <span
                  style={{
                    cursor: "pointer",
                    padding: "5px"
                  }}
                  className="quiz"
                >
                  <QuestionAnswer style={{ fontSize: "28px" }} />
                  <span style={{ paddingLeft: "5px", fontSize: "20px" }}>
                    Quiz{" "}
                  </span>
                </span>
              </Link>
              <span
                style={{
                  fontSize: "20px",
                  marginLeft: "10px",
                  marginRight: "10px"
                }}
              >
                |
              </span>{" "}
              <Link to="/Profile" style={{ textDecoration: "none" }}>
                <span
                  style={{
                    cursor: "pointer",
                    padding: "5px"
                  }}
                  className="quiz"
                >
                  <span style={{ cursor: "pointer" }}>
                    <Person style={{ fontSize: "28px" }} />{" "}
                    <span style={{ paddingLeft: "5px", fontSize: "20px" }}>
                      Profile
                    </span>
                  </span>
                </span>
              </Link>
            </span>
            <br />
            <br />
            <br />
            <br />

            <Card
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
              align="center"
            >
              <Card.Body style={{ textAlign: "left" }}>
                Total Number of Questions:{" "}
                <strong>{this.state.questions.length}</strong>
                <br />
                <br />
                Total Number of Knowledge Areas:{" "}
                <strong>{this.state.areas.length}</strong>
                <br />
                <br />
                Total Number of Graphical Regions:{" "}
                <strong>{data.regions.length}</strong>
                <br />
                <br />
                Difficulty Levels:{" "}
                {data.difficultyLevels.map((difficulty, i) => (
                  <span key={i}>
                    <strong>{difficulty}</strong>{" "}
                    {i !== data.difficultyLevels.length - 1 && " | "}
                  </span>
                ))}
              </Card.Body>
            </Card>
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{ textAlign: "center", marginTop: "100px" }}
          className="dashboard"
        >
          <CircularProgress />
          <br />
          Loading, Please Wait...
        </div>
      );
    }
  }
}
export default withRouter(Dashboard);
