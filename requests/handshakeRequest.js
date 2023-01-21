export async function handshakeRequest() {
  const response = await fetch(
    'https://timeline-service.herokuapp.com/handshake',
    { credentials: 'include' }
  );
  // const response = await fetch('http://127.0.0.1:8080/handshake', {
  //   credentials: 'include',
  // });
  return response.json();
}
