import { Cloudinary } from '@cloudinary/url-gen';
import axios from 'axios';
import { useState } from 'react';

export const useForm = (callback: () => void, initialState: any) => {
  const [values, setValues] = useState(initialState);

  const onChange = (e: React.ChangeEvent<any>): void => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e: React.ChangeEvent<any>): void => {
    e.preventDefault();
    callback();
  };

  return {
    values,
    onChange,
    onSubmit,
    setValues,
  };
};

export const useCloudinary = () => {
  const [publicId, setPublicId] = useState('');
  const [uploadImageLoading, setUploadImageLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState(null);

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dsrhwv8to',
    },
  });

  const myImage = cld.image(publicId);

  const uploadImage = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file[0]);
    formData.append('upload_preset', 'wrhqjxmr');
    setUploadImageLoading(true);
    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dsrhwv8to/image/upload',
        formData
      );
      setPublicId(response.data.public_id);
      setImageUrl(response.data.secure_url);
      setUploadImageLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return {
    publicId,
    uploadImageLoading,
    imageUrl,
    myImage,
    uploadImage,
    setImageUrl,
  };
};
