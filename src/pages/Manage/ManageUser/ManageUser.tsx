import { getUsers } from "@/apis/user.api";
import AvatarCustom from "@/components/dev/AvatarCustom";
import InputCustom from "@/components/dev/Form/InputCustom";
import Paginate from "@/components/dev/PaginationCustom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { path } from "@/constants/path";
import useUserQueryConfig from "@/hooks/useUserQueryConfig";
import DialogUser from "@/pages/Manage/ManageUser/components/DialogUser";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createSearchParams, useNavigate } from "react-router-dom";

export default function ManageUser() {
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = form.handleSubmit((values) => {
    const email = values.email;
    if (email.trim().length === 0) return;
    navigate({
      pathname: path.manageUser,
      search: createSearchParams({
        ...queryConfig,
        email,
      }).toString(),
    });
  });

  const queryConfig = useUserQueryConfig();
  const { data: users } = useQuery({
    queryKey: ["users", queryConfig],
    queryFn: () => getUsers(queryConfig),
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold mb-1">Nhân viên</p>
          <p className="text-sm italic">Quản lý nhân viên</p>
        </div>
        <div>
          <DialogUser />
        </div>
      </div>
      <div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <InputCustom
                  control={form.control}
                  name="email"
                  placeholder="Nhập email để tìm kiếm"
                />
              </div>
              <div className="col-span-2">
                <Button>Tìm kiếm</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <Separator className="my-2" />
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tình trạng</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-semibold">
            {users && users?.data.data.content.length > 0 ? (
              users.data.data.content.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>
                    <AvatarCustom url={user.avatar} className="size-16" />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.password}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.isActive ? "Sử dụng" : "Đã khóa"}</TableCell>
                  <TableCell>
                    <DialogUser user={user} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center italic py-4">
                  Không có nhân viên phù hợp
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div>
        <Paginate
          path={path.manageUser}
          queryConfig={queryConfig}
          pageSize={users?.data.data.pagination.pageSize as number}
          totalSize={users?.data.data.pagination.total as number}
        />
      </div>
    </div>
  );
}
