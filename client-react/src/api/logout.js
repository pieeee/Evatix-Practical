import axios from "axios";

export const logout = async () => {
  console.log("triggered");
  await axios.get("/api/logout");
  console.log("triggered");
};
