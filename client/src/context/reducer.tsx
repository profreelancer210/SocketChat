import { IState, Actions } from './interfaces';

const reducer = (state: IState, action: Actions): IState => {
  if (action.type === 'toggle_chat') {
    return { ...state, isChatOpen: true };
  }

  if (action.type === 'login_user') {
    return { ...state, user: action.payload };
  }

  if (action.type === 'logout_user') {
    return { ...state, user: null, contact: null, isChatOpen: false };
  }

  if (action.type === 'toggle_contact') {
    return { ...state, contact: action.payload };
  }

  if (action.type === 'toggle_filter') {
    return { ...state, usersFiltering: action.payload };
  }

  if (action.type === 'clear_contact') {
    return { ...state, contact: null };
  }

  if (action.type === 'toggle_profile_edit') {
    return { ...state, isEditing: !state.isEditing };
  }
  if (action.type === 'toggle_chat_image') {
    return { ...state, displayChatImage: !state.displayChatImage };
  }

  if (action.type === 'toggle_image_url') {
    return { ...state, chatImageUrl: action.payload };
  }

  throw new Error(`no such action`);
};

export default reducer;
