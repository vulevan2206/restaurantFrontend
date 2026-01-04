import { checkTableSession, unlockTableSession } from "@/apis/table.api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Unlock } from "lucide-react";
import { useState } from "react";

interface DialogUnlockSessionProps {
  tableNumber: number;
}

export default function DialogUnlockSession({
  tableNumber,
}: DialogUnlockSessionProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: sessionData, isLoading } = useQuery({
    queryKey: ["table-session", tableNumber],
    queryFn: () => checkTableSession(tableNumber),
    enabled: open,
  });

  const hasActiveSession = sessionData?.data.data.hasActiveSession;
  const activeSession = sessionData?.data.data.session;

  const unlockMutation = useMutation({
    mutationFn: unlockTableSession,
    onSuccess: (res) => {
      toast({
        description: res.data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["table-session"] });
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  const handleUnlock = () => {
    unlockMutation.mutate({
      table_number: tableNumber,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Unlock className="w-4 h-4 mr-2" />
          Quản lý phiên
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quản lý phiên đặt món - Bàn {tableNumber}</DialogTitle>
          <DialogDescription>
            Xem và mở khóa phiên đặt món của bàn
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-4 text-center">Đang kiểm tra...</div>
        ) : hasActiveSession ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Thông tin phiên hiện tại:
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-sm font-semibold text-gray-700 mb-2">Khách hàng: {activeSession?.customer_name}</span>{" "} 
                </p>
                <p>
                  <span className="text-sm font-semibold text-gray-700 mb-2">Mã khách: {activeSession?.customer_id}</span>{" "}
                  
                </p>
                <p>
                  <span className="text-sm font-semibold text-gray-700 mb-2">Đăng nhập lúc: {activeSession?.logged_in_at
                    ? new Date(activeSession.logged_in_at).toLocaleString(
                        "vi-VN"
                      )
                    : "N/A"}
                    </span>{" "}
                </p>
                <p>
                  <span className="text-sm font-semibold text-gray-700 mb-2">Hoạt động cuối: {activeSession?.last_activity
                    ? new Date(activeSession.last_activity).toLocaleString(
                        "vi-VN"
                      )
                    : "N/A"}
                    </span>{" "}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUnlock}
                variant="destructive"
                disabled={unlockMutation.isLoading}
                className="flex-1"
              >
                {unlockMutation.isLoading ? "Đang xử lý..." : "Mở khóa bàn"}
              </Button>
              <Button onClick={() => setOpen(false)} variant="outline">
                Hủy
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              * Mở khóa bàn sẽ cho phép người khác đăng nhập và đặt món
            </p>
          </div>
        ) : (
          <div className="py-4 text-center text-gray-500">
            Bàn này hiện không có phiên đặt món nào
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
