import React from "react";
import { Modal, Container, Button } from "react-bootstrap";
import TableEditForm from "./TableEditForm";

const EditDialog = props => {
  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" size="lg">
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
          <TableEditForm />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default EditDialog;
