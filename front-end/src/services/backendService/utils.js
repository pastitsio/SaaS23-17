const timeoutDuration = 10000;

export const withTimeout = (promise, timeout = timeoutDuration) => {
  return Promise.race([
    promise,
    new Promise((resolve, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
  ]);
};

export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContents = event.target.result;
      resolve(fileContents);
    };

    reader.onerror = (event) => {
      reject(event.target.error);
    };

    reader.readAsText(file);
  });
}
