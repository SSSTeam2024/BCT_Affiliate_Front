// import React from 'react';
// import { Card, Col, Dropdown, Row, Table } from 'react-bootstrap';
// // import Acitivity from './Activity';
// // import RecentOrders from './RecentOrders';
// import { Link } from 'react-router-dom';

// // Import Images
// import img1 from 'assets/images/users/avatar-1.jpg'

// const UserProfile = () => {
//     return (
//         <React.Fragment>
//             <Row>
//                 <Col xxl={9}>
//                     <Card>
//                         <Card.Body>
//                             <Row>
//                                 <Col lg={3}>
//                                     <div className="profile-user-img position-relative">
//                                         <img src={img1} alt="" className="rounded object-fit-cover" />
//                                         <span className="position-absolute top-0 start-100 translate-middle badge border border-3 border-white rounded-circle bg-success p-1 mt-1 me-1"><span className="visually-hidden">unread messages</span></span>
//                                     </div>
//                                 </Col>
//                                 <Col lg={9}>
//                                     <div className="d-flex border-bottom border-bottom-dashed pb-3 mb-3 mt-4 mt-lg-0">
//                                         <div className="flex-grow-1">
//                                             <h5>Raquel Murillo</h5>
//                                             <p className="text-muted mb-0">Sales & Marketing Manager</p>
//                                         </div>
//                                         <div className="flex-shrink-0">
//                                             <Dropdown>
//                                                 <Dropdown.Toggle href="#" className="arrow-none btn btn-ghost-primary btn-sm btn-icon" data-bs-toggle="dropdown" aria-expanded="false">
//                                                     <i className="ph-dots-three-outline"></i>
//                                                 </Dropdown.Toggle>
//                                                 <Dropdown.Menu>
//                                                     <li><Dropdown.Item href="/#">Action</Dropdown.Item></li>
//                                                     <li><Dropdown.Item href="/#">Another action</Dropdown.Item></li>
//                                                     <li><Dropdown.Item href="/#">Something else here</Dropdown.Item></li>
//                                                 </Dropdown.Menu>
//                                             </Dropdown>
//                                         </div>
//                                     </div>

//                                     <Row>
//                                         <Col lg={6}>
//                                             <div className="table-responsive">
//                                                 <Table className="table-borderless table-sm mb-0">
//                                                     <tbody>
//                                                         <tr>
//                                                             <td>
//                                                                 Location
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 Phoenix, USA
//                                                             </td>
//                                                         </tr>

//                                                         <tr>
//                                                             <td>
//                                                                 Email ID
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 raquelmurillo@sales.com
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td>
//                                                                 Date of Birth
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 29 Oct, 1986
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td>
//                                                                 Mobile / Phone No.
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 +(235) 01234 5678
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td>
//                                                                 Total Reviews
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 <i className="bi bi-star-half text-warning align-middle me-1"></i> 365
//                                                             </td>
//                                                         </tr>
//                                                     </tbody>
//                                                 </Table>
//                                             </div>
//                                         </Col>
//                                         <Col lg={6}>
//                                             <div className="table-responsive">
//                                                 <Table className="table-borderless table-sm mb-0">
//                                                     <tbody>
//                                                         <tr>
//                                                             <td>
//                                                                 Designation
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 Sales & Marketing Managers
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td>
//                                                                 Total Products
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 237
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td>
//                                                                 Orders
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 3,412
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td>
//                                                                 Earnings
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 $2,960.32
//                                                             </td>
//                                                         </tr>
//                                                         <tr>
//                                                             <td>
//                                                                 Joining Date
//                                                             </td>
//                                                             <td className="fw-medium">
//                                                                 16 Aug, 2000
//                                                             </td>
//                                                         </tr>
//                                                     </tbody>
//                                                 </Table>
//                                             </div>
//                                         </Col>
//                                     </Row>

//                                     <div className="mt-3">
//                                         <ul className="list-unstyled hstack gap-2 mb-0">
//                                             <li>
//                                                 Social Media:
//                                             </li>
//                                             <li>
//                                                 <Link to="#!" className="btn btn-soft-secondary btn-icon btn-sm"><i className="ph-facebook-logo"></i></Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="#!" className="btn btn-soft-danger btn-icon btn-sm"><i className="ph-envelope"></i></Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="#!" className="btn btn-soft-primary btn-icon btn-sm"><i className="ph-twitter-logo"></i></Link>
//                                             </li>
//                                             <li>
//                                                 <Link to="#!" className="btn btn-soft-success btn-icon btn-sm"><i className="ph-whatsapp-logo"></i></Link>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </Col>
//                             </Row>
//                         </Card.Body>
//                     </Card>
//                     {/* <RecentOrders /> */}
//                 </Col>

