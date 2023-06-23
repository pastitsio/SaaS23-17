import { api } from '..';
import { withTimeout } from './utils';

// TODO: implement on modal.
const validateCredits = async (email, credits) => {
  try {
    const url = `${process.env.REACT_APP_credit_validator_api_url}/creditValidation`;
    await withTimeout(
      api.get(url,
        {
          params: {
            email: email,
            price: credits
          }
        })
    );
    console.log('User is able to buy');

  } catch (err) {
    if (err.response) { // API Error
      if (err.response.status === 402) {
        throw new Error("Not enough credits! Consider buying some from the top right corner.");
      } else {
        throw new Error(err.response.data);
      }
    } else { // Network Error
      throw new Error(err.message);
    }
  }
};

const buyCredits = async (credits) => {

}


const createChart = async (inputFile, plotType, chartData, mode) => {
  mode = mode.toLowerCase();
  try {
    // plot type creators are on diff servers-ms's
    const plotTypes = process.env['REACT_APP_plot_types'].split(',');
    if (!plotTypes.includes(plotType)) {
      throw new Error(`__type__ should be on of [${plotTypes}]`);
    }

    const postData = new FormData();
    postData.append('file', inputFile);
    postData.append('data', JSON.stringify(chartData));

    const create_server_url = process.env[`REACT_APP_${plotType}_api_url`];
    // ! "save/preview" distinguishment is done through <mode>
    const url = `${create_server_url}/create?mode=${mode}`;
    const response = await withTimeout(
      api.post(url, postData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' }
        })
    );

    if (mode === 'preview') { // fetches newly created preview.
      console.log(`Preview created!`);

      const imgBlob = new Blob([response.data], { type: 'image/jpeg' });
      const downloadedURL = URL.createObjectURL(imgBlob);

      return Promise.resolve(downloadedURL);
    }
    if (mode === 'save') {
      console.log(`Chart saved to DB!`);
    }

  } catch (err) {
    let errorMessage;
    if (err.response) { // API Error => responseType is blob
      const res = await err.response.data.text();
      errorMessage = JSON.parse(res).msg;
    } else if (err.request) { // Network Error
      errorMessage = err.message;
    } else {
      errorMessage = 'Error setting up the request'
    }
    throw new Error(`Error creating chart: ${errorMessage}. Retry later!`);

  }
};


const downloadPreset = (plotType) => {
  const filename = `/presets/${plotType.split(' ').join('_').toLowerCase()}.csv`
  const link = document.createElement('a');
  link.href = filename;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
}


const fetchChart = async (blobFilepath, fileFormat) => {
  let responseFileType;
  switch (fileFormat) {
    case 'svg':
      responseFileType = 'image/svg+xml';
      break;
    case 'png':
      responseFileType = 'image/png';
      break;
    case 'pdf':
      responseFileType = 'application/pdf';
      break;
    default:
      responseFileType = 'text/html'
  }

  try {
    const url = `${process.env.REACT_APP_downloader_api_url}/download/${blobFilepath}?format=${fileFormat}`;
    const response = await withTimeout(
      api.get(url,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' }
        })
    );
    console.log(`Chart preview fetched!`);

    const imgBlob = new Blob([response.data], { type: responseFileType });
    const downloadedURL = URL.createObjectURL(imgBlob);

    return Promise.resolve(downloadedURL);

  } catch (err) {
    let errorMessage;
    if (err.response) { // API Error => responseType is blob
      const res = await err.response.data.text();
      errorMessage = JSON.parse(res).msg;
    } else if (err.request) { // Network Error
      errorMessage = err.message;
    } else {
      errorMessage = 'Error setting up the request'
    }
    throw new Error(`Error fetching chart: ${errorMessage}. Retry later!`);
  }
};


const fetchChartTableData = async (email) => {
  try {
    const url = `${process.env.REACT_APP_chart_info_manager_api_url}/chartInfo/${email}`;
    const response = await withTimeout(
      api.get(url)
    );
    console.log(`Table data fetched! :>> email: ${email}`);

    return Promise.resolve(response.data.result);

  } catch (err) {
    if (!err.response.data.success) { // API error
      throw new Error(`No charts found! Create one`);
    } else { // Network Error
      throw new Error(`Error fetching table data: ${err.message}`);
    }
  }
};


const fetchUserInfo = async (email, force_reload = false) => {
  // first check session storage
  const userInfo = sessionStorage.getItem('userInfo');
  if (userInfo)
    return Promise.resolve(userInfo);

  try {
    const url = `${process.env.REACT_APP_user_info_manager_api_url}/user`;
    const response = await withTimeout(
      api.get(url,
        {
          params: {
            email: email
          }
        })
    );
    console.log(`User info fetched! :>> ${JSON.stringify(response.data)}`);

    sessionStorage.setItem('userInfo', JSON.stringify(response.data));
    if (force_reload) {
      window.location.reload();
    }
  } catch (err) {
    throw new err(`Error fetching user: ${err.message}`);
  }
};


const saveUserToDB = async (email) => {
  try {
    const url = `${process.env.REACT_APP_user_info_manager_api_url}/newUser`;
    const response = await withTimeout(
      api.post(url,
        {
          params: {
            email: email,
            lastLoginTimestamp: Date.now()
          }
        })
    );

    console.log('response :>> ', response.data.msg);
  } catch (err) {
    let errorMessage;
    if (err.response) { // API Error
      errorMessage = err.response.data.msg;
    } else if (err.request) { // Network Error
      errorMessage = err.message;
    } else {
      errorMessage = 'Error setting up the request'
    }
    throw new Error(`Error saving user to DB: ${errorMessage + '. Retry later!'}`);
  }
};



export {
  buyCredits,
  createChart,
  downloadPreset,
  fetchChart,
  fetchChartTableData,
  fetchUserInfo,
  saveUserToDB,
  validateCredits
};

