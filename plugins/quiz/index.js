import initQuestions from "./routes/questions.js";

export default function QuizPlugin() {
  return {
    async onStart(ctx) {
      console.log("start plugin", ctx);

      //   const Users = ctx.getModel("users");
      const Questions = ctx.getModel("questions");
      const Answers = ctx.getModel("answers");
      //   const Roles = ctx.getModel("roles");
      const Submissions = ctx.getModel("submissions");

      initQuestions(ctx);
    },
    async onInstall({ createTable, getModel }) {
      await createTable("users", {
        name: "string|required",
        email: "string",
        username: "string|required",
        password: "string|required",
        roles: "string",
      });

      await getModel("users").insert({
        name: "Admin",
        password: "1qaz!QAZ_hashed",
        email: "admin@quiz.com",
        username: "admin",
        roles: `["Admin"]`,
      });

      await createTable("questions", {
        title: "string|required",
        created_by: "users",
        answers: "answers[]",
      });

      await createTable("answers", {
        value: "string|required",
        question: "questions",
        is_correct: "boolean|required|default=false",
      });

      await createTable("roles", {
        name: "string|required",
        description: "string",
        users: "user[]",
      });

      await createTable("submissions", {
        user: "user",
        answer: "answer",
      });
    },
    async onRemove({ removeTable }) {
      await removeTable("users");
      await removeTable("roles");
      await removeTable("questions");
      await removeTable("answers");
      await removeTable("submissions");
    },
  };
}
