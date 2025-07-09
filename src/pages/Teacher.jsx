import React from "react";
import Alert from "../components/alert_dashboard_tailwind";
import IndividualProgress from "../components/individual_progress_tailwind";
import Leaderboard from "../components/leaderboard_tailwind";
import Logo from "../components/logo_tailwind";
import Navbar from "../components/navbar_tailwind";
import Profile from "../components/profile_tailwind";
import ProfilePage from "../components/profile_page_tailwind"
import StudentProgress from "../components/student_progress_tailwind";

const Teacher = () => {
  return (
    <div>
      <Alert />
      <IndividualProgress />
      <Leaderboard />
      <Logo />
      <Navbar />
      <Profile />
      <ProfilePage />
      <StudentProgress />
    </div>
  );
};

export default Teacher;
