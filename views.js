import {
  Row,
  Col,
  Card,
  Checkbox,
  CardBody,
  CardFooter,
  CardActions,
  CardTitle,
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

export function FormPage({ url, title, action, fields, value } = {}) {
  function Field({ field }) {
    console.log(field);
    if (field.type === "input") {
      return Input({
        name: field.name,
        value: value[field.name],
        ...(field.props ?? {}),
      });
    } else if (field.type === "checkboxes") {
      return CheckboxGroup({
        name: field.name,
        value: value[field.name],
        ...(field.props ?? {}),
      });
    } else if (field.type === "checkbox") {
      return Checkbox({
        name: field.name,
        value: value[field.name],
        ...(field.props ?? {}),
      });
    } else if (field.type === "radios") {
      return RadioGroup({
        name: field.name,
        value: value[field.name],
        ...(field.props ?? {}),
      });
    } else {
      return field.type;
    }
  }

  return [
    Row({ my: "md" }, [
      Col({ col: true }, [title && View({ tag: "h3" }, title)]),
      Col({ col: 0 }, [
        // Button({ color: "primary", href: url + "/add" }, [
        //   Icon({ name: "plus" }),
        //   "Done",
        // ]),
      ]),
    ]),
    Form({ action }, [
      Card([
        View(
          {
            style:
              "padding: var(--size-sm); display: flex; align-items: center; gap: var(--size-sm);",
          },
          [
            Button({ size: "xl", link: true, onClick: "history.back()" }, [
              Icon({ name: "arrow-left" }),
            ]),
            CardTitle([title]),
          ]
        ),

        CardBody([fields.map((field) => Field({ field }))]),
        CardFooter([
          CardActions([
            ButtonGroup([
              Button({ type: "reset" }, "Reset"),
              Button({ color: "primary" }, "Submit"),
            ]),
          ]),
        ]),
      ]),
    ]),
  ];
}

export function TablePage({ title, url, data, columns, page, perPage, sort }) {
  return [
    Row({ my: "md" }, [
      Col({ col: true }, [title && View({ tag: "h3" }, title)]),
      Col({ col: 0 }, [
        Button({ color: "primary", href: url + "/add" }, [
          Icon({ name: "plus" }),
          "Add item",
        ]),
      ]),
    ]),
    Card([
      Table([
        TableHead([
          TableRow([
            ...columns.map((column) => TableCell(column.name)),
            TableCell({ style: "width: 0" }, "Actions"),
          ]),
          TableBody(
            data.map((row) =>
              TableRow([
                ...columns.map((column) => TableCell(row[column.key])),
                TableCell([
                  View({ style: "display: flex; gap: var(--size-sm)" }, [
                    Button({}, [Icon({ name: "eye" })]),
                    Button(
                      { href: url + "/" + row.id + "/edit", color: "warning" },
                      [Icon({ name: "pencil" })]
                    ),
                    Form({ action: "remove" }, [
                      Input({
                        style: "display: none",
                        type: "hidden",
                        name: "id",
                        value: row.id,
                      }),
                      Button({ color: "error" }, [Icon({ name: "trash" })]),
                    ]),
                  ]),
                ]),
              ])
            )
          ),
        ]),
      ]),
    ]),
  ];
}
