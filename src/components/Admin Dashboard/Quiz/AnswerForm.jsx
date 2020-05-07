import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Alert } from "react-bootstrap";

export default class AnswerForm extends Component {
  state = { answer: this.props.answer, update: false, updateError: false };

  whenChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value, update: false, updateError: false });
  };

  updateAnswerHandler = () => {
    if (this.state.answer.trim() !== "") {
      this.props.updateanswerhandler(this.state.answer, this.props.i);
      this.setState({ update: true, updateError: false });
    } else {
      this.setState({ updateError: true });
    }
  };
  render() {
    return (
      <div>
        {this.state.update ? (
          <Alert variant="success" style={{ fontSize: "12px" }}>
            Answer Updated Successfully
          </Alert>
        ) : (
          this.state.updateError && (
            <Alert variant="danger" style={{ fontSize: "12px" }}>
              Answer Required
            </Alert>
          )
        )}
        <Form>
          <Form.Group style={{ textAlign: "left" }}>
            <Form.Label>
              <strong>Answers:</strong>
            </Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter Answer"
              name="answer"
              value={this.state.answer}
              onChange={this.whenChangeHandler}
            />
            <br />
            <Button
              variant="success"
              onClick={this.updateAnswerHandler}
              style={{ width: "100%" }}
            >
              Update Answer
            </Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}
