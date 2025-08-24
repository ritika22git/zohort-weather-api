const fetch = require("node-fetch");

async function fetchWithRetry(url, options = {}, retries = 3, delay = 500) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      if (retries > 0 && res.status >= 500) {
        console.log(`Retrying... attempts left: ${retries}`);
        await new Promise((r) => setTimeout(r, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw new Error(`HTTP Error: ${res.status}`);
    }

    return res;
  } catch (err) {
    if (retries > 0) {
      console.log(`Retrying due to error: ${err.message}, left: ${retries}`);
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw err;
  }
}

module.exports = fetchWithRetry;
