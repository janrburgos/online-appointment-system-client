import "./SetAppointment.css";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import ReactLoading from "react-loading";

const SetAppointment = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const applicantInfo = useSelector(
    (state) => state.applicantInfoReducer.applicantInfo
  );
  const applications = useSelector(
    (state) => state.applicationsReducer.applications
  );
  const doctypes = useSelector((state) => state.doctypesReducer.doctypes);
  const [selectedDocument, setSelectedDocument] = useState({
    requirements: [],
  });
  const [selectedDocumentName, setSelectedDocumentName] = useState("");
  const [loading, setLoading] = useState(false);

  const closeButtonClickHandler = () => {
    localStorage.setItem("highlightedNav", "applications");
    dispatch({ type: "EDIT_HIGHLIGHTED_NAV", payload: "applications" });
    history.push("/main/applications");
  };

  const proceedButtonClickHandler = () => {
    setLoading(true);
    let transactionRequirements = [
      ...selectedDocument.requirements.map((reqr) => {
        return { requirementName: reqr };
      }),
    ];
    axios
      .post(
        "https://online-appointment-system-be.herokuapp.com/api/applications",
        {
          applicantId: applicantInfo._id,
          transactionDocument: selectedDocument.name,
          amount: selectedDocument.amount,
          transactionRequirements,
        }
      )
      .then((res) => {
        let newApplications = [...applications, res.data];
        dispatch({ type: "INSERT_APPLICATIONS", payload: newApplications });
        localStorage.setItem("highlightedNav", "applications");
        dispatch({ type: "EDIT_HIGHLIGHTED_NAV", payload: "applications" });
        history.push("/main/applications");
      })
      .catch(axiosError);
  };

  const axiosError = (err) => {
    setLoading(false);
    alert("communication error");
  };

  return (
    <div className="SetAppointment">
      {loading && (
        <div className="loading-container">
          <ReactLoading
            type={"spokes"}
            color={"var(--font-color)"}
            width={50}
          />
        </div>
      )}
      <div className="set-appointment-modal">
        <div className="select-title">
          <label htmlFor="select-document">
            <b>select document:</b>
          </label>
          <select
            name="select-document"
            id="select-document"
            onChange={(e) => {
              setSelectedDocumentName(e.target.value);
              setSelectedDocument(
                doctypes.find((doc) => doc.name === e.target.value)
              );
            }}
            value={selectedDocumentName}
          >
            <option hidden>---select document---</option>
            {doctypes.map((doc) => (
              <option key={`selecteddocoption-${doc.name}`}>{doc.name}</option>
            ))}
          </select>
        </div>
        <div className="requirement-box">
          <div className="requirement-title">
            <b>requirements:</b>
          </div>
          <div className="requirement-list">
            <ul>
              {selectedDocument.requirements.map((doc, index) => (
                <li key={`selecteddocreq-${doc._id}-${index}`}>{doc}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="set-appointment-buttons">
          <button onClick={proceedButtonClickHandler}>proceed</button>
          <button onClick={closeButtonClickHandler}>close</button>
        </div>
      </div>
    </div>
  );
};

export default SetAppointment;
