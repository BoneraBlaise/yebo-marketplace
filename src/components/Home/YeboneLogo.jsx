import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import logoIcon from "../../Assests/Logo/logomobile.png";

/**
 * Icon-only mark + "Yebone" wordmark (never shows legacy logo text).
 */
const YeboneLogo = ({
  to = "/",
  size = "md",
  variant = "default",
  className,
  showText = true,
}) => {
  const sizes = {
    sm: { icon: "w-8 h-8", text: "text-lg" },
    md: { icon: "w-10 h-10", text: "text-xl" },
    lg: { icon: "w-12 h-12", text: "text-2xl" },
  };

  const textColor =
    variant === "light"
      ? "text-white"
      : "text-yebone-primary dark:text-white";

  const content = (
    <>
      <img
        src={logoIcon}
        alt=""
        aria-hidden
        className={classNames(sizes[size].icon, "object-contain shrink-0")}
      />
      {showText && (
        <span
          className={classNames(
            "font-Poppins font-bold tracking-tight",
            sizes[size].text,
            textColor
          )}
        >
          Yebone
        </span>
      )}
    </>
  );

  const classes = classNames("inline-flex items-center gap-2.5 shrink-0", className);

  if (to) {
    return (
      <Link to={to} className={classes} aria-label="Yebone home">
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
};

export default YeboneLogo;
