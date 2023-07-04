import styled from 'styled-components';
import ChatHeader from './ChatHeader';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@apollo/client';
import { POST_MESSAGE } from '../graphql/mutations/chatMutations';
import { useAppContext } from '../context/appContext';
import { GET_CHAT_MESSAGES } from '../graphql/queries/chatQueries';

interface IProps {
  imageUrl: string | undefined;
  setImageUrl: React.Dispatch<React.SetStateAction<null>>;
}
const ChatImageUpload = ({ imageUrl, setImageUrl }: IProps) => {
  const { user, contact } = useAppContext();

  const [postMessage] = useMutation(POST_MESSAGE, {
    variables: {
      messageContent: imageUrl,
      usersId: [user?.id, contact?.id],
      messageType: 'image/png',
    },
    refetchQueries: [
      {
        query: GET_CHAT_MESSAGES,
        variables: {
          usersId: [user?.id, contact?.id],
        },
      },
    ],
    fetchPolicy: 'network-only',
  });

  const handleClick = () => {
    setImageUrl(null);
    postMessage();
  };

  return (
    <Wrapper>
      <ChatHeader />
      <ImageContainer>
        <Image src={imageUrl} />
        <Note>Do you wish to send this picture?</Note>
      </ImageContainer>
      <IconContainer>
        <CloseIcon onClick={() => setImageUrl(null)} className='decline_icon' />
        <DoneIcon className='accept_icon' onClick={handleClick} />
      </IconContainer>
    </Wrapper>
  );
};

export default ChatImageUpload;

const Wrapper = styled.div`
  width: 70%;
  height: 100%;
  background-color: #e9edef;
  display: flex;
  flex-direction: column;
  .accept_icon {
    color: var(--app-primary-clr);
    font-size: 32px;
    transition: all 0.2s ease-in-out;
    margin-left: 3rem;
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

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 70%;
  align-items: center;
`;

const Image = styled.img`
  width: 280px;
  height: 350px;
  margin-bottom: 2rem;
`;

const Note = styled.p`
  color: var(--primary-title);
  font-size: 18px;
  letter-spacing: 1px;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
