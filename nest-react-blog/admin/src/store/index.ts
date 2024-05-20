import { legacy_createStore as createStore } from 'redux';
import defaultSettings from '../settings.json';
export interface GlobalState {
  settings?: typeof defaultSettings;
  token?: string;
  userInfo?: {
    name?: string;
    avatar?: string;
    job?: string;
    organization?: string;
    location?: string;
    email?: string;
    role?: 'admin' | 'user';
    permissions: Record<string, string[]>;
  };
  isOnline: boolean;
}

const initialState: GlobalState = {
  settings: defaultSettings,
  userInfo: sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : {},
  isOnline: false,
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'update-settings': {
      const { settings } = action.payload;
      return {
        ...state,
        settings,
      };
    }
    case 'update-userInfo': {
      const { userInfo = initialState.userInfo, userLoading } = action.payload;
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
      return {
        ...state,
        userLoading,
        userInfo,
      };
    }
    case 'update-isOnline': {
      const { isOnline } = action.payload;
      return {
        ...state,
        isOnline,
      };
    }
    default:
      return state;
  }
}

export const store = createStore(rootReducer);
