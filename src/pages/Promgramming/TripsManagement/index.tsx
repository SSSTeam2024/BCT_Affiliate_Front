import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Button,
  Form,Modal
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";

const TripsManagement = () => {
  document.title = " Jobs Management | School Administration";

  const [modal_AddShippingModals, setmodal_AddShippingModals] = useState<boolean>(false);
  function tog_AddShippingModals() {
      setmodal_AddShippingModals(!modal_AddShippingModals);
  }
  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Trip ID</span>,
      selector: (row: any) => row.modalId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Scheduale ID</span>,
      selector: (row: any) => row.purchaseId,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">PickUp Time/Date</span>,
      selector: (row: any) => row.pickup_time,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">DropDown Time/Date</span>,
      selector: (row: any) => row.dropdown_time,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">PickUp Station</span>,
      selector: (row: any) => row.pickup_station,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">DropDown Station</span>,
      selector: (row: any) => row.dropdown_station,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Middle Station</span>,
      selector: (row: any) => row.type_trip,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      sortable: true,
      selector: (cell: any) => {
        switch (cell.status) {
                                    case "Done":
                                        return (<span className="badge bg-success-subtle text-success"> {cell.status}</span>)
                                    case "Cancelled":
                                        return (<span className="badge bg-danger-subtle text-danger"> {cell.status}</span>)
                                    case "Pending":
                                        return (<span className="badge bg-warning-subtle text-warning"> {cell.status}</span>)
                                    case "OnRaod":
                                        return (<span className="badge bg-secondary-subtle text-secondary"> {cell.status}</span>)
                                    case "Paused":
                                        return (<span className="badge bg-info-subtle text-info"> {cell.status}</span>)
                                    default:
                                        return (<span className="badge bg-success-subtle text-success"> {cell.status}</span>)
               }
      },
    },

    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,

      cell: () => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#"
                className="badge bg-info-subtle text-info view-item-btn"
              >
                <i className="ph ph-eye"></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge bg-success-subtle text-success edit-item-btn"
              >
                <i className="ph ph-pencil-line"></i>
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="badge bg-danger-subtle text-danger remove-item-btn"
              >
                <i className="ph ph-trash"></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];
  const data2 = [
    {
      srNo: "01",
      modalId: "VLZ-452",
      purchaseId: "VLZ1400087402",
      dropdown_station: "Adderley St",
      pickup_station: "Birmingham Coach Station",
      dropdown_time: "Mon Jan 28 08:15",
      pickup_time: "Mon Jan 28 07:15",
      type_trip: "Regular Trip",
      status: "Done",
    },
    {
      srNo: "02",
      modalId: "VLZ-453",
      purchaseId: "VLZ1400087425",
      dropdown_station: "Adderley St",
      pickup_station: "Birmingham Coach Station",
      dropdown_time: "Wed Jan 28 11:00",
      pickup_time: "Wed Jan 30 10:00",
      type_trip: "Extra Trip",
      status: "OnRaod",
    },
    {
      srNo: "02",
      modalId: "VLZ-453",
      purchaseId: "VLZ1400087425",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Fri Feb 01 07:30",
      pickup_time: "Fri Feb 01 06:00",
      type_trip: "Offer Trip",
      status: "Pending",
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Jobs Management" pageTitle="Programming " />
          <Col lg={12}>
            <Card id="shipmentsList">
            <Card.Header className="border-bottom-dashed">
                            <Row className="g-3">
                                <Col xxl={3} lg={6}>
                                    <div className="search-box">
                                        <input type="text" className="form-control search" placeholder="Search for a job ..." />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </Col>
                                <Col xxl={3} lg={6}>
                                    
                                    <Flatpickr
                                        className="form-control flatpickr-input"
                                        placeholder='Select Date'
                                        options={{
                                            mode: "range",
                                            dateFormat: "d M, Y",
                                        }}
                                    />
                                </Col>
                                <Col xxl={2} lg={6}>
                                    <select className="form-select" data-choices data-choices-search-false name="choices-single-default" id="idStatus">
                                        <option value="">Job Status</option>
                                        <option value="Paused">Paid</option>
                                        <option value="Pending">Unpaid</option>
                                      
                                    </select>
                                </Col>
                                <Col xxl={2} lg={6}>
                                    <select className="form-select" data-choices data-choices-search-false name="choices-single-default">
                                        <option value="">Status</option>
                                        <option defaultValue="all">All</option>
                                        <option value="Today">Today</option>
                                        <option value="Yesterday">Yesterday</option>
                                        <option value="Last 7 Days">Last 7 Days</option>
                                        <option value="Last 30 Days">Last 30 Days</option>
                                        <option value="This Month">This Month</option>
                                        <option value="Last Month">Last Month</option>
                                    </select>
                                </Col>
                                <Col xxl={2} lg={6}>
                                <Link to="/scheduling"><Button variant='success' onClick={() => tog_AddShippingModals()} className="add-btn"><i className="bi bi-plus-circle me-1 align-middle"></i> Add Job</Button></Link>
                                </Col>
                            </Row>
                        </Card.Header>
              <Card.Body>
                <DataTable columns={columns} data={data2} pagination />
              </Card.Body>
            </Card>
          </Col>
        </Container>
        <Modal className="fade zoomIn" size="lg" show={modal_AddShippingModals} onHide={() => { tog_AddShippingModals(); }} centered>
                        <Modal.Header className="px-4 pt-4" closeButton>
                            <h5 className="modal-title fs-18" id="exampleModalLabel">Create Shipping</h5>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            <div id="alert-error-msg" className="d-none alert alert-danger py-2"></div>
                            <Form className="tablelist-form">
                                <input type="hidden" id="id-field" />
                                <Row>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="customerName-field">Customer Name</Form.Label>
                                            <Form.Control type="text" id="customerName-field" placeholder="Enter customer name" required />
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="supplierName-field">Supplier Name</Form.Label>
                                            <Form.Control type="text" id="supplierName-field" placeholder="Enter supplier name" required />
                                        </div>
                                    </Col>

                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="orderDate-field">Order Date</Form.Label>
                                            <Flatpickr
                                                className="form-control flatpickr-input"
                                                placeholder='Select Date'
                                                options={{
                                                    dateFormat: "d M, Y",
                                                }}
                                            />
                                            {/* <Form.Control type="text" id="orderDate-field" data-provider="flatpickr" data-date-format="d M, Y" placeholder="Select date" required /> */}
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="mb-3">
                                            <Form.Label htmlFor="arrivalDate-field">Arrival Date</Form.Label>
                                            <Flatpickr
                                                className="form-control flatpickr-input"
                                                placeholder='Select Date'
                                                options={{
                                                    dateFormat: "d M, Y",
                                                }}
                                            />
                                            {/* <Form.Control type="text" id="arrivalDate-field" data-provider="flatpickr" data-date-format="d M, Y" placeholder="Select date" required /> */}
                                        </div>
                                    </Col>
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label htmlFor="locationSelect" className="form-label">Location</label>
                                            <select className="form-select" name="choices-single-default" id="locationSelect" required>
                                                <option value="">Location</option>
                                                <option value="Ascension Island">Ascension Island</option>
                                                <option value="Andorra">Andorra</option>
                                                <option value="United Arab Emirates">United Arab Emirates</option>
                                                <option value="Afghanistan">Afghanistan</option>
                                                <option value="Antigua and Barbuda">Antigua and Barbuda</option>
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
                                            <label htmlFor="statusSelect" className="form-label">Status</label>
                                            <select className="form-select" name="choices-single-default" id="statusSelect" required>
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
                                            <Button className="btn-ghost-danger" onClick={() => { tog_AddShippingModals(); }} data-bs-dismiss="modal"><i className="ri-close-line align-bottom me-1"></i> Close</Button>
                                            <Button variant='primary' id="add-btn">Add Job</Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal.Body>
                    </Modal>
      </div>
    </React.Fragment>
  );
};
export default TripsManagement;

