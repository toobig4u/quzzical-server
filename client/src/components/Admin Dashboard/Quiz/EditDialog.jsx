import React from "react";
import { Modal, Container, Button } from "react-bootstrap";
import AnswerForm from "./AnswerForm";
import TableEditForm from "./TableEditForm";

const EditDialog = props => {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      size={props.name === "Update Answer" ? "sm" : "lg"} 
      className="color"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ marginBottom: "-100px" }}
        >
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {props.name === "Update Answer" ? (
            <AnswerForm
              updateanswerhandler={props.updateanswerhandler}
              i={props.index}
              answer={props.answer}
            />
          ) : (
            <TableEditForm />
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default EditDialog;
