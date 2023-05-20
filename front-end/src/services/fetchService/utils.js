const timeoutDuration = 10000;

export const withTimeout = (promise, timeout = timeoutDuration) => {
  return Promise.race([
    promise,
    new Promise((resolve, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
  ]);
};
