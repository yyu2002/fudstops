/* App.jsx - root component of react app, top most component in hierarchy */
import "./app.scss"
import Home from "./pages/home/Home";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import FoodInfo from "./pages/foodInfo/FoodInfo";
import Menu from "./pages/menu/Menu";
import Settings from "./pages/settings/Settings";
import Preferences from "./pages/preferences/Preferences";
import Recommendations from "./pages/recommendations/Recommendations";
import PersonalInfo from "./pages/personalInfo/PersonalInfo";
import Favorites from "./pages/favorites/Favorites";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import ForgotPasswordReset from "./pages/forgotPasswordReset/forgotPasswordReset";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authContext/AuthContext";
import ReportProblem from "./pages/reportProblem/reportProblem";
import ProfPic from "./pages/profilePic/ProfilePic";
import DeleteAccount from "./pages/deleteAccount/deleteAccount";
import Popular from "./pages/popular/Popular";
import Notifications from "./pages/notifications/Notifications";
// import axios from "axios";
// import schedule from "node-schedule";

const App = () => {
    const { user } = useContext(AuthContext); // get user from auth context

    return (
        <Router>
            <Routes>
                {/* user can only access other pages if logged in, and can't access login pages if logged in already */}
                { // paths for when logged in
                    user && (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/deleteAccount" element={<DeleteAccount />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/foodInfo" element={<FoodInfo />} />
                            <Route path="/foodInfo/:menuItemID" element={<FoodInfo />} /> {/* This route will be utilized later to lead user to the specific menu item page for a selected menuItemId*/}
                            <Route path="/forgotPassword" element={<Home />} /> {/* Should go to home when logged in */}
                            <Route path="/forgotPasswordReset/:id/:token" element={<Home />} /> {/* Should go to home when logged in */}
                            <Route path="/login" element={<Home />} /> {/* Should go to home when logged in */}
                            <Route path="/menu/:location" element={<Menu />} />
                            <Route path="/personalInfo" element={<PersonalInfo />} />
                            <Route path="/popular" element={<Popular />} />
                            <Route path="/preferences" element={<Preferences />} />
                            <Route path="/recommendations" element={<Recommendations />} />
                            <Route path="/register" element={<Home />} /> {/* Should go to home when logged in */}
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/reportProblem" element={<ReportProblem />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/profPic" element={<ProfPic />} />
                        </>
                    )
                }
                { // paths for when logged out - should redirect to register page if not logged in except for /login
                    !user && (
                        <>
                            <Route path="/" element={<Register />} />
                            <Route path="/deleteAccount" element={<Register />} />
                            <Route path="/favorites" element={<Register />} />
                            <Route path="/foodInfo" element={<Register />} />
                            <Route path="/foodInfo/:menuItemID" element={<Register />} />
                            <Route path="/forgotPassword" element={<ForgotPassword />} />
                            <Route path="/forgotPasswordReset/:id/:token" element={<ForgotPasswordReset />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/menu/:location" element={<Register />} />
                            <Route path="/personalInfo" element={<Register />} />
                            <Route path="/popular" element={<Register />} />
                            <Route path="/preferences" element={<Register />} />
                            <Route path="/recommendations" element={<Register />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/settings" element={<Register />} />
                            <Route path="/reportProblem" element={<Register />} />
                            <Route path="/profPic" element={<Register />} />
                            <Route path="/notifications" element={<Register />} />
                        </>
                    )
                }
            </Routes>
        </Router>
    );
};

export default App;

