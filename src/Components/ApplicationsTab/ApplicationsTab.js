import "./ApplicationsTab.css";
import ApplicationItem from "../ApplicationItem/ApplicationItem";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const ApplicationsTab = ({ role }) => {
  const history = useHistory();
  const applications = useSelector(
    (state) => state.applicationsReducer.applications
  );
  const pendingApplications = useSelector(
    (state) => state.pendingApplicationsReducer.pendingApplications
  );

  const reviewerLogoutClickHandler = () => {
    localStorage.removeItem("pendingApplications");
    localStorage.removeItem("selectedDocumentIndex");
    localStorage.removeItem("application");
    localStorage.removeItem("applicantInfo");
    history.push("/reviewer");
  };

  return (
    <section className="ApplicationsTab">
      {role === "applicant" ? (
        <p className="inner-header">application history</p>
      ) : (
        <>
          <button
            className="reviewer-logout"
            onClick={reviewerLogoutClickHandler}
          >
            Logout
          </button>
          <p className="inner-header">pending applications</p>
        </>
      )}
      <div className="application-history">
        {applications.length === 0 && role === "applicant" && (
          <div className="empty-tab">no applications...</div>
        )}
        {pendingApplications.length === 0 && role === "reviewer" && (
          <div className="empty-tab">no pending applications...</div>
        )}
        {role === "applicant"
          ? applications.map((application) => (
              <ApplicationItem
                key={`applicationitem-${application._id}`}
                application={application}
                role={role}
              />
            ))
          : pendingApplications.map((application) => (
              <ApplicationItem
                key={`applicationitem-${application._id}`}
                application={application}
                role={role}
              />
            ))}
      </div>
    </section>
  );
};

export default ApplicationsTab;
