import styled from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from '../context/appContext';

interface Props {
  imageUrl?: string | null;
}

const DisplayChatImage = ({ imageUrl }: Props) => {
  const { toggleChatImage } = useAppContext();
  return (
    <Wrapper>
      <ImageContainer>
        <ChatImage src={imageUrl || ''} />
        <CloseIcon className='decline_icon' onClick={toggleChatImage} />
      </ImageContainer>
    </Wrapper>
  );
};

export default DisplayChatImage;

const Wrapper = styled.div`
  width: 98vw;
  height: 95vh;
  background-color: white;
  position: absolute;
  z-index: 2;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
const ChatImage = styled.img`
  width: 350px;
  height: 450px;
  margin-bottom: 1rem;
`;
