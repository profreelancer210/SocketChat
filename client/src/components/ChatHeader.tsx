import styled from 'styled-components';
import { useAppContext } from '../context/appContext';

interface IProps {
  toggleContactInfoHandler?: () => void;
}

const ChatHeader = ({ toggleContactInfoHandler }: IProps) => {
  const { contact } = useAppContext();
  return (
    <Wrapper onClick={toggleContactInfoHandler}>
      <ContactImage className='avatar-image' src={contact?.profileImage} />
      <ContactInfo>
        <ContactName>{contact?.nickname}</ContactName>
        <ContactAboutInfo>Click here for more info</ContactAboutInfo>
      </ContactInfo>
    </Wrapper>
  );
};

export default ChatHeader;

const Wrapper = styled.div`
  display: flex;
  background-color: var(--clr-grey);
  min-height: 8%;
  border-left: 1px solid var(--chat-left-border);
  padding: 0.5rem 0;
  cursor: pointer;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
`;
const ContactImage = styled.img`
  margin-left: 1.5rem;
  margin-right: 0.7rem;
`;

const ContactName = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: var(--main-chat-contact-name);
`;

const ContactAboutInfo = styled.span`
  font-size: 13px;
  line-height: 20px;
  color: var(--clr-grey-3);
`;
