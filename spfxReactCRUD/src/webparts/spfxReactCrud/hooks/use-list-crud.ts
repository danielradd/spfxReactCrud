import * as React from 'react';
import { MessageBarType } from '@fluentui/react';
import type { WebPartContext } from '@microsoft/sp-webpart-base';
import * as strings from 'SpfxReactCrudWebPartStrings';
import { ListService, ListServiceError, type IListItem } from '../../../services/list.service';
import { format } from '../../../utils/format';

export interface IStatus {
  type: MessageBarType;
  text: string;
}

export interface IListCrud {
  items: IListItem[];
  /** First load or refresh of the items. */
  loading: boolean;
  /** A create, update or delete is running. */
  busy: boolean;
  status: IStatus | undefined;
  dismissStatus: () => void;
  refresh: () => void;
  /** Each write returns true on success, so the screen can reset its form. */
  createItem: (title: string) => Promise<boolean>;
  updateItem: (id: number, title: string) => Promise<boolean>;
  deleteItem: (id: number) => Promise<boolean>;
}

function errorText(error: unknown, listName: string): string {
  if (error instanceof ListServiceError) {
    if (error.status === 404) {
      return format(strings.ErrorListNotFound, listName);
    }
    if (error.status === 401 || error.status === 403) {
      return strings.ErrorAccessDenied;
    }
  }
  const detail: string = error instanceof Error ? error.message : String(error);
  return format(strings.ErrorGeneric, detail);
}

/** Items of the list and the CRUD actions on them. The service is only used here. */
export function useListCrud(context: WebPartContext, listName: string): IListCrud {
  const service: ListService = React.useMemo(() => new ListService(context), [context]);

  const [items, setItems] = React.useState<IListItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<IStatus | undefined>(undefined);
  const [reloadKey, setReloadKey] = React.useState<number>(0);

  const showError = React.useCallback((error: unknown): void => {
    setStatus({ type: MessageBarType.error, text: errorText(error, listName) });
  }, [listName]);

  React.useEffect(() => {
    let isMounted: boolean = true;

    async function fetchItems(): Promise<void> {
      setLoading(true);
      try {
        const data: IListItem[] = await service.getItems(listName);
        if (isMounted) {
          setItems(data);
        }
      } catch (error) {
        if (isMounted) {
          setItems([]);
          showError(error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchItems().catch((error: unknown) => {
      console.error('fetchItems failed', error);
    });

    return () => {
      isMounted = false;
    };
  }, [service, listName, reloadKey, showError]);

  // A new list name starts with a clean message area.
  React.useEffect(() => {
    setStatus(undefined);
  }, [listName]);

  const refresh = React.useCallback((): void => {
    setReloadKey((key) => key + 1);
  }, []);

  /** Runs a write, shows its message and reloads the items. */
  const runWrite = React.useCallback(async (operation: () => Promise<string>): Promise<boolean> => {
    setBusy(true);
    setStatus(undefined);
    try {
      const message: string = await operation();
      setStatus({ type: MessageBarType.success, text: message });
      refresh();
      return true;
    } catch (error) {
      showError(error);
      return false;
    } finally {
      setBusy(false);
    }
  }, [refresh, showError]);

  const createItem = React.useCallback((title: string): Promise<boolean> => runWrite(async () => {
    const item: IListItem = await service.createItem(listName, title);
    return format(strings.StatusCreated, item.Title, item.Id);
  }), [runWrite, service, listName]);

  const updateItem = React.useCallback((id: number, title: string): Promise<boolean> => runWrite(async () => {
    await service.updateItem(listName, id, title);
    return format(strings.StatusUpdated, id);
  }), [runWrite, service, listName]);

  const deleteItem = React.useCallback((id: number): Promise<boolean> => runWrite(async () => {
    await service.deleteItem(listName, id);
    return format(strings.StatusDeleted, id);
  }), [runWrite, service, listName]);

  const dismissStatus = React.useCallback((): void => setStatus(undefined), []);

  return { items, loading, busy, status, dismissStatus, refresh, createItem, updateItem, deleteItem };
}
