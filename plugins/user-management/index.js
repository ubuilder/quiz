import { HomePage } from "./views.js";
import { LoginPage } from "./views.js";
import * as cookie from "cookie";

export default async function initUserManagement(ctx) {
  const Users = ctx.getModel("users");

  ctx.login = async ({ username, password } = {}) => {
    console.log("logging in", { username, password });
    const user = await Users.query({
      where: {
        username: username + ":=",
        password: password + "_hashed:=",
      },
    });
    console.log({ user }, await Users.query());

    if (user.data.length > 0) {
      return {
        cookie: `token=${user.data[0].id}; HttpOnly; Path=/`,
      };
    } else {
      throw new Error("username or password is invalid!");
    }
  };

  ctx.getUserInfo = async (cookies) => {
    const cookiesObject = cookie.parse(cookies ?? "");

    if (!cookiesObject["token"]) {
      return null;
    }
    const user = await Users.get(cookiesObject.token);
    if (!user) {
      return null;
    }

    delete user["password"];
    user.roles = JSON.parse(user["roles"]);
    return user;
  };

  ctx.logout = () => {
    return {
      cookie: `token=; HttpOnly; Path=/`,
    };
  };

  function respond({ body = {}, headers = {}, status = 200 }) {
    return {
      body,
      headers,
      status,
    };
  }

  function redirect({
    location = "/",
    headers = {},
    status = 303,
    body = {},
  } = {}) {
    return respond({
      status,
      headers: {
        ...headers,
        location,
      },
      body,
    });
  }

  ctx.addPage("/", {
    page: HomePage,
    async load({ headers }) {
      return {
        user: await ctx.getUserInfo(headers.cookie),
      };
    },
  });

 
  ctx.addPage(
    "/login",
    {
      page: () => {
        return LoginPage();
      },
      actions: {
        async login({ body }) {
          try {
            const { cookie } = await ctx.login(body);
            //

            return redirect({
              location: "/admin",
              headers: {
                "set-cookie": cookie,
              },
            });
          } catch (err) {
            return redirect({
              location: "/login",
              body: {
                message: err.message,
              },
            });
          }
        },
      },
    }
    // layout: Layout
  );
}
