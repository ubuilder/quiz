import * as cookie from "cookie";
import { Layout, AdminPage } from "./views.js";

export default function initAdmin(ctx) {
  ctx.addPage("/admin", {
    page({ user }) {
      return Layout({}, AdminPage({ user }, "Content of admin page..."));
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
