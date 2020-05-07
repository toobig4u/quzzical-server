import React from "react";
import { Modal, Container, Button } from "react-bootstrap";
import EditInfoForm from "./EditInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";

const EditDialog = props => {
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
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {props.name === "Edit Information" ? (
            <EditInfoForm
              name={props.namee}
              email={props.email}
              authenticateUser={props.authenticateuser}
            />
          ) : (
            <ChangePasswordForm email={props.email} />
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
