import { api } from '../';

const fakeCondition = true;
const fakeTimeout = 1000;

// const someCondition = UserService.isLoggedIn() && fakeCondition;
const someCondition = true;


// TODO: implement on modal.
const mockBuyCredits = async (_id, credits) => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      // TODO: POST REQUEST FOR CREDIT VALIDATION
      setTimeout(() => {
        console.log(`Credits bought! :>> (ID: ${_id}, credits: ${credits}).`);
        resolve();
      }, fakeTimeout);
    } else {
      reject(new Error(`Failed to buy credits! Please retry in a few moments.`));
    }
  })
};


const mockCreateChart = (fileInput) => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      // TODO: POST REQUEST FOR CREATION
      setTimeout(() => {
        resolve(3);
      }, fakeTimeout);
    } else {
      reject(new Error('Failed to validate file input! Please retry in a few moments'));
    }
  })
};


const mockDownloadImgFormat = async (chartId, format) => {
  const url = `/chart/${chartId}?format=${format}`;
  try {
    const response = await api.get(url, { responseType: 'blob' });
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
  const filename = `test${presetId}.json`;
  const url = `/data/${filename}`;

  try {
    const response = await api.get(url, { responseType: 'blob' });
    const urlHTML = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');

    link.href = urlHTML;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

    console.log(`File downloaded! :>> filename: ${filename}`);
  } catch (error) {
    return Promise.reject(new Error(`Error downloading file: ${error.message}`));
  }
};


const mockFetchChartPreview = async (chartId) => {
  const url = `/chart/${chartId}?preview=True`;
  try {
    const response = await api.get(url, { responseType: 'blob' });
    const imgBlob = new Blob([response.data], { type: 'image/png' });

    console.log(`Chart preview fetched! :>> chartId: ${chartId}`);
    return Promise.resolve(URL.createObjectURL(imgBlob));
  } catch (error) {
    return Promise.reject(new Error(`Error downloading image: ${error.message}`));
  }
};


const mockFetchTableData = async (_id) => {
  const url = `/charts/user/${_id}`;
  try {
    const response = await api.get(url);

    console.log(`Table data fetched! :>> userId: ${_id}`);
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(new Error(`Error fetching table data: ${error.message}`));
  }
};


const mockFetchUserInfo = async () => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      setTimeout(() => {
        const response = {
          new_user: true,
          _id: 1234567810,
          email: 'demos@testos.com',
          number_of_charts: 0,
          credits: 0,
          last_login: 1682970603153
        };

        sessionStorage.setItem('userInfo', JSON.stringify(response));
        resolve(response);
      }, fakeTimeout);
    } else {
      reject(new Error('Failed to fetch user info! Please retry in a few moments'));
    }
  });
};


const mockSaveUserToDB = async (_id) => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      // TODO: POST REQUEST FOR VALIDATION
      setTimeout(() => {
        console.log(`User saved to DB! :>> userId: ${_id}`);
        resolve();
      }, fakeTimeout);
    } else {
      reject(new Error(`Failed to save user ${_id} in database! Please retry in a few moments`));
    }
  })
};


const mockValidateFileInput = async (fileInput) => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      // TODO: POST REQUEST FOR VALIDATION
      setTimeout(() => { // 
        resolve();
      }, fakeTimeout);
    } else {
      reject(new Error('Failed to validate file input! Please retry in a few moments'));
    }
  })
};

const buyCredits = mockBuyCredits;
const createChart = mockCreateChart;
const downloadImgFormat = mockDownloadImgFormat;
const downloadJSONPreset = mockDownloadJSONPreset;
const fetchChartPreview = mockFetchChartPreview;
const fetchTableData = mockFetchTableData;
const fetchUserInfo = mockFetchUserInfo;
const saveUserToDB = mockSaveUserToDB;
const validateFileInput = mockValidateFileInput;

const FetchService = {
  buyCredits,
  createChart,
  downloadImgFormat,
  downloadJSONPreset,
  fetchChartPreview,
  fetchTableData,
  fetchUserInfo,
  saveUserToDB,
  validateFileInput,
};

export default FetchService;
