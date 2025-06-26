export async function authFetch(url, options = {}) {
  const token = localStorage.getItem("devdiary_token");
  options.headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
  return fetch(url, options);
}
