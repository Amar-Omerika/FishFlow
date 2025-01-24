import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

const Layout: React.FC<ContainerProps> = ({ children }) => {
  return (
    <section>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* <Navbar /> */}
        <div style={{ color: "red" }}>aaaaa</div>
        {children}
      </div>
    </section>
  );
};

export default Layout;
