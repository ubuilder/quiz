import { PluginManager } from "@ulibs/plugin";
import QuizPlugin from "./plugins/quiz/index.js";
import CmsPlugin from "./plugins/cms/index.js";
import { FormPage, TablePage } from "./views.js";
import { AdminLayout } from "./plugins/user-management/views.js";
import PluginManagementPlugin from "./plugins/plugin-management/index.js";
import { Badge, Card, CardBody } from "@ulibs/components";
import { renderTemplate } from "@ulibs/router";

const pm = PluginManager({
  config: "./plugins.json",
});

function TestCrud({
  tableName = "crud",
  columns = [],
  icon = "user",
  shouldCreateTable = true,
  getListTitle = () => "Crud List",
  getInsertTitle = () => "Add Crud",
  getUpdateTitle = (item) => "Edit Crud #" + item.id,
}) {
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
          const user = await ctx.getUserInfo(req.headers.cookie);
          console.log(user);

          return {
            user,
            title: "Admin Panel",
            sidebar: sidebarItems,
          };
        },
        actions: {
          async logout() {
            const { cookie } = ctx.logout();

            return {
              status: 303,
              headers: {
                location: "/login",
                "set-cookie": cookie,
              },
            };
          },
        },
        component: AdminLayout,
      });
      // console.log(ctx);

      const slug = "/admin/" + tableName;
      ctx.addPage("/admin", {
        page: (props) => Card({ mt: "md" }, [CardBody("Welcome to Dashboard")]),
      });
      ctx.addSidebarItem({ href: slug, title: tableName, icon });

      ctx.addPage(slug, {
        async load({ url, query: { perPage, page } }) {
          console.log("get list of " + tableName);
          const res = await ctx.getModel(tableName).query({ perPage, page });

          const data = res.data.map((row) => {
            let result = {};

            for (let key in row) {
              const afterRead = columns.find(
                (col) => col.key === key
              )?.afterRead;
              result[key] = row[key];

              if (afterRead) {
                result[key] = afterRead(row[key]);
              }
            }

            return result;
          });

          return {
            ...res,
            data,
            url,
            title: getListTitle(),
            columns: columns
              .filter((col) => col.showOnList !== false)
              .map((column) => ({
                name: column.name,
                key: column.key,
                render: column.renderOnList ?? ((val) => val),
              })),
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
            const payload = {};

            for (let key in body) {
              payload[key] = body[key];

              const beforeInsert = columns.find(
                (col) => col.key === key
              )?.beforeInsert;

              if (beforeInsert) {
                payload[key] = beforeInsert(body[key]);
              }
            }

            const result = await ctx.getModel(tableName).insert(payload);

            return {
              body: {
                message: "Item added successfully!",
              },
            };
          },
        },
        load(req) {
          return {
            fields: columns
              .filter((col) => col.showOnInsert !== false)
              .map((column) => ({
                name: column.key,
                type: column.inputType,
                label: column.name,
                items: column.items ?? [],
                col: column.col ?? 12,
                colXs: column.colXs ?? false,
                colSm: column.colSm ?? false,
                colMd: column.colMd ?? false,
                colLg: column.colLg ?? false,
                colXl: column.colXl ?? false,
              })),
            value: {},
            title: getInsertTitle(),
            action: "create",
          };
        },
        page: FormPage,
      });

      ctx.addPage(slug + "/:id/edit", {
        actions: {
          async update({ params, body }) {
            const payload = {};

            for (let key in body) {
              payload[key] = body[key];

              const beforeUpdate = columns.find(
                (col) => col.key === key
              )?.beforeUpdate;

              if (beforeUpdate) {
                payload[key] = beforeUpdate(body[key]);
              }
            }

            await ctx.getModel(tableName).update(params.id, payload);

            return {
              message: "Item updated successfully!",
            };
            //
          },
        },
        async load({ params }) {
          const value = await ctx.getModel(tableName).get(+params.id);
          // if (!value) {
          //   return {};
          // }

          return {
            fields: columns
              .filter((col) => col.showOnUpdate !== false)
              .map((column) => ({
                name: column.key,
                type: column.inputType,
                label: column.name,
                items: column.items ?? [],
                col: column.col ?? 12,
                colXs: column.colXs ?? false,
                colSm: column.colSm ?? false,
                colMd: column.colMd ?? false,
                colLg: column.colLg ?? false,
                colXl: column.colXl ?? false,
              })),
            title: getUpdateTitle(value),
            action: "update",
            value,
          };
        },
        page: FormPage,
      });
    },
    async onInstall(ctx) {
      if (shouldCreateTable) {
        const fields = {};

        columns.map((column) => {
          fields[column.key] = column.dataType;
        });

        console.log(fields);

        await ctx.createTable(tableName, fields);
      }
    },
    async onRemove(ctx) {
      await ctx.removeTable(tableName);
    },
  };
}

await pm.install("cms", CmsPlugin({ port: 3002 }));
await pm.install("quiz", QuizPlugin());
await pm.install("plugin", PluginManagementPlugin());
await pm.install(
  "crud-users",
  TestCrud({
    tableName: "users",
    shouldCreateTable: false,
    getListTitle: () => "User List",
    getInsertTitle: () => "Add User",
    getUpdateTitle: (user) => "Edit " + user.username,
    columns: [
      {
        key: "username",
        inputType: "input",
        dataType: "string",
        name: "Username",
        col: 12,
        colSm: 6,
      },
      {
        key: "name",
        inputType: "input",
        dataType: "string",
        name: "Name",
        col: 12,
        colSm: 6,
      },
      {
        key: "password",
        inputType: "input",
        dataType: "string",
        name: "Password",
        beforeInsert: (value) => value + "_hashed",
        showOnUpdate: false,
        showOnList: false,
      },
      { key: "email", inputType: "input", dataType: "string", name: "Email" },
      // {
      //   key: "gender",
      //   inputType: "radios",
      //   dataType: "string",
      //   name: "Gender",
      //   items: ["Male", "Female"],
      //   renderOnList: (value) =>
      //     Badge({ color: value === "Male" ? "primary" : "success" }, value),
      // },
      {
        key: "roles",
        inputType: "checkboxes",
        dataType: "string[]",
        name: "Roles",
        items: ["Admin", "User"],
        showOnList: false,
        afterRead: (value) => {
          console.log(value, typeof value);
          return JSON.parse(value);
        },
        beforeUpdate: (value) => JSON.stringify(value),
        beforeInsert: (value) => JSON.stringify(value),
      },
    ],
  })
);

await pm.start();
