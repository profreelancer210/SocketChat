import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';

interface IProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({ searchQuery, setSearchQuery }: IProps) => {
  return (
    <Wrapper>
      <InputContainer>
        <SearchIcon className='search-icon' />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search or start new chat'
        />
      </InputContainer>
    </Wrapper>
  );
};

export default SearchBar;

const Wrapper = styled.div`
  margin-left: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  .search-icon {
    position: absolute;
    color: var(--clr-icon);
    margin-left: 10px;
  }
`;

const Input = styled.input`
  width: 90%;
  height: 35px;
  padding-left: 4rem;
  border-radius: 8px;
  background-color: var(--clr-grey);
  border-color: transparent;
  outline: none;
`;
