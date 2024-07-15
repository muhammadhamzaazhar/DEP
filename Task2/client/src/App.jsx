import { Route, Routes } from "react-router-dom";

import IndexPage from "./components/index-page/index-page.component";
import CreatePost from "./components/create-post/create-post.component";
import PostPage from "./components/post-page/post-page.component";
import EditPost from "./components/edit-post/edit-post.component";
import LoginAndRegister from "./components/login-register/login-register.component";
import DeletePost from "./components/delete-post/delete-post.component";
import Layout from "./utils/Layout";
import { UserContextProvider } from "./UserContext";
import "./App.css";

const App = () => {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route
            path="/auth/login"
            element={<LoginAndRegister formType="login" />}
          />
          <Route
            path="/auth/register"
            element={<LoginAndRegister formType="register" />}
          />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/delete/:id" element={<DeletePost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
};

export default App;
