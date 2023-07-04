export interface IState {
  isChatOpen: boolean;
  user: IUser | null;
  chatId: string | null;
  contact: IUser | null;
  usersFiltering: IFilter;
  isEditing: boolean;
  displayChatImage: boolean;
  chatImageUrl: string | null;
}

export interface IContact {
  status: "requested" | "pending" | "contact";
  userId: string;
  displayMessage: {
    lastMessage: string | null;
    sentAt?: Date | null;
  };
}

export type IUser = {
  username: string;
  nickname: string;
  phone: string;
  id: string | any;
  token: string;
  aboutInfo: string;
  profileImage: string;
  contacts: Array<IContact>;
  backgroundImage?: string;
};

export type IFilter = {
  all?: string | null;
  contacts?: string | null;
  requested?: string | null;
};

export interface AppContextProps extends IState {
  toggleChat: () => void;
  loginUser: (user: IUser) => void;
  logoutUser: () => void;
  toggleContact: (contact: IUser) => void;
  toggleFilter: (filter: IFilter) => void;
  updateChatId: (chatId: string | null) => void;
  toggleProfileEdit: () => void;
  toggleChatImage: () => void;
  toggleChatImageUrl: (value: string) => void;
}

export interface IChildrenProp {
  children: React.ReactNode;
}

export type Actions =
  | { type: "toggle_chat" }
  | { type: "login_user"; payload: IUser }
  | { type: "logout_user" }
  | { type: "toggle_contact"; payload: IUser }
  | { type: "toggle_filter"; payload: IFilter }
  | { type: "toggle_profile_edit" }
  | { type: "clear_contact" }
  | { type: "toggle_chat_image" }
  | { type: "toggle_image_url"; payload: string };
