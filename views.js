import {
  Row,
  Col,
  Card,
  CardActions,
  CardBody,
  CardFooter,
  Container,
  Button,
  Modal,
  ModalBody,
  ButtonGroup,
  View,
  Input,
} from "@ulibs/components";

export function QuestionsPage({ questions = [] }) {
  function Answer({ answer: { value, id }, questionId }) {
    return Col({ col: 12, colMd: 6, colXl: 3 }, [
      Input({
        type: "radio",
        name: questionId,
        value: id,
        label: value,
      }),
    ]);
  }

  function Question({ question: { id, title, answers } }) {
    return View([
      View({ tag: "h3", my: "sm" }, title),
      Row([answers.map((answer) => Answer({ answer, questionId: id }))]),
    ]);
  }

  function Header() {
    return Container({ size: "lg", mx: "auto", my: "md" }, [
      Row({ style: "align-items: center;" }, [
        Col([View({ tag: "h2" }, "Quiz App")]),
        Col({ ms: "auto" }, [
          Button(
            { color: "primary", onClick: "openAddModal()" },
            "Add Question"
          ),
        ]),
      ]),
    ]);
  }

  function modal() {
    return Modal(
      {
        id: "add-question-modal",
        size: "xs",
      },
      [
        ModalBody([
          "Add Question modal (title+ answers)",
          View({ tag: "form", action: "?create", method: "POST" }, [
            Input({ label: "Question:", name: "title" }),

            Input({ label: "Answer #1", name: "answers[0][value]" }),
            Input({ type: "radio", name: "answers[0][is_correct]" }),

            Input({ label: "Answer #2", name: "answers[1][value]" }),
            Input({ type: "radio", name: "answers[1][is_correct]" }),

            Input({ label: "Answer #3", name: "answers[2][value]" }),
            Input({ type: "radio", name: "answers[2][is_correct]" }),

            Input({ label: "Answer #4", name: "answers[3][value]" }),
            Input({ type: "radio", name: "answers[3][is_correct]" }),

            ButtonGroup({}, [
              Button({ type: "button", onClick: "closeAddModal()" }, "Close"),
              Button({ color: "primary", onClick: "closeAddModal()" }, "Add"),
            ]),
          ]),
        ]),
      ]
    );
  }

  function Script() {
    return View({
      tag: "div",
      script: `
    
    function openAddModal() {
      document.getElementById('add-question-modal').setAttribute('u-modal-open', '') // open
    }
    function closeAddModal() {
      document.getElementById('add-question-modal').removeAttribute('u-modal-open') // close
    }
    `,
    });
  }

  return View([
    Header(),
    Container({ size: "lg", mx: "auto" }, [
      questions.map((question) => Question({ question })),
    ]),
    modal(),
    Script(),
  ]);
}

export function Layout(props, slots) {
  return View(
    {
      htmlHead: [
        View({
          component: "link",
          tag: "link",
          rel: "stylesheet",
          href: "https://unpkg.com/@ulibs/components@next/dist/styles.css",
        }),
        View({
          tag: "script",
          src: "https://unpkg.com/@ulibs/components@next/dist/ulibs.js",
        }),
      ],
    },
    slots
  );
}

export function HomePage({ user }) {
  return Layout({}, [
    Container({ size: "lg", mx: "auto" }, [
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
    ]),
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
  ]);
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
            Button({ color: "error" }, "Logout")
          ),
        ]),
      ]),
      Card({ mt: "md" }, [CardBody(slot)]),
    ]);
  }

  return Container({ size: "lg", mx: "auto", px: "md" }, [content]);
}
