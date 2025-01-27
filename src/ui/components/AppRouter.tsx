import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "./Layout";

const Home = lazy(() => import("../Home"));

const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          </Layout>
        }
      />
    </Routes>
  );
};

export default AppRouter;
