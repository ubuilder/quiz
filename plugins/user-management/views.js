import {
  Row,
  Col,
  Card,
  Avatar,
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
} from "@ulibs/components";

export function HomePage({ user }) {
  return Container({ size: "lg", mx: "auto" }, [
    Row([
      View({ ms: "auto", p: "md" }, [
        ButtonGroup({ ms: "auto" }, [
          user
            ? undefined
            : Button({ color: "primary", href: "/login" }, "Login"),
          Button({ color: "success", href: "/questions" }, "Questions"),
          user && Button({ color: "dark", href: "/admin" }, "Admin"),
        ]),
      ]),
    ]),
    Row([View({ py: "xl", my: "xl" }, ["Section 1 (links)"])]),
    Row([View({ py: "xl", my: "xl" }, "Section 2")]),
    Row([View({ py: "xl", my: "xl" }, "Section 3")]),
    Row([View({ py: "xl", my: "xl" }, "Section 4")]),
  ]);
}

export function LoginPage() {
  return Container({ size: "xs", px: "md", mx: "auto", mt: "xl", pt: "xl" }, [
    View({ tag: "form", method: "POST", action: "?login" }, [
      Card({ mt: "xl", title: "Login" }, [
        CardBody([
          Row([
            Col({ col: 12 }, Input({ name: "username", label: "Username" })),
            Col(
              { col: 12 },
              Input({ name: "password", type: "password", label: "Password" })
            ),
            // Col({col: 12}, Input({name: 'remember', label: 'Remember Me'})),
          ]),
        ]),
        CardFooter([
          Button({ color: "primary" }, "Login"),
          Button({ link: true, type: "button" }, "Forgot password"),
        ]),
      ]),
    ]),
    Button({ href: "/", my: "md", mx: "auto" }, "Go Back"),
  ]);
}

export function AdminLayout({ title, sidebar = [], user }, slots) {
  console.log("Admin Layout", sidebar);
  function Sidebar() {
    return View(
      {
        tag: "ul",
        style: "padding-left: 0; height: 100%;",
      },
      sidebar.map((item) =>
        View(
          {
            tag: "li",
            style:
              "list-style-type: none; padding: var(--size-xxs) var(--size-sm); color: var(--color-base-content)",
          },
          View({ tag: "a", href: item.href }, [
            Icon({ name: item.icon }),
            View(
              {
                style: "display: inline-block; padding-left: var(--size-xs);",
              },
              item.title
            ),
          ])
        )
      )
    );
  }

  function Header() {
    return View(
      {
        style:
          "padding-top: var(--size-xxs); padding-bottom: var(--size-xxs); background-color: var(--color-base-100); border-bottom: 1px solid var(--color-base-400);",
      },
      [
        Container({ size: "xl", mx: "auto" }, [
          // check if is logged in from props
          Row([
            Col({ col: true }),
            Col([
              user
                ? Avatar({ color: "dark", size: "sm" }, "HA")
                : Button({ href: "/login" }, "Login"),
            ]),
          ]),
        ]),
      ]
    );
  }

  function Body(props, slots) {
    return Container({ size: "xl", mx: "auto" }, slots);
  }

  return [
    View(
      {
        htmlHead: title ? `<title>${title}</title>` : "",
        style:
          "position: fixed; width: 240px; top: 0; left: 0; height: 100%; background-color: var(--color-base-100); border-right: 1px solid var(--color-base-400);",
      },
      [
        View({ style: "padding: var(--size-sm) var(--size-xxs)" }, "Logo"),
        Sidebar(),
      ]
    ),
    View({ style: "margin-left: 240px;" }, [Header(), Body({}, slots)]),
  ];
}

export function AdminPage({ user }, slot) {
  let content = View("No Access!");

  if (user) {
    content = View({ my: "md" }, [
      Row([
        Col({ col: true }, [
          View({ tag: "h3" }, `Welcome to dashboard ${user.name}!`),
        ]),
        Col({ col: 0 }, [
          View(
            { tag: "form", method: "POST", action: "?logout" },
            ButtonGroup([
              Button({ href: "/" }, "Home"),
              Button({ color: "error" }, "Logout"),
            ])
          ),
        ]),
      ]),
      Card({ mt: "md" }, [CardBody(slot)]),
    ]);
  }

  return Container({ size: "lg", mx: "auto", px: "md" }, [content]);
}
