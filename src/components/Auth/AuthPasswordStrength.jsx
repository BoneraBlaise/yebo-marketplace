import React, { useMemo } from "react";

export const PASSWORD_REQUIREMENTS = [
  { key: "length", test: (p) => p.length >= 8, text: "At least 8 characters" },
  { key: "upper", test: (p) => /[A-Z]/.test(p), text: "One uppercase letter" },
  { key: "lower", test: (p) => /[a-z]/.test(p), text: "One lowercase letter" },
  { key: "number", test: (p) => /\d/.test(p), text: "One number" },
  { key: "special", test: (p) => /[^A-Za-z0-9]/.test(p), text: "One special character" },
];

export function isPasswordPolicyValid(password) {
  return PASSWORD_REQUIREMENTS.every((req) => req.test(password || ""));
}

export function getPasswordPolicyErrors(password) {
  return PASSWORD_REQUIREMENTS.filter((req) => !req.test(password || "")).map(
    (req) => req.text
  );
}

const getStrength = (password) => {
  if (!password) return { level: 0, label: "" };
  const met = PASSWORD_REQUIREMENTS.filter((r) => r.test(password)).length;
  if (met <= 2) return { level: 1, label: "Weak" };
  if (met <= 3) return { level: 2, label: "Fair" };
  if (met <= 4) return { level: 3, label: "Good" };
  return { level: 4, label: "Strong" };
};

const AuthPasswordStrength = ({ password }) => {
  const { level, label } = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

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
        {PASSWORD_REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <li
              key={req.key}
              className={`text-[11px] ${
                met ? "text-green-600 dark:text-green-400" : "text-gray-400"
              }`}
            >
              {met ? "✓" : "○"} {req.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AuthPasswordStrength;
