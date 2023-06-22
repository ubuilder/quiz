import {
  Row,
  Col,
  Checkbox,
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

export function QuestionsPage({ questions = [] }) {
  function Answer({ answer: { value, id }, questionId }) {
    return Col({}, [
      Checkbox({
        inline: true,
        name: questionId,
        value: id,
        label: value,
      }),
    ]);
  }

  function Question({ question: { id, title, answers } }) {
    return View([
      View({ tag: "h3", my: "sm" }, title),
      Row([
        answers.map((answer) => Answer({ answer, questionId: id })),
        Col(
          { col: 12 },
          Form({ action: "check" }, [
            Input({ type: "hidden", name: "question", value: id }),
            Input({ type: "hidden", name: "answer", value: answers[0].id }),
            Button({ color: "primary" }, [Icon({ name: "check" }), "Check"]),
          ])
        ),
      ]),
    ]);
  }

  function Header() {
    return Container({ size: "lg", mx: "auto", my: "md" }, [
      Row({ style: "align-items: center;" }, [
        Col([View({ tag: "h2" }, "Quiz App")]),
        Col({ ms: "auto" }, [
          ButtonGroup([
            Button({ href: "/" }, "Home"),
            Button(
              { color: "primary", onClick: "openAddModal()" },
              "Add Question"
            ),
          ]),
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
          View({ tag: "form", action: "?create", method: "POST" }, [
            Row([
              View(
                { col: 12, my: "md", mx: "auto", tag: "h3" },
                "Add Question"
              ),
              Col({ col: 12 }, Input({ label: "Question:", name: "title" })),

              Col(
                { col: 8 },
                Input({ label: "Answer #1", name: "answers.0.value" })
              ),
              Col(
                { col: 4, mt: "lg" },
                Checkbox({ name: "answers.0.is_correct", label: "Correct?" })
              ),

              Col(
                { col: 8 },
                Input({ label: "Answer #2", name: "answers.1.value" })
              ),
              Col(
                { col: 4, mt: "lg" },
                Checkbox({ name: "answers.1.is_correct", label: "Correct?" })
              ),

              Col(
                { col: 8 },
                Input({ label: "Answer #3", name: "answers.2.value" })
              ),
              Col(
                { col: 4, mt: "lg" },
                Checkbox({ name: "answers.2.is_correct", label: "Correct?" })
              ),

              Col(
                { col: 8 },
                Input({ label: "Answer #4", name: "answers.3.value" })
              ),
              Col(
                { col: 4, mt: "lg" },
                Checkbox({ name: "answers.3.is_correct", label: "Correct?" })
              ),

              ButtonGroup({ col: 12, ms: "auto" }, [
                Button({ type: "button", onClick: "closeAddModal()" }, "Close"),
                Button({ color: "primary", onClick: "closeAddModal()" }, "Add"),
              ]),
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
    Container({ size: "xl", mx: "auto" }, [
      questions.map((question) => Question({ question })),
    ]),
    modal(),
    Script(),
  ]);
}
