import { api } from '..';
import { withTimeout } from './utils';

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


const createChart = async (inputFile, plotType, chartData, mode) => {
  mode = mode.toLowerCase(); 
  try {
   
    const plotTypes = process.env['REACT_APP_plot_types'].split(',');

    if (!plotTypes.includes(plotType)) {
      throw new Error(`__type__ should be on of [${plotTypes}]`);
    }

    const postData = new FormData();
    postData.append('file', inputFile);
    postData.append('data', JSON.stringify(chartData));

    console.log('postData :>> ', postData);

    const create_server_url = process.env[`REACT_APP_${plotType}_api_url`];
    const url = `${create_server_url}/create?mode=${mode}`;

    if (mode === 'preview') {
      const response = await api.post(url, postData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' }
        });

      const imgBlob = new Blob([response.data], { type: 'image/jpeg' });

      console.log(`Chart preview fetched!`);
      return Promise.resolve(URL.createObjectURL(imgBlob));
    }

    if (mode === 'save') {
      await api.post(url, postData, { headers: { 'Content-Type': 'multipart/form-data' } });
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



const mockFetchChartPreview = (inputFile) => {
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


const fetchUserInfo = async (email, force_reload = false) => {
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


const saveUserToDB = async (email) => {
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
const downloadImgFormat = mockDownloadImgFormat;
const fetchChartPreview = mockFetchChartPreview;
const fetchTableData = mockFetchTableData;

const BackendService = {
  buyCredits,
  createChart,
  downloadImgFormat,
  fetchChartPreview,
  fetchTableData,
  fetchUserInfo,
  saveUserToDB,
};

export default BackendService;
