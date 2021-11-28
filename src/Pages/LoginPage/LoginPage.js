import "./LoginPage.css";
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import ReactLoading from "react-loading";

const LoginPage = ({ role }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const loginValidation = (role, success) => {
    setLoginError("");
    if (email.trim() === "") {
      emailRef.current.focus();
      return setLoginError("Enter an email address");
    }
    if (password.trim() === "") {
      passwordRef.current.focus();
      return setLoginError("Enter a password");
    }
    // get applicant's information
    axios(
      `https://online-appointment-system-be.herokuapp.com/api/${role}s/${email}`
    )
      .then((res) => {
        if (res.data[0] === undefined) {
          setLoading(false);
          emailRef.current.focus();
          return setLoginError("This email address is not registered");
        } else if (res.data[0].password !== password) {
          setLoading(false);
          passwordRef.current.focus();
          return setLoginError("This password is incorrect");
        } else {
          // goes to applicant or reviewer login success function
          success(res.data[0]);
        }
      })
      .catch(axiosError);
  };

  const applicantLoginSuccess = (applicantInfo) => {
    // get all doctypes and save to redux
    axios(`https://online-appointment-system-be.herokuapp.com/api/doctypes`)
      .then((res) => {
        dispatch({ type: "INSERT_DOCTYPES", payload: res.data });
        localStorage.setItem("doctypes", JSON.stringify(res.data));
      })
      .catch(axiosError);
    // get all applicant's applications and save to redux
    axios(
      `https://online-appointment-system-be.herokuapp.com/api/applications/${applicantInfo._id}`
    )
      .then((res) => {
        dispatch({ type: "INSERT_APPLICATIONS", payload: res.data });
        localStorage.setItem("applications", JSON.stringify(res.data));
      })
      .catch(axiosError);
    // get all applicant's documents and save to redux
    axios(
      `https://online-appointment-system-be.herokuapp.com/api/documents/${applicantInfo._id}`
    )
      .then((res) => {
        dispatch({ type: "INSERT_DOCUMENTS", payload: res.data });
        localStorage.setItem("documents", JSON.stringify(res.data));
      })
      .catch(axiosError);
    // saves applicant's information to redux
    dispatch({ type: "INSERT_APPLICANT_INFO", payload: applicantInfo });
    localStorage.setItem("applicantInfo", JSON.stringify(applicantInfo));
    //
    dispatch({ type: "EDIT_HIGHLIGHTED_NAV", payload: "profile" });
    localStorage.setItem("highlightedNav", "profile");
    history.push("/main");
  };

  const reviewerLoginSuccess = (result) => {
    axios(
      `https://online-appointment-system-be.herokuapp.com/api/applications/review/pending`
    )
      .then((res) => {
        dispatch({ type: "INSERT_PENDING_APPLICATIONS", payload: res.data });
        localStorage.setItem("pendingApplications", JSON.stringify(res.data));
      })
      .then(() => {
        history.push("/reviewer/main");
      })
      .catch(axiosError);
  };

  const loginHandler = () => {
    setLoading(true);
    if (role === "applicant") {
      loginValidation(role, applicantLoginSuccess);
    } else {
      loginValidation(role, reviewerLoginSuccess);
    }
  };

  const axiosError = (err) => {
    setLoading(false);
    alert("communication error");
  };

  return (
    <div className="LoginPage">
      {loading && (
        <div className="loading-container">
          <ReactLoading
            type={"spokes"}
            color={"var(--font-color)"}
            width={50}
          />
        </div>
      )}
      <div className="login-box">
        <p className="title">
          Sign{" "}
          <Link to="/reviewer">
            <span>in</span>
          </Link>{" "}
          to{" "}
          <Link to="/">
            <span>your</span>
          </Link>{" "}
          account
        </p>
        <span className="login-error">{loginError}</span>
        <input
          type="email"
          name="email-login"
          id="email-login"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          ref={emailRef}
          onKeyDown={(e) =>
            e.key === "Enter" ? passwordRef.current.focus() : null
          }
        />
        <input
          type="password"
          name="password-login"
          id="password-login"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          ref={passwordRef}
          onKeyDown={(e) => (e.key === "Enter" ? loginHandler() : null)}
        />
        <button className="login-button" onClick={loginHandler}>
          Log In
        </button>
        <small
          onClick={() => {
            passwordRef.current.type === "password"
              ? (passwordRef.current.type = "text")
              : (passwordRef.current.type = "password");
          }}
        >
          Show/Hide password
        </small>
      </div>
      {role === "applicant" && (
        <p className="register-message">
          Don't have an account?&nbsp;
          <Link to="/register">
            <span>Register here</span>
          </Link>
        </p>
      )}
    </div>
  );
};

export default LoginPage;
