import { spfi, SPFx, type SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

export function getSP(context: WebPartContext): SPFI {
  return spfi().using(SPFx(context));
}
