import {
  getUserAvatarUrl,
  handleAvatarImgError,
} from "../../utils/userAvatar";

const UserAvatar = ({ user, src, className = "", alt = "" }) => (
  <img
    src={src || getUserAvatarUrl(user)}
    alt={alt || user?.name || "User"}
    className={className}
    onError={handleAvatarImgError}
  />
);

export default UserAvatar;
