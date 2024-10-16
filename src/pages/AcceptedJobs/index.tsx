import React, { useState } from "react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Quote,
  useAddAffiliateDriverToQuoteMutation,
  useAssignAffiliateDriverAndVehicleToQuoteMutation,
  useDeleteAffiliateQuoteMutation,
  useUpdateProgressQuoteAffiliateMutation,
  useUpdateStatusAffiliateQuoteToCancelMutation,
} from "features/quotes/quotesSlice";
import Swal from "sweetalert2";
import {
  useGetAllDriverQuery,
  useGetDriverByIDQuery,
} from "features/driver/driverSlice";
import { useGetAllVehiclesQuery } from "features/vehicles/vehicleSlice";
import { selectCurrentUser } from "../../features/affiliate/authAffiliateSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import ModalAssignVehicle from "./ModalAssignVehicle";
import CheckProgress from "pages/CheckProgress";
import { useGetAllQuotesByAffiliateIDQuery } from "features/affiliate/affiliateSlice";

const AcceptedJobs = () => {
  document.title = "Accepted Jobs | Affiliate Administration";
  const [modal_AssignDriver, setModal_AssignDriver] = useState<boolean>(false);
  const [modal_AssignVehicle, setModal_AssignVehicle] =
    useState<boolean>(false);
  const [modal_updateProgress, setModal_updateProgress] =
    useState<boolean>(false);

  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const { data: AllAffiliateQuotes = [] } = useGetAllQuotesByAffiliateIDQuery(
    user?._id!
  );

  const acceptedJobs = AllAffiliateQuotes.filter(
    (quote: any) =>
      quote.progress === "Booked" ||
      quote.progress === "On Route" ||
      quote.progress === "On Site" ||
      quote.progress === "Picked Up"
  );
  console.log(acceptedJobs);
  const privateHiredJobs = acceptedJobs.filter(
    (privateHired) => privateHired?.category === "Private"
  );
  const contractJobs = acceptedJobs.filter(
    (contract) => contract?.category === "Regular"
  );
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>();
  const handleChange = ({ selectedRows }: { selectedRows: Quote }) => {
    setIsChecked(!isChecked);
    setSelectedRow(selectedRows);
  };
  const [modal_DriverVehicleAssign, setmodal_DriverVehicleAssign] =
    useState<boolean>(false);
  function tog_DriverVehicleAssign() {
    setmodal_DriverVehicleAssign(!modal_DriverVehicleAssign);
  }

  function tog_updateProgress() {
    setModal_updateProgress(!modal_updateProgress);
  }
  const [modal_UpdateQuote, setmodal_UpdateQuote] = useState<boolean>(false);
  const tog_ModalUpdateQuote = () => {
    setmodal_UpdateQuote(!modal_UpdateQuote);
  };
  const locationQuote = useLocation();
  const navigate = useNavigate();
  const { data: AllDrivers = [] } = useGetAllDriverQuery(user?._id!);
  let filterdDrivers = AllDrivers.filter(
    (driver) => driver.driverStatus === "Active"
  );
  let journeyOne = [];
  let journeyTwo: any[] = [];
  if (locationQuote!.state?.type! === "One way") {
    journeyOne.push(locationQuote?.state!);
  } else {
    journeyTwo.push(
      {
        estimated_start_time: locationQuote?.state?.date!,
        estimated_return_start_time: locationQuote?.state?.pickup_time!,
        destination_point: locationQuote!.state?.destination_point!,
        start_point: locationQuote?.state?.start_point!,
      },
      {
        estimated_start_time:
          locationQuote?.state?.estimated_return_start_time!,
        estimated_return_start_time:
          locationQuote?.state?.estimated_start_time!,
        destination_point: locationQuote?.state?.start_point!,
        start_point: locationQuote?.state?.destination_point!,
      }
    );
  }

  const columns1 = [
    {
      name: <span className="font-weight-bold fs-13">Journey</span>,
      selector: (row: any, index: number) => <span>Journey {index + 1}</span>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.pickup_time,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Pickup</span>,
      selector: (row: any) => row.start_point?.placeName!,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Destination</span>,
      selector: (row: any) => row.destination_point?.placeName!,
      sortable: true,
    },
    {
      name: (
        <span className="mdi mdi-account-tie-hat font-weight-bold fs-24"></span>
      ),
      selector: (row: any) =>
        row!.id_affiliate_driver! === undefined ? (
          <span>No Driver</span>
        ) : (
          <span>
            {row!.id_affiliate_driver?.firstname!}{" "}
            {row!.id_affiliate_driver?.surname!}
          </span>
        ),
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
  ];

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

  const [selectVehicle, setSelectedVehicle] = useState<string>("");
  const handleSelectVehicle = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedVehicle(value);
  };

  let { data: oneDriver } = useGetDriverByIDQuery(selectVehicle);

  const [assignDriverToQuoteMutation] = useAddAffiliateDriverToQuoteMutation();

  const initialAssignDriverToQuote = {
    quote_id: "",
    id_affiliate_driver: "",
  };

  const [assignDriverToDriver, setAssignDriverToQuote] = useState(
    initialAssignDriverToQuote
  );

  const { quote_id, id_affiliate_driver } = assignDriverToDriver;

  const onChangeAssignDriverToQuote = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssignDriverToQuote((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitAssignDriverToQuote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      assignDriverToDriver["quote_id"] = locationQuote.state?._id!;
      assignDriverToDriver["id_affiliate_driver"] = selectVehicle;
      assignDriverToQuoteMutation(assignDriverToDriver)
        .then(() => navigate("/jobs/accepted-jobs"))
        .then(() => notifySuccess());
    } catch (error) {
      notifyError(error);
    }
  };

  const openModalAssignDriver = () => {
    setModal_AssignDriver(!modal_AssignDriver);
  };

  const openModalAssignVehicle = () => {
    setModal_AssignVehicle(!modal_AssignVehicle);
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
          <Link to="#" onClick={() => openModalAssignDriver()} state={row}>
            No Driver
          </Link>
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
          <Link to="#" onClick={() => openModalAssignVehicle()} state={row}>
            No Vehicle
          </Link>
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
          case "Accept":
            return (
              <Link to="#" state={cell} onClick={() => tog_updateProgress()}>
                <span className="badge bg-success"> {cell.progress} </span>
              </Link>
            );
          case "On Route":
            return (
              <Link to="#" state={cell} onClick={() => tog_updateProgress()}>
                <span className="badge bg-primary"> {cell.progress} </span>
              </Link>
            );
          case "On Site":
            return (
              <Link to="#" state={cell} onClick={() => tog_updateProgress()}>
                <span className="badge bg-info"> {cell.progress} </span>
              </Link>
            );
          case "Picked Up":
            return (
              <Link to="#" state={cell} onClick={() => tog_updateProgress()}>
                <span className="badge bg-secondary"> {cell.progress} </span>
              </Link>
            );
          default:
            return (
              <Link to="#" state={cell} onClick={() => tog_updateProgress()}>
                <span className="badge bg-warning"> {cell.progress} </span>
              </Link>
            );
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
            return <span className="badge bg-info"> Accepted </span>;
          case "Accepted":
            return <span className="badge bg-info"> {cell.status} </span>;
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

  const [deleteQuote] = useDeleteAffiliateQuoteMutation();
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const AlertDelete = async () => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to go back?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it !",
        cancelButtonText: "No, cancel !",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteQuote(selectedRow[0]._id);
          setIsChecked(!isChecked);
          swalWithBootstrapButtons.fire(
            "Deleted !",
            "Quote is deleted.",
            "success"
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire("Canceled", "Quote is safe :)", "info");
        }
      });
  };

  // The selected CancelCause
  const [selectedCancelCause, setSelectedCancelCause] = useState<string>("");

  // This function will be triggered when a radio button is selected
  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCancelCause(event.target.value);
  };

  // The selected Progress
  const [selectedProgress, setSelectedProgress] = useState<string>("");

  // This function will be triggered when a radio button of progress is selected
  const radioProgressHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProgress(event.target.value);
  };

  const [
    selectVehicleWhenAssignDriverAndVehicle,
    setSelectedVehicleWhenAssignDriverAndVehicle,
  ] = useState<string>("");
  // This function is triggered when the select Vehicle
  const handleSelectVehicleWhenAssignDriverAndVehicle = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedVehicleWhenAssignDriverAndVehicle(value);
  };

  const [
    selectDriverWhenAssignDriverAndVehicle,
    setSelectedDriverWhenAssignDriverAndVehicle,
  ] = useState<string>("");
  // This function is triggered when the select Driver
  const handleSelectDriverWhenAssignDriverAndVehicle = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedDriverWhenAssignDriverAndVehicle(value);
  };

  const [assignDriverAndVehicleToQuoteMutation] =
    useAssignAffiliateDriverAndVehicleToQuoteMutation();

  const initialAssginDriverAndVehicleToQuote = {
    quote_ID: "",
    affiliateVehicle_ID: "",
    affiliateDriver_ID: "",
  };

  const [
    assignDriverAndVehicleToQuoteState,
    setAssignDriverAndVehicleToQuoteState,
  ] = useState(initialAssginDriverAndVehicleToQuote);

  const { quote_ID, affiliateDriver_ID, affiliateVehicle_ID } =
    assignDriverAndVehicleToQuoteState;

  const onSubmitAssignDriverAndVehicleToQuote = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      assignDriverAndVehicleToQuoteState["quote_ID"] = selectedRow[0]._id;

      assignDriverAndVehicleToQuoteState["affiliateVehicle_ID"] =
        selectVehicleWhenAssignDriverAndVehicle;
      assignDriverAndVehicleToQuoteState["affiliateDriver_ID"] =
        selectDriverWhenAssignDriverAndVehicle;
      assignDriverAndVehicleToQuoteMutation(assignDriverAndVehicleToQuoteState)
        .then(() => navigate("/jobs/accepted-jobs"))
        .then(() => notifySuccess())
        .then(() => setIsChecked(!isChecked));
    } catch (error) {
      notifyError(error);
    }
  };

  const [updateStatusQuoteToCancelMutation] =
    useUpdateStatusAffiliateQuoteToCancelMutation();

  const initialUpdateStatusQuoteToCancel = {
    quoteId: "",
    status: "",
  };

  const [updateStatusToCancel, setUpdateStatusToCancel] = useState(
    initialUpdateStatusQuoteToCancel
  );

  const { quoteId, status } = updateStatusToCancel;

  const onChangeStatusToCancel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateStatusToCancel((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitUpdateStatusToCancel = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      updateStatusToCancel["quoteId"] = selectedRow[0]._id;
      updateStatusToCancel["status"] = selectedCancelCause;
      updateStatusQuoteToCancelMutation(updateStatusToCancel)
        .then(() => navigate("/jobs/canceled-jobs"))
        .then(() => notifySuccess());
    } catch (error) {
      notifyError(error);
    }
  };

  const [updateProgressQuoteMutation] =
    useUpdateProgressQuoteAffiliateMutation();

  const initialUpdateProgressQuote = {
    id_quote: "",
    progress: "",
  };

  const [updateProgress, setUpdateProgress] = useState(
    initialUpdateProgressQuote
  );

  const { id_quote, progress } = updateProgress;

  const onChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateProgress((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const progressLocation = useLocation();

  const onSubmitUpdateProgress = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      updateProgress["id_quote"] = progressLocation.state._id;
      updateProgress["progress"] = selectedProgress;
      updateProgressQuoteMutation(updateProgress)
        .then(() => navigate("/jobs/accepted-jobs"))
        .then(() => notifySuccess());
    } catch (error) {
      notifyError(error);
    }
  };

  const activeDrivers = AllDrivers.filter(
    (drivers) => drivers.driverStatus === "Active"
  );
  console.log("AllDrivers", AllDrivers);

  const { data: AllVehicles = [] } = useGetAllVehiclesQuery(user?._id!);
  const activeVehicles = AllVehicles.filter(
    (vehicles) => vehicles.statusVehicle === "Active"
  );
  console.log("activeVehicles", activeVehicles);
  return (
    <React.Fragment>
      {user.progress !== "100" ? (
        <CheckProgress />
      ) : (
        <div className="page-content">
          <Container fluid>
            <Breadcrumb title="Accepted Jobs" pageTitle="Jobs" />
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
                        <option value="all">All Progress</option>
                        <option value="Today">Accepted</option>
                        <option value="Yesterday">Allocated</option>
                        <option value="Last 7 Days">Confirmed</option>
                        <option value="Last 30 Days">Ended</option>
                        <option value="Today">In Progress</option>
                        <option value="Yesterday">Internal Job</option>
                        <option value="Last 7 Days">New</option>
                        <option value="Today">On route</option>
                        <option value="Yesterday">On site</option>
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
                    <Col lg={3} className="d-flex justify-content-start">
                      {isChecked ? (
                        <ul className="hstack gap-2 list-unstyled mb-0">
                          <li>
                            <Link
                              to="#"
                              className="badge badge-soft-info remove-item-btn fs-16"
                              state={selectedRow}
                              onClick={() => tog_DriverVehicleAssign()}
                            >
                              <i className="bi bi-plus-square-dotted fs-18"></i>{" "}
                              Assign Vehicle/Driver
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="#"
                              className="badge badge-soft-dark edit-item-btn fs-16"
                              state={selectedRow}
                              onClick={() => tog_ModalUpdateQuote()}
                            >
                              <i className="bi bi-x-square fs-18"></i> Cancel
                              Job
                            </Link>
                          </li>
                        </ul>
                      ) : (
                        ""
                      )}
                    </Col>
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
                      data={acceptedJobs}
                      pagination
                      selectableRows
                      onSelectedRowsChange={handleChange}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
            {/* Modal To Assign Driver */}
            <Modal
              className="fade zoomIn"
              size="xl"
              show={modal_AssignDriver}
              onHide={() => {
                openModalAssignDriver();
              }}
              centered
            >
              <Modal.Header className="px-4 pt-4" closeButton>
                <h5 className="modal-title fs-18" id="exampleModalLabel">
                  Assign Driver
                </h5>
              </Modal.Header>
              <Modal.Body className="p-4">
                <Card>
                  {/* <Card.Header>
                    <div className="d-flex align-items-center p-1">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-24">
                            <i className="mdi mdi-map-marker-path"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">Journey</h4>
                      </div>
                    </div>
                    {locationQuote?.state?.type! === "One way" ? (
                      <DataTable columns={columns1} data={journeyOne} />
                    ) : (
                      <DataTable columns={columns1} data={journeyTwo} />
                    )}
                  </Card.Header> */}
                  <Card.Header>
                    <div className="d-flex align-items-center p-1">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-24">
                            <i className="mdi mdi-account-tie-hat"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">Choose Driver</h4>
                      </div>
                    </div>
                    <Form
                      className="tablelist-form"
                      onSubmit={onSubmitAssignDriverToQuote}
                    >
                      <Row>
                        <Col lg={12}>
                          <div className="mb-3">
                            <select
                              className="form-select text-muted"
                              name="vehicle_type"
                              id="vehicle_type"
                              onChange={handleSelectVehicle}
                            >
                              <option value="">Select</option>
                              {filterdDrivers.map((driver) => (
                                <option
                                  value={`${driver._id}`}
                                  key={driver?._id!}
                                >
                                  {driver.firstname} {driver.surname}
                                </option>
                              ))}
                            </select>
                          </div>
                        </Col>
                        {/* {selectVehicle && (
                          <Row className="mb-2">
                            <Col lg={6}>
                              <div>
                                <Form.Label>Driver Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  readOnly
                                  defaultValue={oneDriver?.firstname!}
                                />
                              </div>
                              <div className="mt-2">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                  type="text"
                                  readOnly
                                  defaultValue={oneDriver?.phonenumber!}
                                />
                              </div>
                              <div className="mt-2">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                  type="text"
                                  readOnly
                                  defaultValue={oneDriver?.email!}
                                />
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div>
                                <Form.Label>Driving License Expiry</Form.Label>
                                <Form.Control
                                  type="text"
                                  className="text-danger"
                                  readOnly
                                  defaultValue={
                                    oneDriver?.driving_license_expiry!
                                  }
                                />
                              </div>
                              <div className="mt-2">
                                <Form.Label>DQC Expiry</Form.Label>
                                <Form.Control
                                  type="text"
                                  className="text-danger"
                                  readOnly
                                  defaultValue={oneDriver?.dqc_expiry!}
                                />
                              </div>
                              <div className="mt-2">
                                <Form.Label>PVC Expiry</Form.Label>
                                <Form.Control
                                  className="text-danger"
                                  type="text"
                                  readOnly
                                  defaultValue={oneDriver?.pvc_expiry!}
                                />
                              </div>
                            </Col>
                          </Row>
                        )} */}
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              className="btn-ghost-danger"
                              data-bs-dismiss="modal"
                            >
                              <i className="ri-close-line align-bottom me-1"></i>{" "}
                              Close
                            </Button>
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                              onClick={() => openModalAssignDriver()}
                            >
                              Assign Driver
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </Card.Header>
                </Card>
              </Modal.Body>
            </Modal>
            {/* Modal To Assign Vehicle */}
            <Modal
              className="fade zoomIn"
              size="xl"
              show={modal_AssignVehicle}
              onHide={() => {
                openModalAssignVehicle();
              }}
              centered
            >
              <Modal.Body className="p-4">
                <ModalAssignVehicle
                  assigned={modal_AssignVehicle}
                  setModal_AssignVehicle={setModal_AssignVehicle}
                />
              </Modal.Body>
            </Modal>
            {/* Modal To Cancel Job */}
            <Modal
              className="fade zoomIn"
              size="lg"
              show={modal_UpdateQuote}
              onHide={() => {
                tog_ModalUpdateQuote();
              }}
              centered
            >
              {/* <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                Quote n° {selectedRow[0]?._id!}
              </h5>
            </Modal.Header> */}
              <Modal.Body className="p-4">
                <Form
                  className="tablelist-form"
                  onSubmit={onSubmitUpdateStatusToCancel}
                >
                  <Row>
                    <Col lg={12}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          onChange={radioHandler}
                          value="Canceled By Client"
                        />
                        <Form.Label
                          className="form-check-label fs-17"
                          htmlFor="flexRadioDefault1"
                        >
                          Canceled By Client
                        </Form.Label>
                      </div>
                    </Col>
                    {selectedCancelCause === "Canceled By Client" ? (
                      <div
                        className="alert alert-danger alert-modern alert-dismissible fade show"
                        role="alert"
                      >
                        <i className="ri-error-warning-line icons"></i> By
                        Choosing this option, the contract will be terminated at
                        the customer disire.
                      </div>
                    ) : (
                      ""
                    )}
                    <Col lg={12}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value="Canceled By Admin"
                          onChange={radioHandler}
                        />
                        <Form.Label
                          className="form-check-label fs-17"
                          htmlFor="flexRadioDefault1"
                        >
                          Canceled By Admin
                        </Form.Label>
                      </div>
                    </Col>
                    {selectedCancelCause === "Canceled By Admin" ? (
                      <div
                        className="alert alert-danger alert-modern alert-dismissible fade show"
                        role="alert"
                      >
                        <i className="ri-error-warning-line icons"></i> This
                        option means that <strong>You Will Cancel</strong> the
                        contract.
                      </div>
                    ) : (
                      ""
                    )}
                    <Col lg={12}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value="Called off By Client"
                          onChange={radioHandler}
                        />
                        <Form.Label
                          className="form-check-label fs-17"
                          htmlFor="flexRadioDefault1"
                        >
                          Called off By Client
                        </Form.Label>
                      </div>
                    </Col>
                    {selectedCancelCause === "Called off By Client" ? (
                      <div
                        className="alert alert-warning alert-modern alert-dismissible fade show"
                        role="alert"
                      >
                        <i className="ri-alert-line icons"></i> The selected
                        option will cancel jobs at the demand of the client
                      </div>
                    ) : (
                      ""
                    )}

                    <Col lg={12}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value="Called off By Admin"
                          onChange={radioHandler}
                        />
                        <Form.Label
                          className="form-check-label fs-17"
                          htmlFor="flexRadioDefault1"
                        >
                          Called off By Admin
                        </Form.Label>
                      </div>
                    </Col>
                    {selectedCancelCause === "Called off By Admin" ? (
                      <div
                        className="alert alert-warning alert-modern alert-dismissible fade show"
                        role="alert"
                      >
                        <i className="ri-alert-line icons"></i> These jobs will
                        be canceled due to You.
                      </div>
                    ) : (
                      ""
                    )}
                    <Col lg={12}>
                      <div className="hstack gap-2 justify-content-end">
                        <Button
                          className="btn-soft-danger"
                          onClick={() => {
                            tog_ModalUpdateQuote();
                          }}
                          data-bs-dismiss="modal"
                        >
                          <i className="ri-close-line align-bottom me-1"></i>{" "}
                          Close
                        </Button>
                        <Button
                          className="btn-soft-info"
                          type="submit"
                          onClick={() => {
                            tog_ModalUpdateQuote();
                          }}
                        >
                          <i className="ri-send-plane-line align-bottom me-1"></i>{" "}
                          Send
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </Modal>
            {/* Modal To Assign Driver & Vehicle */}
            <Modal
              className="fade zoomIn"
              size="lg"
              show={modal_DriverVehicleAssign}
              onHide={() => {
                tog_DriverVehicleAssign();
              }}
              centered
            >
              <Modal.Body className="p-4">
                <Form
                  className="tablelist-form"
                  onSubmit={onSubmitAssignDriverAndVehicleToQuote}
                >
                  <Row>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Form.Label htmlFor="vehicle_type">Driver</Form.Label>
                      </div>
                    </Col>
                    <Col lg={9}>
                      <div className="mb-3">
                        <select
                          className="form-select text-muted"
                          name="vehicle_type"
                          id="vehicle_type"
                          onChange={
                            handleSelectDriverWhenAssignDriverAndVehicle
                          }
                        >
                          <option value="">Select</option>
                          {activeDrivers.map((driver) => (
                            <option
                              value={`${driver._id}`}
                              key={`${driver._id}`}
                            >
                              {driver.firstname} {driver.surname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Form.Label htmlFor="vehicle_type">Vehicle</Form.Label>
                      </div>
                    </Col>
                    <Col lg={9}>
                      <div className="mb-3">
                        <select
                          className="form-select text-muted"
                          name="vehicle_type"
                          id="vehicle_type"
                          onChange={
                            handleSelectVehicleWhenAssignDriverAndVehicle
                          }
                        >
                          <option value="">Select</option>
                          {activeVehicles.map((vehicle) => (
                            <option
                              value={`${vehicle._id}`}
                              key={`${vehicle._id}`}
                            >
                              {vehicle.registration_number}
                            </option>
                          ))}
                        </select>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={12}>
                      <div className="hstack gap-2 justify-content-end">
                        <Button
                          className="btn-soft-danger"
                          onClick={() => {
                            tog_DriverVehicleAssign();
                          }}
                          data-bs-dismiss="modal"
                        >
                          <i className="ri-close-fill align-bottom me-1"></i>{" "}
                          Close
                        </Button>
                        <Button
                          className="btn-soft-primary"
                          type="submit"
                          onClick={() => tog_DriverVehicleAssign()}
                        >
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          Assign
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </Modal>
            {/*Modal Progress*/}
            <Modal
              className="fade zoomIn"
              size="lg"
              show={modal_updateProgress}
              onHide={() => {
                tog_updateProgress();
              }}
              centered
            >
              {/* <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                Quote n° {selectedRow[0]?._id!}
              </h5>
            </Modal.Header> */}
              <Modal.Body className="p-4">
                <Form
                  className="tablelist-form"
                  onSubmit={onSubmitUpdateProgress}
                >
                  <Row>
                    <Col lg={12}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          onChange={radioProgressHandler}
                          value="On Route"
                        />
                        <Form.Label
                          className="form-check-label fs-17"
                          htmlFor="flexRadioDefault1"
                        >
                          On route
                        </Form.Label>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value="On Site"
                          onChange={radioProgressHandler}
                        />
                        <Form.Label
                          className="form-check-label fs-17"
                          htmlFor="flexRadioDefault1"
                        >
                          On site
                        </Form.Label>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value="Picked Up"
                          onChange={radioProgressHandler}
                        />
                        <Form.Label
                          className="form-check-label fs-17"
                          htmlFor="flexRadioDefault1"
                        >
                          Picked Up
                        </Form.Label>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          value="Completed"
                          onChange={radioProgressHandler}
                        />
                        <Form.Label
                          className="form-check-label fs-17"
                          htmlFor="flexRadioDefault1"
                        >
                          Done
                        </Form.Label>
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="hstack gap-2 justify-content-end">
                        <Button
                          className="btn-soft-danger"
                          onClick={() => {
                            tog_updateProgress();
                          }}
                          data-bs-dismiss="modal"
                        >
                          <i className="ri-close-line align-bottom me-1"></i>{" "}
                          Close
                        </Button>
                        <Button
                          className="btn-soft-info"
                          type="submit"
                          onClick={() => {
                            tog_updateProgress();
                          }}
                        >
                          <i className="ri-send-plane-line align-bottom me-1"></i>{" "}
                          Send
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Modal.Body>
            </Modal>
          </Container>
        </div>
      )}
    </React.Fragment>
  );
};
export default AcceptedJobs;
