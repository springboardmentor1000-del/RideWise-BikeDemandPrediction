import React, { useState, useEffect } from "react";

export default function AuthTest() {
  const backend = `${process.env.REACT_APP_API_BASE_URL}/api/accounts`; // ✅ use localhost, not 127.0.0.1

  const [csrfToken, setCsrfToken] = useState("");

  // Automatically fetch CSRF token on load
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`${backend}/get_csrf_token/`, {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Fetched CSRF Token →", data);
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.error("Error fetching CSRF:", err);
      }
    };
    fetchToken();
  }, [backend]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-orange-400 mb-10">
        🧪 Django Session Auth Test Platform
      </h1>

      {/* Show CSRF token preview */}
      <div className="text-center mb-6 text-sm text-gray-400">
        <p>
          <strong>CSRF Token:</strong>{" "}
          <span className="text-green-400">{csrfToken || "Fetching..."}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <SignupSection backend={backend} csrfToken={csrfToken} />
        <SigninSection backend={backend} csrfToken={csrfToken} />
        <GetUserSection backend={backend} />
        <SignoutSection backend={backend} csrfToken={csrfToken} />
      </div>
    </div>
  );
}

// ============================================================
// 🔹 Signup Section
// ============================================================
function SignupSection({ backend, csrfToken }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);

  const signup = async () => {
    try {
      const res = await fetch(`${backend}/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      console.log("Signup →", data);
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <ApiCard title="Sign Up API" color="blue">
      <Input label="Username" value={username} setValue={setUsername} />
      <Input label="Email" value={email} setValue={setEmail} />
      <Input
        label="Password"
        type="password"
        value={password}
        setValue={setPassword}
      />
      <ActionButton label="Send Signup Request" color="blue" onClick={signup} />
      <ResponseBox data={response} />
    </ApiCard>
  );
}

// ============================================================
// 🔹 Signin Section
// ============================================================
function SigninSection({ backend, csrfToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);

  const signin = async () => {
    try {
      const res = await fetch(`${backend}/signin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log("Signin →", data);
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <ApiCard title="Sign In API" color="green">
      <Input label="Username" value={username} setValue={setUsername} />
      <Input
        label="Password"
        type="password"
        value={password}
        setValue={setPassword}
      />
      <ActionButton label="Send Signin Request" color="green" onClick={signin} />
      <ResponseBox data={response} />
    </ApiCard>
  );
}

// ============================================================
// 🔹 Get User Section
// ============================================================
function GetUserSection({ backend }) {
  const [response, setResponse] = useState(null);

  const getUser = async () => {
    try {
      const res = await fetch(`${backend}/get_user/`, {
        credentials: "include",
      });
      const data = await res.json();
      console.log("GetUser →", data);
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <ApiCard title="Get Current User API" color="yellow">
      <ActionButton label="Check User Session" color="yellow" onClick={getUser} />
      <ResponseBox data={response} />
    </ApiCard>
  );
}

// ============================================================
// 🔹 Signout Section
// ============================================================
function SignoutSection({ backend, csrfToken }) {
  const [response, setResponse] = useState(null);

  const signout = async () => {
    try {
      const res = await fetch(`${backend}/signout/`, {
        method: "POST",
        headers: { "X-CSRFToken": csrfToken },
        credentials: "include",
      });
      const data = await res.json();
      console.log("Signout →", data);
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    }
  };

  return (
    <ApiCard title="Sign Out API" color="red">
      <ActionButton label="Send Signout Request" color="red" onClick={signout} />
      <ResponseBox data={response} />
    </ApiCard>
  );
}

// ============================================================
// 🧩 Reusable Components
// ============================================================
function ApiCard({ title, color, children }) {
  const colorMap = {
    blue: "border-blue-500 text-blue-400",
    green: "border-green-500 text-green-400",
    yellow: "border-yellow-500 text-yellow-400",
    red: "border-red-500 text-red-400",
  };
  const colorStyle = colorMap[color] || "border-gray-500 text-gray-400";

  return (
    <div className={`bg-gray-800 border-l-4 ${colorStyle} rounded-2xl shadow-lg p-6`}>
      <h2 className={`text-xl font-semibold mb-4 ${colorStyle}`}>{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, setValue, type = "text" }) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
}

function ActionButton({ label, color, onClick }) {
  const btnColor = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    red: "bg-red-600 hover:bg-red-700",
    purple: "bg-purple-600 hover:bg-purple-700",
  }[color];

  return (
    <button
      onClick={onClick}
      className={`mt-2 px-4 py-2 rounded font-semibold transition ${btnColor}`}
    >
      {label}
    </button>
  );
}

function ResponseBox({ data }) {
  if (!data) return null;
  return (
    <pre className="mt-4 bg-black/70 text-sm p-3 rounded overflow-auto max-h-48 border border-gray-700">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
