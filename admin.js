import * as cookie from "cookie";
import { Layout, AdminPage } from "./views.js";

export default function initAdmin(ctx) {
  ctx.addPage("/admin", {
    page({ user }) {
      return Layout({}, AdminPage({ user }, "Content of admin page..."));
    },
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
    actions: {
      async logout() {
        return {
          status: 303,
          headers: {
            location: "/login",
            "set-cookie": "token=; HttpOnly; Path=/",
          },
        };
      },
    },
  });
}
