import { View } from "@ulibs/components";
//
function PluginsPage() {
  return View("Plugins Plage");
}

export default function PluginManagementPlugin() {
  return {
    onStart(ctx) {
      ctx.addSidebarItem({
        href: "/admin/plugins",
        title: "Plugins",
        icon: "puzzle",
      });

      ctx.addPage("/admin/plugins", {
        page: PluginsPage,
        async load() {
          console.log("return list of plugins");

          return {
            title: "Plugins",
            plugins: [],
          };
        },
        actions: {
          async disable({ body }) {
            console.log("disable a plugin");
          },
          async enable({ body }) {
            console.log("enable a plugin");
          },
        },
      });
    },
  };
}
