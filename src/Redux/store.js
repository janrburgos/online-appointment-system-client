import { createStore, combineReducers } from "redux";
import applicantInfoReducer from "./Reducers/applicantInfoReducer";
import applicationsReducer from "./Reducers/applicationsReducer";
import pendingApplicationsReducer from "./Reducers/pendingApplicationsReducer";
import doctypesReducer from "./Reducers/doctypesReducer";
import highlightedNavReducer from "./Reducers/highlightedNavReducer";
import documentsReducer from "./Reducers/documentsReducer";

const store = createStore(
  combineReducers({
    applicantInfoReducer,
    applicationsReducer,
    pendingApplicationsReducer,
    doctypesReducer,
    highlightedNavReducer,
    documentsReducer,
  })
);

export default store;
