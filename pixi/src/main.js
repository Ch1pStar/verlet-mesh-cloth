import ClothDebug from './debug/ClothDebug.js';
import {getTxt} from './misc.js';

async function init() {
	window.debug = await ClothDebug.create('rtg-logo.svg');
}

document.addEventListener('DOMContentLoaded', init);
