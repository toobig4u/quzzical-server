import React, { Component } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Edit, Delete } from "@material-ui/icons";
import EditDialog from "./EditDialog";
import TableQuiz from "./TableQuiz";
import { Alert } from "react-bootstrap";
import { getFromStorage } from "../../../utils/storage";
import { withRouter } from "react-router";
import { CircularProgress } from "@material-ui/core";
import data from "../../../data/data.json";

class QuizForm extends Component {
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
    error: "",
    tableData: [],
    isDataFetch: false,
    isLoading: true,
    areas: []
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
            this.areaGetRequest();
            this.setState({ tableData: json.quiz });
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

  addAnswerHandler = () => {
    if (this.state.answer.trim() !== "") {
      let newArr = this.state.answers;
      newArr.push(this.state.answer);
      this.setState({ answers: [...newArr], answer: "" });
    } else {
      this.setState({ addError: true });
    }
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

  addQuestionPostRequest = () => {
    fetch(process.env.REACT_APP_CREATE_QUIZ_API, {
      method: "POST",
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
                question: "",
                area: "",
                region: "",
                difficulty: "",
                answers: [],
                addQuestionError: false,
                isDataFetch: false
              },
              () => {
                this.questionAndAnswersGetRequest();
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

  addQuestionAndAnswer = () => {
    if (getFromStorage(process.env.REACT_APP_TOKEN_KEY)) {
      if (
        this.state.question.trim() !== "" &&
        this.state.area.trim() !== "" &&
        this.state.region.trim() !== "" &&
        this.state.difficulty.trim() !== "" &&
        this.state.answers.length !== 0
      ) {
        this.setState({ isLoading: false }, () => {
          this.addQuestionPostRequest();
        });
      } else {
        this.setState({ addQuestionError: true, addQuestionSuccess: false });
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
      this.questionAndAnswersGetRequest();
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
            {this.state.addQuestionError ? (
              <Alert variant="danger" style={{ fontSize: "12px" }}>
                All Fields Required or Something went wrong
              </Alert>
            ) : (
              this.state.addQuestionSuccess && (
                <Alert variant="success" style={{ fontSize: "12px" }}>
                  Question and Answer Added Successfully
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
                  {this.state.areas.map((area, i) => (
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
                <Form.Group>
                  <Button variant="success" onClick={this.addQuestionAndAnswer}>
                    Add Question and Answer
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
                question_and_answers_get_request={
                  this.questionAndAnswersGetRequest
                }
                is_data_fetch_change={this.isDataFetchChange}
                areas={this.state.areas}
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
export default withRouter(QuizForm);
