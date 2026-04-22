import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/root-layout";
import { HomePage } from "./pages/home-page";
import { SignInPage } from "./pages/signin-page";
import { SignUpPage } from "./pages/signup-page";
import { ChatPage } from "./pages/chat-page";
import { ProfilePage } from "./pages/profile-page";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "signin", Component: SignInPage },
      { path: "signup", Component: SignUpPage },
      { path: "chat", Component: ChatPage },
      { path: "profile", Component: ProfilePage },
      { path: "*", Component: NotFound },
    ],
  },
]);