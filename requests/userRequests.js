import { handshakeRequest } from './handshakeRequest';

export async function getUser(cookies) {
  const envVars = (await handshakeRequest()) || {};
  const { OAUTH_COOKIE, ME_URL } = envVars;
  const userReq = await fetch(
    ME_URL +
      '?' +
      new URLSearchParams({
        token: cookies[OAUTH_COOKIE],
      }),
    { credentials: 'include' }
  );
  const user = await userReq.json();

  return user;
}
