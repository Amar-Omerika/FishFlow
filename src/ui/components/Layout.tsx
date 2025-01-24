import { ReactNode } from "react";
import NavBar from "./NavBar";

interface ContainerProps {
  children: ReactNode;
}

const Layout: React.FC<ContainerProps> = ({ children }) => {
  return (
    <section>
      <div>
        <NavBar />
        {children}
      </div>
    </section>
  );
};

export default Layout;
