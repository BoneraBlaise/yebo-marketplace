import axios from "axios";
import { server } from "../server";
import { loadSeller, loadUser } from "../redux/actions/user";
import { syncVendorAuthToken } from "../config/vendorSession";

export const SELLER_RESUME_SKIP_KEY = "yebone_skip_seller_resume";

export const markSellerSessionSkipped = () => {
  try {
    sessionStorage.setItem(SELLER_RESUME_SKIP_KEY, "1");
  } catch {
    /* ignore */
  }
};

export const clearSellerSessionSkip = () => {
  try {
    sessionStorage.removeItem(SELLER_RESUME_SKIP_KEY);
  } catch {
    /* ignore */
  }
};

const shouldAttemptVendorResume = () => {
  try {
    return sessionStorage.getItem(SELLER_RESUME_SKIP_KEY) !== "1";
  } catch {
    return true;
  }
};

/**
 * Load vendor profile using the single user JWT.
 * Backend authenticateVendor resolves Shop from user.email.
 */
export const loadVendorProfile = () => loadSeller();

/** Resolve linked vendor profile after user login — single user JWT only. */
export const tryResumeSellerSession = () => async (dispatch, getState) => {
  if (!shouldAttemptVendorResume()) {
    return false;
  }
  try {
    const { data } = await axios.get(`${server}/shop/resume-session`, { withCredentials: true });
    if (data?.token) {
      syncVendorAuthToken(data.token);
    }
  } catch {
    /* User may not have a shop yet */
  }
  await dispatch(loadVendorProfile());
  return getState().seller?.isSeller === true;
};

/** After shop activation — sync user token and load vendor profile. */
export const establishSellerSession = async (dispatch, token) => {
  clearSellerSessionSkip();
  if (token) {
    syncVendorAuthToken(token);
  }
  await dispatch(loadUser());
  await dispatch(loadVendorProfile());
};

export default establishSellerSession;
