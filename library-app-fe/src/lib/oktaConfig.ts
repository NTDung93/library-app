export const oktaConfig = {
    clientId: '0oadxqzh5lAMm42s15d7',
    issuer: 'https://dev-92772674.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
};