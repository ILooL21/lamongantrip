import { Outlet } from "react-router-dom";
import { Notifications } from "react-push-notification";

function App() {
  return (
    <>
      <Notifications />
      <Outlet />
    </>
  );
}

export default App;
