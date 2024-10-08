import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router-dom";
import {
  Quote,
  useGetAllQuoteQuery,
  useSendPriceandNotesMutation,
} from "features/quotes/quotesSlice";
import Swal from "sweetalert2";
import { selectCurrentUser } from "../../features/affiliate/authAffiliateSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store"; // Import your RootState interface
import CheckProgress from "pages/CheckProgress";
import { useAddNewRejectedJobMutation } from "features/RejectedJobs/rejectedJobsSlice";

const SuggestedJobs = () => {
  document.title = "Suggested Jobs | Affiliate Administration";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const { data: AllQuotes = [] } = useGetAllQuoteQuery();
  // const result: any[] = [];

  // for (let quote of AllQuotes) {
  //   if (Array.isArray(quote.white_list)) {
  //     for (let aff of quote.white_list) {
  //       if (aff?.id?._id! === user?._id) {
  //         if (
  //           aff.jobStatus !== "Refused" &&
  //           (quote.progress === "New" || quote.progress === "Booked")
  //         ) {
  //           result.push(quote);
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }

  const result: any[] = useMemo(() => {
    const filteredQuotes = [];
    for (let quote of AllQuotes) {
      if (Array.isArray(quote.white_list)) {
        for (let aff of quote.white_list) {
          if (aff?.id?._id === user?._id) {
            if (
              aff.jobStatus !== "Refused" &&
              (quote.progress === "New" || quote.progress === "Booked")
            ) {
              filteredQuotes.push(quote);
              break;
            }
          }
        }
      }
    }
    return filteredQuotes;
  }, [AllQuotes, user]);

  const privateHiredJobs = result.filter(
    (privateHired) => privateHired?.category === "Private"
  );
  const contractJobs = result.filter(
    (contract) => contract?.category === "Regular"
  );

  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [modal_AcceptJob, setmodal_modal_AcceptJob] = useState<boolean>(false);

  const handleChange = ({ selectedRows }: { selectedRows: Quote[] }) => {
    if (!modal_AcceptJob && selectedRows.length > 0) {
      const selectedQuote = selectedRows[0];
      setIsChecked(true);
      setSelectedRow(selectedQuote);
      setmodal_modal_AcceptJob(true);
    }
  };

  const handleModalClose = () => {
    setIsChecked(false);
    setmodal_modal_AcceptJob(false);
    setSelectedRow(null);
  };

  const navigate = useNavigate();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Assign Done successfully",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const [sendPriceMutation] = useSendPriceandNotesMutation();
  const [AddNewRejectedJob] = useAddNewRejectedJobMutation();

  const initialSendPrice = {
    idQuote: "",
    white_list: [""],
  };

  const [sendPrice, setSendPrice] = useState(initialSendPrice);

  const { idQuote, white_list } = sendPrice;

  const onChangeSendPrice = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSendPrice((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const [selectedPrice, setSelectedPrice] = useState<string>("");
  const handleSelectedPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPrice(e.target.value);
  };
  const [id_Quote, setIdQuote] = useState<string>("");
  const [updatedWhiteList, setUpdatedWhiteList] = useState<any[]>([]);
  const [updatedRefuseWhiteList, setUpdatedRefuseWhiteList] = useState<any[]>(
    []
  );
  const [selectedNote, setSelectedNote] = useState<string>("");
  const filteredWhiteList: any[] = selectedRow?.white_list?.filter(
    (whiteList: any) => whiteList.id?._id === user?._id
  );

  const newFiltered: any[] = filteredWhiteList?.map((whiteList: any) => ({
    ...whiteList,
    noteAcceptJob: selectedNote,
    price: selectedPrice === "" ? selectedRow?.pushed_price! : selectedPrice,
    jobStatus: "Accepted",
  }));

  const newRefuseFiltered: any[] = filteredWhiteList?.map((whiteList: any) => ({
    ...whiteList,
    noteAcceptJob: selectedNote,
    price: selectedPrice === "" ? selectedRow?.pushed_price! : selectedPrice,
    jobStatus: "Refused",
  }));

  const handleSelectedNote = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedNote(e.target.value);
    const newUpdatedWhiteList = selectedRow?.white_list?.map((whiteList: any) =>
      whiteList.id?._id === user?._id
        ? { ...whiteList, ...newFiltered[0] }
        : whiteList
    );
    const newUpdatedRefuseWhiteList = selectedRow?.white_list?.map(
      (whiteList: any) =>
        whiteList.id?._id === user?._id
          ? { ...whiteList, ...newRefuseFiltered[0] }
          : whiteList
    );
    setUpdatedWhiteList(newUpdatedWhiteList);
    setUpdatedRefuseWhiteList(newUpdatedRefuseWhiteList);
    setIdQuote(selectedRow?._id!);
  };

  const onSubmitSendPrice = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      sendPrice["idQuote"] = id_Quote;
      sendPrice["white_list"] = updatedWhiteList;
      await sendPriceMutation(sendPrice);
      notifySuccess();
      setmodal_modal_AcceptJob(false);
      navigate("/suggested-jobs");
      setIsChecked(false);
    } catch (error) {
      notifyError(error);
    }
  };

  const onSubmitRefuseQuote = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    try {
      sendPrice["idQuote"] = id_Quote;
      sendPrice["white_list"] = updatedRefuseWhiteList;
      await sendPriceMutation(sendPrice);
      await AddNewRejectedJob({
        affiliate: user?._id!,
        job_id: id_Quote,
      });
      notifySuccess();
      setmodal_modal_AcceptJob(false);
      navigate("/refused-jobs");
    } catch (error) {
      notifyError(error);
    }
  };

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
          <span>No Driver</span>
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
          <span>No Vehicle</span>
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
          case "New":
            return <span className="badge bg-info"> {cell.progress} </span>;
          case "Accepted":
            return <span className="badge bg-success"> {cell.progress} </span>;
          case "Refused":
            return <span className="badge bg-danger"> {cell.progress} </span>;
          case "Booked":
            return <span className="badge bg-danger"> {cell.progress} </span>;
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
          case "Pending":
            return <span className="badge bg-warning"> {cell.status} </span>;
          case "Refuse":
            return <span className="badge bg-danger"> {cell.status} </span>;
          case "Vehicle Allocated":
            return <span className="badge bg-secondary"> {cell.status} </span>;
          case "Driver Allocated":
            return <span className="badge bg-primary"> {cell.status} </span>;
          default:
            return <span className="badge bg-danger"> {cell.status} </span>;
        }
      },
      width: "140px",
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

  const [selectedFilter, setSelectedFilter] = useState("all");

  const handleFilterChange = (event: any) => {
    setSelectedFilter(event.target.value);
  };

  const [selectedProgress, setSelectedProgress] = useState("all");

  const handleFilterProgressChange = (event: any) => {
    setSelectedProgress(event.target.value);
  };

  const filterResults = (results: any, filter: any) => {
    const today = new Date();
    const filterDate = new Date(today);

    switch (filter) {
      case "Today":
        return results.filter(
          (quote: any) =>
            new Date(quote.date).toDateString() === today.toDateString()
        );

      case "Yesterday":
        filterDate.setDate(today.getDate() - 1);
        return results.filter(
          (quote: any) =>
            new Date(quote.date).toDateString() === filterDate.toDateString()
        );

      case "Last 7 Days":
        filterDate.setDate(today.getDate() - 7);
        return results.filter(
          (quote: any) => new Date(quote.date) >= filterDate
        );

      case "Last 30 Days":
        filterDate.setDate(today.getDate() - 30);
        return results.filter(
          (quote: any) => new Date(quote.date) >= filterDate
        );

      case "This Month":
        return results.filter((quote: any) => {
          const quoteDate = new Date(quote.date);
          return (
            quoteDate.getFullYear() === today.getFullYear() &&
            quoteDate.getMonth() === today.getMonth()
          );
        });

      case "Last Month":
        filterDate.setMonth(today.getMonth() - 1);
        return results.filter((quote: any) => {
          const quoteDate = new Date(quote.date);
          return (
            quoteDate.getFullYear() === filterDate.getFullYear() &&
            quoteDate.getMonth() === filterDate.getMonth()
          );
        });

      default:
        return results;
    }
  };

  const filteredResults = filterResults(result, selectedFilter);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSearchResults, setFilteredSearchResults] =
    useState<any[]>(result);

  useEffect(() => {
    setFilteredSearchResults(
      result.filter((row) => {
        return (
          row.quote_ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (
            row.id_affiliate_driver?.firstname +
            " " +
            row.id_affiliate_driver?.surname
          )
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.vehicle_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.id_affiliate_vehicle?.registration_number
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.passengers_number?.toString().includes(searchQuery) ||
          row.start_point?.placeName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.destination_point?.placeName
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.progress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.pushed_price?.toString().includes(searchQuery) ||
          row.id_visitor?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.school_id?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.company_id?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.id_visitor?.phone
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.school_id?.phone
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.company_id?.phone
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.id_visitor?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.school_id?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.company_id?.email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.dropoff_date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.dropoff_time?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.createdAt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.notes?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    );
  }, [searchQuery, result]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const newJobs = result.filter((newJob) => newJob?.progress === "New");
  const bookedJobs = result.filter(
    (bookedJob) => bookedJob?.progress === "Booked"
  );
  const [selectedDates, setSelectedDates] = useState<any[]>([]);

  const handleDateChange = (dates: any) => {
    setSelectedDates(dates);
  };

  const filterDate = () => {
    const startDate = selectedDates[0]?.toISOString()!.split("T")[0];

    return result.filter((item) => item.date == startDate);
  };

  const filteredDate = filterDate();

  return (
    <React.Fragment>
      {user.progress !== "100" ? (
        <CheckProgress />
      ) : (
        <div className="page-content">
          <Container fluid>
            <Breadcrumb title="Suggested Jobs" pageTitle="Jobs" />
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
                        onChange={handleFilterChange}
                        value={selectedFilter}
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
                        name="choices-progress"
                        id="idProgress"
                        onChange={handleFilterProgressChange}
                        value={selectedProgress}
                      >
                        <option value="all">All Progress</option>
                        <option value="Booked">Booked</option>
                        <option value="New">New</option>
                      </select>
                    </Col>
                    <Col lg={2}>
                      <Flatpickr
                        className="form-control flatpickr-input"
                        placeholder="Select Date"
                        options={{
                          dateFormat: "d M, Y",
                        }}
                        onChange={handleDateChange}
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
                      {/* <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inlineCheckbox3"
                          value="option3"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="inlineCheckbox3"
                        >
                          Non Invoiced
                        </label>
                      </div> */}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card id="shipmentsList">
                <Card.Header className="border-bottom-dashed">
                  <Row className="g-3">
                    <Col lg={3} className="d-flex justify-content-end"></Col>
                    <Col lg={7} className="d-flex justify-content-center">
                      <div className="search-box">
                        <input
                          type="text"
                          className="form-control search"
                          placeholder="Search for something..."
                          value={searchQuery}
                          onChange={handleSearchChange}
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
                      selectableRows
                      pagination
                      onSelectedRowsChange={handleChange}
                    />
                  ) : !isPrivateHiredChecked && isContractChecked ? (
                    <DataTable
                      columns={columns}
                      data={contractJobs}
                      pagination
                      selectableRows
                      onSelectedRowsChange={handleChange}
                    />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={filteredSearchResults}
                      // data={filteredDate}
                      pagination
                      selectableRows
                      onSelectedRowsChange={handleChange}
                    />
                  )}
                  {/* {selectedProgress === "New" && (
                    <DataTable
                      columns={columns}
                      data={newJobs}
                      pagination
                      selectableRows
                      onSelectedRowsChange={handleChange}
                    />
                  )}
                  {selectedProgress === "Booked" && (
                    <DataTable
                      columns={columns}
                      data={bookedJobs}
                      pagination
                      selectableRows
                      onSelectedRowsChange={handleChange}
                    />
                  )} */}
                </Card.Body>
              </Card>
            </Col>
            <Modal
              className="fade zoomIn"
              size="lg"
              show={modal_AcceptJob}
              onHide={handleModalClose}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                {selectedRow && (
                  <>
                    <Row>
                      <Col lg={4}>
                        <h5
                          className="modal-title fs-18"
                          id="exampleModalLabel"
                        >
                          Here are the details of this Job:
                        </h5>
                      </Col>
                      <Col lg={4}>
                        <div className="mb-1">
                          <span className="fw-medium">Go Date : </span>{" "}
                          <span className="text-muted">
                            {selectedRow?.date!}
                          </span>{" "}
                          <strong>at </strong>
                          <span className="text-muted">
                            {selectedRow?.pickup_time!}
                          </span>
                        </div>
                        <div>
                          <span className="fw-medium">Pickup Address: </span>
                          <span className="text-muted">
                            {selectedRow?.start_point?.placeName!}
                          </span>
                        </div>
                      </Col>
                      <Col lg={4}>
                        <div className="mb-1">
                          <span className="fw-medium">
                            Destination Address :{" "}
                          </span>
                          <span className="text-muted">
                            {selectedRow?.destination_point?.placeName!}
                          </span>
                        </div>
                        <span className="fw-medium">Arrival Date : </span>
                        <span className="text-muted">
                          {selectedRow?.dropoff_date!}
                        </span>{" "}
                        <strong>at </strong>
                        <span className="text-muted">
                          {selectedRow?.dropoff_time!}
                        </span>
                        .
                      </Col>
                    </Row>
                  </>
                )}
              </Modal.Header>
              <Modal.Body className="p-4">
                {selectedRow && selectedRow.pushed_price ? (
                  <Row>
                    <Col lg={12} className="mb-2">
                      <Form.Label htmlFor="total_price">
                        Pushed Price
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="pushed_price"
                        id="pushed_price"
                        value={
                          selectedRow.pushed_price
                            ? `£${parseFloat(selectedRow.pushed_price).toFixed(
                                2
                              )}`
                            : ""
                        }
                        readOnly
                      />
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <Col lg={12} className="mb-2">
                      <Form.Label htmlFor="price">Proposed Price</Form.Label>
                      <Form.Control
                        type="text"
                        name="price"
                        id="price"
                        placeholder="£ 00.00"
                        value={selectedPrice}
                        onChange={handleSelectedPrice}
                      />
                    </Col>
                  </Row>
                )}
                <Row>
                  <Col lg={12} className="mb-2 mt-2">
                    <Form.Label htmlFor="selectedNote">Notes</Form.Label>
                    <textarea
                      className="form-control"
                      id="selectedNote"
                      name="selectedNote"
                      rows={3}
                      value={selectedNote}
                      onChange={handleSelectedNote}
                    ></textarea>
                  </Col>
                </Row>
                <Col lg={12}>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      type="submit"
                      className="btn-ghost-danger"
                      onClick={onSubmitRefuseQuote}
                      data-bs-dismiss="modal"
                    >
                      <i className="ri-close-line align-bottom me-1"></i> Refuse
                    </Button>
                    <Button
                      className="btn-soft-info"
                      type="submit"
                      onClick={onSubmitSendPrice}
                    >
                      <i className="ri-send-plane-line align-bottom me-1"></i>{" "}
                      Accept and Send
                    </Button>
                  </div>
                </Col>
              </Modal.Body>
            </Modal>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};
export default SuggestedJobs;
