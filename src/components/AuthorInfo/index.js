import React from "react";
import "./index.css";

function index({ author }) {
  console.log(author);
  return (
    <div className="author-info">
      <div>Name: {author.name}</div>
      <div>Location: {author.location}</div>
      <div>Bio: {author.description}</div>
      <div>
        Links:{" "}
        {author.userLinks.map((link) => (
          <span className="author-link">
            <a target="_blank" href={link.url}>
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  );
}

export default index;
