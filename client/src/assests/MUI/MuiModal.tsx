import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../../context/appContext';
import { useMutation } from '@apollo/client';
import {
  APPROVE_CONTACT_REQUEST,
  CONTACT_REQUEST,
} from '../../graphql/mutations/userMutations';

import {
  GET_FILTERED_USERS,
  GET_USER,
} from '../../graphql/queries/userQueries';
import { CREATE_CHAT } from '../../graphql/mutations/chatMutations';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  transform: 'translate(-50%, -50%)',
  width: 350,
  borderRadius: '1rem',
  height: '40vh',
  bgcolor: 'background.paper',
  border: '2px solid white',
  boxShadow: 24,
  outline: 'none',
  p: 4,
};

export interface IModalProps {
  nickname: string;
  profileImage?: string;
  id: string;
  contactStatus: Array<'pending' | 'requested' | 'contact'>;
  contactCheck: Array<boolean | any>;
}
const MuiModal = ({
  nickname,
  profileImage,
  id,
  contactStatus,
}: IModalProps) => {
  const { user, usersFiltering, updateChatId } = useAppContext();
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  const pendingStatus = contactStatus?.toString() === 'pending';

  const [acceptRequest] = useMutation(APPROVE_CONTACT_REQUEST, {
    variables: { userId: id },
    refetchQueries: [
      {
        query: GET_USER,
      },
      {
        query: GET_FILTERED_USERS,
        variables: usersFiltering,
      },
    ],
  });

  const [contactRequest] = useMutation(CONTACT_REQUEST, {
    variables: { userId: id },
    refetchQueries: [
      {
        query: GET_USER,
      },
      {
        query: GET_FILTERED_USERS,
        variables: usersFiltering,
      },
    ],
  });

  const [createChat] = useMutation(CREATE_CHAT, {
    variables: { users: [user?.id, id] },
    refetchQueries: [
      {
        query: GET_FILTERED_USERS,
        variables: usersFiltering,
      },
    ],
    onCompleted(data) {
      updateChatId(data.createChat.chatId);
    },
  });

  const onClickHandler = () => {
    if (pendingStatus) {
      acceptRequest();
      createChat();
    } else {
      contactRequest();
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <Title>{pendingStatus ? 'Request Approval' : 'Friend Request'}</Title>
          <Text>
            {pendingStatus ? (
              <>Do you agree to approve {nickname}'s friend request?</>
            ) : (
              <>
                Do you wish to send a friend request to:
                <Nickname> {nickname}</Nickname>?
              </>
            )}
          </Text>
          <Image src={profileImage} />
          <IconContainer>
            <DoneIcon className='accept_icon' onClick={onClickHandler} />
            <CloseIcon className='decline_icon' onClick={handleClose} />
          </IconContainer>
        </Box>
      </Modal>
    </div>
  );
};

export default MuiModal;

const Title = styled.h2`
  text-align: center;
  letter-spacing: 1px;
  font-weight: 500;
  margin-bottom: 1rem;
  color: var(--primary-title);
`;

const Text = styled.p`
  width: 100%;
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--clr-grey-2);
`;

const Nickname = styled.span`
  color: var(--primary-title);
  font-weight: bold;
`;

const Image = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  margin-bottom: 1.5rem;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 50%;
  .accept_icon {
    color: var(--app-primary-clr);
    font-size: 32px;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: var(--app-primary-hover);
      color: white;
    }
  }
  .decline_icon {
    color: darkred;
    transition: all 0.2s ease-in-out;
    font-size: 32px;
    &:hover {
      background-color: darkred;
      color: white;
    }
  }
`;
