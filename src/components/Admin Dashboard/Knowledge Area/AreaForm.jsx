import React, { Component } from "react";
import { Form, Button, Card } from "react-bootstrap";
import TableQuiz from "./TableQuiz";
import { Alert } from "react-bootstrap";
import { getFromStorage } from "../../../utils/storage";
import { withRouter } from "react-router";
import { CircularProgress } from "@material-ui/core";

class AreaForm extends Component {
  state = {
    area: "",
    open: false,
    addError: false,
    addAreaError: false,
    addAreaSuccess: false,
    error: "",
    tableData: [],
    isDataFetch: false,
    isLoading: true
  };
  whenChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      addError: false,
      addAreaError: false,
      addAreaSuccess: false
    });
  };

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
            this.setState({ tableData: json.area });
          }
          this.setState({ isDataFetch: true });
        })
        .catch(err =>
          this.setState({ error: "Something went wrong", isDataFetch: true })
        );
    } else {
      this.props.history.push("/");
    }
  };

  addAreaPostRequest = () => {
    fetch(process.env.REACT_APP_CREATE_AREA_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getFromStorage(
          process.env.REACT_APP_TOKEN_KEY
        )}`
      },
      body: JSON.stringify({
        area: this.state.area
      })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ isLoading: true }, () => {
          if (json.success) {
            this.setState(
              {
                addAreaSuccess: true,
                area: "",
                addAreaError: false,
                isDataFetch: false
              },
              () => {
                this.areaGetRequest();
              }
            );
          } else {
            this.setState({
              addAreaError: true,
              addAreaSuccess: false
            });
          }
        });
      })
      .catch(err =>
        this.setState({
          addAreaError: true,
          addAreaSuccess: false,
          isLoading: true
        })
      );
  };

  addArea = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (this.state.area.trim() !== "") {
        this.setState({ isLoading: false }, () => {
          this.addAreaPostRequest();
        });
      } else {
        this.setState({ addAreaError: true, addAreaSuccess: false });
      }
    } else {
      this.props.history.push("/");
    }
  };

  isDataFetchChange = value => {
    this.setState({ isDataFetch: value });
  };

  componentDidMount() {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      this.areaGetRequest();
    } else {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div>
        {" "}
        <Card>
          <Card.Body>
            {this.state.addAreaError ? (
              <Alert variant="danger" style={{ fontSize: "12px" }}>
                Knowledge Area Already Exist or All Fields Required or Something
                Went Wrong
              </Alert>
            ) : (
              this.state.addAreaSuccess && (
                <Alert variant="success" style={{ fontSize: "12px" }}>
                  Knowledge Area Added Successfully
                </Alert>
              )
            )}

            <Form>
              <Form.Group style={{ textAlign: "left" }}>
                <Form.Label>
                  <strong>Knowledge Area:</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Knowledge Area"
                  name="area"
                  value={this.state.area}
                  onChange={this.whenChangeHandler}
                />
              </Form.Group>

              {this.state.isLoading ? (
                <Form.Group>
                  <Button variant="success" onClick={this.addArea}>
                    Add Knowledge Area
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
        <br />
        <Card>
          <Card.Body>
            {this.state.isDataFetch ? (
              <TableQuiz
                tableData={this.state.tableData}
                question_and_answers_get_request={this.areaGetRequest}
                is_data_fetch_change={this.isDataFetchChange}
              />
            ) : (
              <React.Fragment>
                <CircularProgress />
                <br />
                Loading Data, Please wait...
              </React.Fragment>
            )}
          </Card.Body>
        </Card>
      </div>
    );
  }
}
export default withRouter(AreaForm);
