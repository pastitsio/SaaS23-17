import { api } from '..';
import { withTimeout } from './utils'

// const fakeCondition = true;
const fakeTimeout = 1000;

// const someCondition = UserService.isLoggedIn() && fakeCondition;
const someCondition = true;

// TODO: implement on modal.
const mockBuyCredits = async (userId, credits) => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      // TODO: POST REQUEST FOR CREDIT VALIDATION
      setTimeout(() => {
        console.log(`Credits bought! :>> (ID: ${userId}, credits: ${credits}).`);
        resolve();
      }, fakeTimeout);
    } else {
      reject(new Error(`Failed to buy credits! Please retry in a few moments.`));
    }
  })
};


const mockCreateChartPreview = async (fileInput) => {
  const formData = new FormData();
  formData.append('file', fileInput);

  const url = `http://localhost:5003/create/`;
  try {
    const response = await api.post(url, formData,
      {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' }
      });

    const imgBlob = new Blob([response.data], { type: 'image/jpeg' });
    console.log('response.data :>> ', response.data);
    console.log(`Chart preview fetched!`);
    return Promise.resolve(URL.createObjectURL(imgBlob));
  } catch (error) {
    return Promise.reject(new Error(error));
  }
};


const mockDownloadImgFormat = async (chartId, format) => {
  const url = `/chart/${chartId}?format=${format}`;
  try {
    const response = await withTimeout(api.get(url, { responseType: 'blob' }));
    const urlHTML = window.URL.createObjectURL(new Blob([response.data]));

    // create and destroy hidden download button
    const link = document.createElement('a');
    link.href = urlHTML;
    link.setAttribute('download', `${chartId}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    console.log(`Chart downloaded! :>> chartId :${chartId}, format: ${format}`);
  } catch (error) {
    return Promise.reject(new Error(`Error downloading image: ${error.message}`));
  }
};


const mockDownloadJSONPreset = async (presetId) => {
  // const filename = `test${presetId}.json`;
  const url = `${process.env.REACT_APP_BACKEND_API_URL}/preset/${presetId}`;

  try {
    const response = await withTimeout(api.get(url, { responseType: 'blob' }));
    const urlHTML = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');

    const filename = `preset${presetId}.json`;

    link.href = urlHTML;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    console.log(`File downloaded! :>> filename: ${filename}`);
  } catch (errorBlob) {
    throw new Error(`Error downloading preset with ID: ${presetId}.`);    
  }
};


const mockFetchChartPreview = (fileInput) => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      // TODO: POST REQUEST FOR FETCH PREVIEW
      setTimeout(() => {
        resolve(3);
      }, fakeTimeout);
    } else {
      reject(new Error('Failed to validate file input! Please retry in a few moments'));
    }
  })
};


const mockFetchTableData = async (userId) => {
  const url = `${process.env.REACT_APP_BACKEND_API_URL}/charts/user/${userId}`;
  try {
    const response = await withTimeout(api.get(url));

    console.log(`Table data fetched! :>> userId: ${userId}`);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(new Error(`Error fetching table data: ${error.message}`));
  }
};


const mockFetchUserInfo = async (userId) => {
  const url = `${process.env.REACT_APP_BACKEND_API_URL}/user/${userId}`;
  try {
    const response = await withTimeout(api.get(url))

    sessionStorage.setItem('userInfo', JSON.stringify(response.data));
    console.log(`User info fetched! :>> userId :${response.data._id}`);
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.reject(new Error(`Error fetching user: ${error.message}`));
  }
};


const mockSaveUserToDB = async (userId) => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      // TODO: POST REQUEST FOR VALIDATION
      setTimeout(() => {
        console.log(`User saved to DB! :>> userId: ${userId}`);
        resolve();
      }, fakeTimeout);
    } else {
      reject(new Error(`Failed to save user ${userId} in database! Please retry in a few moments`));
    }
  })
};


const mockValidateFileInput = async (fileInput) => {
  const formData = new FormData();
  formData.append('file', fileInput);

  const url = process.env.REACT_APP_VALIDATE_API_URL;
  try {
    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Input validated!');
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};


const buyCredits = mockBuyCredits;
const createChartPreview = mockCreateChartPreview;
const downloadImgFormat = mockDownloadImgFormat;
const downloadJSONPreset = mockDownloadJSONPreset;
const fetchChartPreview = mockFetchChartPreview;
const fetchTableData = mockFetchTableData;
const fetchUserInfo = mockFetchUserInfo;
const saveUserToDB = mockSaveUserToDB;
const validateFileInput = mockValidateFileInput;

const BackendService = {
  buyCredits,
  createChartPreview,
  downloadImgFormat,
  downloadJSONPreset,
  fetchChartPreview,
  fetchTableData,
  fetchUserInfo,
  saveUserToDB,
  validateFileInput,
};

export default BackendService;
