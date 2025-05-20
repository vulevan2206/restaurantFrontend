import AvatarCustom from "@/components/dev/AvatarCustom";
import ModeToggle from "@/components/dev/ModeToggle";
import { AppContext } from "@/contexts/app.context";
import { clearLS } from "@/utils/auth";
import { LogOutIcon } from "lucide-react";
import { useContext } from "react";

export default function ManageHeader() {
  const { reset, user } = useContext(AppContext);
  const handleLogout = () => {
    reset();
    clearLS();
  };
  return (
    <header className="h-header-height flex justify-end items-center px-8 border-b shadow-lg z-50">
      <div className="flex items-center space-x-4">
        <LogOutIcon onClick={handleLogout} className="cursor-pointer size-5" />
        <ModeToggle />
        <AvatarCustom url={user?.avatar} />
      </div>
    </header>
  );
}
