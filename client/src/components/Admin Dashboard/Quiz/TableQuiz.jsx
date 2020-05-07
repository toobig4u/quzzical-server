import React, { Component } from "react";
import { MDBDataTable } from "mdbreact";
import { Edit, Delete } from "@material-ui/icons";
import TableEditDialog from "./TableEditDialog";
import TableDeleteDialog from "./TableDeleteDialog";
import { Alert } from "react-bootstrap";
import { getFromStorage } from "../../../utils/storage";

export default class TableQuiz extends Component {
  state = {
    data: {
      columns: [
        {
          label: "#",
          field: "number",
          sort: "asc"
        },
        {
          label: "Question",
          field: "question",
          sort: "asc"
        },
        {
          label: "Knowledge Area",
          field: "area",
          sort: "asc"
        },
        {
          label: "Region",
          field: "region",
          sort: "asc"
        },
        {
          label: "Difficulty Level",
          field: "difficulty",
          sort: "asc"
        },
        {
          label: "Answers",
          field: "answers",
          sort: "asc"
        },
        {
          label: "Action",
          field: "action",
          sort: "asc"
        }
      ],
      rows: []
    },
    open: false,
    dataEdit: {
      id: "",
      question: "",
      area: "",
      region: "",
      difficulty: "",
      answers: []
    },
    id: "",
    openDelete: false,
    error: "",
    success: ""
  };

  deleteQuestionRequest = () => {
    fetch(process.env.REACT_APP_DELETE_QUIZ_API + "?id=" + this.state.id, {
      method: "DELETE",
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
          this.setState(
            {
              success: "Data Deleted Successfully",
              error: ""
            },
            () => {
              setTimeout(
                () =>
                  this.setState(
                    {
                      success: ""
                    },
                    () => {
                      this.props.is_data_fetch_change(false);
                      this.props.question_and_answers_get_request();
                    }
                  ),
                600
              );
            }
          );
        } else {
          this.setState({ error: "Something went wrong", success: "" }, () => {
            setTimeout(
              () =>
                this.setState({
                  error: ""
                }),
              1000
            );
          });
        }
      })
      .catch(err => {
        this.setState({ error: "Something went wrong", success: "" }, () => {
          setTimeout(
            () =>
              this.setState({
                error: ""
              }),
            1000
          );
        });
      });
  };

  initializationOfData = () => {
    let newArr = [];

    this.props.tableData.forEach((item, i) => {
      newArr.push({
        id: item._id,
        number: i + 1,
        question: item.question,
        area: item.area,
        region: item.region,
        difficulty: item.difficulty,
        answers: item.answers.map((answer, i) => (
          <span key={i}>
            {i + 1 + ". "} {answer} <br />
          </span>
        )),
        action: (
          <React.Fragment>
            <Edit
              style={{ fontSize: "18px", cursor: "pointer" }}
              className="edit"
              onClick={() => {
                this.setState({
                  open: true,
                  dataEdit: {
                    id: item._id,
                    question: item.question,
                    area: item.area,
                    region: item.region,
                    difficulty: item.difficulty,
                    answers: item.answers
                  }
                });
              }}
            />
            <Delete
              style={{
                fontSize: "18px",
                cursor: "pointer",
                marginLeft: "10px"
              }}
              className="delete"
              onClick={() => {
                this.setState({ id: item._id, openDelete: true });
              }}
            />
          </React.Fragment>
        )
      });
    });
    this.setState({
      data: {
        columns: this.state.data.columns,
        rows: newArr
      }
    });
  };

  componentDidMount() {
    this.initializationOfData();
  }

  render() {
    return (
      <div>
        <TableEditDialog
          show={this.state.open}
          name="Update Question"
          onHide={() => this.setState({ open: false })}
          data={this.state.dataEdit}
          is_data_fetch_change={() => this.props.is_data_fetch_change()}
          question_and_answers_get_request={() =>
            this.props.question_and_answers_get_request()
          }
          areas={this.props.areas}
        />
        <TableDeleteDialog
          show={this.state.openDelete}
          name="Delete Question"
          onHide={() => this.setState({ openDelete: false })}
          delete_question_request={() => this.deleteQuestionRequest()}
        />
        {this.state.error !== "" ? (
          <Alert variant="danger" style={{ fontSize: "12px" }}>
            {this.state.error}
          </Alert>
        ) : (
          this.state.success !== "" && (
            <Alert variant="success" style={{ fontSize: "12px" }}>
              {this.state.success}
            </Alert>
          )
        )}
        <MDBDataTable
          striped
          bordered
          small
          data={this.state.data}
          hover
          responsive
          noBottomColumns
          style={{ color: "rgb(15, 131, 131)" }}
        />
      </div>
    );
  }
}
