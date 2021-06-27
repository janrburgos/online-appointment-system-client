import "./ProfileTab.css";
import { useSelector } from "react-redux";
import moment from "moment";

const ProfileTab = () => {
  const applicantInfo = useSelector(
    (state) => state.applicantInfoReducer.applicantInfo
  );
  return (
    <section className="ProfileTab">
      <div className="personal-info">
        <p className="inner-header">personal information</p>
        <table>
          <tbody>
            <tr>
              <th>name</th>
              <td>{`${applicantInfo.firstName} ${applicantInfo.middleName} ${applicantInfo.lastName}`}</td>
            </tr>
            <tr>
              <th>gender</th>
              <td>{applicantInfo.gender}</td>
            </tr>
            <tr>
              <th>birth date</th>
              <td>{moment(applicantInfo.birthDate).format("MMMM DD, YYYY")}</td>
            </tr>
            <tr>
              <th>civil status</th>
              <td>{applicantInfo.civilStatus}</td>
            </tr>
            <tr>
              <th>citizenship</th>
              <td>{applicantInfo.citizenship}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="personal-address">
        <p className="inner-header">personal address</p>
        <table>
          <tbody>
            <tr>
              <th>place of birth</th>
              <td>{applicantInfo.placeOfBirth}</td>
            </tr>
            <tr>
              <th>current address</th>
              <td>{applicantInfo.currentAddress}</td>
            </tr>
            <tr>
              <th>permanent address</th>
              <td>{applicantInfo.permanentAddress}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="contact-info">
        <p className="inner-header">contact information</p>
        <table>
          <tbody>
            <tr>
              <th>email address</th>
              <td className="contact-info-email">{applicantInfo.email}</td>
            </tr>
            <tr>
              <th>contact number</th>
              <td>{`+63${applicantInfo.mobileNumber}`}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProfileTab;
