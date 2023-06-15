import { Button, View, Input } from "@ulibs/components";

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

  function Question({ question: { title, answers } }) {
    return View([
      View({ tag: "h2", my: "sm" }, title),
      answers.map((answer) => Answer({ answer })),
      Button({ color: "primary" }, "Next Question"),
    ]);
  }

  return View({ p: "lg" }, [
    questions.map((question) => Question({ question })),
  ]);
}

export function Layout(props, slots) {
  return View(
    {
      htmlHead: View({
        component: "link",
        tag: "link",
        rel: "stylesheet",
        href: "https://unpkg.com/@ulibs/components@next/src/styles.css",
      }),
    },
    slots
  );
}
