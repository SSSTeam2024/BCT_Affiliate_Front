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

import ReportingManagement from "../pages/Tools/ReportingManagement/index";

import PayementManagement from "../pages/Tools/PayementManagment/index";
import Programming from "../pages/Promgramming/Scheduling/index";
import OperationsManagement from "pages/OperationManagement/index";

import TripsManagement from "pages/Promgramming/TripsManagement";
import Offers from "pages/Tools/Offers/index";
import Station from "pages/Promgramming/Stations/index";

import ExtraTrip from "pages/ExtraTrip";
import ListExtraTrip from "pages/ExtraTrip/ListExtraTrip";
import AddNewStation from "pages/Promgramming/Stations/AddNewStation";

import ProgramRoutes from "pages/ProgramRoutes";
import Profile from "pages/Profile";

import ProgramClone from "pages/ProgramRoutes/ProgramClone";
import ProgramDetails from "pages/ProgramRoutes/ProgramDetails";
import Program from "pages/Program";
import AddProgramm from "pages/ProgramRoutes/AddProgramm";
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

const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  // ? operations management

  { path: "/operations-management", component: <OperationsManagement /> },
  // ? extra trips
  { path: "/add-extraTrip/extra-trips", component: <ExtraTrip /> },
  // ? extra trips
  { path: "/list-extra-trips", component: <ListExtraTrip /> },

  //? Programming
  { path: "/trips-management", component: <TripsManagement /> },
  { path: "/scheduling", component: <Programming /> },
  { path: "/offers", component: <Offers /> },
  { path: "/stations", component: <Station /> },
  // add station
  { path: "/add-station/stations", component: <AddNewStation /> },

  // View Profile student
  { path: "/student/view-profile", component: <Profile /> },

  //? Add station
  { path: "/stations/add-station", component: <AddNewStation /> },

  //? Check Progress
  { path: "/check-progress", component: <CheckProgress /> },

  //? Add programm
  { path: "/programming/add-program", component: <AddProgramm /> },
  // program routes
  { path: "/programming/listofprogram", component: <ProgramRoutes /> },

  //? Payment Management
  { path: "/payement-management", component: <PayementManagement /> },
  //? Reporting Management
  { path: "/reporting-management", component: <ReportingManagement /> },

  { path: "/profile", component: <Profile /> },
  { path: "/edit_profile", component: <EditProfile /> },

  { path: "/suggested-jobs", component: <SuggestedJobs /> },
  { path: "/refused-jobs", component: <RefusedJobs /> },
  { path: "/jobs/completed-jobs", component: <CompleteJobs /> },
  { path: "/jobs/accepted-jobs", component: <AcceptedJobs /> },
  { path: "/jobs/canceled-jobs", component: <CancelJobs /> },
  //? Notes
  { path: "/notes", component: <Notes /> },

  { path: "/list-of-program", component: <ProgramRoutes /> },
  { path: "/program/:name", component: <ProgramClone /> },
  { path: "/program-details/:name", component: <ProgramDetails /> },
  { path: "/program", component: <Program /> },
  { path: "/drivers", component: <Driver /> },
  { path: "/driver-details/:fullName", component: <DriverDetails /> },
  { path: "/new-driver", component: <AddNewDriver /> },

  { path: "/vehicles", component: <Vehicles /> },
  { path: "/vehicle-details/:name", component: <VehicleDetails /> },

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
