import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import { Edit, Delete } from "@material-ui/icons";
import EditDialog from "./EditDialog";
import { Alert } from "react-bootstrap";
import { getFromStorage } from "../../../utils/storage";
import { withRouter } from "react-router";
import data from "../../../data/data.json";
import { CircularProgress } from "@material-ui/core";

class TableEditForm extends Component {
  state = {
    question: "",
    area: "",
    region: "",
    difficulty: "",
    answers: [],
    answer: "",
    open: false,
    addError: false,
    addQuestionError: false,
    addQuestionSuccess: false,
    isLoading: true
  };
  whenChangeHandler = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      addError: false,
      addQuestionError: false,
      addQuestionSuccess: false
    });
  };

  addAnswerHandler = () => {
    if (this.state.answer.trim() !== "") {
      let newArr = this.state.answers;
      newArr.push(this.state.answer);
      this.setState({ answers: [...newArr], answer: "" });
    } else {
      this.setState({ addError: true });
    }
  };

  updateQuestionPostRequest = () => {
    fetch(process.env.REACT_APP_UPDATE_QUIZ_API + "?id=" + this.props.data.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getFromStorage(
          process.env.REACT_APP_TOKEN_KEY
        )}`
      },
      body: JSON.stringify({
        question: this.state.question,
        answers: this.state.answers,
        area: this.state.area,
        region: this.state.region,
        difficulty: this.state.difficulty
      })
    })
      .then(res => res.json())
      .then(json => {
        this.setState({ isLoading: true }, () => {
          if (json.success) {
            this.setState(
              {
                addQuestionSuccess: true,
                addQuestionError: false
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

  updateAnswerHandler = (answer, i) => {
    let newArr = this.state.answers;
    newArr[i] = answer;
    this.setState({ answers: [...newArr] });
  };

  deleteHandler = (index, e) => {
    this.setState({
      answers: this.state.answers.filter((item, i) => i !== index)
    });
  };

  updateQuestionAndAnswer = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (
        this.state.question.trim() !== "" &&
        this.state.area.trim() !== "" &&
        this.state.region.trim() !== "" &&
        this.state.difficulty.trim() !== "" &&
        this.state.answers.length !== 0
      ) {
        this.setState({ isLoading: false }, () => {
          this.updateQuestionPostRequest();
        });
      } else {
        this.setState({ addQuestionError: true });
      }
    } else {
      this.props.history.push("/");
    }
  };

  componentDidMount() {
    const { question, answers, region, difficulty, area } = this.props.data;
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      this.setState({ question, answers, region, difficulty, area });
    } else {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div>
        {this.state.addQuestionError ? (
          <Alert variant="danger" style={{ fontSize: "12px" }}>
            All Fields Required or Something went wrong
          </Alert>
        ) : (
          this.state.addQuestionSuccess && (
            <Alert variant="success" style={{ fontSize: "12px" }}>
              Question and Answers Added Successfully
            </Alert>
          )
        )}

        <Form>
          <Form.Group style={{ textAlign: "left" }}>
            <Form.Label>
              <strong>Question:</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Type Question..."
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

          {this.state.addError && (
            <React.Fragment>
              <br />
              <Alert variant="danger" style={{ fontSize: "12px" }}>
                Answer Required
              </Alert>
              <br />
            </React.Fragment>
          )}

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
              style={{ width: "200px" }}
            />
            <br />
            <Button variant="primary" onClick={this.addAnswerHandler}>
              Add Answer
            </Button>
          </Form.Group>
          <br />
          <ol type="a" style={{ textAlign: "left", marginLeft: "10px" }}>
            {this.state.answers.map((item, i) => (
              <li key={i}>
                {item}
                <Edit
                  className="edit"
                  style={{
                    fontSize: "18px",
                    marginLeft: "20px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    this.setState({ open: true });
                  }}
                />
                {this.state.open && (
                  <EditDialog
                    show={this.state.open}
                    index={i}
                    answer={item}
                    name="Update Answer"
                    updateanswerhandler={this.updateAnswerHandler}
                    onHide={() => this.setState({ open: false })}
                  />
                )}
                <Delete
                  className="delete"
                  style={{
                    fontSize: "18px",
                    marginLeft: "10px",
                    cursor: "pointer"
                  }}
                  onClick={() => {
                    this.deleteHandler(i);
                  }}
                />
              </li>
            ))}
          </ol>
          {this.state.isLoading ? (
            <Form.Group
              style={{ marginLeft: "auto", marginRight: "auto" }}
              align="center"
            >
              <Button variant="success" onClick={this.updateQuestionAndAnswer}>
                Update Question and Answer
              </Button>
            </Form.Group>
          ) : (
            <div style={{ textAlign: "center" }}>
              <CircularProgress />
            </div>
          )}
        </Form>
      </div>
    );
  }
}
export default withRouter(TableEditForm);
