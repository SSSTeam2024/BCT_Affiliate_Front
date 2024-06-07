import React from "react";
import { Container, Card } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";

const UserManual = () => {
  document.title = "User Manual | Bouden Coach Travel";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="User Manual" pageTitle="Help" />
          <Card>
            <Card.Header className="border-0">
              <h3>User Manual</h3>
            </Card.Header>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default UserManual;