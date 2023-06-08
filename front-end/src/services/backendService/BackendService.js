import { api } from '..';
import { readFileAsText, withTimeout } from './utils';

// const fakeCondition = true;
const fakeTimeout = 1000;

// const someCondition = UserService.isLoggedIn() && fakeCondition;
const someCondition = true;

// TODO: implement on modal.
const mockBuyCredits = async (email, credits) => {
  return new Promise((resolve, reject) => {
    if (someCondition) {
      // TODO: POST REQUEST FOR CREDIT VALIDATION
      setTimeout(() => {
        console.log(`Credits bought! :>> (ID: ${email}, credits: ${credits}).`);
        resolve();
      }, fakeTimeout);
    } else {
      reject(new Error(`Failed to buy credits! Please retry in a few moments.`));
    }
  })
};


const mockCreateChart = async (fileInput, mode) => {
  mode = mode.toLowerCase();
  try {
    const jsonDataStr = await readFileAsText(fileInput); // read file to extract plot type info
    const jsonData = JSON.parse(jsonDataStr);

    const plotType = jsonData['__type__'];
    const plotTypes = process.env['REACT_APP_plot_types'].split(',');

    if (!plotTypes.includes(plotType)) {
      throw new Error(`__type__ should be on of [${plotTypes}]`);
    }

    const formData = new FormData();
    formData.append('file', fileInput);

    const create_server_url = process.env[`REACT_APP_${plotType}_api_url`];
    const url = `${create_server_url}/create?mode=${mode}`;

    if (mode === 'preview') {
      const response = await api.post(url, formData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' }
        });

      const imgBlob = new Blob([response.data], { type: 'image/jpeg' });

      console.log(`Chart preview fetched!`);
      return Promise.resolve(URL.createObjectURL(imgBlob));
    }

    if (mode === 'save') {
      await api.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      console.log(`Chart saved to DB!`);
    }

  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      const errorData = error.response.data;
      if (errorData instanceof Blob) {
        // responseType was set to blob, so need to read as text->json.
        const blobText = await errorData.text();
        errorMessage = JSON.parse(blobText).message;
      }
    }
    throw new Error(`Error creating chart: ${errorMessage}`);

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
    throw new Error(`Error downloading image: ${error.message}`);
  }
};


const mockDownloadJSONPreset = async (presetId) => {
  // const filename = `test${presetId}.json`;
  const url = `${process.env.REACT_APP_BACKEND_api_url}/preset/${presetId}`;

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


const mockFetchTableData = async (email) => {
  const url = `${process.env.REACT_APP_BACKEND_api_url}/charts/user/${email}`;
  try {
    const response = await withTimeout(api.get(url));

    console.log(`Table data fetched! :>> email: ${email}`);
    return Promise.resolve(response.data);
  } catch (error) {
    throw new Error(`Error fetching table data: ${error.message}`);
  }
};


const mockFetchUserInfo = async (email, force_reload = false) => {
  const userInfo = sessionStorage.getItem('userInfo');
  // first check session storage
  if (userInfo)
    return Promise.resolve(userInfo);

  try {
    const url = `${process.env.REACT_APP_uim_api_url}/user`;
    const response = await withTimeout(api.get(
      url, { params: { email: email, } }
    ))

    sessionStorage.setItem('userInfo', JSON.stringify(response.data));
    console.log(`User info fetched! :>> ${JSON.stringify(response.data)}`);
    if (force_reload) {
      window.location.reload();
    }
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};


const mockSaveUserToDB = async (email) => {
  try {
    const url = `${process.env.REACT_APP_uim_api_url}/newUser`;
    const response = await withTimeout(api.post(
      url,
      {
        params: {
          email: email,
          lastLoginTimestamp: Date.now()
        }
      }));

    console.log('response :>> ', response.data.msg);
  } catch (error) {
    let errorMessage = error.message;

    if (error.response) {
      if (error.response.data instanceof Object) { // if CustomAPIError
        errorMessage = errorMessage.msg;
      } else {
        errorMessage = errorMessage.response.data;
      }
    }
    throw new Error(
      `Error saving to DB: ${errorMessage}. Retry later.`
    );
  }
};



const buyCredits = mockBuyCredits;
const createChart = mockCreateChart;
const downloadImgFormat = mockDownloadImgFormat;
const downloadJSONPreset = mockDownloadJSONPreset;
const fetchChartPreview = mockFetchChartPreview;
const fetchTableData = mockFetchTableData;
const fetchUserInfo = mockFetchUserInfo;
const saveUserToDB = mockSaveUserToDB;


const BackendService = {
  buyCredits,
  createChart,
  downloadImgFormat,
  downloadJSONPreset,
  fetchChartPreview,
  fetchTableData,
  fetchUserInfo,
  saveUserToDB,
};

export default BackendService;
