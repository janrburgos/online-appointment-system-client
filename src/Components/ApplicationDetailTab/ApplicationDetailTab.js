import "./ApplicationDetailTab.css";
import SetAppointmentDate from "../SetAppointmentDate/SetAppointmentDate";
import { Route, Link, useLocation, useHistory } from "react-router-dom";
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import axios from "axios";
import ReactLoading from "react-loading";

const ApplicationDetailTab = () => {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [application, setApplication] = useState({
    ...location.state.application,
  });
  const applicantInfo = useSelector(
    (state) => state.applicantInfoReducer.applicantInfo
  );
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(
    Number(localStorage.getItem("selectedDocumentIndex"))
  );
  const [reviewerPaymentStatus, setReviewerPaymentStatus] =
    useState("accepted");
  const [reviewerTransactionStatus, setReviewerTransactionStatus] = useState(
    "set appointment date"
  );
  const [reviewerRemarks, setReviewerRemarks] = useState("-");
  const [loading, setLoading] = useState(false);
  const fileHandler = useRef(null);

  const updateApplicationsClickHandler = () => {
    axios(
      `https://online-appointment-system-be.herokuapp.com/api/applications/${applicantInfo._id}`
    )
      .then((res) => {
        dispatch({ type: "INSERT_APPLICATIONS", payload: res.data });
        localStorage.setItem("applications", JSON.stringify(res.data));
      })
      .catch(axiosError);
  };

  const uploadDocumentClickHandler = (reqr, index) => {
    setLoading(true);
    const file = fileHandler.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      axios
        .post(
          `https://online-appointment-system-be.herokuapp.com/api/upload/document`,
          {
            data: reader.result,
          }
        )
        .then((res) => {
          let transactionsToEdit = [...application.transactionRequirements];
          transactionsToEdit[index] = {
            requirementName: reqr.requirementName,
            requirementUrl: res.data,
            requirementStatus: "pending",
          };
          // add to documents collection
          axios.post(
            "https://online-appointment-system-be.herokuapp.com/api/documents",
            {
              applicantId: application.applicantId,
              docType: reqr.requirementName,
              documentUrl: res.data,
              dateUploaded: Date.now(),
            }
          );
          // edit applications collection
          axios
            .put(
              `https://online-appointment-system-be.herokuapp.com/api/applications/${application._id}`,
              {
                transactionRequirements: transactionsToEdit,
              }
            )
            .then((res) => {
              setApplication(res.data);
            });
        })
        .then((res) => {
          setLoading(false);
        })
        .catch(axiosError);
    };
  };

  const setAppointmentDateHandler = async (pickedDate) => {
    await axios
      .put(
        `https://online-appointment-system-be.herokuapp.com/api/applications/${application._id}`,
        {
          transactionStatus: "to claim document",
          appointmentDate: pickedDate,
        }
      )
      .then((res) => {
        setApplication(res.data);
        localStorage.setItem("application", JSON.stringify(res.data));
        updateApplicationsClickHandler();
        alert("Apointment date has been set");
      })
      .catch(axiosError);
    // add the new document to documents collection
    await axios
      .post(
        "https://online-appointment-system-be.herokuapp.com/api/documents",
        {
          applicantId: application.applicantId,
          docType: application.transactionDocument,
          documentUrl:
            "https://res.cloudinary.com/janrcloud/image/upload/v1624704185/online-appointment-system/Uploads/pdf-logo.svg",
          dateUploaded: Date.now(),
        }
      )
      .catch(axiosError);
    // create the document the applicant applied for
    await axios
      .post(
        "https://online-appointment-system-be.herokuapp.com/api/createdoc",
        {
          folderName: moment(Date.now()).format("YYYY-MM-DD"),
          fileName: `${applicantInfo.applicantNumber}-${
            application.transactionDocument
          }-${Date.now()}`,
          documentName: application.transactionDocument,
          applicantInfo,
        }
      )
      .catch(axiosError);
    setLoading(false);
  };

  const sendApplicationClickHandler = () => {
    setLoading(true);
    axios
      .put(
        `https://online-appointment-system-be.herokuapp.com/api/applications/${application._id}`,
        {
          transactionStatus: "pending",
          transactionStatusUpdated: Date.now(),
        }
      )
      .then((res) => {
        setLoading(false);
        setApplication(res.data);
        updateApplicationsClickHandler();
        alert("Application has been sent for review");
      })
      .catch(axiosError);
  };

  const cancelApplicationClickHandler = () => {
    setLoading(true);
    axios
      .put(
        `https://online-appointment-system-be.herokuapp.com/api/applications/${application._id}`,
        {
          transactionStatus: "-",
          transactionStatusUpdated: Date.now(),
        }
      )
      .then((res) => {
        setLoading(false);
        setApplication(res.data);
        updateApplicationsClickHandler();
        alert("Application has been cancelled");
      })
      .catch(axiosError);
  };

  const reviewerButtonClickHandler = () => {
    setLoading(true);
    let currentApplicationStatus;
    axios(
      `https://online-appointment-system-be.herokuapp.com/api/applications/application-id/${application._id}`
    )
      .then((res) => {
        currentApplicationStatus = res.data[0].transactionStatus;
      })
      .then((res) => {
        if (currentApplicationStatus === "pending") {
          axios
            .put(
              `https://online-appointment-system-be.herokuapp.com/api/applications/${application._id}`,
              {
                transactionStatus: reviewerTransactionStatus,
                paymentStatus: reviewerPaymentStatus,
                remarks: reviewerRemarks,
              }
            )
            .then((res) => {
              setLoading(false);
              setApplication(res.data);
              alert("Application reviewed");
              history.push("/reviewer/main");
            });
        } else {
          setLoading(false);
          alert("Applicant cancelled the application");
          history.push("/reviewer/main");
        }
      })
      .catch(axiosError);
  };

  const backToPendingClickHandler = () => {
    history.push("/reviewer/main");
  };

  const axiosError = (err) => {
    setLoading(false);
    alert("communication error");
  };

  return (
    <section
      className={`ApplicationDetailTab ${
        location.state.role === "reviewer" ? "ReviewerDetailTab" : null
      }`}
    >
      {loading && (
        <div className="loading-container">
          <ReactLoading
            type={"spokes"}
            color={"var(--font-color)"}
            width={50}
          />
        </div>
      )}
      {location.state.role === "reviewer" && (
        <>
          <div className="reviewer-back-button">
            <button onClick={backToPendingClickHandler}>
              Back to pending applications
            </button>
          </div>
          <div className="applicant-main-top">
            <div className="avatar-container">
              <img src={applicantInfo.avatar} alt={"avatar"} />
            </div>
            <div className="primary-info">
              <div className="applicant-name">
                {`${applicantInfo.firstName} ${applicantInfo.middleName} ${applicantInfo.lastName}`}
              </div>
              <div className="applicant-email">{applicantInfo.email}</div>
              <div className="applicant-number">
                {applicantInfo.applicantNumber}
              </div>
            </div>
          </div>
        </>
      )}
      <div className="application-detail-top">
        <table>
          <tbody>
            <tr>
              <td>Transaction Document:</td>
              <td>{application.transactionDocument}</td>
            </tr>
            <tr>
              <td>Transaction Date:</td>
              <td>
                {moment(application.transactionDate).format(
                  "MMMM Do YYYY, h:mm:ss A"
                )}
              </td>
            </tr>
            <tr>
              <td>Transaction Status:</td>
              <td>
                <b>{application.transactionStatus}</b>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="table-divider"></div>
        <table>
          <tbody>
            <tr>
              <td>Amount:</td>
              <td>php {application.amount}.00</td>
            </tr>
            <tr>
              <td>Payment Status:</td>
              <td>
                <div>{application.paymentStatus}</div>
              </td>
            </tr>
            <tr>
              <td>Appointment Date:</td>
              <td>
                <b>
                  {application.appointmentDate === "-"
                    ? "-"
                    : moment(application.appointmentDate).format(
                        "MMMM Do YYYY"
                      )}
                </b>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {location.state.role === "applicant" &&
        application.transactionStatus === "set appointment date" && (
          <SetAppointmentDate
            setAppointmentDateHandler={() => {
              setLoading(true);
              setAppointmentDateHandler();
            }}
          />
        )}
      <div className="application-detail-bottom">
        <div className="requirement-list">
          <ul>
            {application.transactionRequirements.map((reqr, index) => (
              <li key={`requirement-list-li-${index}-${reqr.requirementName}`}>
                <Link
                  to={{
                    pathname: `${
                      location.state.role === "applicant"
                        ? `/main/applications/${application._id}/${index}`
                        : `/reviewer/applications/${application._id}/${index}`
                    }`,
                    state: {
                      application,
                      role: location.state.role,
                    },
                  }}
                  onClick={() => {
                    setSelectedDocumentIndex(index);
                    localStorage.setItem("selectedDocumentIndex", index);
                  }}
                >
                  <div
                    style={
                      index === selectedDocumentIndex
                        ? {
                            backgroundColor: "var(--secondary-color)",
                          }
                        : null
                    }
                  >
                    {reqr.requirementName}
                  </div>
                </Link>
              </li>
            ))}
            {location.state.role === "reviewer" && (
              <li>
                <Link
                  to={{
                    pathname: `/reviewer/applications/${application._id}/receipt`,
                    state: {
                      application,
                      role: location.state.role,
                    },
                  }}
                  onClick={() => {
                    setSelectedDocumentIndex(100);
                    localStorage.setItem("selectedDocumentIndex", 100);
                  }}
                >
                  <div
                    style={
                      selectedDocumentIndex === 100
                        ? {
                            backgroundColor: "var(--secondary-color)",
                          }
                        : null
                    }
                  >
                    receipt
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="document-photo-container">
          {application.transactionRequirements.map((reqr, index) => (
            <Route
              key={`route-${reqr.requirementName}-${index}`}
              path={
                location.state.role === "applicant"
                  ? `/main/applications/${application._id}/${index}`
                  : `/reviewer/applications/${application._id}/${index}`
              }
            >
              {location.state.role === "applicant" && (
                <div>
                  <input
                    type="file"
                    id="avatar"
                    ref={fileHandler}
                    accept="image/*"
                    onInput={() => uploadDocumentClickHandler(reqr, index)}
                  />
                </div>
              )}
              <img src={reqr.requirementUrl} alt="document" />
            </Route>
          ))}
          <Route path={`/reviewer/applications/${application._id}/receipt`}>
            <img src={application.paymentReceiptUrl} alt="receipt" />
          </Route>
        </div>
      </div>
      {location.state.role === "applicant" && (
        <div className="send-application">
          {(application.transactionStatus === "-" ||
            application.transactionStatus === "to resubmit requirements") && (
            <button onClick={sendApplicationClickHandler}>
              Send Application
            </button>
          )}
          {application.transactionStatus === "pending" && (
            <button onClick={cancelApplicationClickHandler}>
              Cancel Application
            </button>
          )}
          {application.transactionStatus !== "pending" ||
            (application.transactionStatus !== "-" && (
              <span>Application sent!</span>
            ))}
        </div>
      )}
      <div className="remarks-wrapper">
        <div className="application-remarks">
          <p className="inner-header">remarks</p>
          <p className="remarks">{application.remarks}</p>
        </div>
        <div className="reviewer-remarks">
          {location.state.role === "reviewer" && (
            <>
              <div className="reviewer-input-group">
                <label htmlFor="reviewer-payment-status">payment status</label>
                <select
                  id="reviewer-payment-status"
                  value={reviewerPaymentStatus}
                  onChange={(e) => setReviewerPaymentStatus(e.target.value)}
                >
                  <option value="accepted">accepted</option>
                  <option value="rejected">rejected</option>
                </select>
              </div>
              <div className="reviewer-input-group">
                <label htmlFor="reviewer-transaction-status">
                  transaction status
                </label>
                <select
                  id="reviewer-transaction-status"
                  value={reviewerTransactionStatus}
                  onChange={(e) => setReviewerTransactionStatus(e.target.value)}
                >
                  <option value="set appointment date">
                    set appointment date
                  </option>
                  <option value="to resubmit requirements">
                    to resubmit requirements
                  </option>
                </select>
              </div>
              <div className="reviewer-input-group">
                <label htmlFor="reviewer-remarks">remarks</label>
                <textarea
                  name=""
                  id="reviewer-remarks"
                  cols="30"
                  rows="10"
                  value={reviewerRemarks}
                  onChange={(e) => setReviewerRemarks(e.target.value)}
                ></textarea>
              </div>
              <div className="reviewer-input-group">
                <div></div>
                <div className="reviewer-status-button">
                  <button onClick={reviewerButtonClickHandler}>
                    Update Application
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ApplicationDetailTab;
