import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BASE_APP_URL } from "@/constants/config";
import { tableStatus } from "@/constants/tableStatus";
import DialogDeleteTable from "@/pages/Manage/ManageTable/components/DialogDeleteTable";
import DialogTable from "@/pages/Manage/ManageTable/components/DialogTable";
import DialogUnlockSession from "@/pages/Manage/ManageTable/components/DialogUnlockSession";
import { Table as TableType } from "@/types/table.type";
import { generateQRCode } from "@/utils/utils";

interface Props {
  readonly tables: TableType[];
}

export default function TableDataTable({ tables }: Props) {
  return (
    <Table className="font-semibold">
      <TableHeader>
        <TableRow>
          <TableHead>Số bàn</TableHead>
          <TableHead>Sức chứa</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>QR</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tables.length > 0 ? (
          tables.map((table) => {
            const url = `${BASE_APP_URL}/table/${table.table_number}?token=${table.token}`;
            return (
              <TableRow key={table._id}>
                <TableCell>{table.table_number}</TableCell>
                <TableCell>{table.capacity}</TableCell>
                <TableCell>{tableStatus[table.status]}</TableCell>
                <TableCell>
                  <img src={generateQRCode(url)} alt="qr-code" />
                </TableCell>
                <TableCell className="space-x-2">
                  <DialogUnlockSession tableNumber={table.table_number} />
                  <DialogTable table={table} />
                  <DialogDeleteTable table_id={table._id} />
                </TableCell>
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={5}
              className="text-center py-4 italic"
            >
              Không có bàn ăn phù hợp
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
