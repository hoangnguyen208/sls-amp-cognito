import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { Amplify, API, Auth } from 'aws-amplify'

const inter = Inter({ subsets: ['latin'] })

Amplify.configure({
  aws_project_region: 'eu-north-1', // (optional) Default region for project
  aws_cognito_region: 'eu-north-1', // (required) - Region where Amazon Cognito project was created
  aws_user_pools_id: 'eu-north-1_V23f5Prru', // (optional) -  Amazon Cognito User Pool ID
  aws_user_pools_web_client_id: '30aktds2h43cupsljn6f80bqqc', // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
  aws_mandatory_sign_in: 'enable', // (optional) - Users are not allowed to get the aws credentials unless they are signed in
  aws_cloud_logic_custom: [
    {
      name: 'api-sls', // (required) - API Name (This name is used used in the client app to identify the API - API.get('your-api-name', '/path'))
      endpoint: 'https://txwashxwkg.execute-api.eu-north-1.amazonaws.com/dev', // (required) -API Gateway URL + environment
      region: 'eu-north-1' // (required) - API Gateway region
    }
  ]
});

export default function Home() {
  const getUserData = async() => {
    const user = await Auth.currentAuthenticatedUser();
    const idToken = user.signInUserSession.idToken.jwtToken
    console.log('id token: ', idToken);
    const requestHeader = {
      headers: {
        Authorization: idToken
      },
      body: {
        email: user.attributes.email,
        name: user.attributes.name,
        age: 18
      }
    }
    const data = await API.post('api-sls', '/hello', requestHeader);
    console.log('Data: ', data);
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>AWS Serverless</h1>
      <Authenticator 
        loginMechanisms={['email']}
        signUpAttributes={['name']}
        socialProviders={['amazon', 'facebook', 'google']}
      >
        {
          ({ signOut, user}) => (
            <main>
              <h1>Hello {user.attributes.name} - {user.attributes.email}</h1>
              <p>secret msg</p>
              <button onClick={getUserData}>Call API</button>
              <br />
              <button onClick={signOut}>Sign Out</button>
            </main>
          )
        }
      </Authenticator>
    </>
  )
}
