import { Outlet } from "react-router-dom";

import Header from "../components/header/header.component";

const Layout = () => {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
};

export default Layout;
