import findMyWay from "find-my-way";
import http from "http";
import * as qs from "qs";

import { renderHead, renderTemplate, renderScripts } from "@ulibs/router";

export function Router() {
  const app = findMyWay();

  const layouts = [];

  function startServer(port = 3000) {
    console.log("server started at http://localhost:" + port);
    return http
      .createServer((req, res) => {
        app.lookup(req, res);
      })
      .listen(port);
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
    { load = undefined, page = undefined, actions = {}, layout }
  ) {
    app.get(route, async (req, res, params) => {
      res.json = (body) => res.end(JSON.stringify(body ?? {}));

      async function runLoad() {
        const queryString = req.url.split("?")[1];

        const request = {
          url: req.url,
          headers: req.headers,
          params,
          query: qs.parse(queryString),
          locals: {},
        };

        let result = {};

        for (let i = layouts.length - 1; i >= 0; i--) {
          console.log("run load of layouts: ", i, layouts[i]);
          if (layouts[i].load && req.url.startsWith(layouts[i].route)) {
            result = { ...result, ...(await layouts[i].load(request)) };
          }
        }

        if (load) {
          result = { ...result, ...(await load(request)) };
        }

        return result;
      }

      function renderPage(props) {
        let pageComponent = page(props);
        for (let i = layouts.length - 1; i >= 0; i--) {
          const layout = layouts[i];
          console.log("all layouts: ", layouts);
          console.log("current layout", layout);
          if (layout.component && req.url.startsWith(layout.route)) {
            console.log("run layout", layout.route);
            pageComponent = layout.component(props, pageComponent);
          }
        }

        const head = renderHead(pageComponent);
        const template = renderTemplate(pageComponent);
        const script = renderScripts(pageComponent);

        return `<html>
<head>
    ${head}
</head>
<body>
    ${template}
    <script>
        ${script}
    </script>
</body>
</html>`;
      }

      if (!page) {
        if (!load) {
          console.log("route not added");
        }

        const result = await runLoad();

        return res.json(result);
      } else {
        const props = await runLoad();

        return res.end(renderPage(props));
      }
    });

    app.post(route, async (req, res, params, store, query) => {
      let action;

      let actionName;
      for (let key in query) {
        if (query[key] === "") {
          actionName = key;
          break;
        }
      }

      function findActionInActions(actions) {
        console.log({ actions, actionName });
        for (let key in actions) {
          if (key === actionName) {
            console.log("retuning: ", actions[actionName]);
            return actions[actionName];
          }
        }
      }

      action = findActionInActions(actions);
      if (!action) {
        for (let i = layouts.length - 1; i >= 0; i--) {
          const layout = layouts[i];
          console.log("current layout", layout);
          if (layout.actions) {
            action = findActionInActions(layout.actions);
            if (action) break;
          }
        }
      }
      console.log("action: ", action);

      if (action) {
        const body = await parseBody(req);
        const request = {
          body,
          query,
          params,
          locals: {},
        };

        if (body.startsWith("{")) {
          // check from header
          request.body = JSON.parse(body);
        } else {
          request.body = qs.parse(body);
        }

        const result = await action(request);

        res
          .writeHead(result?.status ?? 200, result?.headers ?? {})
          .end(result?.body ? JSON.stringify(result.body) : "");
      }
    });
    //
  }

  function addLayout(route, { component, load, actions } = {}) {
    console.log("addLayout", route, component, load, actions);
    layouts.push({ route, component, load, actions });
    // if(load) {
    // const props = await runLoad()
    // }
  }

  function removePage(route) {
    app.delete(route);
  }

  return {
    startServer,
    addPage,
    addLayout,
    removePage,
  };
}
