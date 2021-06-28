import "./ApplicantTop.css";
import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ReactLoading from "react-loading";

const ApplicantTop = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const avatarHandler = useRef(null);
  const applicantInfo = useSelector(
    (state) => state.applicantInfoReducer.applicantInfo
  );
  const [loading, setLoading] = useState(false);

  const setAppointmentButtonClickHandler = () => {
    history.push("/main/set-appointment");
  };

  const changeAvatarInputHandler = () => {
    setLoading(true);
    const file = avatarHandler.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      axios
        .post(
          `https://online-appointment-system-be.herokuapp.com/api/upload/avatar`,
          {
            data: reader.result,
          }
        )
        .then((res) => {
          axios
            .put(
              `https://online-appointment-system-be.herokuapp.com/api/applicants/${applicantInfo._id}`,
              {
                avatar: res.data,
              }
            )
            .then((res) => {
              setLoading(false);
              dispatch({
                type: "INSERT_APPLICANT_INFO",
                payload: res.data,
              });
              localStorage.setItem("applicantInfo", JSON.stringify(res.data));
            })
            .catch(axiosError);
        })
        .catch(axiosError);
    };
  };

  const axiosError = (err) => {
    setLoading(false);
    alert("communication error");
  };

  return (
    <div className="ApplicantTop">
      {loading && (
        <div className="loading-container">
          <ReactLoading
            type={"spokes"}
            color={"var(--font-color)"}
            width={50}
          />
        </div>
      )}
      <div className="applicant-main-top">
        <div className="avatar-container">
          <img src={applicantInfo.avatar} alt="avatar" />
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
      <div className="applicant-main-bottom">
        <button
          className="appointment-button"
          onClick={setAppointmentButtonClickHandler}
        >
          set appointment
        </button>
        <label className="change-avatar-label">
          <input
            type="file"
            className="change-avatar-button"
            accept="image/*"
            ref={avatarHandler}
            onInput={changeAvatarInputHandler}
          />
          change avatar
        </label>
      </div>
    </div>
  );
};

export default ApplicantTop;
