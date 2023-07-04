import { useApolloClient, useQuery } from '@apollo/client';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { GET_USER } from '../graphql/queries/userQueries';
import jwtDecode from 'jwt-decode';
import {
  AppContextProps,
  IChildrenProp,
  IFilter,
  IState,
  IUser,
} from './interfaces';
import reducer from './reducer';
import { useNavigate } from 'react-router-dom';

export const initialState: IState = {
  isChatOpen: false,
  chatId: null,
  user: localStorage.getItem('token')
    ? jwtDecode(localStorage.getItem('token')!)
    : null,
  contact: null,
  usersFiltering: {
    all: 'all',
    contacts: null,
    requested: null,
  },
  isEditing: false,
  displayChatImage: false,
  chatImageUrl: '',
};
const AppContext = createContext({} as AppContextProps);

export const AppProvider = ({ children }: IChildrenProp) => {
  const navigate = useNavigate();
  const client = useApolloClient();
  const [state, dispatch] = useReducer(reducer, initialState);

  const { data, loading } = useQuery(GET_USER, {
    skip: !state.user,
  });

  useEffect(() => {
    if (!loading && data) {
      dispatch({ type: 'login_user', payload: data?.getUser });
    }
  }, [data, loading]);

  const toggleChat = () => {
    dispatch({ type: 'toggle_chat' });
  };

  const toggleProfileEdit = () => {
    dispatch({ type: 'toggle_profile_edit' });
  };

  const loginUser = (user: IUser) => {
    dispatch({ type: 'login_user', payload: user });
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    client.resetStore();
    navigate('/');
    dispatch({ type: 'logout_user' });
  };

  const toggleContact = (contact: IUser) => {
    dispatch({ type: 'toggle_contact', payload: contact });
  };

  const toggleFilter = (filter: IFilter) => {
    dispatch({ type: 'toggle_filter', payload: filter });
  };

  const toggleChatImage = () => {
    dispatch({ type: 'toggle_chat_image' });
  };

  const toggleChatImageUrl = (value: string) => {
    dispatch({ type: 'toggle_image_url', payload: value });
  };

  const updateChatId = (chatId: string | null) => {
    state.chatId = chatId;
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        toggleChat,
        loginUser,
        logoutUser,
        toggleContact,
        toggleFilter,
        updateChatId,
        toggleProfileEdit,
        toggleChatImage,
        toggleChatImageUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => {
  return useContext(AppContext);
};
