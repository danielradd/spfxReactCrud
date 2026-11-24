import { SPHttpClient, type SPHttpClientResponse } from '@microsoft/sp-http';
import type { IListItem } from '../models/IListItem';

/** Error returned by SharePoint, with the HTTP status code so the UI can pick a friendly message. */
export class ListServiceError extends Error {
  public readonly status: number;

  public constructor(status: number, message: string) {
    super(message);
    this.name = 'ListServiceError';
    this.status = status;
  }
}

const JSON_NO_METADATA: string = 'application/json;odata=nometadata';

/**
 * CRUD access to a SharePoint list through the REST API.
 * The list only needs the default Title column.
 */
export class ListService {
  private readonly _spHttpClient: SPHttpClient;
  private readonly _listUrl: string;

  public constructor(spHttpClient: SPHttpClient, siteUrl: string, listName: string) {
    this._spHttpClient = spHttpClient;
    // OData string literals escape a single quote by doubling it.
    const odataTitle: string = encodeURIComponent(listName.replace(/'/g, "''"));
    this._listUrl = `${siteUrl}/_api/web/lists/getbytitle('${odataTitle}')`;
  }

  /** Returns the most recent items first. */
  public async getItems(top: number = 100): Promise<IListItem[]> {
    const response: SPHttpClientResponse = await this._spHttpClient.get(
      `${this._listUrl}/items?$select=Id,Title&$orderby=Id desc&$top=${top}`,
      SPHttpClient.configurations.v1,
      { headers: { Accept: JSON_NO_METADATA } }
    );
    await ListService._ensureOk(response);
    const data: { value: IListItem[] } = await response.json();
    return data.value;
  }

  public async createItem(title: string): Promise<IListItem> {
    const response: SPHttpClientResponse = await this._spHttpClient.post(
      `${this._listUrl}/items`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: JSON_NO_METADATA,
          'Content-Type': JSON_NO_METADATA
        },
        body: JSON.stringify({ Title: title })
      }
    );
    await ListService._ensureOk(response);
    const item: IListItem = await response.json();
    return { Id: item.Id, Title: item.Title };
  }

  public async updateItem(id: number, title: string): Promise<void> {
    const response: SPHttpClientResponse = await this._spHttpClient.post(
      `${this._listUrl}/items(${id})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: JSON_NO_METADATA,
          'Content-Type': JSON_NO_METADATA,
          'IF-MATCH': '*',
          'X-HTTP-Method': 'MERGE'
        },
        body: JSON.stringify({ Title: title })
      }
    );
    await ListService._ensureOk(response);
  }

  public async deleteItem(id: number): Promise<void> {
    const response: SPHttpClientResponse = await this._spHttpClient.post(
      `${this._listUrl}/items(${id})`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: JSON_NO_METADATA,
          'IF-MATCH': '*',
          'X-HTTP-Method': 'DELETE'
        }
      }
    );
    await ListService._ensureOk(response);
  }

  private static async _ensureOk(response: SPHttpClientResponse): Promise<void> {
    if (response.ok) {
      return;
    }

    let message: string = response.statusText;
    try {
      const body: { 'odata.error'?: { message?: { value?: string } } } = await response.json();
      message = body['odata.error']?.message?.value || message;
    } catch {
      // Body is not JSON: keep the status text.
    }
    throw new ListServiceError(response.status, message);
  }
}
