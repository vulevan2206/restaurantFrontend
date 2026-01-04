import { leaveTable } from "@/apis/table.api";
import ModeToggle from "@/components/dev/ModeToggle";
import OrderProductSheet from "@/components/dev/OrderProductSheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { path } from "@/constants/path";
import { AppContext } from "@/contexts/app.context";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { AlignJustifyIcon, ChefHat } from "lucide-react";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const { tableNumber, customerName, resetUser } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState<boolean>(false); // Trạng thái Dialog Logout
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false); // Trạng thái Sidebar Mobile

  const navData = [
    { id: 1, title: "Trang chủ", to: path.home, canAppear: true },
    { id: 2, title: "Thực đơn", to: path.menu, canAppear: true },
    {
      id: 3,
      title: "Đơn hàng",
      to: path.myOrder,
      canAppear: !!tableNumber && !!customerName,
    },
    {
      id: 4,
      title: "Đăng nhập",
      to: path.login,
      canAppear: !tableNumber && !customerName,
    },
  ];

  const customerLogoutMutation = useMutation({
    mutationFn: (table_number: number) => leaveTable(table_number),
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    customerLogoutMutation.mutate(parseInt(tableNumber), {
      onSuccess: (res) => {
        toast({
          description: res.data.message,
        });
        resetUser();
        setIsOpen(false);
        setIsSheetOpen(false); // Đóng sidebar sau khi logout thành công
        navigate(path.home);
      },
    });
  };

  // Hàm tiện ích để đóng Sidebar nhanh
  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-header-height flex items-center justify-between px-12 shadow-lg bg-background text-foreground">
      <div>
        <div className="flex items-center space-x-4">
          <Link to={path.home}>
            <ChefHat className="size-9" />
          </Link>
          <ul className="lg:flex hidden items-center space-x-2">
            {navData.map(
              (navItem) =>
                navItem.canAppear && (
                  <li key={navItem.id}>
                    <NavLink
                      to={navItem.to}
                      className={({ isActive }) =>
                        clsx(
                          "mx-2 text-md font-semibold hover:text-primary transition-colors",
                          {
                            "text-red-500": isActive,
                          }
                        )
                      }
                    >
                      {navItem.title}
                    </NavLink>
                  </li>
                )
            )}
          </ul>
          <div className="hidden lg:block">
            {!!tableNumber && !!customerName && (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <div className="cursor-pointer text-md font-semibold hover:text-danger transition-colors">
                    Đăng xuất
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-background text-foreground rounded-lg p-6 shadow-lg max-w-sm">
                  <p className="text-center font-semibold mb-4">
                    Bạn có chắc chắn muốn đăng xuất?
                  </p>
                  <p className="text-center mb-4 text-sm text-muted-foreground">
                    Nếu bạn đăng xuất, bạn sẽ không còn được xem các trạng thái
                    đơn hàng hiện tại của mình nữa, nhưng nhà hàng vẫn sẽ phục
                    vụ những món bạn đã đặt!
                  </p>
                  <div className="flex items-center justify-center space-x-2">
                    <Button variant="destructive" onClick={handleLogout}>
                      Đăng xuất
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <ModeToggle />
        <OrderProductSheet />
        <div className="lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <AlignJustifyIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="mt-8 flex flex-col space-y-4">
                {navData.map(
                  (navItem) =>
                    navItem.canAppear && (
                      <NavLink
                        key={navItem.id}
                        to={navItem.to}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          clsx(
                            "px-2 py-2 text-lg font-semibold hover:text-primary transition-colors",
                            {
                              "text-red-500 border-l-4 border-red-500 pl-4":
                                isActive,
                            }
                          )
                        }
                      >
                        {navItem.title}
                      </NavLink>
                    )
                )}

                {!!tableNumber && !!customerName && (
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <div className="cursor-pointer px-2 py-2 text-lg font-semibold text-destructive hover:opacity-80 transition-colors">
                        Đăng xuất
                      </div>
                    </DialogTrigger>
                    <DialogContent className="bg-background text-foreground rounded-lg p-6 shadow-lg max-w-sm">
                      <p className="text-center font-semibold mb-4">
                        Xác nhận đăng xuất?
                      </p>
                      <div className="flex justify-around space-x-2">
                        <Button
                          variant="destructive"
                          onClick={handleLogout}
                          className="flex-1"
                        >
                          Đăng xuất
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                          className="flex-1"
                        >
                          Hủy
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
