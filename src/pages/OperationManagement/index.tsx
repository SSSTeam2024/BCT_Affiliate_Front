import React, { useState } from "react";
import { Container, Row, Card, Col, Offcanvas } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";



const OperationsManagement = () => {
  document.title = " Operations Management | School Administration";
  const [searchQuery, setSearchQuery] = useState("");
  const [showCoupons, setShowCoupons] = useState<boolean>(false);
  const [showCouponDetails, setShowCouponsDetails] = useState<any>({});
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Trip</span>,
      selector: (row: any) => row.modalId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Groups</span>,
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
      name: <span className="font-weight-bold fs-13">Type</span>,
      selector: (row: any) => row.type_trip,
      sortable: true,
    },

    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      sortable: true,
      selector: (cell: any) => {
        switch (cell.status) {
          case "Finished":
            return (
              <span className="badge bg-success-subtle text-success">
                {" "}
                {cell.status}
              </span>
            );
          case "Delayed":
            return (
              <span className="badge bg-danger-subtle text-danger">
                {" "}
                {cell.status}
              </span>
            );
          case "Changing Route":
            return (
              <span className="badge bg-info-subtle text-info">
                {" "}
                {cell.status}
              </span>
            );
          case "OnSite":
            return (
              <span className="badge bg-dark-subtle text-dark">
                {" "}
                {cell.status}
              </span>
            );

          default:
            return (
              <span className="badge bg-success-subtle text-success">
                {" "}
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
                  to="#tripDetails"
                  data-bs-toggle="offcanvas"
                  className="badge bg-info-subtle text-info view-item-btn"
                  onClick={() => {
                    setShowCouponsDetails(cellProps);
                    setShowCoupons(!showCoupons);
                  }}
                >
                <i className="ph ph-eye"
                style={{ transition: 'transform 0.3s ease-in-out', cursor: 'pointer' ,fontSize: '1.5em',}}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}></i>
              </Link>
            </li>
            <li>
              <Link
                to="showModal"
                
                className="badge bg-primary-subtle text-primary edit-item-btn"
              >
                <i className="ph ph-pencil-line" style={{ transition: 'transform 0.3s ease-in-out', cursor: 'pointer' ,fontSize: '1.5em',}}
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

  const data = [
    {
      srNo: "01",
      modalId: "VLZ-452",
      purchaseId: "Group Two",
      dropdown_station: "Adderley St",
      pickup_station: "Birmingham Coach Station",
      dropdown_time: "Jan 28 08:15",
      pickup_time: "Jan 28 07:15",
      type_trip: "Regular Trip",
      status: "OnSite",
    },
    {
      srNo: "02",
      modalId: "VLZ-453",
      purchaseId: "Group Three",
      dropdown_station: "Adderley St",
      pickup_station: "Birmingham Coach Station",
      dropdown_time: "Jan 28 11:00",
      pickup_time: "Jan 30 10:00",
      type_trip: "Extra Trip",
      status: "Delayed",
    },
    {
      srNo: "02",
      modalId: "VLZ-453",
      purchaseId: "Group Five",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 07:30",
      pickup_time: "Feb 01 06:00",
      type_trip: "Offer Trip",
      status: "Finished",
    },
    {
      srNo: "03",
      modalId: "VLZ-454",
      purchaseId: "Group Four",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 08:30",
      pickup_time: "Feb 01 09:00",
      type_trip: "Regular Trip",
      status: "Finished",
    },
    {
      srNo: "03",
      modalId: "VLZ-455",
      purchaseId: "Group Four",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 10:00",
      pickup_time: "Feb 03 10:00",
      type_trip: "Extra Trip",
      status: "Changing Route",
    },
    {
      srNo: "03",
      modalId: "VLZ-455",
      purchaseId: "Group Four",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 10:00",
      pickup_time: "Feb 03 10:00",
      type_trip: "Regular Trip",
      status: "Finished",
    },
    {
      srNo: "03",
      modalId: "VLZ-455",
      purchaseId: "Group Four",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 10:00",
      pickup_time: "Feb 03 10:00",
      type_trip: "Regular Trip",
      status: "Finished",
    },
    {
      srNo: "03",
      modalId: "VLZ-455",
      purchaseId: "Group Four",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 10:00",
      pickup_time: "Feb 03 10:00",
      type_trip: "Offer Trip",
      status: "OnSite",
    },
    {
      srNo: "03",
      modalId: "VLZ-455",
      purchaseId: "Group Four",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 10:00",
      pickup_time: "Feb 03 10:00",
      type_trip: "Regular Trip",
      status: "Changing Route",
    },
    {
      srNo: "03",
      modalId: "VLZ-455",
      purchaseId: "Group Four",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 10:00",
      pickup_time: "Feb 03 10:00",
      type_trip: "Extra Trip",
      status: "Delayed",
    },
    {
      srNo: "03",
      modalId: "VLZ-455",
      purchaseId: "Group Four",
      dropdown_station: "Allison St (Stop DS2)",
      pickup_station: "Adderley St",
      dropdown_time: "Feb 01 10:00",
      pickup_time: "Feb 03 10:00",
      type_trip: "Extra Trip",
      status: "Delayed",
    },
  ];

  const filteredTrips = data.filter((product) => {
    const matchesSearchQuery =
      !searchQuery ||
      (product &&
        product.status &&
        product.type_trip &&
        product.dropdown_station &&
        product.dropdown_time &&
        product.pickup_station &&
        product.pickup_time &&
        product.purchaseId &&
        product.modalId &&
        (product.status
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
          product.type_trip.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.pickup_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.dropdown_time.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.pickup_station
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.dropdown_station
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.purchaseId
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.modalId
            .toLowerCase()
            .includes(searchQuery.toLowerCase())));

            const matchesSelectedStatus =
            !selectedStatus ||
            (selectedStatus.toLowerCase() === "all") || 
            (product &&
              product.status &&
              product.status.toLowerCase() === selectedStatus.toLowerCase());
          
    const matchesSelectedCategory =
      !selectedCategory ||
      (selectedCategory.toLowerCase() === "groups") || 
      (product &&
        product.purchaseId &&
        product.purchaseId.toLowerCase() === selectedCategory.toLowerCase());


    if (!searchQuery && !selectedStatus && !selectedCategory ) {
      return true;
    }

    return (
      matchesSearchQuery && matchesSelectedStatus && matchesSelectedCategory 
    );

   
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Trips Management" pageTitle=" " />
          <Col lg={12}>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col lg={3}>
                    <div className="search-box">
                      <input
                        type="text"
                        className="form-control search"
                        placeholder="Search for Trip ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Select Date"
                      options={{
                        mode: "range",
                        dateFormat: "d M, Y",
                      }}
                    />
                  </Col>
                  <Col lg={2}>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                    >
                      <option value="">Date</option>
                      <option defaultValue="all">All</option>
                      <option value="Today">Today</option>
                      <option value="Yesterday">Yesterday</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="This Month">This Month</option>
                      <option value="Last Month">Last Month</option>
                    </select>
                  </Col>
                  <Col lg={2}>
                    <select
                      className="form-select"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="groups">Groups</option>
                      <option value="Group One">Group One</option>
                      <option value="Group Two">Group Two</option>
                      <option value="Group Three">Group Three</option>
                      <option value="Group Four">Group Four</option>
                      <option value="Group Five">Group Five</option>
                    </select>
                  </Col>
                  <Col lg={2}>
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
                      <option value="all">All</option>
                      <option value="delayed">Delayed</option>
                      <option value="changing Route">Changing Route</option>
                      <option value="onsite">OnSite</option>
                      <option value="finished">Finished</option>
                    </select>
                  </Col>

                  {/* <Col xxl={2} lg={6}>
                                    <Button variant="primary" type="button" className="w-100">Filters</Button>
                                </Col> */}
                </Row>
              </Card.Header>
              <Card.Body>
                <DataTable columns={columns} data={filteredTrips} pagination />
              </Card.Body>
            </Card>
          </Col>

          
        </Container>
      </div>
      <Offcanvas
        show={showCoupons}
        onHide={() => setShowCoupons(!showCoupons)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Trip Details</Offcanvas.Title>
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
                      <span className="text-muted">Trip</span>
                    </td>
                    <td>
                      <span className="fw-medium text-uppercase">
                        {showCouponDetails.modalId}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Groups</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.purchaseId}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">PickUp Time/Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.pickup_time}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span className="text-muted">DropDown Time/Date</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.dropdown_time}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">PickUp Station </span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.pickup_station}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">DropDown Station</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.dropdown_station}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span className="text-muted">Type</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showCouponDetails.type_trip}
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
                            
                            case "OnSite":
                              return "badge bg-dark-subtle text-dark text-uppercase";
                            case "Changing Route":
                              return "badge bg-info-subtle text-info text-uppercase";
                            case "Delayed":
                              return "badge bg-danger-subtle text-danger text-uppercase";
                            case "Finished":
                              return "badge bg-success-subtle text-success text-uppercase";
                           
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
export default OperationsManagement;
