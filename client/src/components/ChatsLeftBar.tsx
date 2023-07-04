import styled from 'styled-components';
import AllUsersContainer from './AllUsersContainer';
import ContactsFiltering from './ContactsFiltering';
import SearchBar from './SearchBar';
import UserHeader from './UserHeader';
import UserProfile from './UserProfile';
import { useAppContext } from '../context/appContext';
import { useState } from 'react';
const ChatsLeftBar = () => {
  const { isEditing } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <Wrapper>
        <UserProfile />
        <Container isEditing={isEditing}>
          <UserHeader />
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <ContactsFiltering />
          <AllUsersContainer searchQuery={searchQuery} />
        </Container>
      </Wrapper>
    </>
  );
};

export default ChatsLeftBar;

const Wrapper = styled.div`
  width: 30vw;
  background-color: var(--contact-list-clr);
`;

const Container = styled.div<{ isEditing: boolean }>`
  opacity: ${(props) => props.isEditing && '0'};
  height: 100%;
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.15);
  }
  &::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
  }
`;
