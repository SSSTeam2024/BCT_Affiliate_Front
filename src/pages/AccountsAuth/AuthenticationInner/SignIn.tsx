import React, { useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

// Import Images
import logoDark from "assets/images/logo-dark.png";
import logoLight from "assets/images/logo-light.png";
import logo from "../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
// import { useAppDispatch, useAppSelector } from "slices/hook";
// import {
//   LoginRequest,
//   UserResponse,
//   useLoginMutation,
// } from "pages/compte/compteSlice";
// import { setCredentials } from "pages/compte/authSlice";

const SignIn = () => {
  document.title = "Sign In | School Administration";

  // const [login, { isLoading }] = useLoginMutation();
  // const [formState, setFormState] = React.useState<LoginRequest>({
  //   login: "",
  //   password: "",
  // });
  // console.log(formState)
  // const [formResponse, setFormResponse] = React.useState<UserResponse>({
  //   results: {
  //     idCompte: 1,
  //     fullname: "",
  //     login: "",
  //     password: "",
  //     code: "",
  //     role: 1,
  //     avatar: "",
  //   },
  //   message: "",
  //   token: "",
  // });
  // const dispatch = useAppDispatch();
  const navigate = useNavigate();


  // const handleChange = ({
  //   target: { name, value },
  // }: React.ChangeEvent<HTMLInputElement>) =>
  //   setFormState((prev) => ({ ...prev, [name]: value }));

  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  // const accessToken = useAppSelector(state => state.Schools.accessToken);
  // const navigate=useNavigate()

  // const handleLogin = async () => {
  //     try {
  //         await dispatch(loginSchoolAsync({ login: validation.values.email, password: validation.values.password }));
  //         console.log("Login successful");
  //         navigate('/map-tracking');
  //     } catch (error) {
  //         console.error("Login failed", error);
  //     }
  // };

  const [passwordShow, setPasswordShow] = useState<any>(false);

  const msgError: string =
    "Sorry, you are not authorized to access this page!";

  const notify = (fullname: string) => {
    Swal.fire({
      icon: "success",
      title: `Bievenue`,
      text: `Bievenue, ${fullname}`,
      showConfirmButton: false,
      timer: 2200,
    });
    navigate("/map-tracking");
  };
  const Errornotify = (msg: string) => {
    Swal.fire({
      icon: "error",
      title: "Ooops...!",
      text: `${msg}`,
      showConfirmButton: false,
      timer: 2200,
    });
    navigate("/login");
  };

//   const validation: any = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().required("Please Enter Your Username"),
//       password: Yup.string().required("Please Enter Your Password"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         const response = await login({
//           login: values.email,
//           password: values.password,
//         });
//         if ("data" in response) {
//           const { data } = response;
//           setFormResponse(data);
//           dispatch(setCredentials(data));
//           navigate("/map-tracking"); // Redirect to desired route upon successful login
//         } else {
//           console.error("Login failed", response.error);
//         }
//       } catch (error) {
//         console.error("Login failed", error);
//       }
//     },
//   });

  return (
    <React.Fragment>
      <section className="auth-page-wrapper position-relative bg-light min-vh-100 d-flex align-items-center justify-content-between">
        <div className="auth-header position-fixed top-0 start-0 end-0 bg-body">
          <Container fluid={true}>
            <Row className="justify-content-between align-items-center">
              <Col className="col-2">
                <Link className="navbar-brand mb-2 mb-sm-0" to="/">
                  <img
                    src={logo}
                    className="card-logo card-logo-dark"
                    alt="logo dark"
                    height="35"
                  />
                  <img
                    src={logoLight}
                    className="card-logo card-logo-light"
                    alt="logo light"
                    height="22"
                  />
                </Link>
              </Col>
              {/* <Col className="col-auto">
                                <ul className="list-unstyled hstack gap-2 mb-0">
                                    <li className="me-md-3">
                                        <Link to="#!" className="text-body fw-medium fs-15">Become a Selling</Link>
                                    </li>
                                    <li className="d-none d-md-block">
                                        <Link to="#!" className="btn btn-soft-secondary" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-google-play align-middle me-1"></i> Download App
                                        </Link>
                                    </li>
                                    <li className="d-none d-md-block">
                                        <Link to="#!" className="btn btn-soft-primary" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="bi bi-apple align-middle me-1"></i> Download App
                                        </Link>
                                    </li>
                                </ul>
                            </Col> */}
            </Row>
          </Container>
        </div>
        <div className="w-100">
          <Container>
            <Row className="justify-content-center">
              <Col lg={6}>
                <div className="auth-card mx-lg-3">
                  <Card className="border-0 mb-0">
                    <Card.Header className="border-0">
                      <Row className="d-flex justify-content-center">
                        <Col lg={4} className="col-3">
                          <img src={logo} alt="" className="img-fluid" />
                        </Col>
                        {/* <Col lg={8} className="col-9">
                                                    <h1 className="text-white lh-base fw-lighter">Join Our Travel Agency</h1>
                                                </Col> */}
                      </Row>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted fs-15">Sign in to continue</p>
                      <div className="p-2">
                        <Form >
                          <div className="mb-3">
                            <Form.Label htmlFor="username">Login</Form.Label>
                            <Form.Control
                              // onChange={handleChange}
                              name="Login"
                              type="text"
                            />
                            
                          </div>

                          <div className="mb-3">
                            <div className="float-end">
                              <Link
                                to="/auth-pass-reset-basic"
                                className="text-muted"
                              >
                                Forgot password?
                              </Link>
                            </div>
                            <Form.Label htmlFor="password-input">
                              Password
                            </Form.Label>
                            <div className="position-relative auth-pass-inputgroup mb-3">
                              <Form.Control
                                className="form-control pe-5 password-input"
                                id="password-input"
                                name="password"
                                // onChange={handleChange}
                            
                                type={show ? "text" : "password"}
                              />
                              <Button
                                variant="link"
                                className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                type="button"
                                id="password-addon"
                                onClick={handleClick}
                              >
                                <i className="ri-eye-fill align-middle"></i>
                              </Button>
                            </div>
                           
                          </div>

                          <div className="form-check">
                            <Form.Check
                              type="checkbox"
                              value=""
                              id="auth-remember-check"
                            />
                            <Form.Label htmlFor="auth-remember-check">
                              Remember me
                            </Form.Label>
                          </div>

                          <div className="mt-4">
                          
                          </div>
                          <div>
                          <Button
                           variant="dark"
                           className="w-100"
                            type="submit"
                            // onClick={async () => {
                            //   try {
                            //     const user = await login(formState).unwrap();
                            //     console.log("User:", user);
                            //     if (
                            //       user.message === "login successfully" &&
                            //       user.results.role === 1
                            //     ) 
                            
                            //     {
                            //       dispatch(setCredentials(user));
                            //       localStorage.setItem(
                            //         "auth",
                            //         JSON.stringify(user.token)
                            //       );
                            //       localStorage.setItem(
                            //         "profile",
                            //         JSON.stringify(user.results.fullname)
                            //       );
                            //       notify(user.results.fullname);
                            //     } else {
                            //       Errornotify(msgError);
                            //     }
                            //   } catch (err: any) {
                            //     console.error("Error:", err);
                            //     Errornotify(err);
                            //   }
                            // }}
                          >
                            Sign In
                          </Button>
                        </div>
                        </Form>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>

          <footer className="footer">
            <Container>
              <Row>
                <Col lg={12}>
                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      ©{new Date().getFullYear()} Bouden Coach Travel. Crafted
                      with <i className="mdi mdi-heart text-danger"></i> by 3S
                    </p>
                  </div>
                </Col>
              </Row>
            </Container>
          </footer>
        </div>
      </section>
    </React.Fragment>
  );
};

export default SignIn;
