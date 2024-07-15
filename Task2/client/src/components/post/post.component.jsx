import { formatISO9075 } from "date-fns";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "../../UserContext";
import "./post.styles.css";

const Post = ({ _id, title, summary, cover, content, createdAt, author }) => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (!userInfo) {
      e.preventDefault();
      navigate("/auth/login");
    }
  };

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`} onClick={handleClick}>
          <img src={"http://localhost:4000/" + cover} alt="" />
        </Link>
      </div>
      <div className="texts">
        <Link to={`/post/${_id}`} onClick={handleClick}>
          <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">{author.username}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="summary">{summary}</p>
      </div>
    </div>
  );
};

export default Post;
