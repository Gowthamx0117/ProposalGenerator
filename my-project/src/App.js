import React, { useState } from 'react';
import './App.css';

function App() {
  // State to store user input category, description and similar projects
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [similarProjects, setSimilarProjects] = useState([]);
  const [error, setError] = useState(null);

  // Function to handle the form submission and API request
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous error message
    setError(null);

    try {
      // Sending the category and project description to Flask API
      const response = await fetch('http://127.0.0.1:8080/get_similar_projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, category }),
      });      

      // Check if the response is OK (status code 200)
      if (!response.ok) {
        throw new Error('Failed to fetch similar projects');
      }

      // Get the response JSON (list of similar projects)
      const data = await response.json();

      // Set similar projects data into state
      setSimilarProjects(data);
    } catch (error) {
      setError(error.message);
      console.error('There was an error:', error);
    }
  };

  return (
    <div className="App">
      <h1>Project Proposal Generator</h1>

      {/* Form to input the project category and description */}
      <form onSubmit={handleSubmit}>
        <label>
          Project Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Project Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            cols="50"
            required
          />
        </label>
        <br />
        <button type="submit">Find Similar Projects</button>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display Similar Projects */}
      {similarProjects.length > 0 && (
        <div>
          <h2>Most Similar Projects:</h2>
          <ul>
            {similarProjects.map((project, index) => (
              <li key={index}>
                <strong>Category:</strong> {project.Category} <br />
                <strong>Project Description:</strong> {project['Project Description']} <br />
                <strong>Solution Overview:</strong> {project['Solution Overview']} <br />
                <strong>Tools/Technologies Required:</strong> {project['Tools/Technologies Required']} <br />
                <strong>Industry Needs/Requirements:</strong> {project['Industry Needs/Requirements']} <br />
                <strong>Target Audience:</strong> {project['Target Audience']} <br />
                <strong>Expected Outcome:</strong> {project['Expected Outcome']} <br />
                <strong>Implementation Challenges:</strong> {project['Implementation Challenges']} <br />
                <hr />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
