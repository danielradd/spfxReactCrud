---
paths:
  - "spfxReactCRUD/src/**/*.tsx"
  - "spfxReactCRUD/src/webparts/**/hooks/*.ts"
---

# React (SPFx)

Sempre `import * as React from 'react'`.

## Componentes

```tsx
// ❌ NÃO
const Crud: React.FC<IProps> = (props) => { ... }
export default Crud

// ✅ SIM
export function ItemForm({ selected, busy, onCreate }: IItemFormProps): React.ReactElement { ... }
```

- Pasta kebab-case com `index.tsx`; `styles.module.scss` só se tiver estilo
- Import do filho pela pasta: `import { ItemForm } from './item-form'`
- Contrato WebPart ↔ App em `components/props.d.ts`; props de filho numa `interface` local no `index.tsx`
- `components/index.tsx` só compõe: estado de dados vem do hook, não de `useState` + fetch no componente
- Componente filho recebe dados e callbacks por props; não instancia service nem hook de dados
- Fluent UI v8 (`@fluentui/react`); textos de `strings` (`SpfxReactCrudWebPartStrings`), com `format()` de `src/utils/format.ts` para `{0}`
- `key` estável em listas (`item.Id`)

## Hooks

- Hooks da tela em `webparts/spfxReactCrud/hooks/use-*.ts`; `src/hooks/` só com reuso real
- O hook instancia o service (`React.useMemo(() => new XService(context), [context])`)
- Fetch em `useEffect` com flag `isMounted` e cleanup, como em `use-list-crud.ts`
- Erros viram texto de `loc/` no hook; o componente só exibe
- Escritas retornam `Promise<boolean>` (sucesso), para a tela limpar o formulário
- Preferir estado derivado a `useEffect` desnecessário
