import { getRefs } from './getRefs';

const refs = getRefs();

export function clearMarkup() {
  refs.listEl.innerHTML = '';
  refs.infoEl.innerHTML = '';
}
