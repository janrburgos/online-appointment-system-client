const initialState = {
  doctypes: [],
};

const doctypes = (state = initialState, action) => {
  switch (action.type) {
    case "INSERT_DOCTYPES":
      return {
        ...state,
        doctypes: [...action.payload],
      };

    default:
      return state;
  }
};

export default doctypes;
