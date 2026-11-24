# spfx-react-crud

Web part do SharePoint Framework que cria, lê, atualiza e exclui itens de uma lista do SharePoint usando React, Fluent UI v8 e `SPHttpClient` (REST).

![version](https://img.shields.io/badge/SPFx-1.24.2-green.svg) ![node](https://img.shields.io/badge/Node-22_LTS-green.svg)

## O que faz

- Mostra os itens da lista (ID e Título) num `DetailsList`, os mais recentes primeiro
- **Criar:** digite um título e clique em *Adicionar*
- **Editar:** selecione um item, altere o título e clique em *Salvar*
- **Excluir:** selecione um item e clique em *Excluir* (pede confirmação; o item vai para a lixeira)
- Mostra mensagens claras quando a lista não existe ou o usuário não tem permissão
- Segue o tema do site (inclusive seções com fundo escuro) e tem textos em pt-br e en-us

## Lista esperada

Qualquer lista do site que tenha a coluna padrão **Título** (`Title`). Não é preciso criar outras colunas.

O nome da lista é configurado no painel de propriedades do web part (*Nome da lista*). O padrão é **`Sample`**.

## Pré-requisitos

- Node.js **22 LTS** (`>=22.14`). Com nvm: `nvm use` (o projeto tem `.nvmrc`)
- Permissão de edição na lista e de edição de página no site
- Para publicar: acesso ao App Catalog do tenant

Os dados da lista são acessados com **PnPjs v4** (`@pnp/sp`).

A toolchain é **Heft** (SPFx 1.22+). Não precisa de gulp nem de pacotes globais.

## Desenvolvimento

O `config/serve.json` não guarda o endereço de nenhum tenant: ele usa o token `{tenantDomain}`, que o Heft troca pelo valor da variável de ambiente **`SPFX_SERVE_TENANT_DOMAIN`**. Defina uma vez na sua máquina (por exemplo no `~/.bashrc`):

```bash
# só o domínio: abre https://contoso.sharepoint.com/SitePages/Home.aspx
export SPFX_SERVE_TENANT_DOMAIN=contoso.sharepoint.com

# ou domínio + site, para abrir a página inicial de um site específico
export SPFX_SERVE_TENANT_DOMAIN=contoso.sharepoint.com/sites/MeuSite
```

```bash
nvm use
npm install
npm start          # heft start --clean, serve em https://localhost:4321
```

O `npm start` abre essa página já com os parâmetros de debug. Para abrir outra página à mão, acrescente ao endereço dela:

```
?debug=true&noredir=true&debugManifestsFile=https://localhost:4321/temp/build/manifests.js
```

A configuração "SharePoint page (debug)" do `.vscode/launch.json` usa a mesma variável.

Aceite "Carregar scripts de depuração", edite a página e adicione o web part **SPFx React CRUD**.

> Na primeira vez, o navegador pode recusar o certificado de `localhost:4321`. Abra `https://localhost:4321/temp/build/manifests.js` e aceite o certificado.

## Build e deploy

```bash
npm run build      # build de produção + pacote
```

Gera `sharepoint/solution/spfx-react-crud.sppkg`. Suba esse arquivo no App Catalog do tenant e, no site, adicione o app (ou atualize, se a versão anterior já estiver instalada; o ID da solução é o mesmo).

## Estrutura

```
src/
├── services/
│   ├── base/base.service.ts       # BaseService: SPFI + web via getSP
│   └── list.service.ts            # CRUD da lista (PnPjs)
├── utils/
│   ├── get-sp.ts                  # bootstrap único do PnPjs
│   └── format.ts                  # "{0}" nas strings de loc/
├── styles/_variables.scss         # tokens de estilo
└── webparts/spfxReactCrud/
    ├── SpfxReactCrudWebPart.ts    # propriedades, tema, monta o App
    ├── App.tsx
    ├── hooks/
    │   ├── use-list-crud.ts       # itens, status e ações (usa o ListService)
    │   └── use-item-selection.ts  # seleção da tabela
    ├── components/
    │   ├── index.tsx              # tela: compõe os filhos
    │   ├── props.d.ts             # contrato WebPart ↔ App
    │   ├── item-form/             # campo de título + botões
    │   ├── items-table/           # DetailsList / carregando / vazio
    │   └── delete-dialog/         # confirmação de exclusão
    └── loc/                       # textos en-us e pt-br
```

As regras de estrutura e código para o Claude Code estão no `CLAUDE.md` e em `.claude/` (na raiz do repositório).

## Histórico

| Versão  | Data       | Comentário |
| ------- | ---------- | ---------- |
| 2.0.0.0 | 23/11/2026 | Upgrade SPFx 1.7.1 → 1.24.2 (Node 22, Heft, React 18), lista configurável, UI com Fluent UI |
| 1.0.0.0 | 2019       | Versão inicial (SPFx 1.7.1) |
