import axios from "axios";

export const getProfile = async () => {
  const { data } = await axios.get("/api/profile");
  return data;
};

export const updateProfile = async (updateFormData) => {
  try {
    await axios.put("/api/profile", updateFormData);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProfile = async () => {
  try {
    await axios.delete("/api/profile");
  } catch (error) {
    console.log(error);
  }
};
