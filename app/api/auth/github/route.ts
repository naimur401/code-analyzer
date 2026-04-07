export async function GET() {
  const clientId = 'Ov23linpIVGxsLEre72t';
  const redirectUri = 'http://localhost:3000/auth/callback';
  
  const githubAuthUrl = 'https://github.com/login/oauth/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=repo,user';
  
  console.log('Redirect URI:', redirectUri);
  
  return Response.redirect(githubAuthUrl);
}
