import styled from 'styled-components';
import { useAppContext } from '../context/appContext';

type IMessage = {
  messageContent: string;
  sentBy?: string;
  sentAt: string;
  type: 'out_message' | 'in_message';
  messageType: 'text' | 'image/png' | 'image/jpeg' | null;
};

type IProps = {
  type?: 'out_message' | 'in_message';
  messageType?: 'text' | 'image/png' | 'image/jpeg' | null;
};

const SingleMessage = ({
  type,
  messageContent,
  sentAt,
  messageType,
}: IMessage) => {
  const { toggleChatImage, toggleChatImageUrl } = useAppContext();

  const date = new Date(sentAt)
    .toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })
    .toLocaleLowerCase();

  const onImageClick = () => {
    toggleChatImage();
    toggleChatImageUrl(messageContent);
  };

  return (
    <>
      <Wrapper type={type}>
        <MessageContainer type={type}>
          <Message>
            {messageType !== 'text' ? (
              <ImageContainer>
                <ChatImage src={messageContent} onClick={onImageClick} />
                <ImageTime>{date}</ImageTime>
              </ImageContainer>
            ) : (
              messageContent
            )}
            <Time messageType={messageType}>{date}</Time>
          </Message>
        </MessageContainer>
      </Wrapper>
    </>
  );
};

export default SingleMessage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${(props: IProps) =>
    props.type === 'out_message' ? 'flex-start' : 'flex-end'};
`;

const MessageContainer = styled.div`
  display: flex;
  padding: 6px 7px 8px 9px;
  margin-bottom: 0.3rem;
  border-radius: 8px;
  background-color: ${(props: IProps) =>
    props.type === 'out_message' ? '#fff' : '#7FB3D5'};
`;
const Message = styled.span`
  overflow-wrap: break-word;
  white-space: pre-wrap;
  font-size: 14.2px;
  line-height: 19px;
  font-weight: 400;
  color: var(--message-clr);
  max-width: 567px;
  direction: rtl;
`;

const Time = styled.span`
  color: var(--message-time-clr);
  font-size: 11px;
  margin: 5px;
  text-align: center;
  display: ${(props: IProps) => (props.messageType !== 'text' ? 'none' : '')};
`;

const ImageTime = styled.span`
  display: flex;
  color: var(--message-time-clr);
  font-size: 11px;
  margin: 5px;
  text-align: center;
  position: absolute;
  color: #fff;
  height: 95%;
  align-items: end;
  direction: ltr;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
`;
const ChatImage = styled.img`
  width: 250px;
  height: 320px;
  filter: brightness(85%);
  cursor: pointer;
`;
