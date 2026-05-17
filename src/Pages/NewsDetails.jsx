import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./NewsDetails.css";

function NewsDetails() {

  const location = useLocation();

  const article = location.state;

  const [comment, setComment] = useState("");

  const [comments, setComments] = useState([]);

  // ADD COMMENT
  const handleComment = async () => {

  if (
    comment.trim() === ""
  ) {

    return;
  }

  try {

    const response =
      await fetch(
        "http://localhost:8000/comment",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            newsTitle:
              article.title,

            comment:
              comment,
          }),
        }
      );

    const data =
      await response.json();

    alert(data.message);

    setComments([
      ...comments,
      comment,
    ]);

    setComment("");

  } catch (error) {

    console.log(error);
  }
};

  // IF NO ARTICLE
  if (!article) {

    return (

      <div className="details-page">

        <h2>No News Found</h2>

        <Link to="/dashboard">
          Go Back
        </Link>

      </div>
    );
  }

  return (

    <div className="details-page">

      {/* BACK BUTTON */}

      <Link
        to="/dashboard"
        className="back-btn"
      >
        ← Back
      </Link>

      {/* TITLE */}

      <h1>
        {article.title}
      </h1>

      {/* IMAGE */}

      <img
        src={
          article.urlToImage ||
          "https://via.placeholder.com/600x300"
        }
        alt="news"
        className="details-image"
      />

      {/* SOURCE */}

      <p>
        <b>Source:</b>{" "}
        {article.source?.name}
      </p>

      {/* DESCRIPTION */}

      <p className="description">

        {article.description}

      </p>

      {/* FULL NEWS */}

      <a
        href={article.url}
        target="_blank"
        rel="noreferrer"
        className="read-more"
      >

        Read Complete Article

      </a>

      {/* COMMENTS */}

      <div className="comments-section">

        <h2>
          Comments
        </h2>

        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
        />

        <button
          onClick={handleComment}
        >
          Add Comment
        </button>

        {/* COMMENT LIST */}

        <div className="comment-list">

          {comments.map(
            (item, index) => (

              <div
                key={index}
                className="comment"
              >

                {item}

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default NewsDetails;