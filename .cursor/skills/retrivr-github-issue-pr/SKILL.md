---
name: retrivr-github-issue-pr
description: >-
  Creates GitHub issues and pull requests for RETRIVR-WEB with the correct
  work-type label (Feature, Fix, Refactor, Docs, Design, Add). Use when the
  user asks to create an issue, open a PR, set labels, or mentions gh issue/pr
  create for this repo.
---

# Retrivr GitHub Issue / PR

Respond in Korean. Repo: `TEAM-Retrivr/RETRIVR-WEB`. Use `gh` via Shell with network.

## Labels (exact names)

| Intent | Label | Branch prefix |
|--------|-------|---------------|
| New feature / API wiring | `Feature` | `feature/` |
| Bug / regression | `Fix` | `fix/` |
| Structure-only cleanup | `Refactor` | `refactor/` |
| Documentation only | `Docs` | `docs/` |
| Layout / CSS / UI polish | `Design` | `design/` |
| Scaffolding, assets, incomplete add | `Add` | `add/` |

Rules:

- Attach **exactly one** work-type label from the table.
- Prefer user intent → branch prefix → changed files.
- If UI/style files dominate a `feature/` change, use `Design` (repo convention).
- Never invent labels outside this set.

## Create issue

1. Infer label + title. Title form: `[RTR-xxx] short summary` when ticket known, else short summary.
2. Body: Task Description, TO-DO checklist, ETC (match `.github/ISSUE_TEMPLATE/*.yml` tone).
3. Create:

```bash
gh issue create --title "..." --body "$(cat <<'EOF'
...
EOF
)" --label "Feature"
```

4. Return the issue URL.

## Create PR

1. Ensure branch is pushed. Base defaults to `develop` unless user says `main`.
2. Infer label (branch / files / intent).
3. Fill `.github/PULL_REQUEST_TEMPLATE.md` sections; set `close #N` when an issue exists.
4. Title style used in this repo: `[RTR-xxx] summary` (or user-provided title).
5. Create with label:

```bash
gh pr create --base develop --title "..." --label "Design" --body "$(cat <<'EOF'
...
EOF
)"
```

6. Return the PR URL. Note that `.github/workflows/pr-auto-label.yml` may sync the work-type label on open/sync.

## Ship flow

If the user is shipping via develop/main merge, also follow `retrivr-ship`. Still pass `--label` on every `gh pr create`.
