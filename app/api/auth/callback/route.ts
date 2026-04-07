import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  
  if (!code) {
    return Response.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': Bearer ,
      },
    });

    const userData = await userResponse.json();

    const user = {
      id: userData.id,
      name: userData.name || userData.login,
      email: userData.email,
      avatar: userData.avatar_url,
      username: userData.login,
    };

    const redirectUrl = new URL('/dashboard', process.env.NEXT_PUBLIC_APP_URL);
    
    return new Response(
      '<!DOCTYPE html>' +
      '<html>' +
      '<head>' +
      '<script>' +
      "localStorage.setItem('user', '" + JSON.stringify(user) + "');" +
      "localStorage.setItem('token', '" + tokenData.access_token + "');" +
      "window.location.href = '" + redirectUrl.toString() + "';" +
      '</script>' +
      '</head>' +
      '<body>Redirecting...</body>' +
      '</html>',
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    return Response.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
