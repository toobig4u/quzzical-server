import React from "react";
import { Modal, Container, Button } from "react-bootstrap";

const TableDeleteDialog = props => {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      size="sm"
      className="color"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ marginBottom: "-100px" }}
        >
          Delete Question
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container style={{ textAlign: "center" }}>
          Are you sure you want to delete?
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>No</Button>
        <Button
          variant="danger"
          style={{ marginLeft: "15px" }}
          onClick={() => {
            props.delete_question_request();
            props.onHide();
          }}
        >
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default TableDeleteDialog;
