import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  console.log('Code received:', code);
  
  if (!code) {
    return Response.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams();
    params.append('client_id', 'Ov23linpIVGxsLEre72t');
    params.append('client_secret', '3ec15acece024a85c4c9c32a0fc010bca0aecaf3');
    params.append('code', code);

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: params.toString(),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token response:', tokenData);
    
    if (tokenData.error) {
      return Response.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
    }
    
    const accessToken = tokenData.access_token;
    
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });

    const userData = await userResponse.json();
    console.log('User data:', userData);

    const user = {
      id: userData.id,
      name: userData.name || userData.login,
      email: userData.email,
      avatar: userData.avatar_url,
      username: userData.login,
    };

    const userJson = JSON.stringify(user);
    
    const html = '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
      '<script>' +
      'const user = ' + userJson + ';' +
      'const token = "' + accessToken + '";' +
      'localStorage.setItem("user", JSON.stringify(user));' +
      'localStorage.setItem("token", token);' +
      'window.location.href = "http://localhost:3000/dashboard";' +
      '</script>' +
      '</head>' +
      '<body>Redirecting...</body>' +
      '</html>';

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Authentication failed: ' + error.message }, { status: 500 });
  }
}
