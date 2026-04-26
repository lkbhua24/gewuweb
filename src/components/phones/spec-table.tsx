import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SpecRow {
  label: string;
  value: string;
}

interface SpecTableProps {
  title: string;
  specs: SpecRow[];
}

export function SpecTable({ title, specs }: SpecTableProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">{title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">参数项</TableHead>
            <TableHead>参数值</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specs.map((spec) => (
            <TableRow key={spec.label}>
              <TableCell className="text-muted-foreground text-sm">
                {spec.label}
              </TableCell>
              <TableCell className="text-sm">{spec.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
