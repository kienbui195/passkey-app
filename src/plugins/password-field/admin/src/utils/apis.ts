import axios from "axios";

const apis = {
  async get({ url, query }: { url: string; query?: string }) {
    return await axios.request({
      url: `${process.env.BE_URL}/${url}${query ? `?${query}` : ""}`,
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  },
  async post({ url, data }: { url: string; data?: any }) {
    return await axios.request({
      url: `${process.env.BE_URL}/${url}`,
      headers: {
        Accept: "application/json",
      },
      data: { ...data },
      method: "POST",
    });
  },
  async del({ url, id }: { url: string; id: number }) {
    return await axios.request({
      url: `${process.env.BE_URL}/${url}/${id}`,
      headers: {
        Accept: "application/json",
      },
      method: "DELETE",
    });
  },
  async update({ url, id, data }: { url: string; id: number; data?: any }) {
    return await axios.request({
      url: `${process.env.BE_URL}/${url}/${id}`,
      headers: {
        Accept: "application/json",
      },
      data,
      method: "PUT",
    });
  },
};

export default apis;
