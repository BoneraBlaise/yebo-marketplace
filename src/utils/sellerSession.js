import axios from "axios";
import { server } from "../server";
import { setSellerToken } from "../config/authStorage";
import { loadSeller } from "../redux/actions/user";

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

const shouldAttemptSellerResume = () => {
  try {
    return sessionStorage.getItem(SELLER_RESUME_SKIP_KEY) !== "1";
  } catch {
    return true;
  }
};

/** Re-establish seller session for logged-in customers who own a shop (same email). */
export const tryResumeSellerSession = () => async (dispatch, getState) => {
  if (!shouldAttemptSellerResume()) {
    return false;
  }
  try {
    const { data } = await axios.get(`${server}/shop/resume-session`, {
      withCredentials: true,
    });
    if (data?.token) {
      setSellerToken(data.token);
    }
    await dispatch(loadSeller());
    return getState().seller?.isSeller === true;
  } catch {
    return false;
  }
};

/** Establish seller session after login or activation — no full page reload */
export const establishSellerSession = async (dispatch, token) => {
  clearSellerSessionSkip();
  if (token) {
    setSellerToken(token);
  }
  await dispatch(loadSeller());
};

export default establishSellerSession;
