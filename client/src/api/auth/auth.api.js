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

export const getDistributors = async () => {
  const response = await axiosInstance.get("/users/distributors");
  return response.data;
};

// DELETE USER
export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/delete/${id}`);
  return response.data;
};

// UPDATE USER
export const updateUser = async (id, data) => {
  const response = await axiosInstance.patch(`/users/update/${id}`, data);
  return response.data;
};


export const getSubDistributors = async () => {
  const response = await axiosInstance.get("/users/retailers");
  return response.data;
};
// UPDATE PASSWORD
export const updatePassword = async (id, password) => {
  const response = await axiosInstance.patch(`/users/update-password/${id}`, { password });
  return response.data;
};
