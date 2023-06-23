import { PluginManager } from "@ulibs/plugin";
import QuizPlugin from "./plugins/quiz/index.js";
import CmsPlugin from "./plugins/cms/index.js";
import { FormPage, TablePage } from "./views.js";
import { AdminLayout } from "./plugins/user-management/views.js";
import PluginManagementPlugin from "./plugins/plugin-management/index.js";
import { Badge, Card, CardBody } from "@ulibs/components";
import express from "express";

const pm = PluginManager({
  config: "./plugins.json",
});

function AdminPanel() {
  let sidebarItems = [];

  return {
    updateCtx(ctx) {
      ctx.addSidebarItem = (item) => {
        sidebarItems = [...sidebarItems, item];
      };
    },
    onStart(ctx) {
      ctx.addPage("/admin", {
        page: (props) => Card({ mt: "md" }, [CardBody("Welcome to Dashboard")]),
      });

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
    },
  };
}

// function TestCrud({
//   tableName = "crud",
//   columns = [],
//   icon = "user",
//   shouldCreateTable = true,
//   getListTitle = () => "Crud List",
//   getInsertTitle = () => "Add Crud",
//   getUpdateTitle = (item) => "Edit Crud #" + item.id,
// }) {
//   let sidebarItems = [];
//   return {
//     updateCtx(ctx) {
//       ctx.addSidebarItem = (item) => {
//         sidebarItems = [...sidebarItems, item];
//       };
//     },
//     onStart(ctx) {
//       // ctx.addLayout("/admin", {
//       //   async load(req) {
//       //     const user = await ctx.getUserInfo(req.headers.cookie);
//       //     console.log(user);

//       //     return {
//       //       user,
//       //       title: "Admin Panel",
//       //       sidebar: sidebarItems,
//       //     };
//       //   },
//       //   actions: {
//       //     async logout() {
//       //       const { cookie } = ctx.logout();

//       //       return {
//       //         status: 303,
//       //         headers: {
//       //           location: "/login",
//       //           "set-cookie": cookie,
//       //         },
//       //       };
//       //     },
//       //   },
//       //   component: AdminLayout,
//       // });
//       // console.log(ctx);

//       const slug = "/admin/" + tableName;
//       // ctx.addPage("/admin", {
//       //   page: (props) => Card({ mt: "md" }, [CardBody("Welcome to Dashboard")]),
//       // });
//       ctx.addSidebarItem({ href: slug, title: tableName, icon });

//       ctx.addPage(slug, {
//         async load({ url, query: { perPage, page } }) {
//           console.log("get list of " + tableName);
//           const res = await ctx.getModel(tableName).query({ perPage, page });

//           const data = res.data.map((row) => {
//             let result = {};

//             for (let key in row) {
//               const afterRead = columns.find(
//                 (col) => col.key === key
//               )?.afterRead;
//               result[key] = row[key];

//               if (afterRead) {
//                 result[key] = afterRead(row[key]);
//               }
//             }

//             return result;
//           });

//           return {
//             ...res,
//             data,
//             url,
//             title: getListTitle(),
//             columns: columns
//               .filter((col) => col.showOnList !== false)
//               .map((column) => ({
//                 name: column.name,
//                 key: column.key,
//                 render: column.renderOnList ?? ((val) => val),
//               })),
//           };
//         },
//         actions: {
//           async remove({ body }) {
//             await ctx.getModel(tableName).remove(+body.id);
//             return {
//               status: 200,
//             };
//           },
//         },
//         page: TablePage,
//       });

//       ctx.addPage(slug + "/add", {
//         actions: {
//           async create({ body }) {
//             const payload = {};

//             for (let key in body) {
//               payload[key] = body[key];

//               const beforeInsert = columns.find(
//                 (col) => col.key === key
//               )?.beforeInsert;

//               if (beforeInsert) {
//                 payload[key] = beforeInsert(body[key]);
//               }
//             }

//             const result = await ctx.getModel(tableName).insert(payload);

//             return {
//               body: {
//                 message: "Item added successfully!",
//               },
//             };
//           },
//         },
//         load(req) {
//           return {
//             fields: columns
//               .filter((col) => col.showOnInsert !== false)
//               .map((column) => ({
//                 name: column.key,
//                 type: column.inputType,
//                 label: column.name,
//                 items: column.items ?? [],
//                 col: column.col ?? 12,
//                 colXs: column.colXs ?? false,
//                 colSm: column.colSm ?? false,
//                 colMd: column.colMd ?? false,
//                 colLg: column.colLg ?? false,
//                 colXl: column.colXl ?? false,
//               })),
//             value: {},
//             title: getInsertTitle(),
//             action: "create",
//           };
//         },
//         page: FormPage,
//       });

