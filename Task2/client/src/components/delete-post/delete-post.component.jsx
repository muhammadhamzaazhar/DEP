import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./delete-post.styles.css";

const DeletePost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:4000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (response.ok) {
      navigate("/");
    }
  };

  const handleCancel = () => {
    navigate(`/post/${id}`);
  };

  return (
    <div className="delete-post-overlay">
      <div className="delete-post-dialog">
        <h2>Are you sure you want to delete this post?</h2>
        <div className="delete-post-buttons">
          <button className="confirm-btn" onClick={handleDelete}>
            Yes
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
