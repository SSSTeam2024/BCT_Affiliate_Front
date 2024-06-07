import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Button,
  Form,
  Dropdown,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import {
  useDeleteProgramMutation,
  useFetchProgrammsQuery,
  useSendResponseMutation,
} from "features/programms/programmSlice";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { selectCurrentUser } from "../../features/account/authSlice";
interface ResponseMsg {
  msg: string;
  date: string;
  sender: string;
}

interface ResponseStatus {
  status: string;
  date_status: string;
}

const LoadingContainer = () => <div>Loading...</div>;
const ProgramList = (props: any) => {
  document.title = "List of Programs | School Administration";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const [modal_Pickup, setmodal_Pickup] = useState<boolean>(false);
  const [modal_Destination, setmodal_Destination] = useState<boolean>(false);

  const [openChatModal, setOpenChatModal] = useState<boolean>(false);
  const tog_OpenChatModal = () => {
    setOpenChatModal(!openChatModal);
  };
  const { data = [] } = useFetchProgrammsQuery();
  function tog_Pickup() {
    setmodal_Pickup(!modal_Pickup);
  }

  console.log(data);
  const navigate = useNavigate();
  function tog_Destination() {
    setmodal_Destination(!modal_Destination);
  }
  function tog_AddShippingModals() {
    navigate("/programming/add-program");
  }
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  const [deleteProgram] = useDeleteProgramMutation();
  const AlertDelete = async (_id: string) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you Sure?",
        text: "You won't be able to go back!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteProgram(_id);
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "The Program has been deleted.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Canceled",
            "The Program is safe :)",
            "error"
          );
        }
      });
  };
  const [modal_Action, setmodal_Action] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<ResponseMsg[]>([]);
  const [responseStatus, setResponseStatus] = useState<ResponseStatus[]>([]);
  const [currentMsg, setCurrentMsg] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState<string>("");
  const programLocation = useLocation();

  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleResponseMsgChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCurrentMsg(event.target.value);
  };

  const handleResponseMsgSubmit = () => {
    if (currentMsg.trim() !== "") {
      let date = new Date().toDateString();
      let time = new Date().toLocaleTimeString();
      let upadteDate = date + " " + time;
      let prev_notes = programLocation?.state?.notes_for_client!;
      let newResponseMsg: ResponseMsg = {
        msg: currentMsg,
        date: upadteDate,
        sender: user.name,
      };
      setResponseMsg(() => [...prev_notes, newResponseMsg]);
      setCurrentMsg("");
    }
  };

  const [sendResponseMutation] = useSendResponseMutation();

  const initialSendResponse = {
    id: "",
    notes_for_client: [
      {
        msg: "",
        date: "",
        sender: "",
      },
    ],
    program_status: [
      {
        status: "",
        date_status: "",
      },
    ],
  };
  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Response send successfully",
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

  const [sendResponse, setSendResponse] = useState(initialSendResponse);

  const handleResponseStatusSubmit = () => {
    let date = new Date().toDateString();
    let time = new Date().toLocaleTimeString();
    let upadteDate = date + " " + time;
    let prev_status: any = [];
    programLocation?.state?.program_status!.forEach((element: any) => {
      prev_status.push(element);
    });
    console.log(isChecked);
    if (isChecked === true) {
      console.log("isChecked");
      setCurrentStatus("Approved");
    } else {
      console.log("not isChecked");
      setCurrentStatus("Revised By Client");
    }
    let newResponseStatus: ResponseStatus = {
      status: currentStatus,
      date_status: upadteDate,
    };
    setResponseStatus(() => [...prev_status, newResponseStatus]);
    // console.log(newResponseStatus);
  };

  function tog_Action() {
    setmodal_Action(!modal_Action);
    handleResponseMsgSubmit();
    // handleResponseStatusSubmit();
  }

  const { id, notes_for_client, program_status } = sendResponse;

  const onChangeSendResponse = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSendResponse((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitSendResponse = (e: React.FormEvent<HTMLFormElement>) => {
    // console.log(responseStatus);
    e.preventDefault();
    try {
      sendResponse["id"] = programLocation.state?._id!;
      sendResponse["notes_for_client"] = responseMsg;
      let newResponseStatus: ResponseStatus = { status: "", date_status: "" };
      let prev_status: any = [];
      programLocation?.state?.program_status!.forEach((element: any) => {
        prev_status.push(element);
      });
      if (isChecked === true) {
        let date = new Date().toDateString();
        let time = new Date().toLocaleTimeString();
        let upadteDate = date + " " + time;
        newResponseStatus = {
          status: "Approved By Client",
          date_status: upadteDate,
        };
        prev_status.push(newResponseStatus);
      }
      if (isChecked === false) {
        let date = new Date().toDateString();
        let time = new Date().toLocaleTimeString();
        let upadteDate = date + " " + time;
        newResponseStatus = {
          status: "Answered By Client",
          date_status: upadteDate,
        };
        console.log(prev_status);
        prev_status.push(newResponseStatus);
        // setResponseStatus(() => [...prev_status, newResponseStatus]);
        // console.log(newResponseStatus);
      }

      sendResponse["program_status"] = prev_status;
      handleResponseMsgSubmit();
      sendResponseMutation(sendResponse)
        .then(() => notifySuccess())
        .then(() => navigate("/list-of-program"));
    } catch (error) {
      notifyError(error);
    }
  };

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row: any) => row.programName,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Pickup</span>,
      selector: (cell: any) => {
        return (
          <span>
            <Link to="#">
              <span className="text-secondary" onClick={() => tog_Pickup()}>
                {cell.origin_point.placeName}
              </span>
            </Link>
          </span>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Destination</span>,
      selector: (cell: any) => {
        return (
          <span>
            <Link to="#">
              <span
                className="text-secondary"
                onClick={() => tog_Destination()}
              >
                {cell.destination_point.placeName}
              </span>
            </Link>
          </span>
        );
      },
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">From</span>,
      selector: (row: any) => row.pickUp_date,
      sortable: true,
      width: "140px",
    },
    {
      name: <span className="font-weight-bold fs-13">To</span>,
      selector: (row: any) => row.droppOff_date,
      sortable: true,
      width: "140px",
    },
    // {
    //   name: <span className="font-weight-bold fs-13">Status</span>,
    //   selector: (row: any) => row.program_status,
    //   sortable: true,
    //   cell: (row: any, index: number) => {
    //     switch (row.program_status[row.program_status.length - 1]?.status!) {
    //       case "Approved By Client":
    //         return (
    //           <span className="badge bg-success-subtle text-success">
    //             {row.program_status[row.program_status.length - 1]?.status!}
    //           </span>
    //         );
    //       case "Pending":
    //         return (
    //           <span className="badge bg-danger-subtle text-danger">
    //             {row.program_status[row.program_status.length - 1]?.status!}
    //           </span>
    //         );
    //       case "Answered By Client":
    //         return (
    //           <span className="badge bg-secondary-subtle text-secondary">
    //             {row.program_status[row.program_status.length - 1]?.status!}
    //           </span>
    //         );
    //       case "Answered By Admin":
    //         return (
    //           <span className="badge bg-info-subtle text-info">
    //             {row.program_status[row.program_status.length - 1]?.status!}
    //           </span>
    //         );
    //         case "Approved By Admin":
    //         return (
    //           <span className="badge bg-dark-subtle text-dark">
    //             {row.program_status[row.program_status.length - 1]?.status!}
    //           </span>
    //         );
    //       default:
    //         return (
    //           <span className="badge bg-secondary-subtle text-secondary">
    //             {row.program_status[row.program_status.length - 1]?.status!}
    //           </span>
    //         );
    //     }
    //   },
    // },

    {
      name: <span className="font-weight-bold fs-13">Status</span>,
      selector: (row: any) => row.program_status,
      sortable: true,
      cell: (row: any, index: number) => {
        const latestStatus =
          row.program_status[row.program_status.length - 1]?.status;
        const penultimateStatus =
          row.program_status[row.program_status.length - 2]?.status;

        return (latestStatus === "Approved By Client" &&
          penultimateStatus === "Approved By Admin") ||
          (penultimateStatus === "Approved By Client" &&
            latestStatus === "Approved By Admin") ? (
          <span className="badge badge-soft-success text-uppercase">
            Converted To Contract
          </span>
        ) : latestStatus === "Pending" ? (
          <span className="badge bg-danger-subtle text-danger">Pending</span>
        ) : latestStatus === "Answered By Client" ? (
          <span className="badge bg-secondary-subtle text-dark">
            Answered By Client
          </span>
        ) : latestStatus === "Answered By Admin" ? (
          <span className="badge bg-info-subtle text-dark">
            Answered By Admin
          </span>
        ) : latestStatus === "Approved By Admin" ? (
          <span className="badge bg-dark-subtle text-dark">
            Approved By Admin
          </span>
        ) : latestStatus === "Approved By Client" ? (
          <span className="badge bg-success-subtle text-dark">
            Approved By Client
          </span>
        ) : null;
      },
    },
    {
      name: <span className="font-weight-bold fs-13">Price</span>,
      selector: (row: any) => {
        return row.total_price === "" ? (
          <span>No Price</span>
        ) : (
          <span>£ {row.total_price}</span>
        );
      },
      sortable: true,
      width: "140px",
    },

    {
      name: <span className="font-weight-bold fs-13">Invoice Frequency</span>,
      selector: (cell: any) => {
        switch (cell.invoiceFrequency) {
          case "Weekly":
            return (
              <span className="badge bg-primary">{cell.invoiceFrequency}</span>
            );
          case "Bi Weekly":
            return (
              <span className="badge bg-info"> {cell.invoiceFrequency} </span>
            );
          case "Daily":
            return (
              <span className="badge bg-success">
                {" "}
                {cell.invoiceFrequency}{" "}
              </span>
            );
          case "Third Weekly":
            return (
              <span className="badge bg-secondary">
                {" "}
                {cell.invoiceFrequency}{" "}
              </span>
            );
          case "Monthly":
            return (
              <span className="badge bg-dark"> {cell.invoiceFrequency} </span>
            );
          default:
            return <span>--</span>;
        }
      },
      sortable: true,
      width: "160px",
    },

    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,
      selector: (row: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            {/* <li>
              <Link
                to={`/program/${row.Name}`}
                className="badge badge-soft-dark edit-item-btn"
                state={row}
              >
                <i
                  className="ph ph-copy"
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
                  title="Clone"
                ></i>
              </Link>
            </li> */}

            <li>
              <Link
                to={`/program-details/${row.Name}`}
                className="badge badge-soft-primary edit-item-btn"
                state={row}
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
                className="badge badge-soft-dark edit-item-btn"
                state={row}
                onClick={() => tog_Action()}
              >
                <i
                  className="ph ph-paper-plane-tilt"
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
              <Dropdown
                className="topbar-head-dropdown ms-1 header-item"
                id="notificationDropdown"
              >
                <Link
                  to="#"
                  state={row}
                  id="notification"
                  type="button"
                  className="badge badge-soft-info edit-item-btn"
                  onClick={() => tog_OpenChatModal()}
                >
                  <i
                    className="ph ph-chats"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.9em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                  <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
                    <span className="notification-badge">
                      {row?.notes_for_client.length}
                    </span>
                  </span>
                </Link>
              </Dropdown>
            </li>

            <li>
              <Link
                to={`/edit-program/${row.Name}`}
                className="badge badge-soft-success edit-item-btn"
                state={row}
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
              <Link to="#" className="badge badge-soft-danger remove-item-btn">
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
                  onClick={() => AlertDelete(row._id)}
                ></i>
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
          <Breadcrumb title="List of Programs" pageTitle="Programming" />
          <Col lg={12}>
            <Card>
              <Card.Body>
                <Row className="g-3">
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
                  <Col xxl={3} lg={6}>
                    <Flatpickr
                      className="form-control flatpickr-input"
                      placeholder="Select Date"
                      options={{
                        mode: "range",
                        dateFormat: "d M, Y",
                      }}
                    />
                  </Col>
                  <Col xxl={2} lg={6}>
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                    >
                      <option value="">Status</option>
                      <option value="Pickups">Pickups</option>
                      <option value="Pending">Pending</option>
                      <option value="Shipping">Shipping</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Out Of Delivery">Out Of Delivery</option>
                    </select>
                  </Col>

                  <Col lg={5} className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      onClick={() => tog_AddShippingModals()}
                      className="add-btn"
                    >
                      <i className="bi bi-plus-circle me-1 align-middle "></i>{" "}
                      Add Programm
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Card id="shipmentsList">
              <Card.Header className="border-bottom-dashed">
                <Row className="g-3">
                  <Col xxl={3} lg={6}>
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
                <DataTable columns={columns} data={data} pagination />
              </Card.Body>
            </Card>
          </Col>
        </Container>
        {/* Modal Action */}
        <Modal
          className="fade zoomIn"
          size="lg"
          show={modal_Action}
          onHide={() => {
            tog_Action();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Send Notes
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={onSubmitSendResponse}>
           
              <Col lg={12} className="mb-2">
                <Form.Label htmlFor="unit_price">Unit Price</Form.Label>
                <Form.Control
                      type="text"
                      name="unit_price"
                      id="unit_price"
                      placeholder="£ 00.00"
                      defaultValue={programLocation?.state?.unit_price!}
                      readOnly
                    />
              </Col>
              <Col lg={12} className="mb-2">
                    <Form.Label htmlFor="total_price">Total Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="total_price"
                      id="total_price"
                      placeholder="£ 00.00"
                      // onChange={onChangeUnitPrice}
                      defaultValue={programLocation?.state?.total_price!}
                      readOnly
                    />
                  </Col>
              <Col lg={12} className="mb-2">
                <Form.Label htmlFor="notes_for_client">Notes</Form.Label>
                <textarea
                  className="form-control"
                  id="notes_for_client"
                  name="notes_for_client"
                  // placeholder="Customer see these!"
                  rows={3}
                  // value={sendResponse.notes_for_client}
                  value={currentMsg}
                  onChange={handleResponseMsgChange}
                ></textarea>
              </Col>
              <Col lg={4} className="d-flex align-items-center">
                <div className="form-check m-2">
                  <Form.Control
                    className="form-check-input"
                    type="checkbox"
                    id="formCheck1"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </div>
                <Form.Label className="m-2" htmlFor="customerName-field">
                  Approved
                </Form.Label>
              </Col>
              <Col lg={12}>
                <div className="hstack gap-2 justify-content-end">
                  <Button
                    className="btn-ghost-danger"
                    onClick={() => {
                      tog_Action();
                      setSendResponse(initialSendResponse);
                    }}
                    data-bs-dismiss="modal"
                  >
                    <i className="ri-close-line align-bottom me-1"></i> Close
                  </Button>
                  <Button
                    variant="primary"
                    id="add-btn"
                    type="submit"
                    onClick={() => {
                      tog_Action();
                    }}
                  >
                    Send
                  </Button>
                </div>
              </Col>
            </Form>
          </Modal.Body>
        </Modal>

         {/* Modal Display Notes  */}
         <Modal
          className="fade zoomIn"
          size="lg"
          show={openChatModal}
          onHide={() => {
            tog_OpenChatModal();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Chat
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            
            {programLocation?.state?.notes_for_client!.map((notes: any) => (
              <Card>
                <Card.Header>
                  <h6>{notes.sender}</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Control
                    type="text"
                    defaultValue={notes.msg}
                    className="mb-2"
                  />
                  <Form.Control type="text" defaultValue={notes.date} />
                </Card.Body>
              </Card>
            ))}
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
};
export default GoogleApiWrapper({
  apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
  LoadingContainer: LoadingContainer,
  v: "3",
})(ProgramList);
