import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000/api/v0.1";

export const request = async ({
  method,
  route,
  body,
  auth = false,
  optimistic,
  rollback,
}) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    headers.Authorization = `Bearer ${localStorage.access_token}`;
  }

  try {
    if (optimistic) {
      optimistic(body);
    }

    const response = await axios.request({
      method, // => method: method,
      headers,
      url: route,
      data: body,
    });

    return response.data;
  } catch (error) {
    if (rollback) {
      rollback();
    }

    return {
      error: true,
      message: error.message,
    };
  }
};
