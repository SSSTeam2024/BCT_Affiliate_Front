import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal,
  Form,
  Button,
  Tab,
  Nav,
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Quote,
  useAddAffiliateDriverToQuoteMutation,
  useAddDriverToQuoteMutation,
  useAssignAffiliateDriverAndVehicleToQuoteMutation,
  useAssignDriverAndVehicleToQuoteMutation,
  useDeleteAffiliateQuoteMutation,
  useDeleteQuoteMutation,
  useGetAllQuoteQuery,
  useUpdateStatusAffiliateQuoteToAcceptMutation,
  useUpdateStatusAffiliateQuoteToCancelMutation,
  useUpdateStatusAffiliateQuoteToRefuseMutation,
  useUpdateStatusQuoteToCancelMutation,
} from "features/quotes/quotesSlice";
import ModalAssignVehicle from "../AcceptedJobs/ModalAssignVehicle";
import Swal from "sweetalert2";
import {
  useGetAllDriverQuery,
  useGetDriverByIDQuery,
} from "features/driver/driverSlice";
import { useGetAllVehiclesQuery } from "features/vehicles/vehicleSlice";
import { selectCurrentUser } from "../../features/affiliate/authAffiliateSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store"; // Import your RootState interface
import {
  AffiliateAccount,
  useUpdateAffiliateMutation,
} from "features/affiliate/affiliateSlice";
const CheckProgress = () => {
  document.title = "New Jobs | Affiliate Administration";
  const [modal_AssignDriver, setModal_AssignDriver] = useState<boolean>(false);
  const [modal_AssignVehicle, setModal_AssignVehicle] =
    useState<boolean>(false);

  const [legalCardFilled, setLegalCardFilled] = useState(false);
  const [dbsFilled, setDBSFilled] = useState(false);
  const [pvcFilled, setPVCFilled] = useState(false);

  const { data: AllQuotes = [] } = useGetAllQuoteQuery();

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  // const [progressBar, setProgressBar] = useState(user?.progress || "0");
  // const updateProgress = async(newProgress: any) => {
  //   setProgressBar(newProgress);
  // };
  // useEffect(()=> {
  //   updateProgress(user?.progress!)
  // }, [user?.progress!])

  // console.log(progressBar)
  // console.log(user?.progress!)
  // // Function to update progress

  const [filledFields, setFilledFields] = useState(0);
  const totalFields = 6;
  const [licenceNumber, setLicenceNumber] = useState<string>("");
  const [insuranceNumber, setInsuranceNumber] = useState<string>("");
  const onChangeLicenceNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicenceNumber(e.target.value);
  };

  const onChangeInsuranceNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInsuranceNumber(e.target.value);
  };

  const result = AllQuotes.filter(
    (bookings) =>
      (bookings?.affiliate_id?._id! === user?._id! &&
        bookings.progress === "New") ||
      bookings.progress === "Refuse"
  );
  const privateHiredJobs = result.filter(
    (privateHired) => privateHired?.category === "Private"
  );
  const contractJobs = result.filter(
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
  const [modal_UpdateQuote, setmodal_UpdateQuote] = useState<boolean>(false);
  const tog_ModalUpdateQuote = () => {
    setmodal_UpdateQuote(!modal_UpdateQuote);
  };
  const locationQuote = useLocation();
  const navigate = useNavigate();
  const { data: AllDrivers = [] } = useGetAllDriverQuery();
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

  // Initialize state to hold an array of objects with type and qty properties
  const [quantities, setQuantities] = useState<{ type: string; qty: string }[]>(
    user?.vehicles?.map((vehicle: any) => ({ type: vehicle.type, qty: "" })) ||
      []
  );

  useEffect(() => {
    if (user?.vehicles) {
      setQuantities(
        user.vehicles.map((vehicle: any) => ({ type: vehicle.type, qty: "" }))
      );
    }
  }, [user?.vehicles]);

  // Update the handleQty function to update the qty property of the corresponding vehicle
  const handleQty =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantities = [...quantities];
      newQuantities[index].qty! = e.target.value;
      setQuantities(newQuantities);
    };

  // Fleet Number
  const sum = quantities.reduce((acc, curr) => {
    const quantity = parseFloat(curr.qty); // Parse qty property, not the entire object
    return isNaN(quantity) ? acc : acc + quantity;
  }, 0);

  // Zone Raduis
  const [raduis, setRaduis] = useState<
    {
      placeName: string;
      coordinates: {
        lat: string;
        lng: string;
      };
      raduis: string;
    }[]
  >(
    user?.coverageArea?.map((area: any) => ({
      placeName: area.placeName,
      coordinates: {
        lat: area.coordinates.lat,
        lng: area.coordinates.lng,
      },
      raduis: "",
    })) || []
  );

  useEffect(() => {
    if (user?.coverageArea) {
      setRaduis(
        user.coverageArea.map((area: any) => ({
          placeName: area.placeName,
          coordinates: {
            lat: area.coordinates.lat,
            lng: area.coordinates.lng,
          },
          raduis: "",
        }))
      );
    }
  }, [user?.coverageArea]);

  const handleRaduis =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newRaduis = [...raduis];
      newRaduis[index].raduis = e.target.value;
      setRaduis(newRaduis);
    };

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
  // This function is triggered when the select Vehicle
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
        .then(() => navigate("/bookings"))
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
            <Link to={`/assign-quote/${cell?._id!}`} state={cell}>
              <span className="text-dark">{cell?._id}</span>
            </Link>{" "}
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
          case "New":
            return <span className="badge bg-info"> {cell.progress} </span>;
          case "Accepted":
            return <span className="badge bg-success"> {cell.progress} </span>;
          case "Refused":
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
          £ <b>{row?.manual_cost!}</b>
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
  const [acceptQuote] = useUpdateStatusAffiliateQuoteToAcceptMutation();
  const handleAccept = () => {
    const affiliateId = user?._id!;
    acceptQuote({
      quote: selectedRow[0]!,
      affiliateId: affiliateId,
    });
  };

  const [refuseQuote] = useUpdateStatusAffiliateQuoteToRefuseMutation();

  const handleRefuse = () => {
    const affiliateId = user?._id!;
    const quoteId = selectedRow[0]?._id!;
    refuseQuote({
      quoteId: quoteId,
      affiliateId: affiliateId,
    });
  };

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

  const AlertAccept = async () => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to go back?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, accept it !",
        cancelButtonText: "No, cancel !",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          handleAccept();
          setIsChecked(!isChecked);
          swalWithBootstrapButtons.fire(
            "Accept !",
            "Quote is Accepted.",
            "success"
          );
          navigate("/jobs/accepted-jobs");
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Canceled",
            "Quote is not Accepted :)",
            "info"
          );
        }
      });
  };

  const AlertRefuse = async () => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to go back?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, refuse it !",
        cancelButtonText: "No, cancel !",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          handleRefuse();
          setIsChecked(!isChecked);
          swalWithBootstrapButtons.fire(
            "Refused !",
            "Quote is Refused.",
            "success"
          );
          navigate("/jobs/new-jobs");
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "Canceled",
            "Quote is not Refused :)",
            "info"
          );
        }
      });
  };
  // The selected Reglement
  const [selectedCancelCause, setSelectedCancelCause] = useState<string>("");

  // This function will be triggered when a radio button is selected
  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCancelCause(event.target.value);
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
        .then(() => navigate("/new-jobs"))
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
        .then(() => navigate("/new-jobs"))
        .then(() => notifySuccess());
    } catch (error) {
      notifyError(error);
    }
  };

  const activeDrivers = AllDrivers.filter(
    (drivers) => drivers.driverStatus === "Active"
  );

  const { data: AllVehicles = [] } = useGetAllVehiclesQuery();
  const activeVehicles = AllVehicles.filter(
    (vehicles) => vehicles.statusVehicle === "Active"
  );

  //add file
  function convertToBase64(
    file: File
  ): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        // const base64Data = base64String.split(",")[1]; // Extract only the Base64 data
        const [, base64Data] = base64String.split(","); // Extract only the Base64 data
        const extension = file.name.split(".").pop() ?? ""; // Get the file extension
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("IdFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newFile = base64Data + "." + extension;
      setUpdateAffiliateProfile({
        ...updateAffiliateProfile,
        id_file: newFile,
        IdFileBase64String: base64Data,
        IdFileExtension: extension,
      });
    }
  };
  const handleFileUploadDBS = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("IdFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      console.log(base64Data);
      console.log(extension);
      const newFile = base64Data + "." + extension;
      console.log(newFile);
      setUpdateAffiliateProfile({
        ...updateAffiliateProfile,
        id_file: newFile,
        IdFileBase64String: base64Data,
        IdFileExtension: extension,
      });
    }
  };

  const [updateAffiliateProfileMutation] = useUpdateAffiliateMutation();

  const initialAffiliateAccount = {
    _id: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    notes: "",
    fleetNumber: "",
    enquiryDate: "",
    coverageDistance: "",
    coverageArea: [
      {
        placeName: "",
        coordinates: {
          lat: "",
          lng: "",
        },
        raduis: "",
      },
    ],
    years_experience: "",
    avatar: "",
    avatarBase64String: "",
    avatarExtension: "",
    website: "",
    service_date: "",
    statusAffiliate: "",
    account_name: "",
    sort_code: "",
    account_number: "",
    bank_name: "",
    login: "",
    password: "",
    vehicles: [
      {
        type: "",
        qty: "",
      },
    ],
    api_token: "",
    progress: "",
    insurance_date: "",
    insurance_number: "",
    insuranceFileBase64String: "",
    InsuranceFileExtension: "",
    insurance_file: "",
    id_creation_date: "",
    number_file: "",
    id_file: "",
    IdFileExtension: "",
    IdFileBase64String: "",
    category: "",
    priceJob: "",
    noteAcceptJob: "",
    statusJob: "",
  };

  const [updateAffiliateProfile, setUpdateAffiliateProfile] =
    useState<AffiliateAccount>(initialAffiliateAccount);

  const {
    _id,
    name,
    address,
    email,
    phone,
    notes,
    fleetNumber,
    enquiryDate,
    coverageDistance,
    coverageArea,
    years_experience,
    avatar,
    avatarBase64String,
    avatarExtension,
    website,
    service_date,
    statusAffiliate,
    account_name,
    sort_code,
    account_number,
    bank_name,
    login,
    password,
    vehicles,
    api_token,
    progress,
    insurance_date,
    insurance_number,
    insuranceFileBase64String,
    InsuranceFileExtension,
    insurance_file,
    id_creation_date,
    number_file,
    id_file,
    IdFileExtension,
    IdFileBase64String,
    category,
    priceJob,
    noteAcceptJob,
    statusJob,
  } = updateAffiliateProfile as AffiliateAccount;

  // Expiration licence Date
  const [selectedExpirationLicenceDate, setSelectedExpirationLicenceDate] =
    useState<Date | null>(null);
  const handleExpirationLicenceDateChange = (selectedDates: Date[]) => {
    setSelectedExpirationLicenceDate(selectedDates[0]);
  };

  const [selectedExpirationInsuranceDate, setSelectedExpirationInsuranceDate] =
    useState<Date | null>(null);
  const handleExpirationInsuranceDateChange = (selectedDates: Date[]) => {
    setSelectedExpirationInsuranceDate(selectedDates[0]);
  };

  const onChangeUpdateAffiliateProfile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdateStatusToCancel((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateAffiliateProfile((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
    // handleInputChange()
  };

  const [licenceFile, setLicenceFile] = useState<string>("");
  const [insuranceFile, setInsuranceFile] = useState<string>("");
  const handlePDFUploadLicence = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("IdFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;
      console.log(extension);
      setLicenceFile(newPDF);
      console.log(newPDF);
      setUpdateAffiliateProfile({
        ...updateAffiliateProfile,
        id_file: newPDF,
        IdFileBase64String: base64Data,
        IdFileExtension: extension,
      });
    }
    // handleInputChange()
  };

  const handlePDFUploadInsurance = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("insuranceFileBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;
      console.log(extension);
      setInsuranceFile(newPDF);
      console.log(newPDF);
      setUpdateAffiliateProfile({
        ...updateAffiliateProfile,
        insurance_file: newPDF,
        insuranceFileBase64String: base64Data,
        InsuranceFileExtension: extension,
      });
    }
  };

  const onSubmitUpdateAffiliateProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      updateAffiliateProfile["_id"] = user?._id!;
      updateAffiliateProfile["id_creation_date"] = user?.id_creation_date;
      updateAffiliateProfile["insurance_date"] =
        selectedExpirationInsuranceDate!.toDateString();
      updateAffiliateProfile["address"] = user?.address!;
      updateAffiliateProfile["email"] = user?.email!;
      updateAffiliateProfile["name"] = user?.name!;
      updateAffiliateProfile["phone"] = user?.phone!;
      updateAffiliateProfile["category"] = user?.category!;
      updateAffiliateProfile["service_date"] = user?.service_date!;
      updateAffiliateProfile["statusAffiliate"] = user?.statusAffiliate!;
      updateAffiliateProfile["account_name"] = user?.account_name!;
      updateAffiliateProfile["sort_code"] = user?.sort_code!;
      updateAffiliateProfile["account_number"] = user?.account_number!;
      updateAffiliateProfile["bank_name"] = user?.bank_name!;
      updateAffiliateProfile["login"] = user?.login!;
      updateAffiliateProfile["password"] = user?.password!;
      updateAffiliateProfile["api_token"] = user?.api_token!;
      updateAffiliateProfile["vehicles"] = quantities;
      updateAffiliateProfile["notes"] = user?.notes!;
      updateAffiliateProfile["fleetNumber"] = sum.toFixed(0);
      // updateAffiliateProfile["coverageDistance"] = zone.toFixed(0);
      updateAffiliateProfile["coverageArea"] = raduis;
      updateAffiliateProfile["years_experience"] = user?.years_experience!;
      updateAffiliateProfile["website"] = user?.website!;
      updateAffiliateProfile["progress"] = filledFields.toString();
      updateAffiliateProfile["number_file"] = user?.number_file!;
      updateAffiliateProfile["id_file"] = user?.id_file!;
      updateAffiliateProfile["insurance_number"] = insuranceNumber;
      console.log(updateAffiliateProfile);
      updateAffiliateProfileMutation(updateAffiliateProfile)
        .then(() => navigate("/dashbord"))
        .then(() => notifySuccess());
    } catch (error) {
      notifyError(error);
    }
  };

  let filledCount = 0;

  const handleInputChange = () => {
    let totalFields = 6;

    if (sum !== 0) {
      filledCount++;
    }
    if (raduis.length !== 0) {
      filledCount++;
    }
    if (selectedExpirationInsuranceDate !== null) {
      filledCount++;
    }
    if (insuranceNumber !== "") {
      filledCount++;
    }
    if (insuranceFile !== "") {
      filledCount++;
    }
    if (isPrivateHiredChecked !== false) {
      filledCount++;
    }
    const progress = (filledCount / totalFields) * 100;
    setFilledFields(progress);
  };

  useEffect(() => {
    handleInputChange();
  }, [
    sum,
    raduis,
    insuranceNumber,
    selectedExpirationInsuranceDate,
    insuranceFile,
    isPrivateHiredChecked,
    filledCount,
  ]);
  const [show, setShow] = useState<boolean>(false);
  const handleShow = () => {
    setShow(!show);
  };
  const [activeVerticalTab, setactiveVerticalTab] = useState<number>(1);
  const [activeTab, setActiveTab] = useState("custom-v-pills-home");
  const [licenceEnabled, setLicenceEnabled] = useState(true);
  const [insuranceEnabled, setInsuranceEnabled] = useState(false);
  const [termsEnabled, setTermsEnabled] = useState(false);

  const isLicenceNameStepValid = () => {
    return sum !== 0;
  };
  const isLicenceFileStepValid = () => {
    return raduis.length !== 0;
  };
  // const isLicenceDateStepValid = () => {
  //   return selectedExpirationLicenceDate !== null;
  // };

  const isInsuranceNameStepValid = () => {
    return insuranceNumber.trim() !== "";
  };
  const isInsuranceFileStepValid = () => {
    return insuranceFile.trim() !== "";
  };
  const isInsuranceDateStepValid = () => {
    return selectedExpirationInsuranceDate !== null;
  };

  const isTermsStepValid = () => {
    return termsEnabled !== false;
  };

  const isNextButtonDisabled = () => {
    switch (activeVerticalTab) {
      case 1:
        return !isLicenceNameStepValid() || !isLicenceFileStepValid();

      case 2:
        return (
          !isInsuranceNameStepValid() ||
          !isInsuranceFileStepValid() ||
          !isInsuranceDateStepValid()
        );
      case 3:
        return !isTermsStepValid();
      default:
        return false;
    }
  };
  const handleNextStep = (isResume: boolean) => {
    if (!isNextButtonDisabled()) {
      setactiveVerticalTab(activeVerticalTab + 1);
    } else {
      alert("Please fill all required fields before proceeding.");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="card bg-light overflow-hidden">
            <div className="card-body">
              <div className="d-flex">
                <div className="flex-grow-1">
                  <h6 className="mb-0">
                    <b className="text-success"> {filledFields.toFixed(1)}%</b>{" "}
                    Update in progress...
                  </h6>
                </div>
                {/* <div className="flex-shrink-0">
                <h6 className="mb-0">45s left</h6>
            </div> */}
              </div>
            </div>
            <div className="progress bg-success-subtle rounded-0">
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${filledFields}%` }}
                aria-valuenow={filledFields}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
          {user?.progress! !== "100" ? (
            <Form onSubmit={onSubmitUpdateAffiliateProfile}>
              <Col xxl={12}>
                <Card>
                  <Card.Body>
                    <Row>
                      <Col lg={6} className="d-flex justify-content-start">
                        <p className="text-muted">
                          Please finalize these informations to complete your
                          profile and enable receiving job notifications..
                        </p>
                      </Col>

                      <Col lg={6} className="d-flex justify-content-end mb-2">
                        <Button
                          variant="success"
                          id="add-btn"
                          className="btn-sm"
                          type="submit"
                          // onClick={handleSaveAndSend}
                        >
                          Save & Send
                        </Button>
                      </Col>
                    </Row>
                    <div className="vertical-navs-step">
                      <Tab.Container activeKey={activeVerticalTab}>
                        <Row className="gy-5">
                          <Col lg={3}>
                            <Nav
                              as="div"
                              variant="pills"
                              className="nav flex-column custom-nav nav-pills"
                              role="tablist"
                              aria-orientation="vertical"
                            >
                              <Nav.Link
                                as="button"
                                className="nav-link done"
                                eventKey="1"
                                onClick={() => setactiveVerticalTab(1)}
                              >
                                <span className="step-title me-2">
                                  <i className="ri-close-circle-fill step-icon me-2"></i>{" "}
                                  Step 1
                                </span>
                                Licence Information
                              </Nav.Link>
                              <Nav.Link
                                as="button"
                                className={
                                  activeVerticalTab > 2
                                    ? "nav-link done"
                                    : "nav-link disabled"
                                }
                                eventKey="2"
                                onClick={() => setactiveVerticalTab(2)}
                              >
                                <span className="step-title me-2">
                                  <i className="ri-close-circle-fill step-icon me-2"></i>{" "}
                                  Step 2
                                </span>
                                Insurance Information
                              </Nav.Link>
                              <Nav.Link
                                as="button"
                                className={
                                  activeVerticalTab > 3
                                    ? "nav-link done"
                                    : "nav-link disabled"
                                }
                                eventKey="3"
                                onClick={() => setactiveVerticalTab(3)}
                              >
                                <span className="step-title me-2">
                                  <i className="ri-close-circle-fill step-icon me-2"></i>{" "}
                                  Step 3
                                </span>
                                Terms And Conditions
                              </Nav.Link>
                            </Nav>
                          </Col>
                          <Col lg={9}>
                            <div className="px-lg-4">
                              <Tab.Content>
                                <Tab.Pane eventKey="1">
                                  {user?.vehicles!.map(
                                    (vehicle: any, index: number) => (
                                      <Row key={index}>
                                        {" "}
                                        {/* Make sure to add a unique key */}
                                        <Col lg={6}>
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`vehicleType_${index}`}
                                              className="form-label"
                                            >
                                              Vehicle Type
                                            </label>
                                            <Form.Control
                                              type="text"
                                              id={`vehicleType_${index}`}
                                              value={vehicle.type}
                                              readOnly
                                            />
                                          </div>
                                        </Col>
                                        <Col lg={3}>
                                          <div className="mb-3">
                                            <label
                                              htmlFor={`qty_${index}`}
                                              className="form-label"
                                            >
                                              Quantity
                                            </label>
                                            <Form.Control
                                              type="text"
                                              id={`qty_${index}`}
                                              name={`qty_${index}`}
                                              value={quantities[index]?.qty!}
                                              onChange={handleQty(index)}
                                            />
                                          </div>
                                        </Col>
                                      </Row>
                                    )
                                  )}
                                  <Row>
                                    <Col
                                      lg={9}
                                      className="d-flex justify-content-end"
                                    >
                                      Fleet Number : {sum}
                                    </Col>
                                  </Row>

                                  {user?.coverageArea!.map(
                                    (area: any, index: number) => (
                                      <Row>
                                        <Col lg={6}>
                                          <div className="mb-3">
                                            <label
                                              htmlFor="vehicleType"
                                              className="form-label"
                                            >
                                              Area
                                            </label>
                                            <Form.Control
                                              type="text"
                                              id="vehicleType"
                                              value={area?.placeName!}
                                              readOnly
                                            />
                                          </div>
                                        </Col>
                                        <Col lg={3}>
                                          <div className="mb-3">
                                            <label
                                              htmlFor="raduis"
                                              className="form-label"
                                            >
                                              Raduis
                                            </label>
                                            <Form.Control
                                              type="text"
                                              id={`raduis${index}`}
                                              name={`raduis${index}`}
                                              value={raduis[index].raduis}
                                              onChange={handleRaduis(index)}
                                            />
                                          </div>
                                        </Col>
                                      </Row>
                                    )
                                  )}
                                  <Col
                                    lg={12}
                                    className="d-flex justify-content-end mb-2"
                                  >
                                    <Button
                                      variant="info"
                                      id="add-btn"
                                      className="btn-sm"
                                      onClick={() => handleNextStep(false)}
                                      disabled={isNextButtonDisabled()}
                                    >
                                      Next
                                      <i className="ph ph-arrow-right align-middle fs-18"></i>
                                    </Button>
                                  </Col>
                                </Tab.Pane>

                                <Tab.Pane eventKey="2">
                                  <Col lg={12}>
                                    <div className="mb-3">
                                      <label
                                        htmlFor="insuranceNumber"
                                        className="form-label"
                                      >
                                        Insurance Number
                                      </label>
                                      <Form.Control
                                        type="text"
                                        id="insuranceNumber"
                                        placeholder="Enter Insurance Number "
                                        onChange={onChangeInsuranceNumber}
                                        value={insuranceNumber}
                                      />
                                    </div>
                                  </Col>
                                  <Col lg={12}>
                                    <div className="mb-3">
                                      <label
                                        htmlFor="statusSelect"
                                        className="form-label"
                                      >
                                        Insurance File
                                      </label>
                                      <Form.Control
                                        name="insuranceFileBase64String"
                                        onChange={handlePDFUploadInsurance}
                                        type="file"
                                        id="insuranceFileBase64String"
                                        accept=".pdf"
                                        placeholder="Choose File"
                                        className="text-muted"
                                      />
                                    </div>
                                  </Col>

                                  <Col lg={12}>
                                    <div className="mb-3">
                                      <Form.Label htmlFor="supplierName-field">
                                        Expiration Date
                                      </Form.Label>
                                      <Flatpickr
                                        value={selectedExpirationInsuranceDate!}
                                        onChange={
                                          handleExpirationInsuranceDateChange
                                        }
                                        className="form-control flatpickr-input"
                                        placeholder="Select Date"
                                        options={{
                                          dateFormat: "d M, Y",
                                        }}
                                        id="insurance_date"
                                        name="insurance_date"
                                      />
                                    </div>
                                  </Col>
                                  <Col
                                    lg={12}
                                    className="d-flex justify-content-end mb-2"
                                  >
                                    <Button
                                      variant="info"
                                      id="add-btn"
                                      className="btn-sm"
                                      onClick={() => handleNextStep(false)}
                                      disabled={isNextButtonDisabled()}
                                    >
                                      Next
                                      <i className="ph ph-arrow-right align-middle fs-18"></i>
                                    </Button>
                                  </Col>
                                </Tab.Pane>
                                <Tab.Pane eventKey="3">
                                  <div className="d-flex mb-4">
                                    <div className="flex-shrink-0"></div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="flex-grow-1 ms-3">
                                      <Col className="d-flex align-items-center">
                                        <div className="form-check form-check-inline">
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="inlineCheckbox1"
                                            value="option1"
                                            checked={isPrivateHiredChecked}
                                            onChange={
                                              handlePrivateHiredCheckboxChange
                                            }
                                          />
                                          <label
                                            className="form-check-label"
                                            htmlFor="inlineCheckbox1"
                                          >
                                            I agree to Terms Conditions
                                          </label>
                                        </div>
                                      </Col>
                                    </div>
                                    <div className="flex-shrink-0"></div>
                                  </div>
                                </Tab.Pane>
                              </Tab.Content>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Form>
          ) : (
            <>
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
                          <option value="all">All Payment</option>
                          <option value="Today">Not paid</option>
                          <option value="Yesterday">Part paid</option>
                          <option value="Last 7 Days">Paid</option>
                          <option value="Last 30 Days">Pay Cash</option>
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
                          <option value="Last 7 Days">Under bid</option>
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
                          <option value="all">All Priority</option>
                          <option value="Today">1</option>
                          <option value="Yesterday">2</option>
                          <option value="Last 7 Days">3</option>
                          <option value="Last 30 Days">4</option>
                          <option value="Today">5</option>
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
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};
export default CheckProgress;
