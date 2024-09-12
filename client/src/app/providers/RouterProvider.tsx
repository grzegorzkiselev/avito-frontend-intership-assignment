import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { ADVERTISEMENTS_PROPS, CenteredLoader } from "../../shared";
import { AppLayout } from "../layout/ui/AppLayout";

const LazyOrdersPage =  lazy(() => import("../../pages/orders"));
const LazyAdvertisementsPage =  lazy(() => import("../../pages/advertisements"));
const LazyAdvertisementPage =  lazy(() => import("../../pages/advertisement"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={ADVERTISEMENTS_PROPS.slug} replace={true} />,
      },
      {
        path: "advertisements/",
        element: <Suspense fallback={<CenteredLoader />}><LazyAdvertisementsPage /></Suspense>,
      },
      {
        path: "advertisements/:id",
        element: <Suspense fallback={<CenteredLoader />}><LazyAdvertisementPage /></Suspense>,
      },
      {
        path: "orders/",
        element: <Suspense fallback={<CenteredLoader />}><LazyOrdersPage /></Suspense>,
      },
    ],
  },
  {
    path: "*",
    element: <p>Страница не найдена</p>,
  },
]);

export const BaseRouterProvider = () => {
  return <RouterProvider router={router} />;
};
