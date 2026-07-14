import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getSaree } from "./sarees-D4QX0580.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saree._id-D5_ahWJM.js
var $$splitNotFoundComponentImporter = () => import("./saree._id-DUJJMozP.mjs");
var $$splitComponentImporter = () => import("./saree._id-DCl6V_8j.mjs");
var Route = createFileRoute("/saree/$id")({
	loader: ({ params }) => {
		const saree = getSaree(params.id);
		if (!saree) throw notFound();
		return { saree };
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [
		{ title: `${loaderData.saree.name} — Virtual Couture` },
		{
			name: "description",
			content: loaderData.saree.description
		},
		{
			property: "og:title",
			content: `${loaderData.saree.name} — Virtual Couture`
		},
		{
			property: "og:description",
			content: loaderData.saree.description
		},
		{
			property: "og:image",
			content: loaderData.saree.image
		}
	] : [{ title: "Not found" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent")
});
//#endregion
export { Route as t };
