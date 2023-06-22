import { api } from '..';
import { withTimeout } from './utils';

// TODO: implement on modal.
const mockBuyCredits = async (email, credits) => {
  try {
    const url = `${process.env.REACT_APP_uim_api_url}/purchaseCredits`;
    const response = await withTimeout(api.post(
      url,
      {
        params: { email: email, credits: credits }
      }));

    console.log('response :>> ', response.data.success);
  } catch (error) {
    throw new Error(error);
  }
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
      const response = await withTimeout(api.post(url, postData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      );
      console.log(`Chart preview fetched!`);

      const imgBlob = new Blob([response.data], { type: 'image/jpeg' });
      const downloadedURL = URL.createObjectURL(imgBlob);

      return Promise.resolve(downloadedURL);
    }

    // TODO: response type blob as well, for uniform error handling
    if (mode === 'save') {
      await withTimeout(api.post(url, postData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }));

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
  try {
    let responseFileType;
    if (fileFormat === 'svg') { responseFileType = 'image/svg+xml' }
    else if (fileFormat === 'png') { responseFileType = 'image/png' }
    else if (fileFormat === 'pdf') { responseFileType = 'application/pdf' }
    else { responseFileType = 'text/html' }

    const url = `${process.env.REACT_APP_dl_api_url}/download/${blobFilepath}?format=${fileFormat}`;
    const response = await withTimeout(api.get(url,
      {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    );
    console.log(`Chart preview fetched!`);

    const imgBlob = new Blob([response.data], { type: responseFileType });
    const downloadedURL = URL.createObjectURL(imgBlob);

    return Promise.resolve(downloadedURL);

  } catch (error) {
    console.log('error :>> ', error);
    if (!error.response) {
      throw new Error(`Error fetching chart preview: ${error.message}`);
    }
    throw new Error(`Error fetching chart preview: ${error.response.data}`);
  }
};


const fetchTableData = async (email) => {
  try {
    const url = `${process.env.REACT_APP_cim_api_url}/chartInfo/${email}`;
    const response = await withTimeout(api.get(url));

    console.log(`Table data fetched! :>> email: ${email}`);

    return Promise.resolve(response.data.result);
  } catch (error) {
    if (!error.response.data.success) {
      throw new Error(`No charts found! Create one`);
    }
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

export {
  buyCredits,
  createChart,
  downloadPreset,
  fetchChart,
  fetchTableData,
  fetchUserInfo,
  saveUserToDB,
};

