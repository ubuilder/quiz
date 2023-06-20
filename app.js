// import { Router } from "@ulibs/router";
import { PluginManager } from "@ulibs/plugin";
import { connect } from "@ulibs/db";
import findMyWay from "find-my-way";
import http from "http";
import qs from "qs";
import * as cookie from "cookie";
import { renderHead, renderScripts, renderTemplate } from "@ulibs/router";
import { Layout, QuestionsPage, HomePage } from "./views.js";
import initQuestions from "./questions.js";
import initUserManagement from "./users.js";
import initAdmin from "./admin.js";

function Router() {
  const app = findMyWay();

  function startServer(port = 3000) {
    console.log("server started at http://localhost:" + port);
    http
      .createServer((req, res) => {
        console.log("app lookup");

        app.lookup(req, res);
      })
      .listen(port);
    //
  }

  function parseBody(req) {
    return new Promise((resolve) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => resolve(body));
    });
  }

  function addPage(
    route,
    { load = undefined, page = undefined, actions = {} }
  ) {
    console.log("add page", route);
    app.get(route, async (req, res, params) => {
      console.log({ route, page, actions, load });

      res.json = (body) => res.end(JSON.stringify(body ?? {}));

      async function runLoad() {
        const queryString = req.url.split("?")[1];

        const request = {
          headers: req.headers,
          params,
          query: qs.parse(queryString),
        };

        const result = (await load(request)) ?? {};

        return result;
      }

      function renderPage(props) {
        console.log({ props });
        const pageComponent = page(props);

        const head = renderHead(pageComponent);
        const template = renderTemplate(pageComponent);
        const script = renderScripts(pageComponent);

        console.log({ head, template, script });

        return `<html><head>${head}</head><body>${template}<script>${script}</script></body></html>`;
      }

      if (!page) {
        if (!load) {
          console.log("route not added");
        }

        const result = await runLoad();

        return res.json(result);
      } else if (load) {
        const props = await runLoad();

        return res.end(renderPage(props));
      } else {
        return res.end(renderPage({}));
      }
    });

    app.post(route, async (req, res, params, store, query) => {
      console.log("POST", route, { req, query, params, res });
      let action;
      for (let key in query) {
        if (key in actions) {
          action = actions[key];
          break;
        }
      }
      if (action) {
        const body = await parseBody(req);
        const request = {
          body,
          query,
          params,
        };

        if (body.startsWith("{")) {
          // check from header
          request.body = JSON.parse(body);
        } else {
          request.body = qs.parse(body);
        }

        const result = await action(request);

        res
          .writeHead(result.status ?? 200, result.headers ?? {})
          .end(result.body ? JSON.stringify(result.body) : "");
      }
    });
    //
  }

  function removePage(route) {
    app.delete(route);
  }

  return {
    startServer,
    addPage,
    removePage,
  };
}

function Quiz() {
  return {
    async onStart(ctx) {
      console.log("start plugin", ctx);

      const Users = ctx.getModel("users");
      const Questions = ctx.getModel("questions");
      const Answers = ctx.getModel("answers");
      const Roles = ctx.getModel("roles");
      const Submissions = ctx.getModel("submissions");

      await Users.insert({
        name: "Admin",
        password: "1qaz!QAZ",
        email: "admin@quiz.com",
        username: "admin",
      });

      ctx.addPage("/", {
        page: HomePage,
        async load({ headers }) {
          const Users = ctx.getModel("users");

          const cookies = cookie.parse(headers.cookie);

          if (cookies["token"]) {
            const user = await Users.get(cookies.token);
            return { user };
          } else {
            return {};
          }
        },
      });

      initUserManagement(ctx);

      initAdmin(ctx);
      initQuestions(ctx);

      // await Questions.insert([
      //   {
      //     title: "Who painted the Mona Lisa?",
      //     answers: [
      //       { value: "Leonardo da Vinci", is_correct: true },
      //       { value: "Vincent van Gogh", is_correct: false },
      //       { value: "Pablo Picasso", is_correct: false },
      //       { value: "Michelangelo", is_correct: false },
      //     ],
      //   },
      //   {
      //     title: "What is the capital of France?",
      //     answers: [
      //       { value: "Paris", is_correct: true },
      //       { value: "London", is_correct: false },
      //       { value: "Madrid", is_correct: false },
      //       { value: "Berlin", is_correct: false },
      //     ],
      //   },
      //   // Add more questions here
      // ]);

      // console.log(
      //   await Questions.query({
      //     select: {
      //       title: true,
      //       answers: true,
      //     },
      //   })
      // );

      //  await Answers.insert([
      //         {value: '3', question_id: 1, is_correct: false},
      //         {value: '4', question_id: 1, is_correct: true},
      //         {value: '5', question_id: 1, is_correct: false},
      //         {value: '2', question_id: 1, is_correct: false},

      //  ])
    },
    async onInstall({ createTable }) {
      await createTable("users", {
        name: "string|required",
        email: "string",
        username: "string|required",
        password: "string|required",
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

const pm = PluginManager({
  config: "./plugins.json",
});

function Base() {
  return {
    updateCtx(ctx) {
      const { createTable, getModel, removeTable } = connect({
        client: "sqlite3",
        filename: "./cms.db",
      });
      ctx.createTable = createTable;
      ctx.getModel = getModel;
      ctx.removeTable = removeTable;

      const { startServer, addPage } = Router();

      ctx.startServer = startServer;
      ctx.addPage = addPage;

      ctx.installPlugin = (name, methods) => {
        return pm.install(name, methods);
      };

      ctx.removePlugin = (name) => {
        return pm.remove(name);
      };
      ctx.enablePlugin = (name) => {
        return pm.enable(name);
      };
      ctx.disablePlugin = (name) => {
        return pm.disable(name);
      };
    },
  };
}

function Cms() {
  return {
    onStart(ctx) {
      ctx.addPage("/disable", {
        load({ query }) {
          console.log("disable");
          ctx.disablePlugin("quiz");

          return query;
          //
        },
      });
      ctx.addPage("/enable", {
        load() {
          console.log("enable");
          ctx.enablePlugin("quiz");

          //
        },
      });
      ctx.startServer(3002);
    },
  };
}

await pm.install("base", Base());
await pm.install("quiz", Quiz());
await pm.install("cms", Cms());

await pm.start();

export function getContext() {
  return pm.ctx;
}
// process.on('exit', () => {
// removePlugin('quiz')
// process.emit()
// })
