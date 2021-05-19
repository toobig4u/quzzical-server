import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/style.css";
import "tachyons";
// Components
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/Admin Dashboard/Dashboard/Dashboard";
import Profile from "./components/Admin Dashboard/Profile/Profile";
import Quiz from "./components/Admin Dashboard/Quiz/Quiz";
import UserProfile from "./components/User Dashboard/Profile/Profile";
import UserQuiz from "./components/User Dashboard/Quiz/Quiz";
import UserDashboard from "./components/User Dashboard/Dashboard/Dashboard";
import NotFound from "./components/Not Found/NotFound";
import Area from "./components/Admin Dashboard/Knowledge Area/Area";
import SecretKey from "./components/Admin Dashboard/Secret Key/SecretKey";

export default class App extends Component {
  createSecretKey = () => {
    fetch(process.env.REACT_APP_CREATE_KEY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ key: process.env.REACT_APP_SECRET_KEY })
    })
      .then(res => res.json())
      .then(json => {})
      .catch(err => console.log(err));
  };

  checkSecretKey = () => {
    fetch(process.env.REACT_APP_GET_KEY_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          if (!json.key) {
            this.createSecretKey();
          }
        }
      })
      .catch(err => console.log(err));
  };
  componentDidMount() {
    this.checkSecretKey();
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Login} exact />
          <Route path="/Login" component={Login} exact />
          <Route path="/Signup" component={Signup} exact />
          <Route path="/AdminSignup" component={Signup} exact />
          <Route path="/AdminDashboard" component={Dashboard} exact />
          <Route path="/AdminProfile" component={Profile} exact />
          <Route path="/AdminQuiz" component={Quiz} exact />
          <Route path="/AdminKnowledgeArea" component={Area} exact />
          <Route path="/AdminSecretKey" component={SecretKey} exact />
          <Route path="/Dashboard" component={UserDashboard} exact />
          <Route path="/Profile" component={UserProfile} exact />
          <Route path="/Quiz" component={UserQuiz} exact />
          <Route path="/" component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}
