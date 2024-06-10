export default {
	permalink({ title }) {
		return `${this.slugify(title)}.html`;
	},
};
