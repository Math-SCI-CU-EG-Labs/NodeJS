// curl -H "Content-type: application/json" http://localhost:8080/setUserData -X POST -d '{"name":"MG", "email":"mg", "age": 38}'
// curl http://localhost:8080/getUserData

/* eslint-env mocha */

const axios = require("axios");

// TEST_ENV contains the environment variables for our test server
const TEST_ENV = {
  PORT: 8080 // Assigned at runtime
};

// waitForURLReachable is a utility function that tries to GET a URL until it
// succeeds. It will throw an error if it cannot reach the URL within the
// provided `opts.timeout` (default: 1000ms)
async function waitForURLReachable(url, { timeout = 1000 } = {}) {
  const timeoutThreshold = Date.now() + timeout;
  while (true) {
    try {
      await axios.get(url);
      return true;
    } catch (err) {
      if (Date.now() > timeoutThreshold) {
        throw new Error(`URL ${url} not reachable after ${timeout}ms`);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}
exports.useInTest = function() {
  before(async function startTestServer() {
    // The test server's environment variables should be set to TEST_ENV as
    // declared at the top of the file, but:
    // 1. Assign PATH to the user's PATH so that the `node` binary can be found
    // 2. Assign PORT to a random free port
    const env = Object.assign({}, TEST_ENV, {
      PATH: process.env.PATH
    });
    await waitForURLReachable(`http://localhost:${env.PORT}`);
    // Create an axios instance that is configured to use the test server as its
    // base URL and expose it as `this.api`. This allows us to easily make
    // requests like `this.api.get('/todos')` from within our test files
    const api = axios.create({ baseURL: `http://localhost:${env.PORT}` });
    this.api = api;
  });
};
