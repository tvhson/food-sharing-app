import ApiManager from './ApiManager';
export const uploadPhoto = async (dataForm: any, token: any) => {
  try {
    const result = await ApiManager('media', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
      data: dataForm,
    });
    return result;
  } catch (error) {
    return error;
  }
};
