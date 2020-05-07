import React from "react";
import { Modal, Container, Button } from "react-bootstrap";
import TableEditForm from "./TableEditForm";

const TableEditDialog = props => {
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
      className="color"
    >
      <Modal.Header closeButton>
        <Modal.Title
          id="contained-modal-title-vcenter"
          style={{ marginBottom: "-50px" }}
        >
          {props.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <TableEditForm
            data={props.data}
            question_and_answers_get_request={() =>
              props.question_and_answers_get_request()
            }
            is_data_fetch_change={() => props.is_data_fetch_change()}
            areas={props.areas}
          />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default TableEditDialog;
