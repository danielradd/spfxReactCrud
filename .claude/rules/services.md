---
paths:
  - "spfxReactCRUD/src/services/**/*.ts"
  - "spfxReactCRUD/src/utils/get-sp.ts"
---

# Services (PnPjs v4)

PnP só via `getSP` (`src/utils/get-sp.ts`). Cada `{dominio}.service.ts` estende `BaseService` e usa `this._web`.

```ts
// ❌ NÃO: no onInit da WebPart ou no componente
this.sp = spfi().using(SPFx(this.context));
await sp.web.lists.getByTitle(listName).items();

// ✅ SIM
export class ListService extends BaseService {
  public async getItems(listName: string): Promise<IListItem[]> { ... }
}
```

- Não chamar `spfi()` no `onInit`; não passar `SPFI`/`SPHttpClient` como prop
- Interface do dado (`IListItem`) exportada no próprio service
- Cada método com `try/catch` convertendo o erro: `HttpRequestError` → `ListServiceError(status, mensagem do SharePoint)`
- Mensagem para o usuário **não** sai do service: o hook traduz o `status` (404, 401/403) para `loc/`
- Imports de PnP (`@pnp/sp/lists`, `@pnp/sp/items`…) ficam no `get-sp.ts`, com o pacote no `package.json`

## Armadilhas do PnPjs v4

- `items.add()` e `item.update()` retornam o dado **direto**, tipado como `any`. **Não existe** `result.data` (era v2/v3): compila e quebra em execução
- Sempre tipar o retorno: `const item: IListItem = await list.items.add({ Title })`
- `update()` e `delete()` já mandam `IF-MATCH: *`
- `.select()` + `.top()` para não trazer colunas e itens à toa
