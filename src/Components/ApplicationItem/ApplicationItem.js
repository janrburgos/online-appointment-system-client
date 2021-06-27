import "./ApplicationItem.css";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const ApplicationItem = (props) => {
  const dispatch = useDispatch();
  let receiptHandler = useRef(null);
  const [application, setApplication] = useState(props.application);

  const applicationDetailsClickHandler = () => {
    localStorage.setItem("selectedDocumentIndex", 0);
    localStorage.setItem("application", JSON.stringify(application));
    if (props.role === "reviewer") {
      axios(
        `https://online-appointment-system-be.herokuapp.com/api/applicants/id/${props.application.applicantId}`
      ).then((res) => {
        dispatch({ type: "INSERT_APPLICANT_INFO", payload: res.data[0] });
        localStorage.setItem("applicantInfo", JSON.stringify(res.data[0]));
      });
    }
  };

  const uploadReceiptInputHandler = (applicationId) => {
    const file = receiptHandler.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      axios
        .post(
          `https://online-appointment-system-be.herokuapp.com/api/upload/receipt`,
          {
            data: reader.result,
          }
        )
        .then((res) => {
          axios
            .put(
              `https://online-appointment-system-be.herokuapp.com/api/applications/${applicationId}`,
              {
                paymentReceiptUrl: res.data,
                paymentStatus: "pending",
              }
            )
            .then((res) => {
              setApplication(res.data);
            });
        });
    };
  };

  return (
    <div className="ApplicationItem">
      <div className="application-card">
        <div className="application-buttons">
          <Link
            to={{
              pathname: `${
                props.role === "applicant"
                  ? `/main/applications/${application._id}/0`
                  : `/reviewer/applications/${application._id}/0`
              }`,
              state: {
                application,
                role: props.role,
              },
            }}
            onClick={applicationDetailsClickHandler}
          >
            <button>view details</button>
          </Link>
          {props.role === "applicant" && (
            <div className="receipt-button">
              {application.paymentStatus !== "accepted" && (
                <input
                  type="file"
                  id="payment-receipt"
                  accept="image/*"
                  ref={receiptHandler}
                  onInput={() => uploadReceiptInputHandler(application._id)}
                />
              )}
              {application.paymentStatus === "-" ||
              application.paymentStatus === "rejected" ? (
                <div>
                  <span className="left-arrow">&#8592;</span>
                  <span className="up-arrow">&#8593;</span> Upload Your Receipt
                </div>
              ) : (
                <div>Receipt Uploaded! </div>
              )}
            </div>
          )}
        </div>
        <div className="application-middle">
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
      </div>
    </div>
  );
};

export default ApplicationItem;
