---
paths:
  - "spfxReactCRUD/src/**/*.scss"
---

# Styles

`styles.module.scss` na pasta do componente. Valores repetidos viram token em `src/styles/_variables.scss`.

```scss
// ❌ NÃO: sobra do Yeoman, valor fixo
.welcomeImage { max-width: 420px; }

// ✅ SIM
@use "../../../styles/variables" as *;

.spfxReactCrud {
  padding: $spacing-m;
  color: $body-text;
  color: var(--bodyText);
}
```

- Caminho do `@use` é relativo ao `.scss` (`components/` → `../../../styles/variables`; `components/{filho}/` → `../../../../styles/variables`)
- Cores de tema por `var(--bodyText)` (definida no `onThemeChanged` da WebPart) com fallback em token
- Sem classes mortas; sem `components/components/` só para isolar estilo
- Layout preferencialmente com `Stack` do Fluent UI; SCSS para o que o Stack não cobre
