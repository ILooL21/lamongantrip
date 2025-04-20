import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import FormAuth from "./pages/AuthForm.jsx";
import ProfilePages from "./pages/ProfilePages.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import HomePages from "./pages/HomePages.jsx";
import ContactPages from "./pages/ContactPages.jsx";
import Dasboard from "./pages/admin/Dashboard.jsx";
import UserManagementPages from "./pages/admin/UserManagement.jsx";
import MailManagementPages from "./pages/admin/MailManagement.jsx";
import ArticleManagementPages from "./pages/admin/ArticleManagement.jsx";
import DestinationManagementPages from "./pages/admin/DestinationManagement.jsx";
import NotFound from "./pages/NotFound.jsx";
import ArticleListPages from "./pages/ArticleList.jsx";
import ArticleDetailPages from "./pages/ArticleDetail.jsx";
import DestinationListPages from "./pages/DestinationList.jsx";
import DestinationDetailPages from "./pages/DestinationDetail.jsx";
import DestinationRecomendationPages from "./pages/DestinationRecomendation.jsx";
import { registerSW } from "virtual:pwa-register";

import { GoogleOAuthProvider } from "@react-oauth/google";

registerSW();

window.pwaState = {
  deferredPrompt: null,
  onPromptReady: () => {}, // akan diisi nanti
};

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  window.pwaState.deferredPrompt = e;

  if (typeof window.pwaState.onPromptReady === "function") {
    window.pwaState.onPromptReady();
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    index: true,
    path: "/",
    element: <HomePages />,
  },
  {
    path: "/auth",
    element: <FormAuth />,
  },
  {
    path: "/contact-us",
    element: <ContactPages />,
  },
  {
    path: "/articles",
    element: <ArticleListPages />,
  },
  {
    path: "/article/:id",
    element: <ArticleDetailPages />,
  },
  {
    path: "/destination/:jenis?",
    element: <DestinationListPages />,
  },
  {
    path: "/destination/detail/:nama",
    element: <DestinationDetailPages />,
  },
  {
    path: "/rekomendasi-wisata",
    element: <DestinationRecomendationPages />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/profile",
        element: <ProfilePages />,
      },
      {
        path: "/admin",
        element: <AdminRoute />,
        children: [
          {
            path: "dashboard",
            element: <Dasboard />,
          },
          {
            path: "users",
            element: <UserManagementPages />,
          },
          {
            path: "mails",
            element: <MailManagementPages />,
          },
          {
            path: "articles",
            element: <ArticleManagementPages />,
          },
          {
            path: "destinations",
            element: <DestinationManagementPages />,
          },
        ],
      },
    ],
  },
  {
    path: "/not-found",
    element: <NotFound />,
  },
  {
    path: "*",
    element: (
      <Navigate
        to="/not-found"
        replace
      />
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </React.StrictMode>
  </Provider>
);
