import React, { useState } from "react";
import { Container, Row, Card, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";

import { Quote } from "features/quotes/quotesSlice";

import { selectCurrentUser } from "../../features/affiliate/authAffiliateSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store"; // Import your RootState interface
import CheckProgress from "pages/CheckProgress";
import { useGetAllQuotesByAffiliateIDQuery } from "features/affiliate/affiliateSlice";
const CancelJobs = () => {
  document.title = "Cancelled Jobs | Affiliate Administration";

  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const { data: AllAffiliateQuotes = [] } = useGetAllQuotesByAffiliateIDQuery(
    user?._id!
  );
  const result: any[] = [];

  for (let quote of AllAffiliateQuotes) {
    // Check if white_list exists and is iterable
    if (quote.progress === "Cancel") {
      result.push(quote);
    }
  }
  const privateHiredJobs = result.filter(
    (privateHired) => privateHired?.category === "Private"
  );
  const contractJobs = result.filter(
    (contract) => contract?.category === "Regular"
  );
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Quote ID</span>,
      selector: (cell: Quote) => {
        return (
          <span>
            <span className="text-dark">{cell?.quote_ref!}</span>
          </span>
        );
      },
      sortable: true,
      width: "160px",
    },
    {
      name: (
        <span className="mdi mdi-account-tie-hat font-weight-bold fs-24"></span>
      ),
      selector: (row: any) =>
        row?.id_affiliate_driver?.firstname! === undefined ? (
          "No Driver"
        ) : (
          <span>
            {row?.id_affiliate_driver?.firstname!}{" "}
            {row?.id_affiliate_driver?.surname!}
          </span>
        ),
      sortable: true,
    },
    {
      name: <span className="mdi mdi-car font-weight-bold fs-24"></span>,
      selector: (row: any) => row?.vehicle_type!,
      sortable: true,
    },
    {
      name: <span className="mdi mdi-car font-weight-bold fs-24"></span>,
      selector: (row: any) =>
        row.id_affiliate_vehicle?.registration_number! === undefined ? (
          "No Vehicle"
        ) : (
          <span>{row.id_affiliate_vehicle?.registration_number!}</span>
        ),
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Go Date</span>,
      selector: (row: any) => (
        <div>
          <strong>{row?.date!}</strong> at <strong>{row?.pickup_time!}</strong>
        </div>
      ),
      sortable: true,
      width: "160px",
    },
    {
      name: <span className="font-weight-bold fs-13">Pax</span>,
      selector: (row: any) => row.passengers_number,
      sortable: true,
      width: "60px",
    },
    {
      name: <span className="font-weight-bold fs-13">Pick Up</span>,
      selector: (row: any) => row.start_point?.placeName!,
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="font-weight-bold fs-13">Destination</span>,
      sortable: true,
      selector: (row: any) => row.destination_point?.placeName!,
      width: "120px",
    },
    {
      name: <span className="font-weight-bold fs-13">Progress</span>,
      selector: (cell: any) => {
        switch (cell.progress) {
          case "Booked":
            return <span className="badge bg-warning"> {cell.progress} </span>;
          case "Accepted":
            return <span className="badge bg-success"> {cell.progress} </span>;
          case "Refused":
            return <span className="badge bg-info"> {cell.progress} </span>;
          default:
            return <span className="badge bg-danger"> {cell.progress} </span>;
        }
      },
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      sortable: true,
      selector: (cell: any) => {
        switch (cell.status) {
          case "Accepted":
            return <span className="badge bg-success"> {cell.status} </span>;
          case "Allocated":
            return <span className="badge bg-dark"> {cell.status} </span>;
          case "Vehicle Allocated":
            return <span className="badge bg-secondary"> {cell.status} </span>;
          case "Driver Allocated":
            return <span className="badge bg-primary"> {cell.status} </span>;
          default:
            return <span className="badge bg-danger"> {cell.status} </span>;
        }
      },
      width: "160px",
    },
    {
      name: <span className="font-weight-bold fs-13">Price</span>,
      sortable: true,
      selector: (row: any) => (
        <span>
          £ <b>{row?.pushed_price!}</b>
        </span>
      ),
    },
    {
      name: <span className="font-weight-bold fs-13">Passenger Name</span>,
      sortable: true,
      selector: (row: any) =>
        row.school_id! === null && row.company_id! === null ? (
          <span>{row.id_visitor?.name!}</span>
        ) : row.id_visitor! === null && row.company_id! === null ? (
          <span>{row.school_id?.name!}</span>
        ) : (
          <span>{row.company_id?.name!}</span>
        ),
    },
    {
      name: <span className="font-weight-bold fs-13">Mobile</span>,
      sortable: true,
      selector: (row: any) =>
        row.school_id! === null && row.company_id! === null ? (
          <span>{row.id_visitor?.phone!}</span>
        ) : row.id_visitor! === null && row.company_id! === null ? (
          <span>{row.school_id?.phone!}</span>
        ) : (
          <span>{row.company_id?.phone!}</span>
        ),
    },
    {
      name: <span className="font-weight-bold fs-13">Email</span>,
      sortable: true,
      selector: (row: any) =>
        row.school_id! === null && row.company_id! === null ? (
          <span>{row.id_visitor?.email!}</span>
        ) : row.id_visitor! === null && row.company_id! === null ? (
          <span>{row.school_id?.email!}</span>
        ) : (
          <span>{row.company_id?.email!}</span>
        ),
    },
    {
      name: <span className="font-weight-bold fs-13">Arrival Date</span>,
      sortable: true,
      selector: (row: any) => (
        <span>
          <b>{row.dropoff_date}</b> at <b>{row.dropoff_time}</b>
        </span>
      ),
      width: "160px",
    },

    {
      name: <span className="font-weight-bold fs-13">Balance</span>,
      sortable: true,
      selector: (row: any) => "No Balance",
    },
    {
      name: <span className="font-weight-bold fs-13">Enquiry Date</span>,
      sortable: true,
      selector: (row: Quote) => {
        const date = new Date(row.createdAt);
        return <span>{date.toDateString()}</span>;
      },
      width: "125px",
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Affiliate</span>,
    //   sortable: true,
    //   selector: (row: any) => "No Affiliate",
    // },
    {
      name: <span className="font-weight-bold fs-13">Callback</span>,
      sortable: true,
      selector: (row: any) => "No CallBack",
    },
    {
      name: <span className="font-weight-bold fs-13">Payment Status</span>,
      sortable: true,
      selector: (cell: any) => {
        return <span className="badge bg-danger"> Not Paid </span>;
      },
    },

    {
      name: <span className="font-weight-bold fs-13">Account Name</span>,
      sortable: true,
      selector: (row: any) =>
        row.school_id! === null && row.company_id! === null ? (
          <span>{row.id_visitor?.name!}</span>
        ) : row.id_visitor! === null && row.company_id! === null ? (
          <span>{row.school_id?.name!}</span>
        ) : (
          <span>{row.company_id?.name!}</span>
        ),
    },
    {
      name: <span className="font-weight-bold fs-13">Notes</span>,
      sortable: true,
      selector: (row: any) => {
        return row?.id_visitor?.notes! !== ""
          ? row?.id_visitor?.notes!
          : "No Notes";
      },
    },
  ];

  const [isPrivateHiredChecked, setIsPrivateHiredChecked] = useState(false);
  const handlePrivateHiredCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPrivateHiredChecked(event.target.checked);
  };

  const [isContractChecked, setIsContractChecked] = useState(false);
  const handleContractCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsContractChecked(event.target.checked);
  };

  return (
    <React.Fragment>
      {user.progress !== "100" ? (
        <CheckProgress />
      ) : (
        <div className="page-content">
          <Container fluid>
            <Breadcrumb title="Cancelled Jobs" pageTitle="Jobs" />
            <Col lg={12}>
              <Card>
                <Card.Body>
                  <Row className="g-lg-2 g-4">
                    <Col sm={9} className="col-lg-auto">
                      <select
                        className="form-select text-muted"
                        data-choices
                        data-choices-search-false
                        name="choices-single-default"
                        id="idStatus"
                      >
                        <option value="all">All</option>
                        <option value="Today">Today</option>
                        <option value="Yesterday">Yesterday</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option defaultValue="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                      </select>
                    </Col>
                    <Col sm={9} className="col-lg-auto">
                      <select
                        className="form-select text-muted"
                        data-choices
                        data-choices-search-false
                        name="choices-single-default"
                        id="idStatus"
                      >
                        <option value="all">All Status</option>
                        <option value="Today">Accepted</option>
                        <option value="Yesterday">Allocated</option>
                        <option value="Last 7 Days">Confirmed</option>
                        <option value="Last 30 Days">Ended</option>
                        <option value="Today">In Progress</option>
                        <option value="Yesterday">Internal Job</option>
                        <option value="Last 7 Days">New</option>
                        <option value="Today">On route</option>
                        <option value="Yesterday">On site</option>
                        <option value="Last 7 Days">Under bid</option>
                      </select>
                    </Col>
                    <Col lg={2}>
                      <Flatpickr
                        className="form-control flatpickr-input"
                        placeholder="Select Date"
                        options={{
                          mode: "range",
                          dateFormat: "d M, Y",
                        }}
                      />
                    </Col>
                    <Col className="d-flex align-items-center">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox1"
                          value="option1"
                          checked={isPrivateHiredChecked}
                          onChange={handlePrivateHiredCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineCheckbox1"
                        >
                          Private Hire
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox2"
                          value="option2"
                          checked={isContractChecked}
                          onChange={handleContractCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineCheckbox2"
                        >
                          Contract
                        </label>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card id="shipmentsList">
                <Card.Header className="border-bottom-dashed">
                  <Row className="g-3">
                    <Col lg={3} className="d-flex justify-content-start"></Col>
                    <Col lg={7} className="d-flex justify-content-center">
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Search for something..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  {isPrivateHiredChecked && !isContractChecked ? (
                    <DataTable
                      columns={columns}
                      data={privateHiredJobs}
                      // selectableRows
                      pagination
                      // onSelectedRowsChange={handleChange}
                    />
                  ) : !isPrivateHiredChecked && isContractChecked ? (
                    <DataTable
                      columns={columns}
                      data={contractJobs}
                      pagination
                      // selectableRows
                      // onSelectedRowsChange={handleChange}
                    />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={result}
                      pagination
                      // selectableRows
                      // onSelectedRowsChange={handleChange}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};
export default CancelJobs;
