import { Navigate } from "react-router-dom";
import Dashboard from "pages/Dashboard";

// import Settings from "pages/Accounts/Settings";
import SignIn from "pages/AccountsAuth/AuthenticationInner/SignIn";
import PasswordReset from "pages/AccountsAuth/AuthenticationInner/PasswordReset";
import PasswordCreate from "pages/AccountsAuth/AuthenticationInner/PasswordCreate";
import SuccessMessage from "pages/AccountsAuth/AuthenticationInner/SucessMessage";
import TwoStepVerify from "pages/AccountsAuth/AuthenticationInner/TwoStepVerify";
import BasicLogout from "pages/AccountsAuth/AuthenticationInner/Logout";
import Error404 from "pages/AccountsAuth/AuthenticationInner/Error404";
import Error500 from "pages/AccountsAuth/AuthenticationInner/Error500";
import ComingSoon from "pages/AccountsAuth/AuthenticationInner/ComingSoon";
import UserProfile from "pages/Authentication/user-profile";
//? Notes
import Notes from "pages/Notes";

import PayementManagement from "../pages/Tools/PayementManagment/index";

import ExtraTrip from "pages/ExtraTrip";
import ListExtraTrip from "pages/ExtraTrip/ListExtraTrip";

import Profile from "pages/Profile";

import Login from "pages/Authentication/Login";
import RefusedJobs from "pages/RefusedJobs/index";
import CompleteJobs from "pages/CompleteJobs";
import AcceptedJobs from "pages/AcceptedJobs";
import CancelJobs from "pages/CancelJobs";
import CheckProgress from "pages/CheckProgress";
import Driver from "pages/Administration/Driver";
import DriverDetails from "pages/Administration/Driver/DriverDetails";
import AddNewDriver from "pages/Administration/Driver/AddNewDriver";
import Vehicles from "pages/Administration/Vehicles";
import VehicleDetails from "pages/Administration/Vehicles/VehicleDetails";
import AddNewVehicle from "pages/Administration/Vehicles/AddNewVehicle";
import SuggestedJobs from "pages/SuggestedJobs";
import EditProfile from "pages/Profile/EditProfile";
import EditDriver from "pages/Administration/Driver/EditDriver";
import EditVehicle from "pages/Administration/Vehicles/EditVehicle";

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  // ? extra trips
  { path: "/add-extraTrip/extra-trips", component: <ExtraTrip /> },
  // ? extra trips
  { path: "/list-extra-trips", component: <ListExtraTrip /> },

  // View Profile student
  { path: "/student/view-profile", component: <Profile /> },

  //? Check Progress
  { path: "/check-progress", component: <CheckProgress /> },

  //? Payment Management
  { path: "/payement-management", component: <PayementManagement /> },

  { path: "/profile", component: <Profile /> },
  { path: "/edit_profile", component: <EditProfile /> },

  { path: "/suggested-jobs", component: <SuggestedJobs /> },
  { path: "/refused-jobs", component: <RefusedJobs /> },
  { path: "/jobs/completed-jobs", component: <CompleteJobs /> },
  { path: "/jobs/accepted-jobs", component: <AcceptedJobs /> },
  { path: "/jobs/canceled-jobs", component: <CancelJobs /> },
  //? Notes
  { path: "/notes", component: <Notes /> },

  { path: "/drivers", component: <Driver /> },
  { path: "/driver-details/:fullName", component: <DriverDetails /> },
  { path: "/new-driver", component: <AddNewDriver /> },
  { path: "/edit-driver", component: <EditDriver /> },
  { path: "/vehicles", component: <Vehicles /> },
  { path: "/vehicle-details/:name", component: <VehicleDetails /> },
  { path: "/edit-vehicle/:name", component: <EditVehicle /> },
  //? Vehicles
  {
    path: "/new-vehicle",
    component: <AddNewVehicle />,
  },

  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
  { path: "/user-profile", component: <UserProfile /> },
];

const publicRoutes = [
  // AuthenticationInner
  { path: "/login", component: <Login /> },
  { path: "/auth-pass-reset-basic", component: <PasswordReset /> },
  { path: "/auth-pass-change-basic", component: <PasswordCreate /> },
  { path: "/auth-success-msg-basic", component: <SuccessMessage /> },
  { path: "/auth-twostep-basic", component: <TwoStepVerify /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-404", component: <Error404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/coming-soon", component: <ComingSoon /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
];

export { authProtectedRoutes, publicRoutes };
