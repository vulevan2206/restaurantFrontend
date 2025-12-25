import ManageHeader from "@/components/dev/ManageHeader";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { path } from "@/constants/path";
import { AppContext } from "@/contexts/app.context";
import { Tooltip } from "@radix-ui/react-tooltip";
import clsx from "clsx";
import {
  ChefHat,
  Cookie,
  Layers3Icon,
  SettingsIcon,
  ShoppingCartIcon,
  TableIcon,
  User,
} from "lucide-react";
import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function ManageLayout() {
  const { user } = useContext(AppContext);
  console.log(user);

  const navData = [
    {
      icon: <ChefHat strokeWidth={1.5} />,
      path: path.kitchen,
      canShow: user?.role === "CHEF",
      tooltip: "Bếp",
    },
    {
      icon: <ShoppingCartIcon strokeWidth={1.5} />,
      path: path.manageOrder,
      canShow: user?.role !== "CHEF",
      tooltip: "Đơn hàng",
    },
    {
      icon: <TableIcon strokeWidth={1.5} />,
      path: path.manageTable,
      canShow: user?.role === "ADMIN",
      tooltip: "Bàn ăn",
    },
    {
      icon: <Layers3Icon strokeWidth={1.5} />,
      path: path.manageCategory,
      canShow: user?.role === "ADMIN",
      tooltip: "Danh mục",
    },
    {
      icon: <Cookie strokeWidth={1.5} />,
      path: path.manageFood,
      canShow: user?.role === "ADMIN",
      tooltip: "Sản phẩm",
    },
    {
      icon: <User strokeWidth={1.5} />,
      path: path.manageUser,
      canShow: user?.role === "ADMIN",
      tooltip: "Người dùng",
    },
    {
      icon: <SettingsIcon strokeWidth={1.5} />,
      path: path.manageSettings,
      canShow: user?.role !== "CHEF",
      tooltip: "Cài đặt",
    },
  ];
  return (
    <div>
      <div>
        <div className="fixed top-0 left-0 h-[100vh] w-14 flex flex-col items-center pt-4">
          {navData.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx("inline-block p-2 rounded-md mb-3", {
                  "bg-secondary text-secondary-foreground": isActive,
                  "hover:bg-secondary hover:text-secondary-foreground":
                    !isActive,
                  hidden: !item.canShow,
                })
              }
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>{item.icon}</TooltipTrigger>
                  <TooltipContent>{item.tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </NavLink>
          ))}
        </div>
        <div className="ml-14">
          <ManageHeader />
          <div className="px-4 py-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