//       ctx.addPage(slug + "/:id/edit", {
//         actions: {
//           async update({ params, body }) {
//             const payload = {};

//             for (let key in body) {
//               payload[key] = body[key];

//               const beforeUpdate = columns.find(
//                 (col) => col.key === key
//               )?.beforeUpdate;

//               if (beforeUpdate) {
//                 payload[key] = beforeUpdate(body[key]);
//               }
//             }

//             await ctx.getModel(tableName).update(params.id, payload);

//             return {
//               message: "Item updated successfully!",
//             };
//             //
//           },
//         },
//         async load({ params }) {
//           const value = await ctx.getModel(tableName).get(+params.id);
//           // if (!value) {
//           //   return {};
//           // }

//           return {
//             fields: columns
//               .filter((col) => col.showOnUpdate !== false)
//               .map((column) => ({
//                 name: column.key,
//                 type: column.inputType,
//                 label: column.name,
//                 items: column.items ?? [],
//                 col: column.col ?? 12,
//                 colXs: column.colXs ?? false,
//                 colSm: column.colSm ?? false,
//                 colMd: column.colMd ?? false,
//                 colLg: column.colLg ?? false,
//                 colXl: column.colXl ?? false,
//               })),
//             title: getUpdateTitle(value),
//             action: "update",
//             value,
//           };
//         },
//         page: FormPage,
//       });
//     },
//     async onInstall(ctx) {
//       if (shouldCreateTable) {
//         const fields = {};

//         columns.map((column) => {
//           fields[column.key] = column.dataType;
//         });

//         console.log(fields);

//         await ctx.createTable(tableName, fields);
//       }
//     },
//     async onRemove(ctx) {
//       await ctx.removeTable(tableName);
//     },
//   };
// }

await pm.install(
  "cms",
  CmsPlugin({ port: process.env.PORT ?? 3002, filename: ":memory:" })
);
await pm.install("admin-panel", AdminPanel());
await pm.install("quiz", QuizPlugin());
await pm.install("plugin", PluginManagementPlugin());
// await pm.install(
//   "crud-users",
//   Crud2({
//     tableName: "users",
//     shouldCreateTable: false,
//     getListTitle: () => "User List",
//     getInsertTitle: () => "Add User",
//     getUpdateTitle: (user) => "Edit " + user.username,
//     columns: [
//       {
//         key: "username",
//         inputType: "input",
//         dataType: "string",
//         name: "Username",
//         col: 12,
//         colSm: 6,
//       },
//       {
//         key: "name",
//         inputType: "input",
//         dataType: "string",
//         name: "Name",
//         col: 12,
//         colSm: 6,
//       },
//       {
//         key: "password",
//         inputType: "input",
//         dataType: "string",
//         name: "Password",
//         beforeInsert: (value) => value + "_hashed",
//         showOnUpdate: false,
//         showOnList: false,
//       },
//       { key: "email", inputType: "input", dataType: "string", name: "Email" },
//       {
//         key: "roles",
//         inputType: "checkboxes",
//         dataType: "string[]",
//         name: "Roles",
//         items: ["Admin", "User"],
//         showOnList: false,
//         afterRead: (value) => JSON.parse(value),
//         beforeUpdate: (value) => JSON.stringify(value),
//         beforeInsert: (value) => JSON.stringify(value),
//       },
//     ],
//   })
// );

