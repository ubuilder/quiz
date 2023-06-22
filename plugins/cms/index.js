import { connect } from "@ulibs/db";
import { Router } from "../../router.js";
import initUserManagement from "../user-management/index.js";
import { View } from "@ulibs/components";

export function Layout(props, slots) {
  return View(
    {
      htmlHead: [
        View({ tag: "meta", charset: "UTF-8" }),
        View({
          tag: "meta",
          "http-equiv": "X-UA-Compatible",
          content: "IE=edge",
        }),
        View({
          tag: "meta",
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        }),

        View({
          component: "link",
          tag: "link",
          rel: "stylesheet",
          href: "https://unpkg.com/@ulibs/components@next/dist/styles.css",
        }),
        View({
          tag: "script",
          async: true,
          defer: true,
          src: "https://unpkg.com/@ulibs/components@next/dist/ulibs.js",
        }),
      ],
    },
    slots
  );
}

export default function CmsPlugin({
  port = 3002,
  client = "sqlite3",
  filename = "./cms.db",
  ...rest
}) {
  return {
    updateCtx(ctx) {
      const { createTable, getModel, removeTable } = connect({
        client,
        filename,
        ...rest,
      });
      ctx.createTable = createTable;
      ctx.getModel = getModel;
      ctx.removeTable = removeTable;

      const { startServer, addPage, addLayout } = Router();

      ctx.startServer = startServer;
      ctx.addPage = addPage;
      ctx.addLayout = addLayout;

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

    async onStart(ctx) {
      ctx.addLayout("/", {
        load: (props) => props,
        component: Layout,
      });

      await initUserManagement(ctx);
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
      ctx.startServer(port);
    },
  };
}
