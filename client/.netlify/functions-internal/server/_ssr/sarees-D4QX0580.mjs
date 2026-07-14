//#region node_modules/.nitro/vite/services/ssr/assets/sarees-D4QX0580.js
var sarees = [
	{
		id: "kanjivaram-maroon",
		name: "Rubina Kanjivaram",
		subtitle: "Deep maroon silk with pure zari",
		price: 42500,
		category: "Silk",
		image: "/assets/saree-1-BZCnoGay.jpg",
		palette: ["#5b0a1a", "#c9a24a"],
		description: "Hand-woven Kanjivaram in a rich crimson tone, finished with a traditional gold zari border and lotus motifs.",
		fabric: "Pure mulberry silk with real zari",
		origin: "Kanchipuram, Tamil Nadu"
	},
	{
		id: "banarasi-royal",
		name: "Nila Banarasi",
		subtitle: "Royal blue silk with gold brocade",
		price: 38900,
		category: "Silk",
		image: "/assets/saree-2-DmPO4a3v.jpg",
		palette: ["#0f2a6b", "#d4a44a"],
		description: "A regal Banarasi silk saree woven with intricate gold brocade motifs and a rich pallu.",
		fabric: "Katan silk with zari brocade",
		origin: "Varanasi, Uttar Pradesh"
	},
	{
		id: "cotton-emerald",
		name: "Vana Cotton",
		subtitle: "Emerald green handloom cotton",
		price: 8900,
		category: "Cotton",
		image: "/assets/saree-3-CyT9XCd9.jpg",
		palette: ["#0e8a4a", "#f4efe3"],
		description: "Breathable handloom cotton in a fresh emerald tone with delicate white block prints.",
		fabric: "Handloom cotton",
		origin: "Chettinad, Tamil Nadu"
	},
	{
		id: "georgette-blush",
		name: "Aara Blush Georgette",
		subtitle: "Blush pink with silver sequin",
		price: 24500,
		category: "Georgette",
		image: "/assets/saree-4-Y87-aQJk.jpg",
		palette: ["#f5c3ce", "#cfcfd6"],
		description: "Flowing georgette in a soft blush hue, hand-embellished with subtle silver sequin work.",
		fabric: "Pure georgette with sequin embroidery",
		origin: "Surat, Gujarat"
	},
	{
		id: "tissue-ivory",
		name: "Divya Tissue Silk",
		subtitle: "Ivory tissue with peacock motifs",
		price: 32900,
		category: "Silk",
		image: "/assets/saree-5-BPNZG_RQ.jpg",
		palette: ["#f0e6c8", "#c69240"],
		description: "Luminous ivory tissue silk featuring hand-woven peacock motifs on a warm gold border.",
		fabric: "Tissue silk with zari",
		origin: "Bengaluru, Karnataka"
	},
	{
		id: "georgette-noir",
		name: "Kaya Noir",
		subtitle: "Jet black georgette, gold sequin border",
		price: 27500,
		category: "Georgette",
		image: "/assets/saree-6-BvDRjNLj.jpg",
		palette: ["#0a0a0a", "#c9a24a"],
		description: "A dramatic black georgette drape with a molten gold sequin border — pure evening glamour.",
		fabric: "Georgette with hand-cut sequin work",
		origin: "Mumbai, Maharashtra"
	}
];
function getSaree(id) {
	return sarees.find((s) => s.id === id);
}
function formatPrice(v) {
	return "₹" + v.toLocaleString("en-IN");
}
//#endregion
export { getSaree as n, sarees as r, formatPrice as t };
