const initialState = {
  highlightedNav: "profile",
};

const highlightedNav = (state = initialState, action) => {
  switch (action.type) {
    case "EDIT_HIGHLIGHTED_NAV":
      return {
        ...state,
        highlightedNav: action.payload,
      };

    default:
      return state;
  }
};

export default highlightedNav;
