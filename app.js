import { PluginManager } from "@ulibs/plugin";
import QuizPlugin from "./plugins/quiz/index.js";
import CmsPlugin from "./plugins/cms/index.js";
import { FormPage, TablePage } from "./views.js";
import { AdminLayout } from "./plugins/user-management/views.js";
import PluginManagementPlugin from "./plugins/plugin-management/index.js";

const pm = PluginManager({
  config: "./plugins.json",
});

function TestCrud(tableName = "crud") {
  let sidebarItems = [];
  return {
    updateCtx(ctx) {
      ctx.addSidebarItem = (item) => {
        sidebarItems = [...sidebarItems, item];
      };
    },
    onStart(ctx) {
      ctx.addLayout("/admin", {
        async load(req) {
          return {
            title: "Admin Panel",
            sidebar: sidebarItems,
          };
        },
        component: AdminLayout,
      });
      // console.log(ctx);

      const slug = "/admin/" + tableName;
      ctx.addSidebarItem({ href: slug, title: tableName, icon: "user" });
      ctx.addPage(slug, {
        async load({ url, query: { perPage, page } }) {
          const res = await ctx.getModel(tableName).query({ perPage, page });

          return {
            ...res,
            url,
            columns: [
              { name: "Name", key: "name" },
              { name: "Test", key: "test" },
              { name: "Checked", key: "checked" },
            ],
          };
        },
        actions: {
          async remove({ body }) {
            await ctx.getModel(tableName).remove(+body.id);
            return {
              status: 200,
            };
          },
        },
        page: TablePage,
      });

      ctx.addPage(slug + "/add", {
        actions: {
          async create({ body }) {
            console.log(body);
            const result = await ctx.getModel(tableName).insert(body);
            console.log(result);
            //
          },
        },
        load(req) {
          return {
            fields: [
              {
                name: "name",
                type: "input",
                props: { label: "Name: ", placeholder: "Enter a number..." },
              },
              {
                name: "test",
                type: "input",
                props: {
                  type: "number",
                  label: "Test: ",
                  placeholder: "Enter a number...",
                },
              },
              {
                name: "checked",
                type: "checkbox",
                props: { label: "Checked: " },
              },
            ],
            value: {},
            title: "Add Crud Item",
            action: "create",
          };
        },
        page: FormPage,
      });

      ctx.addPage(slug + "/:id/edit", {
        actions: {
          async update({ params, body }) {
            console.log(body);
            const result = await ctx
              .getModel(tableName)
              .update(params.id, body);
            console.log(result);
            //
          },
        },
        async load({ params }) {
          return {
            fields: [
              {
                name: "name",
                type: "input",
                props: { label: "Name: ", placeholder: "Enter a number..." },
              },
              {
                name: "test",
                type: "input",
                props: {
                  type: "number",
                  label: "Test: ",
                  placeholder: "Enter a number...",
                },
              },
              {
                name: "checked",
                type: "checkbox",
                props: { label: "Checked: " },
              },
            ],
            value: {},
            title: "Edit item #" + params.id,
            action: "update",
            value: await ctx.getModel(tableName).get(+params.id),
          };
        },
        page: FormPage,
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
await pm.install("plugin", PluginManagementPlugin());
await pm.install("crud", TestCrud("crud"));

await pm.start();
