// Nations by Numbers — entry point: render the current hash route and
// re-render whenever the hash changes (back/forward buttons included).
import { route } from './views.js';

window.addEventListener('hashchange', route);
route();
