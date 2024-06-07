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
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";

const ListExtraTrip = () => {
  document.title = "Extra Trips | School Administartion";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedHandledBy, setSelectedHandledBy] = useState("");
  
  const [showCoupons, setShowCoupons] = useState<boolean>(false);
  const [showCouponDetails, setShowCouponsDetails] = useState<any>({});
  

  const [modal_AddShippingModals, setmodal_AddShippingModals] =
    useState<boolean>(false);

  const data3 = [
    {
      stationlId: "#87756",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "Return",
      cost: "3300£",
      handledBy: "Bouden",
      status: "Done",
      numberStudents: "54",
    },
    {
      stationlId: "#87757",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "Return",
      cost: "6300£",
      handledBy: "Bouden",
      status: "Paused",
      numberStudents: "94",
    },
    {
      stationlId: "#87758",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "One Way",
      cost: "300£",
      handledBy: "SubContractor",
      status: "OnRaod",
      numberStudents: "56",
    },
    {
      stationlId: "#87759",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "Return",
      cost: "600£",
      handledBy: "SubContractor",
      status: "Cancelled",
      numberStudents: "96",
    },
    {
      stationlId: "#87760",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "Return",
      cost: "300£",
      handledBy: "Bouden",
      status: "Pending",
      numberStudents: "56",
    },
    {
      stationlId: "#87761",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "One Way",
      cost: "900£",
      handledBy: "Bouden",
      status: "OnRaod",
      numberStudents: "70",
    },
    {
      stationlId: "#87762",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "Return",
      cost: "809£",
      handledBy: "Bouden",
      status: "Done",
      numberStudents: "56",
    },
    {
      stationlId: "#87763",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "Return",
      cost: "300£",
      handledBy: "SubContractor",
      status: "Pending",
      numberStudents: "56",
    },
    {
      stationlId: "#87764",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "One Way",
      cost: "300£",
      handledBy: "SubContractor",
      status: "OnRaod",
      numberStudents: "56",
    },
    {
      stationlId: "#87765",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "One Way",
      cost: "760£",
      handledBy: "SubContractor",
      status: "Cancelled",
      numberStudents: "56",
    },
    {
      stationlId: "#87766",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "Return",
      cost: "300£",
      handledBy: "SubContractor",
      status: "OnRaod",
      numberStudents: "56",
    },
    {
      stationlId: "#87767",
      stationDropDown: "Adderley St",
      stationPickUp: "Birmingham Coach Station",
      datePickUp: "Jan 28 08:15",
      dateDropDown: "Jan 29 08:15",
      category: "One Way",
      cost: "300£",
      handledBy: "Bouden",
      status: "OnRaod",
      numberStudents: "76",
    },
  ];
  
  const filteredTrips = data3.filter((product) => {
    const matchesSearchQuery =
      !searchQuery ||
      (product &&
        product.stationlId &&
        product.category &&
        product.numberStudents &&
        product.cost &&
        product.dateDropDown &&
        product.datePickUp &&
        product.handledBy &&
        product.status &&
        product.stationDropDown &&
        product.stationPickUp &&
        (product.numberStudents
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.handledBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.cost.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.dateDropDown
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.datePickUp
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.stationDropDown
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.stationPickUp
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.stationlId
            .toLowerCase()
            .includes(searchQuery.toLowerCase())));

    const matchesSelectedStatus =
      !selectedStatus ||
      (product &&
        product.status &&
        product.status.toLowerCase() === selectedStatus.toLowerCase());

    const matchesSelectedCategory =
      !selectedCategory ||
      (product &&
        product.category &&
        product.category.toLowerCase() === selectedCategory.toLowerCase());

        const matchesSelectedHandledBy =
        !selectedHandledBy ||
        (product &&
          product.handledBy &&
          product.handledBy.toLowerCase() === selectedHandledBy.toLowerCase());

    if (!searchQuery && !selectedStatus && !selectedCategory  && !selectedHandledBy) {
      return true;
    }

    return (
      matchesSearchQuery && matchesSelectedStatus && matchesSelectedCategory && matchesSelectedHandledBy
    );
  });

  function tog_AddShippingModals() {
    setmodal_AddShippingModals(!modal_AddShippingModals);
  }
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Extra Trip ID</span>,
      selector: (row: any) => row.stationlId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Number Students</span>,
      selector: (row: any) => row.numberStudents,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">PickUp Station</span>,
      selector: (row: any) => row.stationPickUp,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">PickUp Date</span>,
      selector: (row: any) => row.datePickUp,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">DropDown Station</span>,
      selector: (row: any) => row.stationDropDown,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">DropDown Date</span>,
      selector: (row: any) => row.dateDropDown,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Cost</span>,
      selector: (row: any) => row.cost,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Handled By</span>,
      sortable: true,
      selector: (cell: any) => {
        switch (cell.handledBy) {
          case "Bouden":
            return (
              <span className="badge bg-dark-subtle text-dark">
                {" "}
                {cell.handledBy}
              </span>
            );

          case "SubContractor":
            return (
              <span className="badge bg-danger-subtle text-danger">
                {" "}
                {cell.handledBy}
              </span>
            );
          default:
            return (
              <span className="badge bg-dark-subtle text-dark">
                {" "}
                {cell.handledBy}
              </span>
            );
        }
      },
    },
    {
      name: <span className="font-weight-bold fs-13">Category</span>,
      sortable: true,
      selector: (cell: any) => {
        switch (cell.category) {
          case "One Way":
            return (
              <span className="badge bg-warning-subtle text-warning">
                {" "}
                {cell.category}
              </span>
            );

          case "Return":
            return (
              <span className="badge bg-dark-subtle text-secondary">
                {" "}
                {cell.category}
              </span>
            );
          default:
            return (
              <span className="badge bg-warning-subtle text-warning">
                {" "}
                {cell.category}
              </span>
            );
        }
      },
    },

    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      sortable: true,
      selector: (cell: any) => {
        switch (cell.status) {
          case "Done":
            return (
              <span className="badge bg-success-subtle text-success">
                {cell.status}
              </span>
            );
          case "Cancelled":
            return (
              <span className="badge bg-danger-subtle text-danger">
                {cell.status}
              </span>
            );
          case "Pending":
            return (
              <span className="badge bg-warning-subtle text-warning">
                {cell.status}
              </span>
            );
          case "OnRaod":
            return (
              <span className="badge bg-secondary-subtle text-secondary">
                {cell.status}
              </span>
            );
          case "Paused":
            return (
              <span className="badge bg-info-subtle text-info">
                {cell.status}
              </span>
            );
          default:
            return (
              <span className="badge bg-success-subtle text-success">
                {cell.status}
              </span>
            );
        }
      },
    },

    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,

      cell: (cellProps:any) => {
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
                <i className="ph ph-eye" style={{ transition: 'transform 0.3s ease-in-out', cursor: 'pointer' ,fontSize: '1.5em',}}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge bg-info-subtle text-info edit-item-btn"
              >
                <i className="ph ph-file-pdf" style={{ transition: 'transform 0.3s ease-in-out', cursor: 'pointer' ,fontSize: '1.5em',}}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge bg-danger-subtle text-danger remove-item-btn"
              >
                <i className="ph ph-trash" style={{ transition: 'transform 0.3s ease-in-out', cursor: 'pointer' ,fontSize: '1.5em',}}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Extra Trips" pageTitle="Tools " />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col xxl={2} lg={2}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for trip..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col xxl={2} lg={2}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Select Date"
                      options={{
                        mode: "range",
                        dateFormat: "d M, Y",
                      }}
                    />
                  </Col>
                  <Col xxl={2} lg={2}>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">Trip Status</option>
                      <option value="paused">Paused</option>
                      <option value="pending">Pending</option>
                      <option value="done">Done</option>
                      <option value="onRaod">OnRaod</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </Col>
                  <Col xxl={2} lg={2}>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Category</option>
                      <option value="one way">One Way</option>
                      <option value="return">Return</option>
                    </select>
                  </Col>
                  <Col xxl={2} lg={2}>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                      value={selectedHandledBy}
                      onChange={(e) => setSelectedHandledBy(e.target.value)}
                    >
                      <option value="">Handled By</option>
                      <option value="bouden">Bouden</option>
                      <option value="subcontractor">SubContractor</option>
                    </select>
                  </Col>
                  <Col xxl={2} lg={2}>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                    >
                      <option value="">This Month</option>
                      <option defaultValue="all">All</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="last 7 days">Last 7 Days</option>
                      <option value="last 30 days">Last 30 Days</option>
                      <option value="this month">This Month</option>
                      <option value="last month">Last Month</option>
                    </select>
                  </Col>
                  <Col xxl={2} lg={6}>
                    {/* <Link to="/scheduling"><Button variant='success' onClick={() => tog_AddShippingModals()} className="add-btn"><i className="bi bi-plus-circle me-1 align-middle"></i> Add Job</Button></Link> */}
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable columns={columns} data={filteredTrips} pagination />
              </Card.Body>
            </Card>
          </Col>
        </Container>
        <Modal
          className="fade zoomIn"
          size="lg"
          show={modal_AddShippingModals}
          onHide={() => {
            tog_AddShippingModals();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Create Shipping
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
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
                      Customer Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="customerName-field"
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="mb-3">
                    <Form.Label htmlFor="supplierName-field">
                      Supplier Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="supplierName-field"
                      placeholder="Enter supplier name"
                      required
                    />
                  </div>
                </Col>

                <Col lg={6}>
                  <div className="mb-3">
                    <Form.Label htmlFor="orderDate-field">
                      Order Date
                    </Form.Label>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Select Date"
                      options={{
                        dateFormat: "d M, Y",
                      }}
                    />
                    {/* <Form.Control type="text" id="orderDate-field" data-provider="flatpickr" data-date-format="d M, Y" placeholder="Select date" required /> */}
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-3">
                    <Form.Label htmlFor="arrivalDate-field">
                      Arrival Date
                    </Form.Label>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Select Date"
                      options={{
                        dateFormat: "d M, Y",
                      }}
                    />
                    {/* <Form.Control type="text" id="arrivalDate-field" data-provider="flatpickr" data-date-format="d M, Y" placeholder="Select date" required /> */}
                  </div>
                </Col>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label htmlFor="locationSelect" className="form-label">
                      Location
                    </label>
                    <select
                      className="form-select"
                      name="choices-single-default"
                      id="locationSelect"
                      required
                    >
                      <option value="">Location</option>
                      <option value="Ascension Island">Ascension Island</option>
                      <option value="Andorra">Andorra</option>
                      <option value="United Arab Emirates">
                        United Arab Emirates
                      </option>
                      <option value="Afghanistan">Afghanistan</option>
                      <option value="Antigua and Barbuda">
                        Antigua and Barbuda
                      </option>
                      <option value="Armenia">Armenia</option>
                      <option value="Antarctica">Antarctica</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Australia">Australia</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Benin">Benin</option>
                      <option value="Bermuda">Bermuda</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Belarus">Belarus</option>
                      <option value="Canada">Canada</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="Cook Islands">Cook Islands</option>
                      <option value="Chile">Chile</option>
                      <option value="China">China</option>
                      <option value="Christmas Island">Christmas Island</option>
                      <option value="Cyprus">Cyprus</option>
                      <option value="Germany">Germany</option>
                      <option value="Denmark">Denmark</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Estonia">Estonia</option>
                      <option value="Spain">Spain</option>
                      <option value="Ethiopia">Ethiopia</option>
                      <option value="Europe">Europe</option>
                      <option value="Finland">Finland</option>
                      <option value="Faroe Islands">Faroe Islands</option>
                      <option value="France">France</option>
                      <option value="England">England</option>
                      <option value="Scotland">Scotland</option>
                      <option value="Georgia">Georgia</option>
                      <option value="UA">UA</option>
                      <option value="Poland">Poland</option>
                      <option value="Italy">Italy</option>
                      <option value="Ukraine">Ukraine</option>
                      <option value="Serbia">Serbia</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Albania">Albania</option>
                      <option value="Spain">Spain</option>
                      <option value="Jersey">Jersey</option>
                    </select>
                  </div>
                </div>
                <Col lg={6}>
                  <div className="mb-3">
                    <label htmlFor="statusSelect" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      name="choices-single-default"
                      id="statusSelect"
                      required
                    >
                      <option value="">Status</option>
                      <option value="Pickups">Pickups</option>
                      <option value="Pending">Pending</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Out Of Delivery">Out Of Delivery</option>
                    </select>
                  </div>
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
                      Add Job
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
          <Offcanvas.Title>Extra Trip details</Offcanvas.Title>
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
                      <span className="text-muted">Extra Trip ID</span>
                    </td>
                    <td>
                      <span className="fw-medium text-uppercase">
                        {showCouponDetails.stationlId}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Number Students</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.numberStudents}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">PickUp Station</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.stationPickUp}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="text-muted">PickUp Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.datePickUp}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">DropDown Date </span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.dateDropDown}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Cost</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.cost}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Category</span>
                    </td>
                    <td>
                      <span
                        className={(() => {
                          switch (showCouponDetails.category) {
                            
                            case "One Way":
                              return "badge bg-warning-subtle text-warning text-uppercase";
                            case "Return":
                              return "badge bg-dark-subtle text-secondary text-uppercase";

                           
                            default:
                              return "badge bg-success-subtle text-success text-uppercase";
                          }
                        })()}
                      >
                        {showCouponDetails.category}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Handled By</span>
                    </td>
                    <td>
                      <span
                        className={(() => {
                          switch (showCouponDetails.handledBy) {
                            
                            case "Bouden":
                              return "badge bg-dark-subtle text-dark text-uppercase";
                            case "SubContractor":
                              return "badge bg-danger-subtle text-danger text-uppercase";
                            
                           
                            default:
                              return "badge bg-dark-subtle text-dark text-uppercase";
                          }
                        })()}
                      >
                        {showCouponDetails.handledBy}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Status</span>
                    </td>
                    <td>
                      <span
                        className={(() => {
                          switch (showCouponDetails.status) {
                            
                            case "Done":
                              return "badge bg-success-subtle text-success text-uppercase";
                            case "Cancelled":
                              return "badge bg-danger-subtle text-danger text-uppercase";
                            case "Pending":
                              return "badge bg-warning-subtle text-warning text-uppercase";
                            case "OnRaod":
                              return "badge bg-secondary-subtle text-secondary text-uppercase";
                              case "Paused":
                                return "badge bg-info-subtle text-info text-uppercase";
                           
                            default:
                              return "badge bg-success-subtle text-success text-uppercase";
                          }
                        })()}
                      >
                        {showCouponDetails.status}
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
export default ListExtraTrip;
