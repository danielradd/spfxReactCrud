import * as React from 'react';
import { MessageBar, type PartialTheme, Stack, Text, ThemeProvider } from '@fluentui/react';
import * as strings from 'SpfxReactCrudWebPartStrings';
import type { IListItem } from '../../../services/list.service';
import { format } from '../../../utils/format';
import { useItemSelection } from '../hooks/use-item-selection';
import { useListCrud } from '../hooks/use-list-crud';
import { DeleteDialog } from './delete-dialog';
import { ItemForm } from './item-form';
import { ItemsTable } from './items-table';
import type { IProps } from './props';
import styles from './styles.module.scss';

export function SpfxReactCrud({ context, listName, theme }: IProps): React.ReactElement {
  const crud = useListCrud(context, listName);
  const { selection, selected, clear } = useItemSelection();
  const [pendingDelete, setPendingDelete] = React.useState<IListItem | undefined>(undefined);

  async function update(id: number, title: string): Promise<boolean> {
    const ok: boolean = await crud.updateItem(id, title);
    if (ok) {
      clear();
    }
    return ok;
  }

  async function confirmDelete(): Promise<void> {
    const item: IListItem | undefined = pendingDelete;
    setPendingDelete(undefined);
    if (item && await crud.deleteItem(item.Id)) {
      clear();
    }
  }

  return (
    <ThemeProvider theme={theme as PartialTheme | undefined} className={styles.spfxReactCrud}>
      <Stack tokens={{ childrenGap: 12 }}>
        <Text variant="xLarge" block>{format(strings.Heading, listName)}</Text>

        {crud.status && (
          <MessageBar messageBarType={crud.status.type} onDismiss={crud.dismissStatus} isMultiline>
            {crud.status.text}
          </MessageBar>
        )}

        <ItemForm
          selected={selected}
          busy={crud.busy}
          loading={crud.loading}
          onCreate={crud.createItem}
          onUpdate={update}
          onDelete={() => setPendingDelete(selected)}
          onCancel={clear}
          onRefresh={crud.refresh}
        />

        <ItemsTable items={crud.items} loading={crud.loading} selection={selection} />
      </Stack>

      <DeleteDialog
        item={pendingDelete}
        onConfirm={confirmDelete}
        onDismiss={() => setPendingDelete(undefined)}
      />
    </ThemeProvider>
  );
}
