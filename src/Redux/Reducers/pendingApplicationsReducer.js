const initialState = {
  pendingApplications: [],
};

const pendingApplications = (state = initialState, action) => {
  switch (action.type) {
    case "INSERT_PENDING_APPLICATIONS":
      return {
        ...state,
        pendingApplications: [...action.payload],
      };

    default:
      return state;
  }
};

export default pendingApplications;
