import { getMe } from "@/apis/user.api";
import ChangePassword from "@/pages/Setting/components/ChangePassword";
import UserInformation from "@/pages/Setting/components/UserInformation";
import { useQuery } from "@tanstack/react-query";

export default function Setting() {
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });
  return (
    <div>
      <div className="mb-6">
        <p className="text-lg font-bold mb-1">Cài đặt</p>
        <p className="text-sm italic">Quản lý thông tin cá nhân</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <UserInformation me={me?.data.data} />
        </div>
        <div className="col-span-1">
          <ChangePassword />
        </div>
      </div>
    </div>
  );
}
