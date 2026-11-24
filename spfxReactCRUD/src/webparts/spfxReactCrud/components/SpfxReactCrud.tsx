import * as React from 'react';
import {
  DefaultButton,
  DetailsList,
  DetailsListLayoutMode,
  Dialog,
  DialogFooter,
  DialogType,
  type IColumn,
  MessageBar,
  MessageBarType,
  type PartialTheme,
  PrimaryButton,
  Selection,
  SelectionMode,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TextField,
  ThemeProvider
} from '@fluentui/react';
import * as strings from 'SpfxReactCrudWebPartStrings';

import styles from './SpfxReactCrud.module.scss';
import type { ISpfxReactCrudProps } from './ISpfxReactCrudProps';
import type { IListItem } from '../models/IListItem';
import { ListService, ListServiceError } from '../services/ListService';

interface IStatus {
  type: MessageBarType;
  text: string;
}

/** Replaces {0}, {1}… with the given values. */
function format(template: string, ...values: (string | number)[]): string {
  return template.replace(/\{(\d+)\}/g, (match: string, index: string) => {
    const value: string | number | undefined = values[Number(index)];
    return value === undefined ? match : String(value);
  });
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

const columns: IColumn[] = [
  { key: 'id', name: strings.ColumnId, fieldName: 'Id', minWidth: 40, maxWidth: 70 },
  { key: 'title', name: strings.ColumnTitle, fieldName: 'Title', minWidth: 200, isMultiline: true }
];

const SpfxReactCrud: React.FC<ISpfxReactCrudProps> = (props) => {
  const { listName, spHttpClient, siteUrl, theme } = props;

  const service: ListService = React.useMemo(
    () => new ListService(spHttpClient, siteUrl, listName),
    [spHttpClient, siteUrl, listName]
  );

  const [items, setItems] = React.useState<IListItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [busy, setBusy] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<IStatus | undefined>(undefined);
  const [title, setTitle] = React.useState<string>('');
  const [selected, setSelected] = React.useState<IListItem | undefined>(undefined);
  const [confirmDelete, setConfirmDelete] = React.useState<boolean>(false);

  const selection: Selection = React.useMemo(
    () => new Selection({
      onSelectionChanged: () => {
        const item: IListItem | undefined = selection.getSelection()[0] as IListItem | undefined;
        setSelected(item);
        setTitle(item ? item.Title || '' : '');
      }
    }),
    []
  );

  const loadItems = React.useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      setItems(await service.getItems());
    } catch (error) {
      setItems([]);
      setStatus({ type: MessageBarType.error, text: errorText(error, listName) });
    } finally {
      setLoading(false);
    }
  }, [service, listName]);

  React.useEffect(() => {
    setStatus(undefined);
    loadItems().catch(() => { /* handled in loadItems */ });
  }, [loadItems]);

  /** Runs a write operation, shows the result and reloads the list. */
  const run = async (operation: () => Promise<string>): Promise<void> => {
    setBusy(true);
    setStatus(undefined);
    try {
      const message: string = await operation();
      selection.setAllSelected(false);
      setTitle('');
      setStatus({ type: MessageBarType.success, text: message });
      await loadItems();
    } catch (error) {
      setStatus({ type: MessageBarType.error, text: errorText(error, listName) });
    } finally {
      setBusy(false);
    }
  };

  const onCreate = (): Promise<void> => run(async () => {
    const item: IListItem = await service.createItem(title.trim());
    return format(strings.StatusCreated, item.Title, item.Id);
  });

  const onUpdate = (): Promise<void> => run(async () => {
    const id: number = selected!.Id;
    await service.updateItem(id, title.trim());
    return format(strings.StatusUpdated, id);
  });

  const onDelete = (): Promise<void> => {
    setConfirmDelete(false);
    return run(async () => {
      const id: number = selected!.Id;
      await service.deleteItem(id);
      return format(strings.StatusDeleted, id);
    });
  };

  const hasTitle: boolean = title.trim().length > 0;

  return (
    <ThemeProvider theme={theme as PartialTheme | undefined} className={styles.spfxReactCrud}>
      <Stack tokens={{ childrenGap: 12 }}>
        <Text variant="xLarge" block>{format(strings.Heading, listName)}</Text>

        {status && (
          <MessageBar messageBarType={status.type} onDismiss={() => setStatus(undefined)} isMultiline>
            {status.text}
          </MessageBar>
        )}

        <Stack horizontal wrap verticalAlign="end" tokens={{ childrenGap: 8 }}>
          <Stack.Item grow className={styles.titleField}>
            <TextField
              label={selected ? format(strings.TitleFieldEditLabel, selected.Id) : strings.TitleFieldNewLabel}
              value={title}
              onChange={(_, value) => setTitle(value || '')}
              disabled={busy}
            />
          </Stack.Item>
          {selected ? (
            <>
              <PrimaryButton text={strings.ButtonSave} iconProps={{ iconName: 'Save' }} onClick={onUpdate} disabled={busy || !hasTitle} />
              <DefaultButton text={strings.ButtonDelete} iconProps={{ iconName: 'Delete' }} onClick={() => setConfirmDelete(true)} disabled={busy} />
              <DefaultButton text={strings.ButtonCancel} onClick={() => selection.setAllSelected(false)} disabled={busy} />
            </>
          ) : (
            <PrimaryButton text={strings.ButtonCreate} iconProps={{ iconName: 'Add' }} onClick={onCreate} disabled={busy || !hasTitle} />
          )}
          <DefaultButton text={strings.ButtonRefresh} iconProps={{ iconName: 'Refresh' }} onClick={loadItems} disabled={busy || loading} />
        </Stack>

        {loading ? (
          <Spinner size={SpinnerSize.large} label={strings.Loading} />
        ) : items.length === 0 ? (
          <Text>{strings.EmptyList}</Text>
        ) : (
          <DetailsList
            items={items}
            columns={columns}
            selection={selection}
            selectionMode={SelectionMode.single}
            selectionPreservedOnEmptyClick
            layoutMode={DetailsListLayoutMode.justified}
            getKey={(item: IListItem) => String(item.Id)}
            setKey="items"
          />
        )}
      </Stack>

      <Dialog
        hidden={!confirmDelete}
        onDismiss={() => setConfirmDelete(false)}
        dialogContentProps={{
          type: DialogType.normal,
          title: strings.DeleteDialogTitle,
          subText: selected ? format(strings.DeleteDialogText, selected.Title, selected.Id) : ''
        }}
        modalProps={{ isBlocking: true }}
      >
        <DialogFooter>
          <PrimaryButton text={strings.ButtonDelete} onClick={onDelete} />
          <DefaultButton text={strings.ButtonCancel} onClick={() => setConfirmDelete(false)} />
        </DialogFooter>
      </Dialog>
    </ThemeProvider>
  );
};

export default SpfxReactCrud;
