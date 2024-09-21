import { $, fs } from 'zx';

await $`pnpm changeset status --output ./_status.json`;

const status = await fs.readJSON('./_status.json');

if (status.changesets.length === 0 && status.releases.length === 0) {
	$`echo run_release=true`;
} else {
	$`echo run_releasae=false`;
}
