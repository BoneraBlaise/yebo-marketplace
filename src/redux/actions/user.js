import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response.data.message,
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};

// user update information
export const updateUserInformation = (name, email, phoneNumber, password) => async (dispatch) => {
  try {
    dispatch({
      type: "updateUserInfoRequest",
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `${server}/user/update-user-info`,
      {
        name,
        email,
        phoneNumber,
        password,
      },
      config
    );

    dispatch({
      type: "updateUserInfoSuccess",
      payload: data.user,
    });

    toast.success("Profile updated successfully!");
  } catch (error) {
    dispatch({
      type: "updateUserInfoFailed",
      payload: error.response?.data?.message || "Update failed",
    });
    toast.error(error.response?.data?.message || "Update failed");
  }
};

// update user avatar
export const updateUserAvatar = (avatar) => async (dispatch) => {
  try {
    dispatch({
      type: "updateUserAvatarRequest",
    });

    const { data } = await axios.put(
      `${server}/user/update-avatar`,
      { avatar },
      { withCredentials: true }
    );

    dispatch({
      type: "updateUserAvatarSuccess",
      payload: data.user,
    });

    toast.success("Avatar updated successfully!");
  } catch (error) {
    dispatch({
      type: "updateUserAvatarFailed",
      payload: error.response?.data?.message || "Avatar update failed",
    });
    toast.error(error.response?.data?.message || "Avatar update failed");
  }
};

// update user address
export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true }
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          successMessage: "User address updated succesfully!",
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response.data.message,
      });
    }
  };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await axios.delete(
      `${server}/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "User deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};

// Join commission program
export const joinCommissionProgram = () => async (dispatch) => {
  try {
    dispatch({ type: "joinCommissionRequest" });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: 'include',
    };

    const { data } = await axios.post(
      `${server}/commission/join-program`,
      {},
      config
    );

    // Update local user state immediately
    dispatch({ 
      type: "joinCommissionSuccess",
      payload: data
    });

    // Show success message
    toast.success("Successfully joined the commission program!");

    // Reload user data to ensure everything is in sync
    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: "joinCommissionFailed",
      payload: error.response?.data?.message || "Failed to join commission program"
    });
    toast.error(error.response?.data?.message || "Failed to join commission program");
  }
};
