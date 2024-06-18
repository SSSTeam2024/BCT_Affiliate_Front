import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import img4 from "assets/images/small/img-4.jpg";
import { selectCurrentUser } from "../../features/affiliate/authAffiliateSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store"; // Import your RootState interface
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Flatpickr from "react-flatpickr";
import { useGetAllVehicleTypesQuery } from "features/vehicleType/vehicleType";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import {
  AffiliateAccount,
  useUpdateAffiliateMutation,
} from "features/affiliate/affiliateSlice";

import Swal from "sweetalert2";

interface Stop {
  placeName: string;
  coordinates: {
    lat: string;
    lng: string;
  };
  raduis: string;
}

const EditProfile = () => {
  document.title = "Edit Profile| Bouden Coach Travel";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  function convertToBase64(
    file: File
  ): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
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

  const { data: AllVehicleTypes = [] } = useGetAllVehicleTypesQuery();

  let newArray = AllVehicleTypes.filter(function (el) {
    return !user.vehicles.some((vehicle: any) => vehicle?.type! === el?.type!);
  });

  const [modal_PVCModals, setmodal_PVCModals] = useState<boolean>(false);
  function tog_PVCModals() {
    setmodal_PVCModals(!modal_PVCModals);
  }

  const [modal_Insurance, setmodal_Insurance] = useState<boolean>(false);
  function tog_Insurance() {
    setmodal_Insurance(!modal_Insurance);
  }

  if (pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }

  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // License Date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDate(selectedDates[0]);
  };

  // Insurance Date
  const [selectedDateInsurance, setSelectedDateInsurance] =
    useState<Date | null>(null);

  const handleDateInsuranceChange = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDateInsurance(selectedDates[0]);
  };

  const [checkedMap, setCheckedMap] = useState<{ [key: string]: boolean }>({});
  const [quantities, setQuantities] = useState<{ [key: string]: string }>({});
  const [mergedVehicles, setMergedVehicles] = useState<any[]>([]);
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { checked } = event.target;
    setCheckedMap((prevCheckedMap) => ({
      ...prevCheckedMap,
      [id]: checked,
    }));
  };

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: string
  ) => {
    const { value } = event.target;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: value,
    }));
  };

  useEffect(() => {
    mergeVehicles();
  }, [checkedMap, quantities]);

  const mergeVehicles = () => {
    const selectedVehicles = newArray
      .filter((vehicle) => checkedMap[vehicle?._id!])
      .map((vehicle) => ({
        type: vehicle.type,
        qty: quantities[vehicle?._id!] || "0",
      }));
    setMergedVehicles([...user.vehicles, ...selectedVehicles]);
  };
  const [sumFleet, setSumFleet] = useState<string>("");
  useEffect(() => {
    const sum = mergedVehicles.reduce((acc, curr) => {
      const quantity = parseFloat(curr.qty); // Parse qty property, not the entire object
      return isNaN(quantity) ? acc : acc + quantity;
    }, 0);
    setSumFleet(sum);
  }, [mergedVehicles]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process?.env?.REACT_APP_MAPS_KEY!,
    libraries: ["places"],
  });

  const [areaCoverage, setAreaCoverage] = useState<Stop[]>([]);
  const [searchAreaCoverages, setSearchAreaCoverages] = useState<any>([]);
  const [stop, setStop] = useState<any>();
  const [selectedStop, setSelectedStop] = useState(null);
  const [waypts, setWaypts] = useState<any[]>([]);

  const stopRef = useRef<any>(null);

  function onLoadStop(autocomplete: any, index: any) {
    const newSearchAreaCoverages: any[] = [...searchAreaCoverages];
    newSearchAreaCoverages[index] = autocomplete;
    setSearchAreaCoverages(newSearchAreaCoverages);
  }

  function onPlaceChangedAreaCoverage(index: number) {
    if (searchAreaCoverages[index] != null) {
      const place = (
        searchAreaCoverages[index] as unknown as google.maps.places.Autocomplete
      ).getPlace();

      const location = place.geometry?.location;
      if (location) {
        const nom = { lat: location.lat(), lng: location.lng() };
        const formattedAddress = place.formatted_address;
        const wayPoint = {
          placeName: formattedAddress,
          coordinates: {
            lat: nom.lat,
            lng: nom.lng,
          },
          raduis: "",
        };
        setWaypts((waypts) => [...waypts, wayPoint]);
        let prevAreaCov = [...areaCoverage];
        prevAreaCov[index].placeName = formattedAddress!;
        prevAreaCov[index].coordinates.lat = nom.lat.toString();
        prevAreaCov[index].coordinates.lng = nom.lng.toString();
        setAreaCoverage(prevAreaCov);
      } else {
        console.error("Location not found in place object");
      }
    } else {
      alert("Please enter text");
    }
  }

  // Update the handleQty function to update the qty property of the corresponding vehicle
  const handleQty =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      let rad = e.target.value;
      let prevAreaCov = [...areaCoverage];
      prevAreaCov[index].raduis = rad!;
      setAreaCoverage(prevAreaCov);
    };

  const handleLocationButtonClickStop = () => {
    setSelectedStop(stop);
  };

  const [license, setLicense] = useState<string>(user?.number_file ?? "");
  const handleLicense = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicense(e.target.value);
  };

  const [insurance, setInsurance] = useState<string>(
    user?.insurance_number ?? ""
  );
  const handleInsurance = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInsurance(e.target.value);
  };

  const [nameAff, setNameAff] = useState<string>(user?.name ?? "");
  const handleNameAff = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameAff(e.target.value);
  };
  const [adr, setAdr] = useState<string>(user?.address ?? "");
  const handleAdr = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdr(e.target.value);
  };
  const [mail, setMail] = useState<string>(user?.email ?? "");
  const handleMail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMail(e.target.value);
  };
  const [phoneNum, setPhoneNum] = useState<string>(user?.phone ?? "");
  const handlePhoneNum = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNum(e.target.value);
  };
  const [web, setWeb] = useState<string>(user?.website ?? "");
  const handleWeb = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeb(e.target.value);
  };
  // Ensure that placeName is properly assigned when adding stops
  const handleAddStopClick = () => {
    setAreaCoverage((prevAreaCoverages) => [
      ...prevAreaCoverages,
      {
        placeName: "",
        coordinates: {
          lat: "",
          lng: "",
        },
        raduis: "",
      },
    ]);
  };

  const handleRemoveStopClick = (idToRemove: any) => {
    const newWaypts = [...areaCoverage];
    newWaypts.splice(idToRemove - 1, 1);
    setAreaCoverage(newWaypts);
  };

  useEffect(() => {
    let stops = [];
    for (let i = 0; i < waypts.length; i++) {
      stops.push({
        placeName: waypts[i].location,
        coordinates: waypts[i].coordinates,
        raduis: waypts[i].raduis,
      });
    }
  });
  const mergedCoverageAreas = [...areaCoverage, ...user.coverageArea];
  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Affiliate Updated successfully",
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

  const navigate = useNavigate();

  // Update Affiliate Profile
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
    avatar: "",
    avatarBase64String: "",
    avatarExtension: "",
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

  // Avatar
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (document.getElementById("avatar") as HTMLFormElement)
      .files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setUpdateAffiliateProfile({
        ...updateAffiliateProfile,
        avatar: profileImage,
        avatarBase64String: base64Data,
        avatarExtension: extension,
      });
    }
  };

  // License
  const handleLicenseFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (document.getElementById("id_file") as HTMLFormElement)
      .files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      setUpdateAffiliateProfile({
        ...updateAffiliateProfile,
        id_file: profileImage,
        IdFileBase64String: base64Data,
        IdFileExtension: extension,
      });
    }
  };

  // Insurance
  const handleInsuranceFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (document.getElementById("insurance_file") as HTMLFormElement)
      .files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const profileImage = base64Data + "." + extension;
      console.log(extension);
      setUpdateAffiliateProfile({
        ...updateAffiliateProfile,
        insurance_file: profileImage,
        insuranceFileBase64String: base64Data,
        InsuranceFileExtension: extension,
      });
    }
  };

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
    website,
    service_date,
    statusAffiliate,
    account_name,
    sort_code,
    account_number,
    bank_name,
    avatar,
    avatarBase64String,
    avatarExtension,
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

  const onSubmitUpdateAffiliateProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      updateAffiliateProfile["_id"] = user?._id!;
      if (selectedDate === null) {
        updateAffiliateProfile["id_creation_date"] = user?.id_creation_date;
      } else {
        updateAffiliateProfile["id_creation_date"] =
          selectedDate!.toDateString();
      }

      if (selectedDateInsurance === null) {
        updateAffiliateProfile["insurance_date"] = user?.insurance_date;
      } else {
        updateAffiliateProfile["insurance_date"] =
          selectedDateInsurance!.toDateString();
      }
      if (nameAff === "") {
        updateAffiliateProfile["name"] = user?.name!;
      } else {
        updateAffiliateProfile["name"] = nameAff;
      }
      if (adr === "") {
        updateAffiliateProfile["address"] = user?.address!;
      } else {
        updateAffiliateProfile["address"] = adr;
      }
      if (mail === "") {
        updateAffiliateProfile["email"] = user?.email!;
      } else {
        updateAffiliateProfile["email"] = mail;
      }
      if (phoneNum === "") {
        updateAffiliateProfile["phone"] = user?.phone!;
      } else {
        updateAffiliateProfile["phone"] = phoneNum;
      }
      if (web === "") {
        updateAffiliateProfile["website"] = user?.website!;
      } else {
        updateAffiliateProfile["website"] = web;
      }
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
      updateAffiliateProfile["vehicles"] = mergedVehicles;
      updateAffiliateProfile["notes"] = user?.notes!;
      if (sumFleet === "") {
        updateAffiliateProfile["fleetNumber"] = user?.fleetNumber;
      } else {
        updateAffiliateProfile["fleetNumber"] = sumFleet;
      }
      updateAffiliateProfile["years_experience"] = user?.years_experience!;

      updateAffiliateProfile["progress"] = user?.progress!;
      if (license === "") {
        updateAffiliateProfile["number_file"] = user?.number_file!;
      } else {
        updateAffiliateProfile["number_file"] = license;
      }
      if (insurance === "") {
        updateAffiliateProfile["insurance_number"] = user?.insurance_number!;
      } else {
        updateAffiliateProfile["insurance_number"] = insurance;
      }
      updateAffiliateProfile["coverageArea"] = mergedCoverageAreas;

      if (!updateAffiliateProfile.avatarBase64String) {
        // If not, keep the existing profile picture
        updateAffiliateProfile["avatar"] = user?.avatar!;
        // Make sure to retain the existing base64 data and extension
        updateAffiliateProfile["avatarBase64String"] =
          user?.avatarBase64String!;
        updateAffiliateProfile["avatarExtension"] = user?.avatarExtension!;
      }

      if (!updateAffiliateProfile.IdFileBase64String) {
        // If not, keep the existing profile picture
        updateAffiliateProfile["id_file"] = user?.id_file!;
        // Make sure to retain the existing base64 data and extension
        updateAffiliateProfile["IdFileBase64String"] =
          user?.IdFileBase64String!;
        updateAffiliateProfile["IdFileExtension"] = user?.IdFileExtension!;
      }

      if (!updateAffiliateProfile.insuranceFileBase64String) {
        // If not, keep the existing profile picture
        updateAffiliateProfile["insurance_file"] = user?.insurance_file!;
        // Make sure to retain the existing base64 data and extension
        updateAffiliateProfile["insuranceFileBase64String"] =
          user?.insuranceFileBase64String!;
        updateAffiliateProfile["InsuranceFileExtension"] =
          user?.InsuranceFileExtension!;
      }

      updateAffiliateProfileMutation(updateAffiliateProfile)
        .then(() => navigate("/profile"))
        .then(() => notifySuccess());
    } catch (error) {
      notifyError(error);
    }
  };
  const options = {
    componentRestrictions: { country: "uk" },
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Form onSubmit={onSubmitUpdateAffiliateProfile}>
                <Card>
                  <Card.Body>
                    <Card className="border-0 shadow-none mb-0">
                      <Card.Body
                        className="rounded profile-basic"
                        style={{
                          backgroundImage: `url(${img4})`,
                          backgroundSize: "cover",
                        }}
                      ></Card.Body>
                      <Card.Body>
                        <div className="mt-n5">
                          {updateAffiliateProfile.avatar &&
                          updateAffiliateProfile.avatarBase64String ? (
                            <Image
                              src={`data:image/jpeg;base64, ${updateAffiliateProfile.avatarBase64String}`}
                              alt=""
                              className="avatar-lg rounded-circle p-1 bg-body mt-n3"
                            />
                          ) : (
                            <Image
                              src={`${
                                process.env.REACT_APP_FILE_URL
                              }/affiliateFiles/avatarFilesPath/${user?.avatar!}`}
                              alt=""
                              className="avatar-lg rounded-circle p-1 bg-body mt-n3"
                            />
                          )}
                        </div>
                        <div
                          className="d-flex justify-content-start mt-n5"
                          style={{ marginLeft: "90px" }}
                        >
                          <label
                            htmlFor="avatar"
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
                            name="avatar"
                            id="avatar"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e)}
                            style={{ width: "210px", height: "120px" }}
                          />
                        </div>
                      </Card.Body>
                      <Card.Body className="pt-0">
                        <Row className="justify-content-between gy-4">
                          <Col xl={5} md={7}>
                            <div className="mb-3 text-dark">
                              Name :
                              <Form.Control
                                type="text"
                                id="name"
                                name="name"
                                value={nameAff}
                                onChange={handleNameAff}
                                className="text-muted"
                              />
                            </div>
                            <div className="mb-3 text-dark">
                              Address :
                              <Form.Control
                                type="text"
                                id="address"
                                name="address"
                                value={adr}
                                onChange={handleAdr}
                                className="text-muted"
                              />
                            </div>
                            <div className="mb-3 text-dark justify-content-between">
                              <div>
                                <Form.Label>Email :</Form.Label>
                              </div>
                              <div>
                                <Form.Control
                                  type="text"
                                  id="email"
                                  name="email"
                                  value={mail}
                                  onChange={handleMail}
                                  className="text-muted"
                                />
                              </div>
                            </div>
                            <div className="mb-3 text-dark">
                              Phone :
                              <Form.Control
                                type="text"
                                id="phone"
                                name="phone"
                                value={phoneNum}
                                onChange={handlePhoneNum}
                                className="text-muted"
                              />
                            </div>
                            <div className="mb-3 text-dark">
                              Website :
                              <Form.Control
                                type="text"
                                id="website"
                                name="website"
                                value={web}
                                onChange={handleWeb}
                                className="text-muted"
                              />
                            </div>
                          </Col>
                          <Col xl={3}>
                            <h5 className="fs-16">Licence</h5>
                            <div className="mb-3 text-dark">
                              Number :
                              <Form.Control
                                type="text"
                                id="licence_number"
                                name="licence_number"
                                value={license}
                                onChange={handleLicense}
                                className="text-muted"
                              />
                            </div>
                            <div className="mb-3 text-dark">
                              Expiry Date:{" "}
                              {selectedDate === null ? (
                                <span className="mb-3 text-muted">
                                  {user?.id_creation_date}
                                </span>
                              ) : (
                                <span>{selectedDate?.toDateString()!}</span>
                              )}
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
                            </div>
                            <div>
                              <button
                                title="Book Offer"
                                type="button"
                                className="btn btn-soft-primary btn-icon d-grid"
                                onClick={() => tog_PVCModals()}
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
                                  htmlFor="id_file"
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
                                  name="id_file"
                                  id="id_file"
                                  accept=".pdf"
                                  onChange={(e) => handleLicenseFile(e)}
                                  style={{ width: "210px", height: "120px" }}
                                />
                              </div>
                            </div>
                          </Col>
                          <Col xl={3}>
                            <h5 className="fs-16">Insurance</h5>
                            <div className="mb-3 text-dark">
                              Number :
                              <Form.Control
                                type="text"
                                id="insurance_number"
                                name="insurance_number"
                                value={insurance}
                                onChange={handleInsurance}
                                className="text-muted"
                              />
                            </div>
                            <div className="mb-3 text-dark">
                              Expiry Date:{" "}
                              {selectedDateInsurance === null ? (
                                <span className="mb-3 text-muted">
                                  {user?.id_creation_date}
                                </span>
                              ) : (
                                <span>{selectedDate?.toDateString()!}</span>
                              )}
                              <Flatpickr
                                value={selectedDateInsurance!}
                                onChange={handleDateInsuranceChange}
                                className="form-control flatpickr-input"
                                placeholder="Select Date"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                                id="birthdate"
                              />
                            </div>
                            <div>
                              <button
                                title="Book Offer"
                                type="button"
                                className="btn btn-soft-primary btn-icon d-grid"
                                onClick={() => tog_Insurance()}
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
                                  htmlFor="insurance_file"
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
                                  name="insurance_file"
                                  id="insurance_file"
                                  accept=".pdf"
                                  onChange={(e) => handleInsuranceFile(e)}
                                  style={{ width: "210px", height: "120px" }}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                    <Row>
                      <hr />
                    </Row>
                    <Row className="justify-content-between gy-4">
                      <Col xl={8} md={5}>
                        <div className="d-flex gap-2">
                          <span className="mt-1 mb-2 fw-bold">
                            Fleet Number :
                          </span>
                          {sumFleet === "" ? (
                            <span className="fs-16 fw-medium align-middle">
                              {user?.fleetNumber}
                            </span>
                          ) : (
                            <span className="fs-16 fw-medium align-middle">
                              {sumFleet}
                            </span>
                          )}
                        </div>
                        <p className="fw-bold mb-2">Vehicle Types</p>
                        <Row>
                          {user?.vehicles!.map((vehicle: any) => (
                            <Col lg={4} key={vehicle.id}>
                              <Row className="mb-2">
                                <Col
                                  lg={9}
                                  className="d-flex align-items-center"
                                >
                                  <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    id={`inlineCheckbox${vehicle.id}`}
                                    value="option1"
                                    checked
                                    onChange={(event) =>
                                      handleCheckboxChange(event, vehicle.id)
                                    }
                                  />
                                  <label
                                    className="fw-medium mb-0 me-2"
                                    htmlFor={`inlineCheckbox${vehicle.id}`}
                                  >
                                    <span>{vehicle?.type}</span>
                                  </label>
                                </Col>
                                <Col lg={3}>
                                  <input
                                    type="text"
                                    id={`number${vehicle.id}`}
                                    name="number"
                                    style={{
                                      width: "50px",
                                      height: "30px",
                                      padding: "0.375rem 0.75rem",
                                    }}
                                    value={vehicle?.qty!}
                                    onChange={(event) =>
                                      handleQuantityChange(event, vehicle.id)
                                    }
                                  />
                                </Col>
                              </Row>
                            </Col>
                          ))}
                        </Row>

                        <Row>
                          {newArray.map((vehicle: any) => (
                            <Col lg={4} key={vehicle._id}>
                              <Row className="mb-2">
                                <Col
                                  lg={9}
                                  className="d-flex align-items-center"
                                >
                                  <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    id={`inlineCheckbox${vehicle._id}`}
                                    value="option1"
                                    checked={checkedMap[vehicle._id] || false}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, vehicle._id)
                                    }
                                  />
                                  <label
                                    className="fw-medium mb-0 me-2"
                                    htmlFor={`inlineCheckbox${vehicle._id}`}
                                  >
                                    <span>{vehicle?.type}</span>
                                  </label>
                                </Col>
                                <Col lg={3}>
                                  {checkedMap[vehicle._id] && (
                                    <input
                                      type="text"
                                      id={`qty${vehicle._id}`}
                                      name="qty"
                                      style={{
                                        width: "50px",
                                        height: "30px",
                                        padding: "0.375rem 0.75rem",
                                      }}
                                      value={quantities[vehicle._id] || ""}
                                      onChange={(event) =>
                                        handleQuantityChange(event, vehicle._id)
                                      }
                                    />
                                  )}
                                </Col>
                              </Row>
                            </Col>
                          ))}
                        </Row>

                        {/* <Button onClick={mergeVehicles}>Merge Vehicles</Button> */}
                      </Col>
                      <Col xl={4} md={5}>
                        <Row>
                          <p className="text-muted fw-medium mb-2">
                            Area of Coverage
                          </p>
                          <ul className="list-inline mb-2">
                            {user?.coverageArea.map((area: any) => (
                              <li className="list-inline-item">
                                <div className="d-flex gap-2">
                                  <span
                                    className="badge bg-info-subtle text-info w-100"
                                    // style={{ width: "25px" }}
                                  >
                                    {area.placeName}
                                  </span>
                                  <Form.Control
                                    type="text"
                                    id="number"
                                    name="number"
                                    //   value={quantities[index]}
                                    //   onChange={handleQty(index)}
                                    defaultValue={area.raduis}
                                    size="sm"
                                    className="w-25"
                                  />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </Row>
                        <Row>
                          <Col lg={12}>
                            <div
                              style={{
                                marginTop: "15px",
                                maxHeight: "500px", // Change this value to auto or a larger value
                                overflowX: "auto",
                                // overflowY: "none", // Hide the vertical scrollbar
                              }}
                            >
                              {areaCoverage.map((stop: any, index: number) => (
                                <Row>
                                  <Col lg={7} key={index}>
                                    <Form.Label htmlFor="customerName-field">
                                      Area {index + 1}
                                    </Form.Label>
                                    <div className="mb-3">
                                      <Autocomplete
                                        onLoad={(autocomplete) =>
                                          onLoadStop(autocomplete, index)
                                        }
                                        onPlaceChanged={() =>
                                          onPlaceChangedAreaCoverage(index)
                                        }
                                        options={options}
                                      >
                                        <Form.Control
                                          type="text"
                                          className="w-100"
                                          placeholder="London, UK"
                                          ref={stopRef}
                                          id="stop"
                                          onClick={() => {
                                            handleLocationButtonClickStop();
                                          }}
                                        />
                                      </Autocomplete>
                                    </div>
                                  </Col>
                                  <Col lg={3}>
                                    <Form.Control
                                      type="text"
                                      id="number"
                                      name="number"
                                      value={areaCoverage[index]?.raduis!}
                                      onChange={handleQty(index)}
                                      placeholder="Raduis(miles)"
                                      className="w-100"
                                      style={{
                                        marginTop: "29px",
                                      }}
                                    />
                                  </Col>
                                  <Col lg={2}>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-icon"
                                      onClick={() =>
                                        handleRemoveStopClick(stop.id)
                                      }
                                      style={{
                                        marginTop: "29px",
                                      }}
                                    >
                                      <i className="ri-delete-bin-5-line"></i>
                                    </button>
                                  </Col>
                                </Row>
                              ))}
                              <div className="d-flex flex-btn-via">
                                <Link
                                  to="#"
                                  id="add-item"
                                  className="btn btn-soft-info fw-medium w-25"
                                  onClick={handleAddStopClick}
                                >
                                  <i className="ri-add-line label-icon align-middle rounded-pill fs-16 me-2"></i>
                                </Link>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Body>
                    <Row>
                      <hr />
                      <Col lg={12}>
                        <div className="d-flex justify-content-center">
                          <Button
                            className="btn-soft-success w-25"
                            type="submit"
                          >
                            <i className="ri-send-plane-line align-bottom me-1"></i>{" "}
                            Save and Send
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Form>
            </Col>
          </Row>
        </Container>
        <Modal
          className="fade zoomIn"
          size="xl"
          show={modal_PVCModals}
          onHide={() => {
            tog_PVCModals();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              License File
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"
            ></div>
            <div>
              <Document
                file={`${process.env.REACT_APP_FILE_URL}/affiliateFiles/licenceFiles/${user.id_file}`}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page pageNumber={1} />
              </Document>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          className="fade zoomIn"
          size="xl"
          show={modal_Insurance}
          onHide={() => {
            tog_Insurance();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Insurance File
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"
            ></div>
            <div>
              <Document
                file={`${process.env.REACT_APP_FILE_URL}/affiliateFiles/insuranceFiles/${user.insurance_file}`}
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

export default EditProfile;
