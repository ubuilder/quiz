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
  console.log("Admin Layout", { sidebar, title, user });
  user = { name: "hadi", username: "hadi" };
  function Sidebar() {
    return View(
      {
        tag: "ul",
        ps: 0,
        h: 100,
      },
      sidebar.map((item) =>
        View(
          {
            tag: "li",
            style: "list-style-type: none",
          },
          View(
            {
              tag: "a",
              href: item.href,
              d: "flex",
              // color: base-800
              py: "xxs",
              p: "sm",
              style: "text-decoration: none; color: var(--color-base-800);",
            },
            [
              Icon({ name: item.icon }),
              View(
                {
                  ps: "xs",
                  d: "inline-block",
                },
                item.title
              ),
            ]
          )
        )
      )
    );
  }

  function Header() {
    return View(
      {
        py: 'xxs',
        style:
          "background-color: var(--color-base-100); border-bottom: 1px solid var(--color-base-400);",
      },
      [
        Container({ size: "xl", mx: "auto" }, [
          // check if is logged in from props
          Row({ align: "center" }, [
            Col({ col: true }),
            Col({ class: "hide-light" }, [
              Button({ onClick: "toggleTheme()" }, Icon({ name: "sun" })),
            ]),
            Col({ class: "hide-dark" }, [
              Button({ onClick: "toggleTheme()" }, Icon({ name: "moon" })),
            ]),
            user
              ? [
                  Col([Avatar({ color: "info" }, user.name.substring(0, 2))]),
                  Form(
                    { action: "logout" },
                    Col([Button({ color: "error" }, "Logout")])
                  ),
                ]
              : Col([Button({ href: "/login" }, "Login")]),
          ]),
        ]),
      ]
    );
  }

  function Body(props, slots) {
    return Container(
      { size: "xl", mx: "auto" },
      user ? slots : Card({ mt: "md" }, [CardBody("You are not logged in!")])
    );
  }

  const script = View(
    { tag: "script" },
    `
    let theme = localStorage.getItem('THEME') ?? 'light'
    if(theme === 'dark') {
      document.body.classList.add('dark')
    }

    function toggleTheme() {
      
      if(theme === 'dark') {
        theme = 'light'
      } else {
        theme = 'dark'
      }
      localStorage.setItem('THEME', theme)
      document.body.classList.toggle('dark')

    }
  `
  );
  const css = View(
    {
      tag: "style",
    },
    `
  .dark .hide-dark {
    display: none;
  }
  .hide-light {
    display: none;
  }

  .dark .hide-light {
    display: unset;
  }
  `
  );

  return [
    View(
      {
        htmlHead: [title ? `<title>${title}</title>` : "", css],
        h: 100,
        style:
          "position: fixed; width: 240px; top: 0; left: 0; background-color: var(--color-base-100); border-right: 1px solid var(--color-base-400);",
      },
      [View({ px: "xxs", py: "sm" }, "Logo"), Sidebar()]
    ),
    View({ style: "margin-left: 240px;" }, [script, Header(), Body({}, slots)]),
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
