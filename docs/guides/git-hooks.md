# Git Hooks (Husky + lint-staged)

## Что запускается

При `git commit` автоматически выполняется `.husky/pre-commit`:

```
git commit
  |
  +-- lint-staged (только staged файлы)
  |     |
  |     +-- *.ts, *.tsx  -->  prettier --write  +  eslint --fix
  |     +-- *.json, *.css, *.md  -->  prettier --write
  |
  +-- pnpm typecheck (весь проект)
        |
        +-- react-router typegen
        +-- tsc -b
```

## Установка

```bash
pnpm install    # хуки ставятся автоматически через prepare скрипт
```

## Что делать если коммит не проходит

### ESLint ошибки
Починить ошибку → `git add` → `git commit` снова.

### TypeScript ошибки
Починить тип → `git add` → `git commit` снова.

### Prettier
Prettier запускается с `--write` — автоматически форматирует staged файлы.

## Как пропустить (крайний случай)

```bash
git commit --no-verify -m "hotfix: urgent fix"
```
