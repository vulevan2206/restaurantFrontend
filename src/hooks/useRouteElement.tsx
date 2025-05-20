import { path } from "@/constants/path";
import { AppContext } from "@/contexts/app.context";
import MainLayout from "@/layouts/MainLayout";
import ManageLayout from "@/layouts/ManageLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import ManageCategory from "@/pages/Manage/ManageCategory";
import ManageFood from "@/pages/Manage/ManageFood";
import ManageOrder from "@/pages/Manage/ManageOrder";
import ManageTable from "@/pages/Manage/ManageTable";
import ManageUser from "@/pages/Manage/ManageUser";
import Menu from "@/pages/Menu";
import MyOrder from "@/pages/MyOrder";
import Setting from "@/pages/Setting";
import Table from "@/pages/Table";
import { useContext } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.home} />;
}

function AdminProtectedRoute() {
  const { user } = useContext(AppContext);
  return user?.role === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to={path.manageOrder} />
  );
}

export default function useRouteElement() {
  const routeElement = useRoutes([
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      ),
    },
    {
      path: path.menu,
      index: true,
      element: (
        <MainLayout>
          <Menu />
        </MainLayout>
      ),
    },
    {
      path: path.table,
      index: true,
      element: (
        <MainLayout>
          <Table />
        </MainLayout>
      ),
    },
    {
      path: path.myOrder,
      index: true,
      element: (
        <MainLayout>
          <MyOrder />
        </MainLayout>
      ),
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.manage,
          element: <ManageLayout />,
          children: [
            {
              path: path.manageOrder,
              element: <ManageOrder />,
            },
            {
              path: path.manageSettings,
              element: <Setting />,
            },
            {
              path: "",
              element: <AdminProtectedRoute />,
              children: [
                {
                  path: path.manageTable,
                  element: <ManageTable />,
                },
                {
                  path: path.manageCategory,
                  element: <ManageCategory />,
                },
                {
                  path: path.manageFood,
                  element: <ManageFood />,
                },
                {
                  path: path.manageUser,
                  element: <ManageUser />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <MainLayout>
              <Login />
            </MainLayout>
          ),
        },
      ],
    },
  ]);
  return routeElement;
}
