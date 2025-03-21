import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

function GoogleLogin() {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
      alert("Login successful!");
    } catch (error) {
      console.error("Error:", error.message);
      alert("Error: " + error.message);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>Sign in with Google</button>
  );
}

export default GoogleLogin;