function Crud2(options) {
  const {
    tableName,
    title,
    getListTitle,
    getInsertTitle,
    getUpdateTitle,
    shouldCreateTable,
    fields,
    icon,
  } = options;

  return {
    onStart(ctx) {
      //
      const slug = "/admin/" + tableName;
      ctx.addSidebarItem({ href: slug, title: title, icon });

      ctx.addPage(slug, {
        async load({ url, query: { perPage, page } }) {
          const res = await ctx.getModel(tableName).query({ perPage, page });

          const data = res.data.map((row) => {
            let result = {};

            for (let key in row) {
              const afterRead = fields[key]?.afterRead;
              result[key] = row[key];

              if (afterRead) {
                result[key] = afterRead(row[key]);
              }
            }

            return result;
          });
          let columns = [];

          for (let field in fields) {
            if (fields[field].showOnList !== false) {
              columns.push({ name: field, text: fields[field].text });
            }
          }

          return {
            ...res,
            data,
            url,
            title: getListTitle(),
            columns,
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

              const beforeWrite = fields[key]?.beforeWrite;

              if (beforeWrite) {
                payload[key] = beforeWrite(body[key]);
              }
            }

            console.log("insert: ", payload);
            await ctx.getModel(tableName).insert(payload);

            return {
              body: {
                message: "Item added successfully!",
              },
            };
          },
        },
        load(req) {
          const defaultComponents = {
            string: "input",
            "string[]": "checkboxes",
          };

          const columns = [];
          for (let field in fields) {
            console.log("field: ", field);
            if (fields[field].showOnInsert !== false) {
              columns[field] = {
                name: field,
                text: fields[field].text,
                component:
                  fields[field].inputType ??
                  defaultComponents[fields[field].type],
                props: fields[field].props ?? {},
              };
            }
          }

          return {
            fields: columns,
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

              const beforeUpdate = fields[key]?.beforeUpdate;

              if (beforeUpdate) {
                payload[key] = beforeUpdate(body[key]);
              }
            }

            await ctx.getModel(tableName).update(params.id, payload);

            return {
              message: "Item updated successfully!",
            };
          },
        },
        async load({ params }) {
          const value = await ctx.getModel(tableName).get(+params.id);

          const defaultComponents = {
            string: "input",
            "string[]": "checkboxes",
          };

          const columns = [];
          for (let field in fields) {
            console.log("field: ", field);
            if (fields[field].showOnInsert !== false) {
              columns[field] = {
                name: field,
                text: fields[field].text,
                component:
                  fields[field].inputType ??
                  defaultComponents[fields[field].type],
                props: fields[field].props ?? {},
              };
            }
          }

          return {
            fields: columns,
            title: getUpdateTitle(value),
            action: "update",
            value,
          };
        },
        page: FormPage,
      });
    },
    async onInstall(ctx) {
      if (shouldCreateTable !== false) {
        let columns = {};
        for (let field in fields) {
          columns[field] = fields[field].type;
        }

        await ctx.createTable(tableName, columns);
      }
    },
  };
}
await pm.install(
  "crud-uzers",
  Crud2({
    tableName: "users",
    title: "Users",
    icon: "users",
    shouldCreateTable: false,
    getListTitle: () => "User List",
    getInsertTitle: () => "Add User",
    getUpdateTitle: (item) => "Edit (" + item.username + ")",
    fields: {
      username: {
        inputType: "input",
        type: "string",
        text: "Username",
        props: {
          colSm: 6,
        },
      },
      name: {
        inputType: "input",
        type: "string",
        text: "Name",
        props: {
          colSm: 6,
        },
      },
      password: {
        inputType: "input",
        type: "string",
        text: "Password",
        beforeWrite: (value) => value + "_hashed",
        showOnUpdate: false,
        showOnList: false,
      },
      email: { inputType: "input", type: "string", text: "Email" },
      roles: {
        component: "checkboxes",
        type: "string[]",
        text: "Roles",
        props: {
          inline: true,
          items: ["Admin", "User"],
        },
        showOnList: false,
        afterRead: (value) => JSON.parse(value),
        beforeWrite: (value) => JSON.stringify(value),
      },
    },
  })
);
await pm.install(
  "another-crud",
  Crud2({
    tableName: "another",
    title: "Another",
    icon: "star",
    getListTitle: () => "Another List",
    getInsertTitle: () => "Add Another",
    fields: {
      created_by: {
        text: "Created By",
        type: "users",
        inputType: "input",
        props: { placeholder: "Choose a User...", items: [], colSm: 6 },
      },
      name: {
        text: "Name",
        type: "string",
        props: { col: 12 },
      },
    },
  })
);

await pm.start();
// const ctx = pm.getCotext();

// console.log("ctx: ", ctx);

// const app = express();

// app.use((req, res, next) => {
//   return ctx.handleRequest(req, res);
// });

// export default app;

// {
//   key: "gender",
//   inputType: "radios",
//   dataType: "string",
//   name: "Gender",
//   items: ["Male", "Female"],
//   renderOnList: (value) =>
//     Badge({ color: value === "Male" ? "primary" : "success" }, value),
// },
