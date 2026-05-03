# Taskfile — task runner

Проект использует [go-task](https://taskfile.dev) как task runner. Все задачи описаны в `Taskfile.yml`.

## Установка

go-task ставится автоматически при `pnpm install` как devDependency (`@go-task/cli`).

## Использование

```bash
npx task --list        # список задач
npx task lint          # ESLint
npx task test          # unit-тесты
npx task check         # lint + typecheck + format параллельно
```

## Структура

| Группа      | Задачи                                                             |
| ----------- | ------------------------------------------------------------------ |
| Dev & Build | `dev`, `build`, `preview`                                          |
| Quality     | `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `check` |
| Unit-тесты  | `test`, `test:watch`                                               |

## Связь с package.json

В `package.json` остались только скрипты для: husky hooks, CI/CD, release, lifecycle.
Всё остальное — через `npx task`.
