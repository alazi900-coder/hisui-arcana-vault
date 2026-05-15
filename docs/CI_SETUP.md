# CI setup

The CI workflow lives in `docs/ci-workflow.yml.template` because the Devin OAuth
app that opened this PR does not have GitHub's `workflow` scope and therefore
cannot push files under `.github/workflows/`.

To enable CI, copy the template into place on `main` (or on this branch via the
GitHub web UI before merging):

```sh
mkdir -p .github/workflows
cp docs/ci-workflow.yml.template .github/workflows/ci.yml
git add .github/workflows/ci.yml
git commit -m "ci: enable lint/typecheck/test/build pipeline"
```

After the file is committed, every PR will run:

| Job | Steps |
|---|---|
| `lint-typecheck-test-build` | `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` |
| `e2e` | `npm ci`, `npx playwright install chromium`, `npm run test:e2e`, uploads `playwright-report/` artifact |

The `e2e` job depends on `lint-typecheck-test-build`.
