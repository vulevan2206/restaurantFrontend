import { Toaster } from "@/components/ui/toaster";
import useRouteElement from "@/hooks/useRouteElement";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function App() {
  const routes = useRouteElement();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);
  return (
    <div className="relative">
      {routes} <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </div>
  );
}

export default App;
