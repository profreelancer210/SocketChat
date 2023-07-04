import styled from 'styled-components';
import { useAppContext } from '../context/appContext';

const ContactsFiltering = () => {
  const { toggleFilter, user, usersFiltering } = useAppContext();

  const contactsLength =
    user && user?.contacts?.filter((contact) => contact.status === 'contact');
  const requestedLength =
    user &&
    user?.contacts?.filter((user) => user?.status === 'requested')?.length;

  return (
    <Wrapper>
      <List>
        <ListItem
          className={usersFiltering.all ? 'active' : ''}
          onClick={() => toggleFilter({ all: 'all' })}
        >
          All
        </ListItem>

        <ListItem
          className={usersFiltering.contacts ? 'active' : ''}
          onClick={() => toggleFilter({ contacts: 'contacts' })}
        >
          {`Contacts (${contactsLength?.length || 0})`}
        </ListItem>
        <ListItem
          className={usersFiltering.requested ? 'active' : ''}
          onClick={() => toggleFilter({ requested: 'requested' })}
        >
          {`Requested (${requestedLength || 0})`}
        </ListItem>
      </List>
    </Wrapper>
  );
};

export default ContactsFiltering;

const Wrapper = styled.div`
  .active {
    border-bottom: 1px solid;
  }
`;
const List = styled.ul`
  display: flex;
  justify-content: start;
  padding: 1rem;
  list-style: none;
`;
const ListItem = styled.li`
  color: var(--clr-grey-2);
  margin: 0 1rem;
  font-size: 16px;
  cursor: pointer;
  &:active {
    border-bottom: 1px solid !important;
  }

  &:focus {
    border-bottom: 1px solid !important;
  }

  &:after {
    border-bottom: 1px solid !important;
  }

  &:visited {
    border-bottom: 1px solid !important;
  }
`;
