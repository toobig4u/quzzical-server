import React, { Component } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { getFromStorage } from "../../../utils/storage";
import { withRouter } from "react-router";
import { CircularProgress } from "@material-ui/core";

class TableEditForm extends Component {
  state = {
    area: "",
    open: false,
    addError: false,
    addAreaError: false,
    addAreaSuccess: false,
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

  updateAreaPatchRequest = () => {
    fetch(process.env.REACT_APP_UPDATE_AREA_API + "?id=" + this.props.data.id, {
      method: "PATCH",
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
                addAreaError: false
              },
              () => {
                setTimeout(() => {
                  this.props.is_data_fetch_change(false);
                  this.props.question_and_answers_get_request();
                }, 2000);
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

  updateArea = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (this.state.area.trim() !== "") {
        this.setState({ isLoading: false }, () => {
          this.updateAreaPatchRequest();
        });
      } else {
        this.setState({ addAreaError: true });
      }
    } else {
      this.props.history.push("/");
    }
  };

  componentDidMount() {
    const { area } = this.props.data;
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      this.setState({ area });
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
                went wrong
              </Alert>
            ) : (
              this.state.addAreaSuccess && (
                <Alert variant="success" style={{ fontSize: "12px" }}>
                  Knowledge Area Updated Successfully
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
                <Form.Group style={{ textAlign: "center" }}>
                  <Button variant="success" onClick={this.updateArea}>
                    Update Knowledge Area
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
    );
  }
}
export default withRouter(TableEditForm);
