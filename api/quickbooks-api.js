const OAuthClient = require('intuit-oauth');

const defaultParams = {
  clientId: process.env.QB_APP_ID,            // enter the apps `clientId`
  clientSecret: process.env.QB_APP_SECRET,    // enter the apps `clientSecret`
  environment: process.env.QB_APP_ENVIRONMENT,     // enter either `sandbox` or `production`
  redirectUri: process.env.QB_APP_REDIRECT_URI,      // enter the redirectUri
  logging: true                               // by default the value is `false`
}

/**
 * 
 * @param {any} [config] 
 */
function QuickbooksAPI (config = defaultParams) {
  
  /**
   * @type {OAuthClient}
   * @private
   */
  this._client = new OAuthClient(config);
  
  /**
   * @type {string}
   * @private
   */
  this._authURI = this._client.authorizeUri({
    scope: [OAuthClient.scopes.Accounting],
    state: 'black-hawk',
  });

  /**
   * 
   * @returns {string}
   */
  this.getAuthURI = function () {
    return this._authURI
  }

  /**
   * 
   * @returns {boolean}
   */
  this.hasValidToken = function () {
    return this._client.token.isAccessTokenValid();
  }
}

/**
 * 
 * @param {string} url 
 * @returns {Promise<any>}
 */
QuickbooksAPI.prototype.createToken = function (url) {
  return this._client.createToken(url);
}

/**
 * 
 * @param {string} entity
 * @param {string} id
 * @returns {Promise<any>}
 */
QuickbooksAPI.prototype.getEntity = function (entity, id) {
  const companyID = this._client.getToken().realmId;
  const url = this._client.environment == "sandbox"
    ? OAuthClient.environment.sandbox
    : OAuthClient.environment.production;
  
  return this._client.makeApiCall({url: `${url}v3/company/${companyID}/${entity}/${id}`})
}

/**
 * 
 * @param {string} sqlStm 
 * @param {string} [minorversion]
 * @returns {Promise<any>}
 */
QuickbooksAPI.prototype.query = function (sqlStm, minorversion) {
  const companyID = this._client.getToken().realmId;
  const url = this._client.environment == "sandbox"
    ? OAuthClient.environment.sandbox
    : OAuthClient.environment.production;
  
  return this._client.makeApiCall({url: `${url}v3/company/${companyID}/query?query=${sqlStm}&minorversion=${minorversion}`});
}

module.exports = {
  QuickbooksAPI
}