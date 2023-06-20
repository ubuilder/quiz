import { Layout, QuestionsPage } from "./views.js";
// import { getContext } from "./app.js";

export default function (ctx) {
  console.log("ctx: ", ctx);

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
      create({ body }) {
        const created_by_id = 1;
        const title = body.title ?? "What is 2 + 2?";
        const answers = body.answers ?? [
          { value: "3", is_correct: false },
          { value: "4", is_correct: true },
          { value: "5", is_correct: false },
          { value: "2", is_correct: false },
        ];

        return Questions.insert({
          title,
          created_by_id,
          answers,
        });
      },
    },
    page({ questions }) {
      console.log({ questions });
      return Layout({}, QuestionsPage({ questions }));
    },
  });
}
