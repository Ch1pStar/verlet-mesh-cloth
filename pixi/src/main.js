import Cloth from './Cloth.js';
import {addControls, getTxt} from './misc.js';

async function init() {
	const txt = await getTxt('rtg-logo.svg')
	const c = new Cloth(txt);

	addControls(c.points);
}

document.addEventListener('DOMContentLoaded', init);
