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
  RadioGroup,
  CheckboxGroup,
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
    let componentMap = {
      checkboxes: CheckboxGroup,
      checkbox: Checkbox,
      radios: RadioGroup,
      input: Input,
    };

    const { type, ...props } = field;
    props.value = value[field.name];
    let component = componentMap[type] ?? View;

    return component(props);
  }

  return [
    Row({ my: "md" }, [
      Col({ col: true }, [title && View({ tag: "h3" }, title)]),
    ]),
    Form({ action }, [
      Card([
        View(
          {
            style:
              "padding: var(--size-sm); display: flex; align-items: center; gap: var(--size-sm);",
          },
          [
            Button(
              {
                type: "button",
                size: "xl",
                link: true,
                onClick: "history.back()",
              },
              [Icon({ name: "arrow-left" })]
            ),
            CardTitle([title]),
          ]
        ),

        CardBody([
          Row([
            fields.map((field) =>
              Col(
                {
                  col: field.col,
                  colXs: field.colXs,
                  colSm: field.colSm,
                  colMd: field.colMd,
                  colLg: field.colLg,
                  colXl: field.colXl,
                },
                Field({ field })
              )
            ),
          ]),
        ]),
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
                ...columns.map((column) =>
                  TableCell([column.render(row[column.key])])
                ),
                TableCell([
                  View({ style: "display: flex; gap: var(--size-xxs)" }, [
                    Button({ size: "sm" }, [Icon({ name: "eye" })]),
                    Button(
                      {
                        size: "sm",
                        href: url + "/" + row.id + "/edit",
                        color: "warning",
                      },
                      [Icon({ name: "pencil" })]
                    ),
                    Form({ action: "remove" }, [
                      Input({
                        style: "display: none",
                        type: "hidden",
                        name: "id",
                        value: row.id,
                      }),
                      Button({ size: "sm", color: "error" }, [
                        Icon({ name: "trash" }),
                      ]),
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
