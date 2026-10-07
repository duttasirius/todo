import { User } from "../models/user.model.js";
import { getFirebaseAuth } from "../utils/firebase-admin.js";

export const loginWithGoogle = async (idToken: string) => {
  const decodedToken = await getFirebaseAuth().verifyIdToken(idToken);

  const email = decodedToken.email?.trim().toLowerCase();
  const uid = decodedToken.uid;
  const nameFromGoogle = decodedToken.name?.trim();

  if (!email || decodedToken.email_verified !== true) {
    throw new Error("A verified Google email is required");
  }

  let user = await User.findOne({ firebaseUid: uid }).select("+password");

  if (user && user.email !== email) {
    const conflictingUser = await User.findOne({ email }).select("+password");

    if (conflictingUser && conflictingUser._id.toString() !== user._id.toString()) {
      throw new Error("This email is already linked to another account");
    }

    user.email = email;
  }

  if (!user) {
    user = await User.findOne({ email }).select("+password");
  }

  if (!user) {
    return User.create({
      name: nameFromGoogle || email.split("@")[0] || "Google User",
      email,
      firebaseUid: uid,
      authProvider: "google",
    });
  }

  if (user.firebaseUid && user.firebaseUid !== uid) {
    throw new Error("This account is linked to a different Google account");
  }

  user.firebaseUid = uid;

  if (!user.name.trim() && nameFromGoogle) {
    user.name = nameFromGoogle;
  }

  await user.save();

  return user;
};
