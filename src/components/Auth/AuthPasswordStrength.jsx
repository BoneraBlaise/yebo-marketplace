import React, { useMemo } from "react";

const getStrength = (password) => {
  if (!password) return { level: 0, label: "" };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { level: 1, label: "Weak" };
  if (score <= 2) return { level: 2, label: "Fair" };
  if (score <= 3) return { level: 3, label: "Good" };
  return { level: 4, label: "Strong" };
};

const AuthPasswordStrength = ({ password }) => {
  const { level, label } = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  const requirements = [
    { met: password.length >= 6, text: "At least 6 characters" },
    { met: /[A-Z]/.test(password) || /[a-z]/.test(password), text: "Letters" },
    { met: /\d/.test(password), text: "A number" },
  ];

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
          Password strength
        </span>
        <span
          className={`text-[11px] font-semibold ${
            level >= 4
              ? "text-green-600"
              : level >= 3
              ? "text-yellow-600"
              : "text-red-500"
          }`}
        >
          {label}
        </span>
      </div>
      <div className="auth-strength-bar">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={`auth-strength-segment ${
              level >= segment ? `is-active-${level}` : ""
            }`}
          />
        ))}
      </div>
      <ul className="mt-2 space-y-0.5">
        {requirements.map((req) => (
          <li
            key={req.text}
            className={`text-[11px] ${
              req.met ? "text-green-600 dark:text-green-400" : "text-gray-400"
            }`}
          >
            {req.met ? "✓" : "○"} {req.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthPasswordStrength;
