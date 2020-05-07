import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import "./styles/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/Signup/Signup";
import Dashboard from "./components/Admin Dashboard/Dashboard/Dashboard";
import "tachyons";
import Profile from "./components/Admin Dashboard/Profile/Profile";
import Quiz from "./components/Admin Dashboard/Quiz/Quiz";
import UserProfile from "./components/User Dashboard/Profile/Profile";
import UserQuiz from "./components/User Dashboard/Quiz/Quiz";
import UserDashboard from "./components/User Dashboard/Dashboard/Dashboard";
import NotFound from "./components/Not Found/NotFound";
import Area from "./components/Admin Dashboard/Knowledge Area/Area";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Login} exact />
        <Route path="/Login" component={Login} exact />
        <Route path="/Signup" component={Signup} exact />

        <Route path="/AdminDashboard" component={Dashboard} exact />
        <Route path="/AdminProfile" component={Profile} exact />
        <Route path="/AdminQuiz" component={Quiz} exact />
        <Route path="/AdminKnowledgeArea" component={Area} exact />

        <Route path="/Dashboard" component={UserDashboard} exact />
        <Route path="/Profile" component={UserProfile} exact />
        <Route path="/Quiz" component={UserQuiz} exact />

        <Route path="/" component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
