import { useEffect, useState } from "react";
import styled from "styled-components";
import MuiModal from "../assests/MUI/MuiModal";
import { useAppContext } from "../context/appContext";
import { IUser } from "../context/interfaces";

const Contact = ({
  profileImage,
  nickname,
  phone,
  id,
  username,
  contacts,
  token,
  aboutInfo,
}: IUser) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isContact, setIsContact] = useState(false);
  const [isActive, setIsActive] = useState(null);
  const { toggleChat, user, toggleContact, contact } = useAppContext();

  const contactCheck = contacts.filter(
    (contact) => contact.userId === user?.id
  );

  const contactStatus = contactCheck?.map((contact) => contact.status);

  const contactDisplayMessage = contactCheck?.map(
    (contact) => contact.displayMessage
  );

  const date = new Date(contactDisplayMessage[0]?.sentAt!)
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLocaleLowerCase();

  const modalCondition =
    contactCheck.length < 1
      ? true
      : contactStatus.toString() === "contact"
      ? false
      : contactStatus.toString() === "requested"
      ? false
      : true;

  const contactValues = {
    profileImage,
    nickname,
    phone,
    id,
    username,
    contacts,
    token,
    aboutInfo,
  };

  const handleUserClick = () => {
    if (contactStatus.toString() === "contact" && contactCheck.length > 0) {
      toggleContact(contactValues);
      setIsActive(id);
      toggleChat();
    } else {
      setModalOpen(!modalOpen);
    }
  };

  useEffect(() => {
    if (contactCheck.length > 0) {
      setIsContact(true);
    }
  }, [contactCheck.length, id]);

  return (
    <Wrapper onClick={handleUserClick}>
      {modalCondition && modalOpen && (
        <MuiModal
          nickname={nickname}
          profileImage={profileImage}
          id={id}
          contactStatus={contactStatus}
          contactCheck={contactCheck}
        />
      )}
      <ContactContainer className={isActive === contact?.id ? "active" : ""}>
        <ContactImage src={profileImage} />
        <ContactDetails>
          <Name>{nickname}</Name>
          <Message>
            {isContact ? (
              <DisplayMessageContainer>
                <LastMessage>
                  {contactDisplayMessage[0].lastMessage}
                </LastMessage>
                <SentAt>{date}</SentAt>
              </DisplayMessageContainer>
            ) : (
              "Click here for more info"
            )}
          </Message>
        </ContactDetails>
      </ContactContainer>
    </Wrapper>
  );
};

export default Contact;

const Wrapper = styled.div`
  .active {
    background-color: var(--contact-hover);
  }
  display: flex;
  width: 100%;

  &:hover {
    background-color: var(--contact-hover);
    cursor: pointer;
  }
`;
const ContactContainer = styled.div`
  width: 100%;
  display: flex;
  padding: 1rem 1rem;
  border-top: 1px solid var(--clr-grey);
`;
const ContactImage = styled.img`
  width: 49px;
  height: 49px;
  border-radius: 50%;
`;
const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 0.7rem;
`;
const Name = styled.h4`
  font-size: 17px;
  font-weight: 400;
  line-height: 21px;
  color: var(--contact-name-clr);
  padding-bottom: 3px;
`;

const Message = styled.div`
  color: var(--contact-message-clr);
`;

const DisplayMessageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: var(--contact-message-clr);
`;
const LastMessage = styled.span`
  font-weight: 550;
`;
const SentAt = styled.p`
  margin-left: 25px;
`;
