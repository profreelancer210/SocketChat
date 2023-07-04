import styled from 'styled-components';
import { ChatsLayout } from '../components';

const Chats = () => {
  return (
    <Wrapper>
      <ChatsLayout />
    </Wrapper>
  );
};

export default Chats;

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: 1.2vw;
`;
