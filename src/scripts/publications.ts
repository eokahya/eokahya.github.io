/** Progressive filtering of the publication list. Without JavaScript every record stays visible. */
const tools = document.querySelector<HTMLElement>('[data-pub-tools]');
const list = document.querySelector<HTMLElement>('[data-pub-list]');
if (tools && list) {
  tools.hidden = false;
  const items = Array.from(list.querySelectorAll<HTMLElement>('.pub'));
  const groups = Array.from(list.querySelectorAll<HTMLElement>('[data-year-group]'));
  const search = tools.querySelector<HTMLInputElement>('[data-search]')!;
  const counter = tools.querySelector<HTMLElement>('[data-result-count]')!;
  const empty = list.querySelector<HTMLElement>('[data-empty]')!;
  const state = { type: 'all', topic: 'all', query: '' };

  const params = new URLSearchParams(location.search);
  for (const key of ['type', 'topic'] as const) {
    const value = params.get(key);
    if (value && tools.querySelector(`[data-filter="${key}"] [data-value="${CSS.escape(value)}"]`)) state[key] = value;
  }

  function apply() {
    const words = state.query.toLowerCase().split(/\s+/).filter(Boolean);
    let shown = 0;
    for (const item of items) {
      const ok = (state.type === 'all' || item.dataset.type === state.type)
        && (state.topic === 'all' || (item.dataset.topics ?? '').split(' ').includes(state.topic))
        && words.every((word) => (item.dataset.search ?? '').includes(word));
      item.hidden = !ok;
      if (ok) shown++;
    }
    for (const group of groups) group.hidden = !group.querySelector('.pub:not([hidden])');
    empty.hidden = shown > 0;
    counter.textContent = (counter.dataset.template ?? '{shown} / {total}').replace('{shown}', String(shown)).replace('{total}', String(items.length));
    for (const key of ['type', 'topic'] as const) {
      tools!.querySelectorAll<HTMLButtonElement>(`[data-filter="${key}"] button`).forEach((button) => {
        button.setAttribute('aria-pressed', String(button.dataset.value === state[key]));
      });
    }
    const url = new URL(location.href);
    for (const key of ['type', 'topic'] as const) { if (state[key] === 'all') url.searchParams.delete(key); else url.searchParams.set(key, state[key]); }
    history.replaceState(null, '', url);
  }

  tools.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-value]');
    const group = button?.closest<HTMLElement>('[data-filter]');
    if (!button || !group) return;
    state[group.dataset.filter as 'type' | 'topic'] = button.dataset.value!;
    apply();
  });
  search.addEventListener('input', () => { state.query = search.value; apply(); });
  apply();
}
