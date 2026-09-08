import React from "react";
import {
  UserRound,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  CalendarDays,
  Pencil,
  Ticket,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";

import "./Profile.css";

const Profile = () => {
  return (
    <div className="profile-page">

      {/* HEADER */}
      <div className="profile-heading">
        <div>
          <span className="profile-label">STUDENT ACCOUNT</span>
          <h1>My Profile</h1>
          <p>
            Manage your personal information and EventHub account.
          </p>
        </div>

        <button className="edit-profile-btn">
          <Pencil size={15} />
          Edit Profile
        </button>
      </div>


      {/* PROFILE HERO */}
      <div className="profile-hero">

        <div className="profile-avatar">
          <UserRound size={42} />
        </div>

        <div className="profile-main-info">
          <span>EVENTHUB STUDENT</span>
          <h2>Student Name</h2>
          <p>
            student@email.com
          </p>
        </div>

        <div className="profile-status">
          <ShieldCheck size={15} />
          Active Student
        </div>

      </div>


      {/* CONTENT GRID */}
      <div className="profile-grid">

        {/* PERSONAL INFORMATION */}
        <div className="profile-card">

          <div className="card-heading">
            <div className="card-icon">
              <UserRound size={18} />
            </div>

            <div>
              <span>ACCOUNT DETAILS</span>
              <h3>Personal Information</h3>
            </div>
          </div>


          <div className="info-grid">

            <div className="info-item">
              <span>FULL NAME</span>
              <strong>Student Name</strong>
            </div>

            <div className="info-item">
              <span>EMAIL ADDRESS</span>
              <strong>student@email.com</strong>
            </div>

            <div className="info-item">
              <span>PHONE NUMBER</span>
              <strong>+91 XXXXX XXXXX</strong>
            </div>

            <div className="info-item">
              <span>DATE OF BIRTH</span>
              <strong>Not Added</strong>
            </div>

          </div>

        </div>


        {/* EDUCATION */}
        <div className="profile-card">

          <div className="card-heading">

            <div className="card-icon">
              <GraduationCap size={18} />
            </div>

            <div>
              <span>ACADEMIC DETAILS</span>
              <h3>Education</h3>
            </div>

          </div>


          <div className="education-info">

            <div className="education-row">
              <Building2 size={17} />

              <div>
                <span>COLLEGE</span>
                <strong>Your College Name</strong>
              </div>
            </div>


            <div className="education-row">
              <GraduationCap size={17} />

              <div>
                <span>COURSE</span>
                <strong>Diploma in Computer Engineering</strong>
              </div>
            </div>


            <div className="education-row">
              <CalendarDays size={17} />

              <div>
                <span>YEAR</span>
                <strong>Third Year</strong>
              </div>
            </div>

          </div>

        </div>


        {/* STATISTICS */}
        <div className="profile-card profile-stat-card">

          <div className="card-heading">

            <div className="card-icon">
              <Ticket size={18} />
            </div>

            <div>
              <span>EVENT ACTIVITY</span>
              <h3>My Activity</h3>
            </div>

          </div>


          <div className="profile-stats">

            <div className="profile-stat">
              <strong>24</strong>
              <span>Upcoming Events</span>
            </div>

            <div className="profile-stat">
              <strong>03</strong>
              <span>Registrations</span>
            </div>

            <div className="profile-stat">
              <strong>03</strong>
              <span>Tickets</span>
            </div>

          </div>

        </div>


        {/* QUICK ACCESS */}
        <div className="profile-card">

          <div className="card-heading">

            <div className="card-icon">
              <ClipboardList size={18} />
            </div>

            <div>
              <span>QUICK ACCESS</span>
              <h3>EventHub Activity</h3>
            </div>

          </div>


          <div className="quick-links">

            <a href="/student/registrations">
              <ClipboardList size={17} />
              <div>
                <strong>My Registrations</strong>
                <span>View your registered events</span>
              </div>
            </a>


            <a href="/student/tickets">
              <Ticket size={17} />
              <div>
                <strong>My Tickets</strong>
                <span>View your event passes</span>
              </div>
            </a>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;