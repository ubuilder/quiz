import {
  Divider,
  Button,
  Modal,
  ModalBody,
  View,
  Input,
} from "@ulibs/components";

export function QuestionsPage({ questions = [] }) {
  function Answer({ answer: { value, id }, questionId }) {
    return View(
      {
        mb: "sm",
      },
      [
        Input({
          type: "radio",
          name: questionId,
          me: "md",
          value: id,
        }),
        View(value),
      ]
    );
  }

  function Question({ question: { id, title, answers } }) {
    return View([
      View({ tag: "h3", my: "sm" }, title),
      answers.map((answer) => Answer({ answer, questionId: id })),
      Divider(),
    ]);
  }

  function Header() {
    return View(
      {
        style:
          "display: flex; align-items: center; justify-content: space-between;",
      },
      [
        View({ tag: "h2" }, "Quiz App"),
        Button({ color: "primary", onClick: "openAddModal()" }, "Add Question"),
      ]
    );
  }

  function modal() {
    return Modal({ id: "add-question-modal" }, [
      ModalBody([
        "Add Question modal (title+ answers)",
        Button({ onClick: "closeAddModal()" }, "Close"),
      ]),
    ]);
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

  return View({ p: "lg" }, [
    Header(),
    questions.map((question) => Question({ question })),
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
