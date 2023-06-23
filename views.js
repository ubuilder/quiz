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

    const { name, component, props, text } = field;
    props.name = name;
    props.label = text;
    props.value = value[field.name];

    console.log({ props, component, fields });
    return (componentMap[component] ?? View)(props);
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
              "padding: var(--size-xs); display: flex; align-items: center; gap: var(--size-sm);",
          },
          [
            Button(
              {
                type: "button",
                size: "xl",
                link: true,
                onClick: "window.location = document.referrer",
              },
              [Icon({ name: "arrow-left" })]
            ),
            CardTitle([title]),
          ]
        ),

        CardBody([
          Row([
            Object.keys(fields).map((key) =>
              Col(
                {
                  col: fields[key].props.col,
                  colXs: fields[key].props.colXs,
                  colSm: fields[key].props.colSm,
                  colMd: fields[key].props.colMd,
                  colLg: fields[key].props.colLg,
                  colXl: fields[key].props.colXl,
                },
                Field({ field: fields[key] })
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
            ...columns.map((column) => TableCell(column.text)),
            TableCell({ style: "width: 0" }, "Actions"),
          ]),
          TableBody(
            data.map((row) =>
              TableRow([
                ...columns.map((column) => TableCell([row[column.name]])), // render function
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
