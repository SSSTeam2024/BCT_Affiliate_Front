import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import SimpleBar from "simplebar-react";
import Swal from "sweetalert2";
import { Document, Page } from "react-pdf";
// Import Contry Data
import countryData from "Common/country";
import { useUpdateDriverMutation } from "features/driver/driverSlice";
import { selectCurrentUser } from "features/affiliate/authAffiliateSlice";
import { useSelector } from "react-redux";
import { RootState } from "app/store";
import { pdfjs } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const EditDriver = () => {
  document.title = "Edit Driver | Affiliate Administration";

  if (pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const navigate = useNavigate();
  const driverLocation = useLocation();
  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Driver is updated successfully",
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

  const [modal_DrivingLicense, setmodal_DrivingLicense] =
    useState<boolean>(false);
  function tog_DrivingLicense() {
    setmodal_DrivingLicense(!modal_DrivingLicense);
  }

  const [modal_DQC, setmodal_DQC] = useState<boolean>(false);
  function tog_DQC() {
    setmodal_DQC(!modal_DQC);
  }

  const [modal_DBS, setmodal_DBS] = useState<boolean>(false);
  function tog_DBS() {
    setmodal_DBS(!modal_DBS);
  }

  const [modal_PVC, setmodal_PVC] = useState<boolean>(false);
  function tog_PVC() {
    setmodal_PVC(!modal_PVC);
  }

  const [showBirthDate, setShowBirthDate] = useState<boolean>(false);
  const [showNationality, setShowNationality] = useState<boolean>(false);
  const [showDateDrivingLicense, setShowDateDrivingLicense] =
    useState<boolean>(false);
  const [showDateDQC, setShowDateDQC] = useState<boolean>(false);
  const [showDateDBSIssue, setShowDateDBSIssue] = useState<boolean>(false);
  const [showDateDBSBadge, setShowDateDBSBadge] = useState<boolean>(false);
  const [showDatePvc, setShowDatePvc] = useState<boolean>(false);
  const [showJoiningDate, setShowJoiningDate] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<boolean>(false);

  const [firstnameDriver, setFirstNameDriver] = useState<string>(
    driverLocation?.state?.firstname ?? ""
  );

  const [lastnameDriver, setLastNameDriver] = useState<string>(
    driverLocation?.state?.surname ?? ""
  );

  // Date of birth
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [emailDriver, setEmailDriver] = useState<string>(
    driverLocation?.state?.email ?? ""
  );

  const [phoneDriver, setPhoneDriver] = useState<string>(
    driverLocation?.state?.phonenumber ?? ""
  );

  const [mobileDriver, setMobileDriver] = useState<string>(
    driverLocation?.state?.emergency_contact ?? ""
  );

  // Country Change States
  const [seletedCountry1, setseletedCountry1] = useState<any>({});

  const [addressDriver, setAddressDriver] = useState<string>(
    driverLocation?.state?.address ?? ""
  );

  const [cityDriver, setCityDriver] = useState<string>(
    driverLocation?.state?.city ?? ""
  );

  const [stateDriver, setStateDriver] = useState<string>(
    driverLocation?.state?.state ?? ""
  );

  const [countryDriver, setCountryDriver] = useState<string>(
    driverLocation?.state?.country ?? ""
  );

  const [postalCodeDriver, setPostalCodeDriver] = useState<string>(
    driverLocation?.state?.postalcode ?? ""
  );

  const [languageDriver, setLanguageDriver] = useState<string>(
    driverLocation?.state?.language ?? ""
  );

  const [bankName, setBankName] = useState<string>(
    driverLocation?.state?.bank_name ?? ""
  );

  const [accountBankName, setAccountBankName] = useState<string>(
    driverLocation?.state?.account_name ?? ""
  );

  const [numberBankName, setNumberBankName] = useState<string>(
    driverLocation?.state?.account_number ?? ""
  );

  const [sortCode, setSortCode] = useState<string>(
    driverLocation?.state?.sort_code ?? ""
  );

  // Driving License Expiry Date
  const [selectedDateDrivingLicense, setSelectedDateDrivingLicense] =
    useState<Date | null>(null);

  // DQC Expiry Date
  const [selectedDateDQC, setSelectedDateDQC] = useState<Date | null>(null);

  // DBS Issue Date
  const [selectedDateDBSIssue, setSelectedDateDBSIssue] = useState<Date | null>(
    null
  );

  // DBS Badge Date
  const [selectedDateDBSBadge, setSelectedDateDBSBadge] = useState<Date | null>(
    null
  );

  // PVC Expiry
  const [selectedDatePVC, setSelectedDatePVC] = useState<Date | null>(null);

  const [depostiHeld, setDepostiHeld] = useState<string>(
    driverLocation?.state?.deposti_held ?? ""
  );

  const [driverNote, setDriverNote] = useState<string>(
    driverLocation?.state?.notes ?? ""
  );

  const [selectDriverStatus, setSelectedDriverStatus] = useState<string>("");

  // Join DAte
  const [selectedJoinDate, setSelectedJoinDate] = useState<Date | null>(null);

  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstNameDriver(e.target.value);
  };

  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastNameDriver(e.target.value);
  };
  const handleDateChange = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDate(selectedDates[0]);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailDriver(e.target.value);
  };

  const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneDriver(e.target.value);
  };

  const handleMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileDriver(e.target.value);
  };

  const handleAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressDriver(e.target.value);
  };

  const handleCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCityDriver(e.target.value);
  };

  const handleState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateDriver(e.target.value);
  };

  const handleCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountryDriver(e.target.value);
  };

  const handlePostalCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostalCodeDriver(e.target.value);
  };

  const handleLanguage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLanguageDriver(e.target.value);
  };

  const handleBankName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankName(e.target.value);
  };

  const handleAccountBankName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountBankName(e.target.value);
  };

  const handleNumberBankName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumberBankName(e.target.value);
  };

  const handleSortCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSortCode(e.target.value);
  };

  const handleDateChangeDrivingLicense = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDateDrivingLicense(selectedDates[0]);
  };

  const handleDateChangeDQC = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDateDQC(selectedDates[0]);
  };

  const handleDateChangeDBSIssue = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDateDBSIssue(selectedDates[0]);
  };

  const handleDateChangeDBSBadge = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDateDBSBadge(selectedDates[0]);
  };

  const handleDateChangePVC = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDatePVC(selectedDates[0]);
  };

  const handleDepostiHeld = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepostiHeld(e.target.value);
  };

  const handleNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDriverNote(e.target.value);
  };

  const handleDateChangeJoinDate = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedJoinDate(selectedDates[0]);
  };

  // This function is triggered when the select Ownership
  const handleSelectDriverStatus = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedDriverStatus(value);
  };

  const [updateDriverProfileMutation] = useUpdateDriverMutation();

  const initialDriver = {
    _id: "",
    username: "",
    password: "",
    email: "",
    profile_image_base64_string: "",
    profile_image_extension: "",
    profile_image: "",
    firstname: "",
    surname: "",
    birthdate: "",
    joindate: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalcode: "",
    language: "",
    nationality: "",
    phonenumber: "",
    emergency_contact: "",
    bank_name: "",
    account_name: "",
    account_number: "",
    sort_code: "",
    driver_license_base64_string: "",
    driver_license_extension: "",
    driving_license_expiry: "",
    dqc_base64_string: "",
    dqc_extension: "",
    dqc_expiry: "",
    dbscheck_base64_string: "",
    dbscheck_extension: "",
    dbs_issue_date: "",
    dbs_badge_date: "",
    pvc_expiry: "",
    contract_base64_string: "",
    contract_extension: "",
    deposti_held: "",
    notes: "",
    driver_license: "",
    dqc: "",
    contract: "",
    dbscheck: "",
    driverStatus: "",
    affilaite_reference_id: "",
  };

  const [driver, setDriver] = useState(initialDriver);

  const {
    _id,
    username,
    password,
    email,
    profile_image_base64_string,
    profile_image_extension,
    firstname,
    surname,
    birthdate,
    joindate,
    address,
    city,
    state,
    country,
    postalcode,
    language,
    nationality,
    phonenumber,
    emergency_contact,
    bank_name,
    account_name,
    account_number,
    sort_code,
    driver_license_base64_string,
    driver_license_extension,
    driving_license_expiry,
    dqc_base64_string,
    dqc_extension,
    dqc_expiry,
    dbscheck_base64_string,
    dbscheck_extension,
    dbs_issue_date,
    dbs_badge_date,
    pvc_expiry,
    contract_base64_string,
    contract_extension,
    deposti_held,
    notes,
    driver_license,
    dqc,
    dbscheck,
    contract,
    driverStatus,
    affilaite_reference_id,
  } = driver;

  // Avatar
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("profile_image_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setDriver({
        ...driver,
        profile_image: profileImage,
        profile_image_base64_string: base64Data,
        profile_image_extension: extension,
      });
    }
  };

  // Driving License
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById("driver_license_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const driverlicense = base64Data + "." + extension;
      setDriver({
        ...driver,
        driver_license: driverlicense,
        driver_license_base64_string: base64Data,
        driver_license_extension: extension,
      });
    }
  };

  // DQC
  const handleFileDQC = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById("dqc_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const DQC = base64Data + "." + extension;
      setDriver({
        ...driver,
        dqc: DQC,
        dqc_base64_string: base64Data,
        dqc_extension: extension,
      });
    }
  };

  // DBS
  const handleFileDBS = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById("dbscheck_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const DBS = base64Data + "." + extension;
      setDriver({
        ...driver,
        dbscheck: DBS,
        dbscheck_base64_string: base64Data,
        dbscheck_extension: extension,
      });
    }
  };

  // PVC
  const handleFilePVC = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (
      document.getElementById("contract_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const PVC = base64Data + "." + extension;
      setDriver({
        ...driver,
        contract: PVC,
        contract_base64_string: base64Data,
        contract_extension: extension,
      });
    }
  };

  const onSubmitDriver = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      driver["_id"] = driverLocation?.state?._id!;
      if (firstnameDriver === "") {
        driver["firstname"] = driverLocation?.state?.firstname!;
      } else {
        driver["firstname"] = firstnameDriver;
      }
      if (lastnameDriver === "") {
        driver["surname"] = driverLocation?.state?.surname!;
      } else {
        driver["surname"] = lastnameDriver;
      }
      if (emailDriver === "") {
        driver["email"] = driverLocation?.state?.email!;
      } else {
        driver["email"] = emailDriver;
      }
      if (phoneDriver === "") {
        driver["phonenumber"] = driverLocation?.state?.phonenumber!;
      } else {
        driver["phonenumber"] = phoneDriver;
      }
      if (mobileDriver === "") {
        driver["emergency_contact"] = driverLocation?.state?.emergency_contact!;
      } else {
        driver["emergency_contact"] = mobileDriver;
      }
      if (addressDriver === "") {
        driver["address"] = driverLocation?.state?.address!;
      } else {
        driver["address"] = addressDriver;
      }
      if (cityDriver === "") {
        driver["city"] = driverLocation?.state?.city!;
      } else {
        driver["city"] = cityDriver;
      }
      if (stateDriver === "") {
        driver["state"] = driverLocation?.state?.state!;
      } else {
        driver["state"] = stateDriver;
      }
      if (countryDriver === "") {
        driver["country"] = driverLocation?.state?.country!;
      } else {
        driver["country"] = countryDriver;
      }
      if (postalCodeDriver === "") {
        driver["postalcode"] = driverLocation?.state?.postalcode!;
      } else {
        driver["postalcode"] = postalCodeDriver;
      }
      if (languageDriver === "") {
        driver["language"] = driverLocation?.state?.language!;
      } else {
        driver["language"] = languageDriver;
      }
      if (bankName === "") {
        driver["bank_name"] = driverLocation?.state?.bank_name!;
      } else {
        driver["bank_name"] = bankName;
      }
      if (accountBankName === "") {
        driver["account_name"] = driverLocation?.state?.account_name!;
      } else {
        driver["account_name"] = accountBankName;
      }
      if (numberBankName === "") {
        driver["account_number"] = driverLocation?.state?.account_number!;
      } else {
        driver["account_number"] = numberBankName;
      }
      if (sortCode === "") {
        driver["sort_code"] = driverLocation?.state?.sort_code!;
      } else {
        driver["sort_code"] = sortCode;
      }
      if (depostiHeld === "") {
        driver["deposti_held"] = driverLocation?.state?.deposti_held!;
      } else {
        driver["deposti_held"] = depostiHeld;
      }
      if (driverNote === "") {
        driver["notes"] = driverLocation?.state?.notes!;
      } else {
        driver["notes"] = driverNote;
      }
      if (selectDriverStatus === "") {
        driver["driverStatus"] = driverLocation?.state?.driverStatus!;
      } else {
        driver["driverStatus"] = selectDriverStatus;
      }
      if (selectedDate === null) {
        driver["birthdate"] = driverLocation?.state?.birthdate!;
      } else {
        driver["birthdate"] = selectedDate?.toDateString()!;
      }
      if (selectedDateDrivingLicense === null) {
        driver["driving_license_expiry"] =
          driverLocation?.state?.driving_license_expiry!;
      } else {
        driver["driving_license_expiry"] =
          selectedDateDrivingLicense?.toDateString()!;
      }
      if (selectedDateDQC === null) {
        driver["dqc_expiry"] = driverLocation?.state?.dqc_expiry!;
      } else {
        driver["dqc_expiry"] = selectedDateDQC?.toDateString()!;
      }
      if (selectedDateDBSIssue === null) {
        driver["dbs_issue_date"] = driverLocation?.state?.dbs_issue_date!;
      } else {
        driver["dbs_issue_date"] = selectedDateDBSIssue?.toDateString()!;
      }

      if (selectedDateDBSBadge === null) {
        driver["dbs_badge_date"] = driverLocation?.state?.dbs_badge_date!;
      } else {
        driver["dbs_badge_date"] = selectedDateDBSBadge?.toDateString()!;
      }

      if (selectedDatePVC === null) {
        driver["pvc_expiry"] = driverLocation?.state?.pvc_expiry!;
      } else {
        driver["pvc_expiry"] = selectedDatePVC?.toDateString()!;
      }

      if (selectedJoinDate === null) {
        driver["joindate"] = driverLocation?.state?.joindate!;
      } else {
        driver["joindate"] = selectedJoinDate?.toDateString()!;
      }

      if (seletedCountry1 === null) {
        driver["nationality"] = driverLocation?.state?.nationality!;
      } else {
        driver["nationality"] = seletedCountry1?.countryName!;
      }

      driver["affilaite_reference_id"] = user?._id!;

      if (!driver.profile_image_base64_string) {
        driver["profile_image"] = driverLocation?.state?.profile_image!;
        driver["profile_image_base64_string"] =
          driverLocation?.state?.profile_image_base64_string!;
        driver["profile_image_extension"] =
          driverLocation?.state?.profile_image_extension!;
      }

      if (!driver.driver_license_base64_string) {
        driver["driver_license"] = driverLocation?.state?.driver_license!;
        driver["driver_license_base64_string"] =
          driverLocation?.state?.driver_license_base64_string!;
        driver["driver_license_extension"] =
          driverLocation?.state?.driver_license_extension!;
      }

      if (!driver.contract_base64_string) {
        driver["contract"] = driverLocation?.state?.contract!;
        driver["contract_base64_string"] =
          driverLocation?.state?.contract_base64_string!;
        driver["contract_extension"] =
          driverLocation?.state?.contract_extension!;
      }

      if (!driver.dqc_base64_string) {
        driver["dqc"] = driverLocation?.state?.dqc!;
        driver["dqc_base64_string"] = driverLocation?.state?.dqc_base64_string!;
        driver["dqc_extension"] = driverLocation?.state?.dqc_extension!;
      }

      if (!driver.dbscheck_base64_string) {
        driver["dbscheck"] = driverLocation?.state?.dbscheck!;
        driver["dbscheck_base64_string"] =
          driverLocation?.state?.dbscheck_base64_string!;
        driver["dbscheck_extension"] =
          driverLocation?.state?.dbscheck_extension!;
      }

      updateDriverProfileMutation(driver)
        .then(() => setDriver(initialDriver))
        .then(() => notifySuccess())
        .then(() => navigate("/drivers"));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Header>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-sm">
                        <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                          <i className="bx bx-user"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">Driver Information</h5>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form" onSubmit={onSubmitDriver}>
                      <Row>
                        <Row className="mb-2">
                          <div className="d-flex justify-content-center">
                            {driver.profile_image &&
                            driver.profile_image_base64_string ? (
                              <Image
                                src={`data:image/jpeg;base64, ${driver.profile_image_base64_string}`}
                                alt=""
                                className="avatar-xl rounded-circle p-1 bg-body mt-n3"
                              />
                            ) : (
                              <Image
                                src={`http://57.128.184.217:3000/driverAffiliateFiles/profileImages/${driverLocation
                                  ?.state?.profile_image!}`}
                                alt=""
                                className="avatar-xl rounded-circle p-1 bg-body mt-n3"
                              />
                            )}
                          </div>
                          <div
                            className="d-flex justify-content-center mt-n4"
                            style={{ marginLeft: "60px" }}
                          >
                            <label
                              htmlFor="profile_image_base64_string"
                              className="mb-0"
                              data-bs-toggle="tooltip"
                              data-bs-placement="right"
                              title="Select affiliate logo"
                            >
                              <span className="avatar-xs d-inline-block">
                                <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                  <i className="bi bi-pen"></i>
                                </span>
                              </span>
                            </label>
                            <input
                              className="form-control d-none"
                              type="file"
                              name="profile_image_base64_string"
                              id="profile_image_base64_string"
                              accept="image/*"
                              onChange={(e) => handleFileUpload(e)}
                              style={{ width: "210px", height: "120px" }}
                            />
                          </div>
                        </Row>
                        <Row>
                          {/* First Name  == Done */}
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="firstname">
                                First Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="firstname"
                                placeholder="Enter first name"
                                onChange={handleFirstName}
                                value={firstnameDriver}
                              />
                            </div>
                          </Col>
                          {/* Last Name == Done */}
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="surname">
                                Last Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="surname"
                                placeholder="Enter last name"
                                onChange={handleLastName}
                                value={lastnameDriver}
                              />
                            </div>
                          </Col>
                          {/* Birth_Date  == Done */}
                          <Col lg={4}>
                            <div className="mb-3">
                              <Form.Label htmlFor="birthdate">
                                Birth Date :{" "}
                                <span className="text-dark fs-14">
                                  {driverLocation.state.birthdate}
                                </span>
                                <div
                                  className="d-flex justify-content-start mt-n3"
                                  style={{ marginLeft: "230px" }}
                                >
                                  <label
                                    htmlFor="birthdate"
                                    className="mb-0"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="right"
                                    title="Select Birth Date"
                                  >
                                    <span
                                      className="d-inline-block"
                                      onClick={() =>
                                        setShowBirthDate(!showBirthDate)
                                      }
                                    >
                                      <span className="text-success cursor-pointer">
                                        <i className="bi bi-pen fs-14"></i>
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              </Form.Label>
                              {showBirthDate && (
                                <Flatpickr
                                  value={selectedDate!}
                                  onChange={handleDateChange}
                                  className="form-control flatpickr-input"
                                  placeholder="Select Date"
                                  options={{
                                    dateFormat: "d M, Y",
                                  }}
                                  id="birthdate"
                                />
                              )}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          {/* Email  == Done */}
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="email">Email</Form.Label>
                              <Form.Control
                                type="email"
                                id="email"
                                placeholder="Enter email"
                                onChange={handleEmail}
                                value={emailDriver}
                              />
                            </div>
                          </Col>
                          {/* Phone  == Done */}
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="phonenumber">
                                Phone
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="phonenumber"
                                placeholder="Enter phone"
                                onChange={handlePhone}
                                value={phoneDriver}
                              />
                            </div>
                          </Col>
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="emergency_contact">
                                Emergency Contact
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="emergency_contact"
                                placeholder="Enter emergency contact"
                                onChange={handleMobile}
                                value={mobileDriver}
                              />
                            </div>
                          </Col>
                          {/*  Nationaity == Not Yet */}
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="nationality">
                                Nationality :{" "}
                                <span className="text-dark fs-14">
                                  {driverLocation.state.nationality}
                                </span>
                                <div
                                  className="d-flex justify-content-start mt-n3"
                                  style={{ marginLeft: "230px" }}
                                >
                                  <label
                                    htmlFor="nationality"
                                    className="mb-0"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="right"
                                    title="Select Birth Date"
                                  >
                                    <span
                                      className="d-inline-block"
                                      onClick={() =>
                                        setShowNationality(!showNationality)
                                      }
                                    >
                                      <span className="text-success cursor-pointer">
                                        <i className="bi bi-pen fs-14"></i>
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              </Form.Label>
                              {showNationality && (
                                <Dropdown>
                                  <Dropdown.Toggle
                                    as="input"
                                    style={{
                                      backgroundImage: `url(${
                                        seletedCountry1.flagImg &&
                                        seletedCountry1.flagImg
                                      })`,
                                    }}
                                    className="form-control rounded-end flag-input form-select"
                                    placeholder="Select country"
                                    readOnly
                                    defaultValue={seletedCountry1.countryName}
                                  ></Dropdown.Toggle>
                                  <Dropdown.Menu
                                    as="ul"
                                    className="list-unstyled w-100 dropdown-menu-list mb-0"
                                  >
                                    <SimpleBar
                                      style={{ maxHeight: "220px" }}
                                      className="px-3"
                                    >
                                      {(countryData || []).map(
                                        (item: any, key: number) => (
                                          <Dropdown.Item
                                            as="li"
                                            onClick={() =>
                                              setseletedCountry1(item)
                                            }
                                            key={key}
                                            className="dropdown-item d-flex"
                                          >
                                            <div className="flex-shrink-0 me-2">
                                              <Image
                                                src={item.flagImg}
                                                alt="country flag"
                                                className="options-flagimg"
                                                height="20"
                                              />
                                            </div>
                                            <div className="flex-grow-1">
                                              <div className="d-flex">
                                                <div className="country-name me-1">
                                                  {item.countryName}
                                                </div>
                                                <span className="countrylist-codeno text-muted">
                                                  {item.countryCode}
                                                </span>
                                              </div>
                                            </div>
                                          </Dropdown.Item>
                                        )
                                      )}
                                    </SimpleBar>
                                  </Dropdown.Menu>
                                </Dropdown>
                              )}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          {/* Address  == Done */}
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="address">Address</Form.Label>
                              <Form.Control
                                type="text"
                                id="address"
                                placeholder="Enter address"
                                onChange={handleAddress}
                                value={addressDriver}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="city">City</Form.Label>
                              <Form.Control
                                type="text"
                                id="city"
                                placeholder="Enter City"
                                onChange={handleCity}
                                value={cityDriver}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="state">State</Form.Label>
                              <Form.Control
                                type="text"
                                id="state"
                                placeholder="Enter State"
                                onChange={handleState}
                                value={stateDriver}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="country">Country</Form.Label>
                              <Form.Control
                                type="text"
                                id="country"
                                placeholder="Enter Country"
                                onChange={handleCountry}
                                value={countryDriver}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="postalcode">
                                Postal Code
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="postalcode"
                                placeholder="Enter Postal Code"
                                onChange={handlePostalCode}
                                value={postalCodeDriver}
                              />
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="language">
                                Language
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="language"
                                placeholder="Enter Language"
                                onChange={handleLanguage}
                                value={languageDriver}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bx bx-id-card"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  Bank Informations{" "}
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="bank_name"
                                    className="form-label"
                                  >
                                    Bank Name
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="bank_name"
                                    placeholder="Enter Bank Name"
                                    name="bank_name"
                                    onChange={handleBankName}
                                    value={bankName}
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="account_name"
                                    className="form-label"
                                  >
                                    Account Name
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="account_name"
                                    placeholder="Enter Account Name"
                                    name="account_name"
                                    onChange={handleAccountBankName}
                                    value={accountBankName}
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="account_number"
                                    className="form-label"
                                  >
                                    Account Number
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="account_number"
                                    placeholder="Enter Account Number"
                                    name="account_number"
                                    onChange={handleNumberBankName}
                                    value={numberBankName}
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="sort_code"
                                    className="form-label"
                                  >
                                    Sort Code
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="sort_code"
                                    placeholder="Enter Sort Code"
                                    name="sort_code"
                                    onChange={handleSortCode}
                                    value={sortCode}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bx bx-id-card"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">Driving License </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="driving_license_expiry">
                                    Driving License Expiry Date:{" "}
                                    <span className="text-dark fs-14">
                                      {
                                        driverLocation.state
                                          .driving_license_expiry
                                      }
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n2"
                                      style={{ marginLeft: "290px" }}
                                    >
                                      <label
                                        htmlFor="driving_license_expiry"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Birth Date"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowDateDrivingLicense(
                                              !showDateDrivingLicense
                                            )
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </Form.Label>
                                  {showDateDrivingLicense && (
                                    <Flatpickr
                                      value={selectedDateDrivingLicense!}
                                      onChange={handleDateChangeDrivingLicense}
                                      className="form-control flatpickr-input"
                                      placeholder="Select Date"
                                      options={{
                                        dateFormat: "d M, Y",
                                      }}
                                      id="driving_license_expiry"
                                    />
                                  )}
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div>
                                  <button
                                    title="Open File"
                                    type="button"
                                    className="btn btn-soft-danger btn-icon d-grid"
                                    onClick={() => tog_DrivingLicense()}
                                  >
                                    <i
                                      className="bi bi-filetype-pdf"
                                      style={{ fontSize: "24px" }}
                                    ></i>
                                  </button>

                                  <div
                                    className="d-flex justify-content-start mt-n3"
                                    style={{ marginLeft: "36px" }}
                                  >
                                    <label
                                      htmlFor="driver_license_base64_string"
                                      className="mb-0"
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="right"
                                      title="Select Driving License"
                                    >
                                      <span className="avatar-xxs d-inline-block fs-16">
                                        <span className="avatar-title bg-white text-info cursor-pointer">
                                          <i className="bi bi-pen fs-12"></i>
                                        </span>
                                      </span>
                                    </label>
                                    <input
                                      className="form-control d-none"
                                      type="file"
                                      name="driver_license_base64_string"
                                      id="driver_license_base64_string"
                                      accept=".pdf"
                                      onChange={(e) => handleFile(e)}
                                      style={{
                                        width: "210px",
                                        height: "120px",
                                      }}
                                    />
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bx bx-id-card"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">DQC </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="dqc_expiry">
                                    DQC Expiry Date:{" "}
                                    <span className="text-dark fs-14">
                                      {driverLocation.state.dqc_expiry}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "230px" }}
                                    >
                                      <label
                                        htmlFor="dqc_expiry"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Birth Date"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowDateDQC(!showDateDQC)
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </Form.Label>
                                  {showDateDQC && (
                                    <Flatpickr
                                      value={selectedDateDQC!}
                                      onChange={handleDateChangeDQC}
                                      className="form-control flatpickr-input"
                                      placeholder="Select Date"
                                      options={{
                                        dateFormat: "d M, Y",
                                      }}
                                      id="dqc_expiry"
                                    />
                                  )}
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="dqc_base64_string"
                                    className="form-label"
                                  >
                                    File
                                  </label>
                                  <div>
                                    <button
                                      title="Open File"
                                      type="button"
                                      className="btn btn-soft-danger btn-icon d-grid"
                                      onClick={() => tog_DQC()}
                                    >
                                      <i
                                        className="bi bi-filetype-pdf"
                                        style={{ fontSize: "24px" }}
                                      ></i>
                                    </button>

                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "36px" }}
                                    >
                                      <label
                                        htmlFor="dqc_base64_string"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select company logo"
                                      >
                                        <span className="avatar-xxs d-inline-block fs-16">
                                          <span className="avatar-title bg-white text-info cursor-pointer">
                                            <i className="bi bi-pen fs-12"></i>
                                          </span>
                                        </span>
                                      </label>
                                      <input
                                        className="form-control d-none"
                                        type="file"
                                        name="dqc_base64_string"
                                        id="dqc_base64_string"
                                        accept=".pdf"
                                        onChange={(e) => handleFileDQC(e)}
                                        style={{
                                          width: "210px",
                                          height: "120px",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bx bx-id-card"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">DBS </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={4}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="dbs_issue_date">
                                    DBS Issue Date :{" "}
                                    <span className="text-dark fs-14">
                                      {driverLocation.state.dbs_issue_date}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "230px" }}
                                    >
                                      <label
                                        htmlFor="dbs_issue_date"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Birth Date"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowDateDBSIssue(
                                              !showDateDBSIssue
                                            )
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </Form.Label>
                                  {showDateDBSIssue && (
                                    <Flatpickr
                                      value={selectedDateDBSIssue!}
                                      onChange={handleDateChangeDBSIssue}
                                      className="form-control flatpickr-input"
                                      placeholder="Select Date"
                                      options={{
                                        dateFormat: "d M, Y",
                                      }}
                                      id="dbs_issue_date"
                                    />
                                  )}
                                </div>
                              </Col>
                              <Col lg={4}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="dbs_badge_date">
                                    DBS Badge Date:{" "}
                                    <span className="text-dark fs-14">
                                      {driverLocation.state.dbs_badge_date}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "230px" }}
                                    >
                                      <label
                                        htmlFor="dbs_badge_date"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Birth Date"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowDateDBSBadge(
                                              !showDateDBSBadge
                                            )
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </Form.Label>
                                  {showDateDBSBadge && (
                                    <Flatpickr
                                      value={selectedDateDBSBadge!}
                                      onChange={handleDateChangeDBSBadge}
                                      className="form-control flatpickr-input"
                                      placeholder="Select Date"
                                      options={{
                                        dateFormat: "d M, Y",
                                      }}
                                      id="dbs_badge_date"
                                    />
                                  )}
                                </div>
                              </Col>
                              <Col lg={4}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="dbscheck_base64_string"
                                    className="form-label"
                                  >
                                    File
                                  </label>
                                  <div>
                                    <button
                                      title="Open File"
                                      type="button"
                                      className="btn btn-soft-danger btn-icon d-grid"
                                      onClick={() => tog_DBS()}
                                    >
                                      <i
                                        className="bi bi-filetype-pdf"
                                        style={{ fontSize: "24px" }}
                                      ></i>
                                    </button>

                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "36px" }}
                                    >
                                      <label
                                        htmlFor="dbscheck_base64_string"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select company logo"
                                      >
                                        <span className="avatar-xxs d-inline-block fs-16">
                                          <span className="avatar-title bg-white text-info cursor-pointer">
                                            <i className="bi bi-pen fs-12"></i>
                                          </span>
                                        </span>
                                      </label>
                                      <input
                                        className="form-control d-none"
                                        type="file"
                                        name="dbscheck_base64_string"
                                        id="dbscheck_base64_string"
                                        accept=".pdf"
                                        onChange={(e) => handleFileDBS(e)}
                                        style={{
                                          width: "210px",
                                          height: "120px",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bx bx-id-card"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">PVC</h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={4}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="pvc_expiry">
                                    PVC Expiry:{" "}
                                    <span className="text-dark fs-14">
                                      {driverLocation.state.pvc_expiry}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "230px" }}
                                    >
                                      <label
                                        htmlFor="pvc_expiry"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Birth Date"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowDatePvc(!showDatePvc)
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </Form.Label>
                                  {showDatePvc && (
                                    <Flatpickr
                                      value={selectedDatePVC!}
                                      onChange={handleDateChangePVC}
                                      className="form-control flatpickr-input"
                                      placeholder="Select Date"
                                      options={{
                                        dateFormat: "d M, Y",
                                      }}
                                      id="pvc_expiry"
                                    />
                                  )}
                                </div>
                              </Col>
                              <Col lg={2}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="contract_base64_string"
                                    className="form-label"
                                  >
                                    PVC File
                                  </label>
                                  <div>
                                    <button
                                      title="Open File"
                                      type="button"
                                      className="btn btn-soft-danger btn-icon d-grid"
                                      onClick={() => tog_PVC()}
                                    >
                                      <i
                                        className="bi bi-filetype-pdf"
                                        style={{ fontSize: "24px" }}
                                      ></i>
                                    </button>

                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "36px" }}
                                    >
                                      <label
                                        htmlFor="contract_base64_string"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select company logo"
                                      >
                                        <span className="avatar-xxs d-inline-block fs-16">
                                          <span className="avatar-title bg-white text-info cursor-pointer">
                                            <i className="bi bi-pen fs-12"></i>
                                          </span>
                                        </span>
                                      </label>
                                      <input
                                        className="form-control d-none"
                                        type="file"
                                        name="contract_base64_string"
                                        id="contract_base64_string"
                                        accept=".pdf"
                                        onChange={(e) => handleFilePVC(e)}
                                        style={{
                                          width: "210px",
                                          height: "120px",
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="deposti_held">
                                    Deposit Held
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="deposti_held"
                                    placeholder="Enter Deposti Held"
                                    name="deposti_held"
                                    onChange={handleDepostiHeld}
                                    value={depostiHeld}
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="notes">Notes</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="notes"
                                    placeholder="Enter notes"
                                    name="notes"
                                    onChange={handleNote}
                                    value={driverNote}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bx bx-id-card"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">Account</h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="driverStatus">
                                    Status:{" "}
                                    <span className="text-dark fs-14">
                                      {driverLocation.state.driverStatus}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "230px" }}
                                    >
                                      <label
                                        htmlFor="driverStatus"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Birth Date"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowStatus(!showStatus)
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </Form.Label>
                                  {showStatus && (
                                    <select
                                      className="form-select text-muted"
                                      name="driverStatus"
                                      id="driverStatus"
                                      onChange={handleSelectDriverStatus}
                                    >
                                      <option value="">Status</option>
                                      <option value="Active">Active</option>
                                      <option value="Inactive">Inactive</option>
                                      <option value="onVacation">
                                        On Vacation
                                      </option>
                                      <option value="onRoad">On Road</option>
                                    </select>
                                  )}
                                </div>
                              </Col>
                              <Col lg={6}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="joindate">
                                    Joining Date:{" "}
                                    <span className="text-dark fs-14">
                                      {driverLocation.state.joindate}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "230px" }}
                                    >
                                      <label
                                        htmlFor="joindate"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Birth Date"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowJoiningDate(!showJoiningDate)
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </Form.Label>
                                  {showJoiningDate && (
                                    <Flatpickr
                                      value={selectedJoinDate!}
                                      onChange={handleDateChangeJoinDate}
                                      className="form-control flatpickr-input"
                                      placeholder="Select Date"
                                      options={{
                                        dateFormat: "d M, Y",
                                      }}
                                      id="joindate"
                                    />
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              type="submit"
                              variant="primary"
                              id="add-btn"
                            >
                              Edit Driver
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        {/* Driving License */}
        <Modal
          className="fade zoomIn"
          size="xl"
          show={modal_DrivingLicense}
          onHide={() => {
            tog_DrivingLicense();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Driving License File
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"
            ></div>
            <div>
              <Document
                file={`${
                  process.env.REACT_APP_BASE_URL
                }/driverAffiliateFiles/licenseFiles/${driverLocation?.state
                  ?.driver_license!}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </Modal.Body>
        </Modal>
        {/*  DQC */}
        <Modal
          className="fade zoomIn"
          size="xl"
          show={modal_DQC}
          onHide={() => {
            tog_DQC();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              DQC File
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"
            ></div>
            <div>
              <Document
                file={`${
                  process.env.REACT_APP_BASE_URL
                }/driverAffiliateFiles/dqcFiles/${driverLocation?.state?.dqc!}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </Modal.Body>
        </Modal>
        {/*  DBS */}
        <Modal
          className="fade zoomIn"
          size="xl"
          show={modal_DBS}
          onHide={() => {
            tog_DBS();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              DBS File
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"
            ></div>
            <div>
              <Document
                file={`${
                  process.env.REACT_APP_BASE_URL
                }/driverAffiliateFiles/dbsCheckFiles/${driverLocation?.state
                  ?.dbscheck!}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </Modal.Body>
        </Modal>
        {/*  PVC */}
        <Modal
          className="fade zoomIn"
          size="xl"
          show={modal_PVC}
          onHide={() => {
            tog_PVC();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              PVC File
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"
            ></div>
            <div>
              <Document
                file={`${
                  process.env.REACT_APP_BASE_URL
                }/driverAffiliateFiles/contractFiles/${driverLocation?.state
                  ?.contract!}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default EditDriver;
