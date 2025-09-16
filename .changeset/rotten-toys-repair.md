---
'eleventy-plugin-vento': patch
---

Update `debug` to 4.4.3.

4.4.3 handles a vulnerability in 4.4.2 which was never distributed by this package. Pinning 4.4.3 over 4.4.2 circumvents the now-yanked version.

See https://github.com/debug-js/debug/issues/1005#issuecomment-3293627810 for more information.
