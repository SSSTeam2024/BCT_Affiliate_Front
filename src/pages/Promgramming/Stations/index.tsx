import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Button,
  Form,
  Modal,
  Offcanvas,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import { GoogleApiWrapper, Map } from "google-maps-react";
import { Marker } from "google-maps-react";

const LoadingContainer = () => <div>Loading...</div>;

const Station = (props: any) => {
  document.title = "Stations | Administartion";

  const [showCoupons, setShowCoupons] = useState<boolean>(false);
  const [showCouponDetails, setShowCouponsDetails] = useState<any>({});
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState({ lat: 0, lng: 0 });

  const handleMapClick = (location: any) => {
    setSelectedLocation({
      lat: location.lat(),
      lng: location.lng(),
    });
  };

  const [modal_AddShippingModals, setmodal_AddShippingModals] =
    useState<boolean>(false);
  function tog_AddShippingModals() {
    navigate("/stations/add-station");
  }
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Station ID</span>,
      selector: (row: any) => row.stationlId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Station Name</span>,
      selector: (row: any) => row.stationName,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Country</span>,
      selector: (row: any) => row.country,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">City</span>,
      selector: (row: any) => row.city,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Region</span>,
      selector: (row: any) => row.region,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">PostCode</span>,
      selector: (row: any) => row.zip,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">GPS Coordinates</span>,
      selector: (row: any) => row.positionMap,
      sortable: true,
    },

    // {
    //   name: <span className="font-weight-bold fs-13">Status</span>,
    //   sortable: true,
    //   selector: (cell: any) => {
    //     switch (cell.status) {
    //                                 case "Done":
    //                                     return (<span className="badge bg-success-subtle text-success"> {cell.status}</span>)
    //                                 case "Cancelled":
    //                                     return (<span className="badge bg-danger-subtle text-danger"> {cell.status}</span>)
    //                                 case "Pending":
    //                                     return (<span className="badge bg-warning-subtle text-warning"> {cell.status}</span>)
    //                                 case "OnRaod":
    //                                     return (<span className="badge bg-secondary-subtle text-secondary"> {cell.status}</span>)
    //                                 case "Paused":
    //                                     return (<span className="badge bg-info-subtle text-info"> {cell.status}</span>)
    //                                 default:
    //                                     return (<span className="badge bg-success-subtle text-success"> {cell.status}</span>)
    //            }
    //   },
    // },

    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,

      cell: (cellProps: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#stationDetails"
                data-bs-toggle="offcanvas"
                className="badge bg-dark-subtle text-body view-item-btn"
                onClick={() => {
                  setShowCouponsDetails(cellProps);
                  setShowCoupons(!showCoupons);
                }}
              >
                <i
                  className="ph ph-eye"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge bg-primary-subtle text-primary edit-item-btn"
              >
                <i
                  className="ph ph-pencil-line"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge bg-danger-subtle text-danger remove-item-btn"
              >
                <i
                  className="ph ph-trash"
                  style={{
                    transition: "transform 0.3s ease-in-out",
                    cursor: "pointer",
                    fontSize: "1.5em",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                ></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];
  const data2 = [
    {
      stationlId: "EUS",
      stationName: "London Euston",
      country: "United Kingdom",
      city: "London",
      region: "Greater London",
      zip: "NW1 2RT",
      positionMap: "51.5284° N, 0.1335° W",
    },
    {
      stationlId: "PAD",
      stationName: "London Paddington",
      country: "United Kingdom",
      city: "London",
      region: " Greater London",
      zip: "W2 1HB",
      positionMap: "51.5154° N, 0.1751° W",
    },
    {
      stationlId: "EUS",
      stationName: "London Euston",
      country: "United Kingdom",
      city: "London",
      region: "Greater London",
      zip: "NW1 2RT",
      positionMap: "51.5284° N, 0.1335° W",
    },
    {
      stationlId: "EUS",
      stationName: "London Euston",
      country: "United Kingdom",
      city: "London",
      region: "Greater London",
      zip: "NW1 2RT",
      positionMap: "51.5284° N, 0.1335° W",
    },
    {
      stationlId: "EUS",
      stationName: "London Euston",
      country: "United Kingdom",
      city: "London",
      region: "Greater London",
      zip: "NW1 2RT",
      positionMap: "51.5284° N, 0.1335° W",
    },
    {
      stationlId: "EUS",
      stationName: "London Euston",
      country: "United Kingdom",
      city: "London",
      region: "Greater London",
      zip: "NW1 2RT",
      positionMap: "51.5284° N, 0.1335° W",
    },
    {
      stationlId: "EUS",
      stationName: "London Euston",
      country: "United Kingdom",
      city: "London",
      region: "Greater London",
      zip: "NW1 2RT",
      positionMap: "51.5284° N, 0.1335° W",
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Stations" pageTitle="Programming " />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3 d-flex justify-content-between">
                  <Col xxl={3} lg={6}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for station ..."
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>

                  <Col className="col-xxl-auto col-sm-auto ms-auto">
                    <Button
                      variant="success"
                      onClick={() => tog_AddShippingModals()}
                      className="add-btn"
                    >
                      <i className="bi bi-plus-circle me-1 align-middle"></i>{" "}
                      Add Station
                    </Button>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable columns={columns} data={data2} pagination />
              </Card.Body>
            </Card>
          </Col>
        </Container>
        <Modal
          className="fade zoomIn"
          size="xl"
          show={modal_AddShippingModals}
          onHide={() => {
            tog_AddShippingModals();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Create Station
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4" id="map-container">
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"
            ></div>
            <Form className="tablelist-form">
              <input type="hidden" id="id-field" />
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <Form.Label htmlFor="customerName-field">
                      Station Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="customerName-field"
                      placeholder="Enter station name"
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="mb-3">
                    <Form.Label htmlFor="supplierName-field">
                      Country
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="supplierName-field"
                      placeholder="Enter country name"
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="mb-3">
                    <Form.Label htmlFor="supplierName-field">City</Form.Label>
                    <Form.Control
                      type="text"
                      id="supplierName-field"
                      placeholder="Enter city name"
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="mb-3">
                    <Form.Label htmlFor="supplierName-field">Region</Form.Label>
                    <Form.Control
                      type="text"
                      id="supplierName-field"
                      placeholder="Enter region name"
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="mb-3">
                    <Form.Label htmlFor="supplierName-field">
                      PostCode
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="supplierName-field"
                      placeholder="Enter zip code"
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                {/* <Map
                  google={props.google}
                  style={{
                    width: "90%",
                    height: "85px",
                    //position: "relative",
                  }}
                  initialCenter={{ lat: 0, lng: 0 }}
                  center={selectedLocation}
                  zoom={14}
                  onClick={(t: any, map: any, c: any) =>
                    handleMapClick(c.latLng)
                  }
                >
                  <Marker
                    name={"Selected location"}
                    position={selectedLocation}
                  />
                </Map> */}
                 </Col>
                <Col lg={12}>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        tog_AddShippingModals();
                      }}
                      data-bs-dismiss="modal"
                    >
                      <i className="ri-close-line align-bottom me-1"></i> Close
                    </Button>
                    <Button variant="primary" id="add-btn">
                      Add Station
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      <Offcanvas
        show={showCoupons}
        onHide={() => setShowCoupons(!showCoupons)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Station details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* <div>
                        <img src={offerbanner} alt="" className="img-thumbnail" />
                    </div> */}
          <div className="mt-3">
            <div className="table-responsive">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>
                      <span className="text-muted">Station Name</span>
                    </td>
                    <td>
                      <span className="fw-medium text-uppercase">
                        {showCouponDetails.stationName}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Country</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.country}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">City</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.city}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="text-muted">Region</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.region}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">PostCode </span>
                    </td>
                    <td>
                      <span className="fw-medium">{showCouponDetails.zip}</span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">GPS Coordinates</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.positionMap}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </React.Fragment>
  );
};
export default GoogleApiWrapper({
  apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
  LoadingContainer: LoadingContainer,
  v: "3",
})(Station);
