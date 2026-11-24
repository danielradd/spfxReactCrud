import type { HttpRequestError } from '@pnp/queryable';
import { BaseService } from './base/base.service';

/** An item of the target list. Only the default columns are used. */
export interface IListItem {
  Id: number;
  Title: string;
}

/** Error returned by SharePoint, with the HTTP status code so the UI can pick a friendly message. */
export class ListServiceError extends Error {
  public readonly status: number;

  public constructor(status: number, message: string) {
    super(message);
    this.name = 'ListServiceError';
    this.status = status;
  }
}

/**
 * CRUD on a SharePoint list through PnPjs.
 * The list is addressed by its title and only needs the default Title column.
 */
export class ListService extends BaseService {
  /** Returns the most recent items first. */
  public async getItems(listName: string, top: number = 100): Promise<IListItem[]> {
    try {
      const items: IListItem[] = await this._web.lists
        .getByTitle(listName)
        .items.select('Id', 'Title')
        .orderBy('Id', false)
        .top(top)();

      return items.map((item) => ({ Id: item.Id, Title: item.Title }));
    } catch (error) {
      throw ListService._toServiceError(error);
    }
  }

  public async createItem(listName: string, title: string): Promise<IListItem> {
    try {
      // PnPjs v4: add() resolves to the created item itself (no ".data" wrapper as in v2/v3).
      const item: IListItem = await this._web.lists.getByTitle(listName).items.add({ Title: title });
      return { Id: item.Id, Title: item.Title };
    } catch (error) {
      throw ListService._toServiceError(error);
    }
  }

  public async updateItem(listName: string, id: number, title: string): Promise<void> {
    try {
      await this._web.lists.getByTitle(listName).items.getById(id).update({ Title: title });
    } catch (error) {
      throw ListService._toServiceError(error);
    }
  }

  public async deleteItem(listName: string, id: number): Promise<void> {
    try {
      await this._web.lists.getByTitle(listName).items.getById(id).delete();
    } catch (error) {
      throw ListService._toServiceError(error);
    }
  }

  private static _toServiceError(error: unknown): Error {
    if (ListService._isHttpRequestError(error)) {
      return new ListServiceError(error.status, ListService._serverMessage(error));
    }
    return error instanceof Error ? error : new Error(String(error));
  }

  private static _isHttpRequestError(error: unknown): error is HttpRequestError {
    return typeof error === 'object'
      && error !== null
      && (error as Partial<HttpRequestError>).isHttpRequestError === true;
  }

  /**
   * PnPjs puts the response body after "::>" in the message.
   * Returns SharePoint's own text (odata.error.message.value) when it is there.
   */
  private static _serverMessage(error: HttpRequestError): string {
    const separator: number = error.message.indexOf('::>');
    if (separator >= 0) {
      try {
        const body: { 'odata.error'?: { message?: { value?: string } } } =
          JSON.parse(error.message.substring(separator + 3).trim());
        const value: string | undefined = body['odata.error']?.message?.value;
        if (value) {
          return value;
        }
      } catch {
        // Body is not JSON: fall back to the status text.
      }
    }
    return error.statusText || error.message;
  }
}
