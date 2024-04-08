import { PersistPartial } from "redux-persist/es/persistReducer";
import { Reducer, Action } from "redux";
import { User } from "@/types";

interface UserState {
  user: null | User;
}

type UserAction = { type: "USER_GET" } | { type: "USER_SET"; payload: User };

const initialState: UserState = {
  user: null,
};

const userReducer: Reducer<UserState & Partial<PersistPartial>, UserAction> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case "USER_SET":
      return {
        ...state,
        user: action.payload,
      };
    case "USER_GET":
      return state

    default:
      return state;
  }
};

export default userReducer;
