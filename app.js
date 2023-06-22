import { PluginManager } from "@ulibs/plugin";
import QuizPlugin from "./plugins/quiz/index.js";
import CmsPlugin from "./plugins/cms/index.js";
import { TablePage } from "./views.js";
import { AdminLayout } from "./plugins/user-management/views.js";

const pm = PluginManager({
  config: "./plugins.json",
});

function TestCrud(tableName = "crud") {
  return {
    onStart(ctx) {
      ctx.addLayout("/admin", {
        async load(req) {
          return {
            sidebar: [
              { title: "Crud", href: "/admin/crud", icon: "box" },
              { title: "Users", href: "/admin/users", icon: "user" },
              { title: "Settings", href: "/admin/settings", icon: "settings" },
            ],
          };
        },
        component: AdminLayout,
      });
      // console.log(ctx);
      ctx.addPage("/admin/" + tableName, {
        async load({ query: { perPage, page } }) {
          const res = await ctx.getModel(tableName).query({ perPage, page });

          return {
            ...res,
            columns: [
              { name: "Name", key: "name" },
              { name: "Test", key: "test" },
              { name: "Checked", key: "checked" },
            ],
          };
        },
        page: TablePage,
      });
    },
    async onInstall(ctx) {
      await ctx.createTable(tableName, {
        name: "string",
        test: "number",
        checked: "boolean",
      });
    },
    async onRemove(ctx) {
      await ctx.removeTable(tableName);
    },
  };
}

await pm.install("quiz", QuizPlugin());
await pm.install("cms", CmsPlugin({ port: 3002 }));
await pm.install("crud", TestCrud("crud"));

await pm.start();
