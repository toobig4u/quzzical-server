import React, { Component } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import data from "../../../data/data.json";
import { getFromStorage } from "../../../utils/storage.js";
import { withRouter } from "react-router";
import PrintQuestions from "./PrintQuestions.jsx";
import { CircularProgress } from "@material-ui/core";

class QuizForm extends Component {
  state = {
    question: "",
    area: "",
    region: "",
    difficulty: "",
    open: false,
    addError: false,
    addQuestionError: false,
    addQuestionSuccess: false,
    questions: [],
    isLoading: true
  };
  whenChangeHandler = e => {
    const { name, value } = e.target;
    if (e.target.validity.valid)
      this.setState({
        [name]: value,
        addError: false,
        addQuestionError: false,
        addQuestionSuccess: false
      });
  };

  searchGetRequest = () => {
    fetch(
      process.env.REACT_APP_SEARCH_QUIZ_API +
        `?numbers=${parseInt(this.state.question)}&&area=${
          this.state.area
        }&&region=${this.state.region}&&difficulty=${this.state.difficulty}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getFromStorage(
            process.env.REACT_APP_TOKEN_KEY
          )}`
        }
      }
    )
      .then(res => res.json())
      .then(json => {
        this.setState({ isLoading: true }, () => {
          if (json.success) {
            this.setState({
              addQuestionSuccess: true,
              question: "",
              area: "",
              region: "",
              difficulty: "",
              answers: [],
              addQuestionError: false,
              isDataFetch: false,
              questions: json.quiz
            });
          } else {
            this.setState({
              addQuestionError: true,
              addQuestionSuccess: false
            });
          }
        });
      })
      .catch(err =>
        this.setState({
          addQuestionError: true,
          addQuestionSuccess: false,
          isLoading: true
        })
      );
  };

  searchQuestionAndAnswer = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (
        this.state.question.trim() !== "" &&
        this.state.area.trim() !== "" &&
        this.state.region.trim() !== "" &&
        this.state.difficulty.trim() !== "" &&
        parseInt(this.state.question) !== 0
      ) {
        this.setState({ isLoading: false }, () => {
          this.searchGetRequest();
        });
      } else {
        this.setState({ addQuestionError: true });
      }
    } else {
      this.props.history.push("/");
    }
  };

  render() {
    return (
      <div>
        {" "}
        <Card>
          <Card.Body>
            {this.state.addQuestionError ? (
              <Alert variant="danger" style={{ fontSize: "12px" }}>
                All Fields Required or Something went wrong
              </Alert>
            ) : this.state.questions.length === 0 &&
              this.state.addQuestionSuccess ? (
              <Alert variant="danger" style={{ fontSize: "12px" }}>
                Questions not Available
              </Alert>
            ) : (
              this.state.addQuestionSuccess && (
                <Alert variant="success" style={{ fontSize: "12px" }}>
                  Question and Answers Found
                </Alert>
              )
            )}

            <Form>
              <Form.Group style={{ textAlign: "left" }}>
                <Form.Label>
                  <strong>Number of Questions:</strong>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Number of Questions"
                  pattern="[0-9]*"
                  name="question"
                  value={this.state.question}
                  onChange={this.whenChangeHandler}
                />
              </Form.Group>
              <Form.Group style={{ textAlign: "left" }}>
                <Form.Label>
                  <strong>Knowlege Area:</strong>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="area"
                  onChange={this.whenChangeHandler}
                  value={this.state.area}
                >
                  <option value="" style={{ color: "silver" }}>
                    Select Knowledge Area
                  </option>
                  {this.props.areas.map((area, i) => (
                    <option value={area.area} key={i}>
                      {area.area}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group style={{ textAlign: "left" }}>
                <Form.Label>
                  <strong>Region:</strong>
                </Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.region}
                  onChange={this.whenChangeHandler}
                  name="region"
                >
                  <option value="" style={{ color: "silver" }}>
                    Select Region
                  </option>
                  {data.regions.map((region, i) => (
                    <option value={region} key={i}>
                      {region}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group style={{ textAlign: "left" }}>
                <Form.Label>
                  <strong>Difficulty Level:</strong>
                </Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.difficulty}
                  onChange={this.whenChangeHandler}
                  name="difficulty"
                >
                  <option value="" style={{ color: "silver" }}>
                    Select Difficulty Level
                  </option>
                  {data.difficultyLevels.map((difficulty, i) => (
                    <option value={difficulty} key={i}>
                      {difficulty}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              {this.state.isLoading ? (
                <Form.Group>
                  <Button
                    variant="success"
                    onClick={this.searchQuestionAndAnswer}
                  >
                    Search Questions
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
        {this.state.questions.length !== 0 && (
          <PrintQuestions questions={this.state.questions} />
        )}
      </div>
    );
  }
}
export default withRouter(QuizForm);
