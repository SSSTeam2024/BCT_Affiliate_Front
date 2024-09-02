import React from "react";
import { Container, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import DriverTable from "./DriverTable";
import { useGetAllDriverQuery } from "features/driver/driverSlice";
import { selectCurrentUser } from "features/affiliate/authAffiliateSlice";
import { useSelector } from "react-redux";
import { RootState } from "app/store"; // Import your RootState interface

const Driver = () => {
  document.title = "Drivers | Bouden Coach Travel";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const { data = [] } = useGetAllDriverQuery(user?._id!);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Drivers" pageTitle="Administration" />
          <Row>
            <DriverTable driver={data} />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Driver;
