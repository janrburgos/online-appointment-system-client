const initialState = {
  applicantInfo: {},
};

const applicantInfo = (state = initialState, action) => {
  switch (action.type) {
    case "INSERT_APPLICANT_INFO":
      return {
        ...state,
        applicantInfo: { ...action.payload },
      };

    default:
      return state;
  }
};

export default applicantInfo;
