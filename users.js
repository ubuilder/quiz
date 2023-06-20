import { Layout, LoginPage } from "./views.js";

export default function initUserManagement(ctx) {
  ctx.addPage("/login", {
    page: () => {
      return Layout({}, [LoginPage()]);
    },
    actions: {
      async login({ body }) {
        const Users = ctx.getModel("users");

        const user = await Users.query({
          where: {
            username: body.username,
            password: body.password,
          },
        });
        if (user.data.length > 0) {
          return {
            status: 303,
            headers: {
              'set-cookie': `token=${user.data[0].id}; HttpOnly; Path=/`,
              location: "/admin",
            },
            body: {
              message: "Logged in successfully!",
            },
          };
        } else {
          return {
            status: 401,
            body: {
              message: "username or password is invalid!",
            },
          };
        }
        // if(username === 'admin' && password === '1qaz!QAZ')
      },
    },
    // layout: Layout
  });
}
