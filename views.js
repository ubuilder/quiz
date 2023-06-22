import {
  Row,
  Col,
  Card,
  Checkbox,
  CardBody,
  CardFooter,
  Container,
  Button,
  Modal,
  ModalBody,
  ButtonGroup,
  View,
  Icon,
  Input,
  Form,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@ulibs/components";

export function TablePage({ data, columns, page, perPage, sort }) {
  return Card([
    Table([
      TableHead([
        TableRow([
          ...columns.map((column) => TableCell(column.name)),
          TableCell("Actions"),
        ]),
        TableBody(
          data.map((row) =>
            TableRow([
              ...columns.map((column) => TableCell(row[column.key])),
              TableCell([
                Button({ color: "primary" }, [Icon({ name: "eye" })]),
                Button({ color: "warning" }, [Icon({ name: "pencil" })]),
                Button({ color: "danger" }, [Icon({ name: "trash" })]),
              ]),
            ])
          )
        ),
      ]),
    ]),
  ]);
}
