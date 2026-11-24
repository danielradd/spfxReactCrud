import type { WebPartContext } from '@microsoft/sp-webpart-base';
import type { SPFI } from '@pnp/sp';
import type { IWeb } from '@pnp/sp/webs';
import { getSP } from '../../utils/get-sp';

export class BaseService {
  protected _web: IWeb;
  protected _sp: SPFI;

  public constructor(protected readonly _context: WebPartContext) {
    this._sp = getSP(this._context);
    this._web = this._sp.web;
  }
}
