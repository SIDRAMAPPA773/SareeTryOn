//#region node_modules/.nitro/vite/services/ssr/assets/tryon-store-CwsnO9F2.js
var KEY = "vc.tryon.history";
var CURRENT = "vc.tryon.current";
function isBrowser() {
	return typeof window !== "undefined";
}
function getHistory() {
	if (!isBrowser()) return [];
	try {
		return JSON.parse(localStorage.getItem(KEY) || "[]");
	} catch {
		return [];
	}
}
function saveEntry(entry) {
	if (!isBrowser()) return;
	const list = getHistory();
	list.unshift(entry);
	localStorage.setItem(KEY, JSON.stringify(list.slice(0, 24)));
	localStorage.setItem(CURRENT, entry.id);
}
function getEntry(id) {
	return getHistory().find((e) => e.id === id);
}
function newId() {
	return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
//#endregion
export { saveEntry as i, getHistory as n, newId as r, getEntry as t };
