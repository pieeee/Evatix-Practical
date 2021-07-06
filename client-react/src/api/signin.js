import axios from "axios";

export const signin = async (signinFormData) => {
  try {
    const {
      data: { status, message },
    } = await axios.post("/api/signin", signinFormData);
    return { status, message };
  } catch (error) {
    throw error;
  }
};
