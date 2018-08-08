export function parse(cookie: string) {
  if (cookie) {
    const cookies: any = {};
    cookie.split("; ").map(cookie => {
      cookies[cookie.split("=")[0]] = cookie.split("=")[1];
    });
    return cookies;
  } else {
    return {};
  }
}

export function serialize(cookies: object) {
  if (Object.keys(cookies).length > 0) {
    let cookieString = "";
    Object.keys(cookies).forEach(cookieName => {
      cookieString +=
        (cookieString === "" ? "" : ";") +
        `${cookieName}=${cookies[cookieName]}`;
    });
    return cookieString;
  }
  return "";
}

export function add(cookie: string, name: string, value: string) {
  const cookies = parse(cookie);
  cookies[name] = value;
}

export function remove(cookie: string, name: string) {
  const cookies = parse(cookie);
  cookies[name] = ";Max-Age=-1";
}

export default {
  parse,
  serialize,
  add,
  remove
};
