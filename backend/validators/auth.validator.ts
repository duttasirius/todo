export const validateRegister = (
  name: string,
  email: string,
  password: string,
): string | null => {
  if (!name || name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!email || !email.includes("@")) {
    return "Valid email is required";
  }

  if (!password || password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

export const validateLogin = (
  email: string,
  password: string,
): string | null => {
  if (!email || !email.includes("@")) {
    return "Valid email is required";
  }

  if (!password) {
    return "Password is required";
  }

  return null;
};
