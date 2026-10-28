import "./App.css";
import SummaryCard from "./Components/SummaryCard";
import JobApplicationCard from "./Components/JobApplicationCard";
import { useEffect, useState } from "react";

function App() {
  // Job applications
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: "Google",
      position: "Junior Web Developer",
      status: "interview",
    },
    {
      id: 2,
      company: "Innowise",
      position: "PHP Developer Intern",
      status: "applied",
    },
    {
      id: 3,
      company: "Microsoft",
      position: "Frontend Developer",
      status: "offer",
    },
  ]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  // Add application form state
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");

  // Login function
  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      setToken(data.token);
      fetchApplications(data.token);
      setPassword("");

      console.log("Login successful!");
    } catch (error) {
      console.error(error.message);
    }
  }


async function handleLogout() {
  setError("");

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/logout",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Logout failed.");
    }
  } catch (error) {
    setError(error.message);
    return;
  }

  setToken("");
  setApplications([]);
  setEmail("");
  setPassword("");
}


  async function fetchApplications(authToken) {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/job-applications",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load applications.");
      }

      setApplications(data.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  // Summary calculations
  const totalApplications = applications.length;

  const totalInterviews = applications.filter(
    (application) => application.status === "interview",
  ).length;

  const totalOffers = applications.filter(
    (application) => application.status === "offer",
  ).length;

  // Add application function
  
async function addApplication(event) {
  event.preventDefault();

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/job-applications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: company,
          position: position,
          status: "applied",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add application.");
    }

    // Reload the list from Laravel
    await fetchApplications(token);

    // Clear the form
    setCompany("");
    setPosition("");
  } catch (error) {
    console.error(error.message);
  }
}


async function deleteApplication(id) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/job-applications/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete application.");
    }

    await fetchApplications(token);
  } catch (error) {
    console.error(error.message);
  }
}

  // Change application status
  
async function changeApplicationStatus(id) {
  const application = applications.find(
    (application) => application.id === id
  );

  if (!application) {
    return;
  }

  let nextStatus;

  if (application.status === "applied") {
    nextStatus = "interview";
  } else if (application.status === "interview") {
    nextStatus = "offer";
  } else {
    nextStatus = "applied";
  }

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/job-applications/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update status.");
    }

    await fetchApplications(token);
  } catch (error) {
    console.error(error.message);
  }
}


  // Page UI
  return (
    <>
        {error && (
      <p className="error-message">
        {error}
      </p>
    )}
      <section className="applications">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {token && (
          <div>
            <p>Successfully logged in!</p>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </section>

      <header>
        <h1>Job Application Tracker</h1>
      </header>

      <section className="stats">
        <SummaryCard number={totalApplications} label="Total Applications" />

        <SummaryCard number={totalInterviews} label="Interviews" />

        <SummaryCard number={totalOffers} label="Offers" />
      </section>

      <section className="applications">
        <h2>Add an application</h2>

        <form onSubmit={addApplication}>
          <input
            type="text"
            placeholder="Company name"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Job position"
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            required
          />

          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="applications">
        <h2>My applications</h2>

        {applications.map((application) => (
          <JobApplicationCard
            key={application.id}
            company={application.company}
            position={application.position}
            status={application.status}
            onChangeStatus={() =>
              changeApplicationStatus(application.id)
            }
            onDelete={() =>
              deleteApplication(application.id)
            }
          />
        ))}
      </section>
    </>
  );
}

export default App;
