import "./ReviewerMainPage.css";
import ApplicationsTab from "../../Components/ApplicationsTab/ApplicationsTab";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";

const ReviewerMainPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  if (localStorage.getItem("pendingApplications") === null) {
    history.push("/reviewer");
  } else {
    axios(
      `https://online-appointment-system-be.herokuapp.com/api/applications/review/pending`
    ).then((res) => {
      dispatch({ type: "INSERT_PENDING_APPLICATIONS", payload: res.data });
      localStorage.setItem("pendingApplications", JSON.stringify(res.data));
    });
  }

  return (
    <div className="ReviewerMainPage">
      <ApplicationsTab role={"reviewer"} />
    </div>
  );
};

export default ReviewerMainPage;
