import { useQuery } from '@apollo/client';
import { useState } from 'react';
import styled from 'styled-components';
import { MuiAlert } from '../assests/MUI/MuiAlert';
import { MuiLoader } from '../assests/MUI/MuiLoader';
import { useAppContext } from '../context/appContext';
import { IUser } from '../context/interfaces';
import { GET_FILTERED_USERS } from '../graphql/queries/userQueries';
import Contact from './Contact';

interface IProps {
  searchQuery: string;
}

const AllUsersContainer = ({ searchQuery }: IProps) => {
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const { usersFiltering, isEditing } = useAppContext();

  const { error, loading, data } = useQuery(GET_FILTERED_USERS, {
    variables: { ...usersFiltering, searchQuery },
    onCompleted({ getFilteredUsers }) {
      setAllUsers(getFilteredUsers);
    },
    pollInterval: 500,
    skip: isEditing,
  });

  return (
    <>
      {loading ? (
        <Loading>
          <MuiLoader />
        </Loading>
      ) : error ? (
        <Error>
          <MuiAlert type='error'>{error?.message}</MuiAlert>
        </Error>
      ) : (
        <Wrapper>
          <div className='test'>
            {data &&
              allUsers?.map((user) => {
                return <Contact key={user.id} {...user} />;
              })}
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default AllUsersContainer;

const Wrapper = styled.div`
  overflow-y: scroll;
  height: 75%;
  min-height: 450px;
  background-color: var(--contact-list-clr);
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.15);
  }
  &::-webkit-scrollbar {
    width: 5px !important;
    height: 5px !important;
  }
`;
const Loading = styled.div`
  display: flex;
  justify-content: center;
`;
const Error = styled.div``;
