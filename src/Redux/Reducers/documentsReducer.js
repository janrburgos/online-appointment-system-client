const initialState = {
  documents: [],
};

const documents = (state = initialState, action) => {
  switch (action.type) {
    case "INSERT_DOCUMENTS":
      return {
        ...state,
        documents: [...action.payload],
      };

    default:
      return state;
  }
};

export default documents;
