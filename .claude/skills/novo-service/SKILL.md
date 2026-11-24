---
name: novo-service
description: Cria um service PnPjs novo (ou método novo num service existente) e o hook que o usa, no padrão BaseService + getSP do projeto spfxReactCrud. Use quando pedirem acesso a outra lista, biblioteca, usuário ou qualquer dado novo do SharePoint neste projeto.
argument-hint: "<dominio> [o que ele lê ou grava]"
---

# Novo service

Argumentos: `$ARGUMENTS` (o primeiro é o domínio em kebab-case, ex. `document`; o resto descreve os dados).

## Passos

1. **Já existe service do domínio?** Se sim, acrescente o método nele em vez de criar outro arquivo.
2. **Arquivo:** `spfxReactCRUD/src/services/<dominio>.service.ts` (modelo: `list.service.ts`):
   ```ts
   import { BaseService } from './base/base.service';

   export interface I<Dominio>Item { Id: number; Title: string; }

   export class <Dominio>Service extends BaseService {
     public async getItems(...): Promise<I<Dominio>Item[]> {
       try {
         const items: I<Dominio>Item[] = await this._web.lists.getByTitle(...).items.select('Id', 'Title').top(100)();
         return items;
       } catch (error) {
         throw ...; // converter como em ListService._toServiceError
       }
     }
   }
   ```
   - Retornos do PnPjs são `any`: **sempre tipar**, e lembrar que `add()`/`update()` retornam o dado direto (sem `.data`)
   - Se o erro HTTP precisar de mensagem própria, reutilize `ListServiceError` e a conversão de `list.service.ts` (mova para `services/base/` quando passar a ter dois usos)
3. **Módulo PnP novo** (`@pnp/sp/files`, `@pnp/sp/site-users`…): importar em `src/utils/get-sp.ts`. Pacote `@pnp/*` novo: `npm install` e conferir o `package.json`.
4. **Hook:** `spfxReactCRUD/src/webparts/spfxReactCrud/hooks/use-<dominio>.ts`, no molde de `use-list-crud.ts` (service no `useMemo`, fetch no `useEffect` com `isMounted`, erro → texto de `loc/`).
5. **Strings** novas nos três arquivos de `loc/`.
6. **Verificar** com o checklist do `CLAUDE.md`.
