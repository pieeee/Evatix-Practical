import axios from "axios";

export const signup = async (body) => {
  try {
    const response = await axios.post("/api/signup", body);
    return response.data.status;
  } catch (error) {
    throw error;
  }
};
