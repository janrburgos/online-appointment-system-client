const initialState = {
  applications: [],
};

const applications = (state = initialState, action) => {
  switch (action.type) {
    case "INSERT_APPLICATIONS":
      return {
        ...state,
        applications: [...action.payload],
      };

    default:
      return state;
  }
};

export default applications;
