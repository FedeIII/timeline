export async function getUser(cookies) {
  const handshakeReq = await fetch(
    'https://timeline-service.herokuapp.com/handshake',
    { credentials: 'include' }
  );
  // const handshakeReq = await fetch('http://127.0.0.1:8080/handshake', {
  //   credentials: 'include',
  // });
  const envVars = await handshakeReq.json();
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
