import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MuiLoader } from '../assests/MUI/MuiLoader';
import { useCloudinary } from '../utils/customHooks';
import { AdvancedImage } from '@cloudinary/react';
import { useAppContext } from '../context/appContext';

const ProfilePicture = ({ setValues, values }: any) => {
  const { user, isEditing } = useAppContext();
  const { imageUrl, uploadImageLoading, uploadImage, myImage } =
    useCloudinary();

  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageUrl && isEditing) {
      setValues({ ...values, imageUrl: imageUrl });
    }
  }, [imageUrl, isEditing, values, setValues]);

  const onClickHandler = () => {
    if (imageInputRef?.current) {
      imageInputRef?.current?.click();
    }
  };

  return (
    <>
      <ImageContainer>
        <ImageInput
          type='file'
          style={{ display: 'none' }}
          ref={imageInputRef}
          name='profileImage'
          accept='image/*'
          onChange={(e) => uploadImage(e.target.files)}
        />

        {uploadImageLoading ? (
          <Loading style={{ margin: '1rem' }}>
            <MuiLoader />
          </Loading>
        ) : imageUrl !== null ? (
          <>
            <ImageInput
              type='file'
              style={{ display: 'none' }}
              ref={imageInputRef}
              name='profileImage'
              accept='image/*'
              onChange={(e) => uploadImage(e.target.files)}
            />
            <AdvancedImage
              value={imageUrl}
              name='profileImage'
              className='user_image'
              cldImg={myImage}
              onClick={onClickHandler}
            />
          </>
        ) : (
          <UserImage src={user?.profileImage} onClick={onClickHandler} />
        )}
      </ImageContainer>
    </>
  );
};

export default ProfilePicture;
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .user_image {
    width: 200px;
    height: 200px;
    margin: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      filter: brightness(50%);
      transition: 0.3s all ease-out;
    }
  }
`;

const ImageInput = styled.input``;

const UserImage = styled.img`
  width: 200px;
  height: 200px;
  margin: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    filter: brightness(50%);
    transition: 0.3s all ease-out;
  }
`;

const Loading = styled.div``;
