import { useMutation, useQuery } from "@apollo/client";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import styled from "styled-components";
import { MuiAlert } from "../assests/MUI/MuiAlert";
import { MuiLoader } from "../assests/MUI/MuiLoader";
import { useAppContext } from "../context/appContext";
import { GET_USER } from "../graphql/queries/userQueries";
import { useForm } from "../utils/customHooks";
import { UPDATE_PROFILE } from "../graphql/mutations/userMutations";
import ProfilePicture from "./ProfilePicture";

const UserProfile = () => {
  const [toggleNameInput, setToggleNameInput] = useState(false);
  const [toggleAboutInput, setToggleAboutInput] = useState(false);
  const { toggleProfileEdit, isEditing } = useAppContext();

  const { values, onChange, onSubmit, setValues } = useForm(
    handleProfileUpdate,
    {}
  );

  const { loading, error } = useQuery(GET_USER, {
    onCompleted({ getUser }) {
      setValues({
        nickname: getUser.nickname,
        phone: getUser.phone,
        aboutInfo: getUser.aboutInfo,
        imageUrl: getUser.profileImage,
      });
    },
  });

  const [updateUserInfo, { loading: updateLoading }] = useMutation(
    UPDATE_PROFILE,
    {
      onCompleted() {
        toggleProfileEdit();
      },
    }
  );

  function handleProfileUpdate() {
    updateUserInfo({ variables: values });
    setToggleAboutInput(false);
    setToggleNameInput(false);
  }

  return (
    <Wrapper isEditing={isEditing}>
      <Header>
        <ProfileHeader>
          <ArrowBackIcon
            onClick={toggleProfileEdit}
            style={{ color: "#fff", cursor: "pointer" }}
          />
          <ProfileText>Profile</ProfileText>
        </ProfileHeader>
      </Header>
      {loading ? (
        <MuiLoader />
      ) : error ? (
        <MuiAlert type="error">{error?.message}</MuiAlert>
      ) : (
        <UserInfo>
          <Form onSubmit={onSubmit} id="form">
            <ProfilePicture values={values} setValues={setValues} />
            <FormRow>
              <FormTitle>Your name</FormTitle>
              <InputContainer>
                <Value
                  disabled={!toggleNameInput}
                  value={values?.nickname || ""}
                  name="nickname"
                  onChange={onChange}
                />
                <ToggleEdit>
                  {toggleNameInput ? (
                    <CloseIcon onClick={() => setToggleNameInput(false)} />
                  ) : (
                    <EditIcon onClick={() => setToggleNameInput(true)} />
                  )}
                </ToggleEdit>
              </InputContainer>
            </FormRow>
            <FormRow>
              <FormTitle>Phone Number</FormTitle>
              <InputContainer>
                <Value
                  disabled={!toggleNameInput}
                  value={values?.phone || ""}
                  name="phone"
                  onChange={onChange}
                />
                <ToggleEdit>
                  {toggleNameInput ? (
                    <CloseIcon onClick={() => setToggleNameInput(false)} />
                  ) : (
                    <EditIcon onClick={() => setToggleNameInput(true)} />
                  )}
                </ToggleEdit>
              </InputContainer>
            </FormRow>
            <Note>
              This is not your username. This name will be visible to your
              contacts only
            </Note>
            <FormRow>
              <FormTitle>About</FormTitle>
              <InputContainer>
                <Value
                  disabled={!toggleAboutInput}
                  value={values?.aboutInfo || ""}
                  name="aboutInfo"
                  onChange={onChange}
                />
                <ToggleEdit>
                  {toggleAboutInput ? (
                    <CloseIcon onClick={() => setToggleAboutInput(false)} />
                  ) : (
                    <EditIcon onClick={() => setToggleAboutInput(true)} />
                  )}
                </ToggleEdit>
              </InputContainer>
            </FormRow>

            {updateLoading ? (
              <Loading>
                <MuiLoader />
              </Loading>
            ) : (
              <ConfirmButton
                disabled={updateLoading}
                type="submit"
                className="button"
              >
                Confirm
              </ConfirmButton>
            )}
          </Form>
        </UserInfo>
      )}
    </Wrapper>
  );
};

export default UserProfile;

const Wrapper = styled.div<{ isEditing: boolean }>`
  width: ${(props) => (props.isEditing ? "30vw" : "0%")};
  opacity: ${(props) => (props.isEditing ? "1" : "0")};
  height: 95%;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
  background-color: var(--profile-edit-clr);
  position: fixed;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  height: 128px;
  background-color: var(--app-primary-dark-clr);
  padding-bottom: 1rem;
`;

const ProfileText = styled.p`
  color: white;
  font-weight: 500;
  letter-spacing: 1.5px;
  font-size: 19px;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-around;
  width: 35%;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const FormRow = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 1rem 2rem;
  background-color: var(--profile-form-clr);
  justify-content: center;
  margin-bottom: 1rem;
`;

const FormTitle = styled.p`
  font-size: 14px;
  color: var(--profile-edit-title);
  letter-spacing: 0.5px;
`;
const Value = styled.input`
  font-size: 16px;
  letter-spacing: 0.5px;
  font-weight: 500;
  color: var(--profile-edit-value);
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--app-primary-dark-clr);
  background: transparent;
  outline: none;
  &:disabled {
    border: none;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  width: 100%;
`;

const Note = styled.p`
  color: var(--clr-grey-2);
  text-align: center;
  margin-bottom: 2rem;
`;

const ToggleEdit = styled.span`
  color: var(--clr-icon-2);
  cursor: pointer;
`;
const ConfirmButton = styled.button`
  text-align: center;
  align-self: center;
  background-color: var(--profile-edit-btn);
`;

const Loading = styled.div`
  text-align: center;
  margin: 0 auto;
`;
