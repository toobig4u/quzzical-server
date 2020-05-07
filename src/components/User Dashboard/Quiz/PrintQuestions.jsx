import React, { Component } from "react";
import { Card, Button } from "react-bootstrap";
import ReactToPrint from "react-to-print";

class PrintQuestions extends Component {
  render() {
    return (
      <div>
        <Card style={{ textAlign: "left" }}>
          <Card.Body>
            <section
              ref={el => (this.componentRef = el)}
              style={{ margin: "20px" }}
            >
              <h2 style={{ textAlign: "center" }}>Quizzical</h2>
              Number of questions:{" "}
              <strong>{this.props.questions.length}</strong>
              <br />
              Knowledge Area: <strong>{this.props.questions[0].area}</strong>
              <br />
              Geographical Region:{" "}
              <strong>{this.props.questions[0].region}</strong>
              <br />
              Difficulty Level:{" "}
              <strong>{this.props.questions[0].difficulty}</strong>
              <br />
              <hr />
              <br />
              <ol style={{ marginLeft: "15px" }}>
                {this.props.questions.map((question, i) => (
                  <li key={i}>
                    {question.question}
                    <br />
                    <ol type="a" style={{ marginLeft: "15px" }}>
                      {question.answers.map((answer, i) => (
                        <li key={i}>{answer}</li>
                      ))}
                    </ol>
                    <br />
                  </li>
                ))}
              </ol>
            </section>
          </Card.Body>
        </Card>
        <br />
        <ReactToPrint
          trigger={() => <Button variant="danger">Print Questions</Button>}
          content={() => this.componentRef}
        />

        <br />
      </div>
    );
  }
}

export default PrintQuestions;
