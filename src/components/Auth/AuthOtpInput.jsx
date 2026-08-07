import React, { useRef, useEffect } from "react";

const AuthOtpInput = ({ value, onChange, disabled, length = 6 }) => {
  const inputsRef = useRef([]);

  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const focusIndex = (index) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (index, char) => {
    const cleaned = char.replace(/\D/g, "").slice(-1);
    const next = digits.slice();
    next[index] = cleaned;
    onChange(next.join("").slice(0, length));
    if (cleaned && index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusIndex(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    onChange(pasted);
    focusIndex(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          className="auth-otp-digit w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-yebone-primary focus:ring-2 focus:ring-yebone-primary/20 outline-none transition"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
};

export default AuthOtpInput;
