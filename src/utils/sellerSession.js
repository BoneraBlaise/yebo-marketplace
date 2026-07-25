import { setSellerToken } from "../config/authStorage";
import { loadSeller } from "../redux/actions/user";

/** Establish seller session after login or activation — no full page reload */
export const establishSellerSession = async (dispatch, token) => {
  if (token) {
    setSellerToken(token);
  }
  await dispatch(loadSeller());
};

export default establishSellerSession;
