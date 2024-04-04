import { PersistPartial } from 'redux-persist/es/persistReducer';
import { Reducer, Action } from 'redux';

interface NavbarState {
  collapsed: boolean;
}

type NavbarAction = 
  | { type: 'TOGGLE_NAVBAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' };

const initialState: NavbarState = {
  collapsed: false,
};

const navbarReducer: Reducer<NavbarState & Partial<PersistPartial>, NavbarAction> = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_NAVBAR':
      return {
        ...state,
        collapsed: !state.collapsed,
      };
    case 'OPEN':
      return {
        ...state,
        collapsed: true,
      };
    case 'CLOSE':
      return {
        ...state,
        collapsed: false,
      };
    default:
      return state;
  }
};

export default navbarReducer;
