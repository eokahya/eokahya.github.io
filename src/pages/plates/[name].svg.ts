import type { APIRoute, GetStaticPaths } from 'astro';
import { plateNames, plateSvg, type PlateName } from '../../lib/plates';

/** Static plate files (dark and light) used as the no-WebGL fallback on the home page. */
export const getStaticPaths: GetStaticPaths = () =>
  plateNames.flatMap((name) => (['dark', 'light'] as const).map((theme) => ({ params: { name: `${name}-${theme}` }, props: { name, theme } })));

export const GET: APIRoute = ({ props }) => {
  const { name, theme } = props as { name: PlateName; theme: 'dark' | 'light' };
  return new Response(plateSvg(name, theme), { headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' } });
};
