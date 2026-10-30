
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:4000/api";

function App() {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    project_name: "",
    project_type: "solar",
    location: "",
    start_date: "",
    end_date: "",
  });

  async function loadProjects() {
    try {
      const response = await axios.get(`${API}/projects`);
      setProjects(response.data);
    } catch {
      setMessage("Backend connect aagala. Server check pannunga.");
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API}/projects`, {
        ...form,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });

      setMessage("Project successfully created!");

      setForm({
        project_name: "",
        project_type: "solar",
        location: "",
        start_date: "",
        end_date: "",
      });

      await loadProjects();
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Project create panna mudiyala."
      );
    }
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold">Civil Progress Tracker</h2>
      <p className="text-secondary">
        Project Management & Daily Work Progress
      </p>

      {message && (
        <div className="alert alert-info">{message}</div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">
          Create New Project
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Project Name</label>
              <input
                className="form-control"
                name="project_name"
                value={form.project_name}
                onChange={handleChange}
                placeholder="Example: Solar Fencing Project"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Project Type</label>
              <select
                className="form-select"
                name="project_type"
                value={form.project_type}
                onChange={handleChange}
              >
                <option value="solar">Solar Project</option>
                <option value="road">Road Work</option>
                <option value="other">Other Civil Work</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                className="form-control"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter site location"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Date</label>
                <input
                  className="form-control"
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">End Date</label>
                <input
                  className="form-control"
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn btn-primary" type="submit">
              Create Project
            </button>
          </form>
        </div>
      </div>

      <h4 className="mb-3">Project List</h4>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Project</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.project_name}</td>
                <td>{project.project_type}</td>
                <td>{project.location || "-"}</td>
                <td>{project.status}</td>
              </tr>
            ))}

            {projects.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No projects available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
