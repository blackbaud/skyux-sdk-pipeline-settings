function logBrowserStackSession(session) {
  console.log(`


  ****************************************************************************************************
  Visit the following URL to view your BrowserStack results:
  https://app.blackbaud.com/browserstack/sessions/${session}
  ****************************************************************************************************

  `);
}

module.exports = logBrowserStackSession;
