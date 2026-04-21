// Kaldon split-domain URL helpers.
//
// Marketing site lives at https://kaldon.io, app lives at https://app.kaldon.io.
// Every outbound CTA from marketing needs an absolute URL to the app domain
// with UTM params attached so attribution survives the domain hop.
//
// Convention:
//   utm_source=marketing_site
//   utm_medium=cta
//   utm_campaign={page_slug}
//
// Campaign slugs describe the PAGE/COMPONENT a CTA originated from. Examples:
//   - "home", "home_hero", "home_final_cta"
//   - "pricing", "pricing_final_cta"
//   - "use_cases_agencies", "compare_research_tools"
//   - "blog_{post-slug}"
//   - "nav" (navigation CTAs shared across pages)

export const MARKETING_URL = 'https://kaldon.io';
export const APP_URL = 'https://app.kaldon.io';

export interface AppUrlOptions {
  /** Additional query params to append after the UTM triplet (e.g. plan=pro). */
  extra?: Record<string, string>;
}

/**
 * Build an absolute URL to the Kaldon app with UTM attribution attached.
 *
 * @param path Path on the app, leading slash optional (e.g. "/signup" or "signup")
 * @param campaign Page or component identifier; populated into utm_campaign
 * @param options.extra Extra query params (preserved alongside UTMs)
 */
export function appUrl(path: string, campaign: string, options: AppUrlOptions = {}): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(cleanPath, APP_URL);
  url.searchParams.set('utm_source', 'marketing_site');
  url.searchParams.set('utm_medium', 'cta');
  url.searchParams.set('utm_campaign', campaign);
  if (options.extra) {
    for (const [key, value] of Object.entries(options.extra)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

/**
 * Build an absolute URL to a marketing-site page. Used by the app (and by
 * sitemap/canonical tags within marketing) to produce deterministic absolute
 * links that survive split-domain routing.
 */
export function marketingUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(cleanPath, MARKETING_URL).toString();
}
