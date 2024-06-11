// https://www.w3schools.com/js/js_cookies.asp
export const getCookie = (cookieName) => {
  const name = cookieName + "=";
  const splitCookie = document.cookie.split(';');
  for(let i = 0; i <splitCookie.length; i++) {
    let c = splitCookie[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}