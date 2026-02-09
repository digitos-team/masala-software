import axiosInstance from "../axiosInstance";

// REGISTER USER
export const registerUser = async (data) => {
  const response = await axiosInstance.post("/users/register", data);
  return response.data;
};

// LOGIN USER
export const loginUser = async (data) => {
  const response = await axiosInstance.post("/users/login", data);
  return response.data;
};

// LOGOUT USER
export const logoutUser = async () => {
  const response = await axiosInstance.post("/users/logout");
  return response.data;
};

// GET DISTRIBUTORS
export const getDistributors = async () => {
  const response = await axiosInstance.get("/users/distributors");
  return response.data;
};
