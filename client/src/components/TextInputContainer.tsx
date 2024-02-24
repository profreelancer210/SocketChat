import styled from "styled-components";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useMutation } from "@apollo/client";
import { POST_MESSAGE } from "../graphql/mutations/chatMutations";
import { useAppContext } from "../context/appContext";
import { useEffect, useRef, useState } from "react";
import { GET_CHAT_MESSAGES } from "../graphql/queries/chatQueries";
import Picker from "emoji-picker-react";

interface IProps {
  toggleContactInfo: boolean;
  uploadImage: (file: any) => void;
  imageUrl?: string | null;
}




const TextInputContainer = ({
  toggleContactInfo,
  uploadImage,
  imageUrl,
}: IProps) => {
  const { user, contact } = useAppContext();
  const [messageInput, setMessageInput] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onEmojiClick = (event: React.MouseEvent, emojiObject: any) => {
    let message = messageInput;
    message += emojiObject.emoji;
    setMessageInput(message);
  };

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [postMessage] = useMutation(POST_MESSAGE, {
    variables: {
      usersId: [user?.id, contact?.id],
      messageContent: messageInput,
      messageType: "text",
    },
    refetchQueries: [
      {
        query: GET_CHAT_MESSAGES,
        variables: {
          users: [user?.id, contact?.id],
        },
      },
    ],
    fetchPolicy: "network-only",
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageInput("");
    setShowEmojiPicker(false);
    postMessage();
  };

  const onClickHandler = () => {
    if (imageInputRef?.current) {
      imageInputRef?.current?.click();
    }
  };

  const onUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadImage(e.target.files);
  };

  useEffect(() => {
    if (imageUrl) {
      setMessageInput(imageUrl);
    }
  }, [imageUrl]);

  return (
    <>
      <Wrapper onSubmit={onSubmit} toggleContactInfo={toggleContactInfo}>
        <InsertEmoticonIcon
          className="icon"
          onClick={handleEmojiPickerhideShow}
        />

        <Emoji onMouseLeave={() => setShowEmojiPicker(!showEmojiPicker)}>
          {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
        </Emoji>

        <OpenInNewIcon className="icon" onClick={onClickHandler} />
        <input
          type="file"
          ref={imageInputRef}
          style={{ display: "none" }}
          onChange={onUploadImage}
        />
        <Input
          toggleContactInfo={toggleContactInfo}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message"
          type="text"
        />
        <SubmitButton disabled={!messageInput} type="submit">
          <SendIcon className="icon" />
        </SubmitButton>
      </Wrapper>
    </>
  );
};

export default TextInputContainer;

const Input = styled.input<{ toggleContactInfo: boolean }>`
  width: ${(props) => (props.toggleContactInfo ? "40%" : "80%")};
  transition: 0.2s all;
  height: 45px;
  border-radius: 8px;
  background-color: var(--text-input-backgroundClr);
  color: var(--text-input-clr);
  border-color: transparent;
  padding-left: 1rem;
  outline: none;
`;

const Wrapper = styled.form<{ toggleContactInfo: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.toggleContactInfo ? "start" : "space-evenly"};
  align-items: center;
  width: 100%;
  height: 12%;
  padding: ${(props) => (props.toggleContactInfo ? "10px" : "15px ")};
  overflow: hidden;
  z-index: 1;
  background-color: var(--clr-grey);
  .icon {
    color: var(--clr-icon);
    font-size: 28px;
    cursor: pointer;
    margin: ${(props) => (props.toggleContactInfo ? "0.8rem" : "0.5rem")};
  }
`;



const SubmitButton = styled.button`
  outline: none;
  border-color: transparent;
  background: transparent;
`;

const Emoji = styled.div`
  position: absolute;
  bottom: 70px;
  left: 10px;
`;
