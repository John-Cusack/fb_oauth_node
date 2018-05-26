import { FILE_UPLOAD } from "../actions/types";

export default function(state = null, action) {
  switch (action.type) {
    case FILE_UPLOAD:
      return action.payload || false;
    default:
      return state;
  }
}