//                 {/* <Col xxl={3}>
//                     <Acitivity />
//                 </Col> */}
//             </Row>
//         </React.Fragment>
//     );
// };

// export default UserProfile;

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Form,
  Table,
  Dropdown,
} from "react-bootstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "Common/withRouter";
import { RootState } from "../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../features/account/authSlice";
import { editProfile, resetProfileFlag } from "slices/thunk";

const UserProfile = () => {
  document.title = " Profile | Affiliate Administration ";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const dispatch = useDispatch<any>();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);

  const { error, success } = useSelector((state: any) => ({
    error: state.Profile.error,
    success: state.Profile.success,
  }));

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser") || "{}");
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setname(obj.displayName);
        setemail(obj.email);
        setidx(obj.uid);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        setname(obj.username);
        setemail(obj.email);
        setidx(obj.uid);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      username: name || "",
      idx: idx || "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Please Enter Your UserName"),
    }),
    onSubmit: (values) => {
      dispatch(editProfile(values));
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xxl={12}>
              <Card>
                <Card.Body>
                  <Row>
                    <Col lg={3}>
                      <div className="profile-user-img position-relative">
                        <img
                          src={`${process.env.REACT_APP_BASE_URL}/schoolFiles/${user.id_file}`}
                          alt=""
                          className="rounded object-fit-cover"
                        />
                        <span className="position-absolute top-0 start-100 translate-middle badge border border-3 border-white rounded-circle bg-success p-1 mt-1 me-1">
                          <span className="visually-hidden">
                            unread messages
                          </span>
                        </span>
                      </div>
                    </Col>
                    <Col lg={9}>
                      <div className="d-flex border-bottom border-bottom-dashed pb-3 mb-3 mt-4 mt-lg-0">
                        <div className="flex-grow-1">
                          <h5>{user.name}</h5>
                          <p className="text-muted mb-0">{user.activity}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <Dropdown>
                            <Dropdown.Toggle
                              href="#"
                              className="arrow-none btn btn-ghost-primary btn-sm btn-icon"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="ph-dots-three-outline"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <li>
                                <Dropdown.Item href="/#">Action</Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item href="/#">
                                  Another action
                                </Dropdown.Item>
                              </li>
                              <li>
                                <Dropdown.Item href="/#">
                                  Something else here
                                </Dropdown.Item>
                              </li>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      <Row>
                        <Col lg={6}>
                          <div className="table-responsive">
                            <Table className="table-borderless table-sm mb-0">
                              <tbody>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-map-pin"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Location</td>
                                  </div>
                                  <td className="fw-medium">{user.address}</td>
                                </tr>

                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-envelope"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Email</td>
                                  </div>
                                  <td className="fw-medium">{user.email}</td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-phone"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Mobile / Phone No.</td>
                                  </div>
                                  <td className="fw-medium">{user.phone}</td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-book"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Designation</td>
                                  </div>
                                  <td className="fw-medium">{user.activity}</td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div className="table-responsive">
                            <Table className="table-borderless table-sm mb-0">
                              <tbody>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-bank"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Bank Name</td>
                                  </div>
                                  <td className="fw-medium">
                                    {" "}
                                    {user.bank_name}
                                  </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-user-list"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Account Name</td>
                                  </div>
                                  <td className="fw-medium">
                                    {" "}
                                    {user.account_name}
                                  </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-credit-card"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Account Number</td>
                                  </div>
                                  <td className="fw-medium">
                                    {" "}
                                    {user.account_number}
                                  </td>
                                </tr>
                                <tr>
                                  <div className="d-flex align-item-start fw-medium">
                                    <i
                                      className="ph ph-receipt"
                                      style={{
                                        marginRight: "3px",
                                        marginTop: "4px",
                                      }}
                                    ></i>
                                    <td>Sort Code</td>
                                  </div>
                                  <td className="fw-medium">
                                    {" "}
                                    {user.sort_code}
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              {/* <RecentOrders /> */}
            </Col>

            {/* <Col xxl={3}>
                    <Acitivity />
                </Col> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
