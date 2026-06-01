import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

import { auth, provider } from "../services/firebase";
import { Mail, Lock, User } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });

    return () => unsubscribe();
  }, [navigate]);

  const showError = (err) => {
    if (err.code === "auth/invalid-credential") {
      setError("Wrong email or password, or account does not exist.");
    } else if (err.code === "auth/email-already-in-use") {
      setError("This email already has an account. Please login.");
    } else if (err.code === "auth/weak-password") {
      setError("Password must be at least 6 characters.");
    } else if (err.code === "auth/invalid-email") {
      setError("Enter a valid email address.");
    } else {
      setError(err.message);
    }
  };

  const handleEmailAuth = async () => {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Enter email and password.");
      return;
    }

    if (isSignup && !username.trim()) {
      setError("Enter username.");
      return;
    }

    try {
      setLoading(true);

      if (isSignup) {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await updateProfile(result.user, {
          displayName: username,
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/dashboard");
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent. Check Inbox or Spam.");
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="login-page notion-login">
      <div className="login-card notion-login-card">
        <div className="login-avatar">🌿</div>

        <h1>{isSignup ? "Create Account" : "Welcome back!"}</h1>

        <p>
          {isSignup ? "Start your" : "Sign in to open your"}{" "}
          <b>PingPlan AI Study Workspace</b>
        </p>

        {isSignup && (
          <>
            <label className="login-label">Username</label>
            <div className="login-input-wrap">
              <User size={18} />
              <input
                placeholder="Enter username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </>
        )}

        <label className="login-label">Email</label>
        <div className="login-input-wrap">
          <Mail size={18} />
          <input
            placeholder="Enter email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className="login-label">Password</label>
        <div className="login-input-wrap">
          <Lock size={18} />
          <input
            type="password"
            placeholder="Enter password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        <button className="continue-btn" onClick={handleEmailAuth}>
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
        </button>

        {!isSignup && (
          <button className="forgot-btn" onClick={resetPassword}>
            Forgot password?
          </button>
        )}

        <div className="login-divider">
          <span></span>
          or continue with
          <span></span>
        </div>

        <div className="login-options single-login-option">
          <button onClick={handleGoogleLogin}>
            <b>G</b>
            <span>Continue with Google</span>
          </button>
        </div>

        <p className="signup-text">
          {isSignup ? "Already have an account?" : "New user?"}{" "}
          <span
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
              setSuccess("");
            }}
          >
            {isSignup ? "Login" : "Create Account"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;