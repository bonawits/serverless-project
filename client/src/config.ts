// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3l2jmo8vje'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'sloanedev.eu.auth0.com', // Auth0 domain
  clientId: '3MRe5WgZ5tpoSmFnjVftCZO85W0dJwQ99', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
