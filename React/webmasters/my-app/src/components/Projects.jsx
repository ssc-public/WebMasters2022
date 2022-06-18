import { useState, useEffect } from "react";

function Projects({ username }) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    getRepos(username).then((response) => {
      setRepos(response.data.repos);
    });
  }, [setRepos]);

  return (
    <div className="Projects">
      <h1>{username}'s repositories:</h1>
      <ul>
        {repos.map((repo) => (
          <li>{repo}</li>
        ))}
      </ul>
    </div>
  );
}

function getRepos(username) {
  // return fetch(`https://api.github.com/users/${username}/repos`);
  return new Promise((resolve, reject) => {
    resolve({ data: { repos: ["first repo", "second repo"] } });
  });
}

export default Projects;
