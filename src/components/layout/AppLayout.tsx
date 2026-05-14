import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-surface-950">
      <Navbar />
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
}
