import React, { useMemo, useState } from "react";
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
import { Link } from "react-router-dom";
import avatar1 from "assets/images/users/avatar-1.jpg";
import img4 from "assets/images/small/img-4.jpg";
import { selectCurrentUser } from "../../features/affiliate/authAffiliateSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store"; // Import your RootState interface
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";

const Profile = () => {
  document.title = "Profile| Coach Hire Network";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
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
                        <Image
                          src={`
                            http://57.128.184.217:3000
                          /affiliateFiles/avatarFilesPath/${user?.avatar!}`}
                          alt=""
                          className="avatar-lg rounded-circle p-1 bg-body mt-n3"
                        />
                      </div>
                      <div className=" d-flex justify-content-end mt-n5">
                        <Link
                          to="/edit_profile"
                          type="button"
                          className="btn btn-soft-success btn-icon p-4"
                        >
                          <i
                            className="bi bi bi-pen"
                            style={{ fontSize: "20px" }}
                          ></i>
                          <span className="fs-14"> Edit</span>
                        </Link>
                      </div>
                    </Card.Body>
                    <Card.Body className="pt-0">
                      <Row className="justify-content-between gy-4">
                        <Col xl={5} md={7}>
                          <h5 className="fs-18">{user?.name}</h5>
                          <div className="mb-3 text-muted">
                            <i className="bi bi-geo-alt"></i> {user?.address}
                          </div>
                          <div className="mb-3 text-muted">
                            <i className="bi bi-envelope"></i>
                            {user?.email}
                          </div>
                          <div className="mb-3 text-muted">
                            <i className="bi bi-telephone"></i> {user?.phone}
                          </div>
                          <div className="mb-3 text-muted">
                            <i className="bi bi-globe"></i> {user?.website!}
                          </div>
                          {/* <div className="hstack gap-2">
                                                    <Button variant="primary">Invite to Project</Button>
                                                    <Button variant='soft-info' className="btn-icon"><i className="bi bi-chat-left-text"></i></Button>

                                                    <Dropdown role="button">
                                                        <Dropdown.Toggle as="a" className="btn btn-soft-danger btn-icon arrow-none">
                                                            <i className="bi bi-three-dots-vertical"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu as="ul" className="dropdown-menu">
                                                            <li><Link className="dropdown-item" to="#">Action</Link></li>
                                                            <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                                            <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </div> */}
                        </Col>
                        <Col xl={3} md={5}>
                          <div>
                            <p className="text-muted fw-medium mb-2">
                              Area of Coverage
                            </p>
                            <ul className="list-inline mb-2">
                              {user?.coverageArea.map((area) => (
                                <li className="list-inline-item">
                                  <span className="badge bg-info-subtle text-info">
                                    {area.placeName}
                                  </span>
                                  <span
                                    className="badge bg-light-subtle text-dark"
                                    style={{ marginLeft: "10px" }}
                                  >
                                    {area.raduis} miles
                                  </span>
                                </li>
                              ))}
                              {/* <li className="list-inline-item">
                                                            <span className="badge bg-info-subtle text-info">English</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span className="badge bg-info-subtle text-info">Russian</span>
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <span className="badge bg-info-subtle text-info">Chinese</span>
                                                        </li> */}
                            </ul>
                          </div>
                        </Col>
                        <Col xl={3} md={5}>
                          <div>
                            <p className="text-muted fw-medium mb-2">
                              Vehicle Types
                            </p>
                            <ul className="d-flex gap-2 flex-wrap list-unstyled mb-0">
                              {user?.vehicles.map((vehicle: any) => (
                                <li className="list-inline-item mb-2">
                                  <span className="badge bg-secondary-subtle text-secondary">
                                    {vehicle?.type!}
                                  </span>
                                  <span
                                    className="badge bg-dark-subtle text-dark"
                                    style={{ marginLeft: "10px" }}
                                  >
                                    {vehicle?.qty!}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {user?.fleetNumber === "" ? (
                            ""
                          ) : (
                            <div className="d-flex gap-2">
                              <p className="text-muted fw-medium mb-2">
                                Fleet Number :
                              </p>
                              <p>{user?.fleetNumber!}</p>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                  <Row>
                    <hr />
                  </Row>
                </Card.Body>
                <Card.Body>
                  <Row>
                    <Col lg={6}>
                      <h5 className="fs-16">Licence</h5>
                      <div className="mb-3 text-muted">
                        Number: {user?.number_file}
                      </div>
                      <div className="mb-3 text-muted">
                        Expiry Date: {user?.id_creation_date}
                      </div>
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
                    </Col>
                    <Col lg={6}>
                      <h5 className="fs-16">Insurance</h5>
                      <div className="mb-3 text-muted">
                        Number: {user?.insurance_number}
                      </div>
                      <div className="mb-3 text-muted">
                        Expiry Date: {user?.insurance_date}
                      </div>
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
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
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

export default Profile;
