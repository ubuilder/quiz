import { QuestionsPage } from "../views.js";
// import { getContext } from "./app.js";

export default function initQuestions(ctx) {
  const Questions = ctx.getModel("questions");

  ctx.addPage("/questions", {
    async load() {
      // const randomIds = [1, 4, 6, 3, 15];
      const result = await Questions.query({
        where: {
          // id: randomIds.join(",") + ":in",
        },
        perPage: 100,
        select: {
          title: true,
          answers: {
            value: true,
          },
        },
      });

      return {
        questions: result.data,
      };
    },
    actions: {
      async create({ body }) {
        const created_by_id = 1;
        const title = body.title ?? "What is 2 + 2?";
        console.log(body);
        const answers = body.answers ?? [
          { value: "3", is_correct: false },
          { value: "4", is_correct: true },
          { value: "5", is_correct: false },
          { value: "2", is_correct: false },
        ];

        await Questions.insert({
          title,
          created_by_id,
          answers,
        });

        return {
          status: 303,
          headers: {
            location: "/questions",
          },
        };
      },
      async check({ body }) {
        const questionId = body.question;
        const answerId = body.answer;

        console.log({ questionId, answerId });
      },
    },
    page({ questions }) {
      console.log({ questions });
      return QuestionsPage({ questions });
    },
  });
}
