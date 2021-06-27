import "./MainPage.css";
import ProfileTab from "../../Components/ProfileTab/ProfileTab";
import DocumentsTab from "../../Components/DocumentsTab/DocumentsTab";
import ApplicationsTab from "../../Components/ApplicationsTab/ApplicationsTab";
import ApplicationDetailTab from "../../Components/ApplicationDetailTab/ApplicationDetailTab";
import SetAppointment from "../../Components/SetAppointment/SetAppointment";
import ApplicantTop from "../../Components/ApplicantTop/ApplicantTop";

import { Route, Link, Switch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const MainPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const highlightedNav = useSelector(
    (state) => state.highlightedNavReducer.highlightedNav
  );

  if (localStorage.getItem("applicantInfo") === null) {
    history.push("/");
  }

  const logoutButtonClickHandler = () => {
    localStorage.removeItem("doctypes");
    localStorage.removeItem("highlightedNav");
    localStorage.removeItem("applicantInfo");
    localStorage.removeItem("application");
    localStorage.removeItem("applications");
    localStorage.removeItem("documents");
    localStorage.removeItem("pendingApplications");
    localStorage.removeItem("selectedDocumentIndex");
    history.push("/");
  };

  return (
    <div className="MainPage">
      <header>
        <button onClick={logoutButtonClickHandler}>logout</button>
      </header>
      <main>
        <ApplicantTop />
        <nav className="applicant-nav">
          <ul>
            <Link
              to="/main"
              onClick={() => {
                dispatch({ type: "EDIT_HIGHLIGHTED_NAV", payload: "profile" });
                localStorage.setItem("highlightedNav", "profile");
              }}
            >
              <li>
                <div
                  style={
                    highlightedNav === "profile"
                      ? {
                          backgroundColor: "var(--font-color)",
                          color: "var(--secondary-color)",
                        }
                      : null
                  }
                >
                  profile
                </div>
              </li>
            </Link>
            <Link
              to="/main/documents"
              onClick={() => {
                dispatch({
                  type: "EDIT_HIGHLIGHTED_NAV",
                  payload: "documents",
                });
                localStorage.setItem("highlightedNav", "documents");
              }}
            >
              <li>
                <div
                  style={
                    highlightedNav === "documents"
                      ? {
                          backgroundColor: "var(--font-color)",
                          color: "var(--secondary-color)",
                        }
                      : null
                  }
                >
                  documents
                </div>
              </li>
            </Link>
            <Link
              to="/main/applications"
              onClick={() => {
                dispatch({
                  type: "EDIT_HIGHLIGHTED_NAV",
                  payload: "applications",
                });
                localStorage.setItem("highlightedNav", "applications");
              }}
            >
              <li>
                <div
                  style={
                    highlightedNav === "applications"
                      ? {
                          backgroundColor: "var(--font-color)",
                          color: "var(--secondary-color)",
                        }
                      : null
                  }
                >
                  applications
                </div>
              </li>
            </Link>
          </ul>
        </nav>
        <div className="applicant-details">
          <Switch>
            <Route
              path="/main/applications/:_id"
              component={ApplicationDetailTab}
            />
            <Route
              path="/main/applications"
              render={() => <ApplicationsTab role={"applicant"} />}
            />
            <Route path="/main/documents" component={DocumentsTab} />
            <Route path="/main" component={ProfileTab} />
          </Switch>
        </div>
      </main>
      <Route path="/main/set-appointment" component={SetAppointment} />
    </div>
  );
};

export default MainPage;
