import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getSaree } from "./sarees-D4QX0580.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/try-on._id-C_qU4Kvm.js
var $$splitComponentImporter = () => import("./try-on._id-CezEA7rb.mjs");
var Route = createFileRoute("/try-on/$id")({
	loader: ({ params }) => {
		const saree = getSaree(params.id);
		if (!saree) throw notFound();
		return { saree };
	},
	head: () => ({ meta: [{
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
