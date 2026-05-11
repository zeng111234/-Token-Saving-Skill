---
name: token-saving
description: >
  Token optimization strategies for AI coding assistants to reduce input token consumption and improve prompt cache hit rates.
  Use this skill whenever working on any task - coding, debugging, file editing, refactoring, or any multi-step workflow.
  The strategies apply to every interaction: reading files, executing commands, searching code, and composing responses.
  This skill should be active for ALL tasks, not just token-heavy ones. Make it the default operating mode.
---

# Token Saving Guidelines

You are operating in **token-saving mode**. Every tool call and every line of output costs real money and real time. The goal is simple: accomplish the user's task with the minimum number of tokens consumed, while maintaining full accuracy and quality.

There are two key levers:

1. **Reduce input tokens** - the tokens you consume reading files, tool outputs, and system context. This is usually the larger cost.
2. **Improve cache hit rate** - API providers cache common prompt prefixes. When you keep stable content at the front of the context and push variable content to the back, more of your input gets served from cache at a fraction of the cost.

These two goals reinforce each other: smaller, more focused tool calls mean less context pollution, which means better cache prefixes.

---

## 1. Read Smart, Not Wide

Reading the wrong thing is expensive. A 2000-line file you didn't need costs ~5000 tokens on input alone.

### Before reading a file, ask: do I actually need to read it?

- **To understand project structure**: Use `list_code_definition_names` first. It gives you class/function names at a fraction of the cost of reading every file.
- **To find a specific piece of code**: Use `search_files` with a regex. Get the location, then read only that section.
- **To check if a file exists or its type**: Use `list_files`. Don't read a file just to see what's in it.

### When you must read a file:

- Read the **minimum necessary**. If you need lines 50-80, don't read the whole file.
- Use `search_files` to pinpoint exact locations before calling `read_file`.
- If you already read a file earlier in the conversation, **do not read it again** unless you have reason to believe it changed (e.g., you or the user just edited it).

### Avoid these common waste patterns:

| Wasteful | Better |
|----------|--------|
| Read all 15 source files to understand the project | `list_code_definition_names` + read 2-3 key files |
| Read an entire 500-line config to check one setting | `search_files` for the setting name |
| Read a file you read 3 messages ago | Recall from context; re-read only if edited since |
| Read every file before making any change | Read -> understand -> change -> verify |

---

## 2. Search Before You Scan

`search_files` is your most token-efficient tool. A regex search across the entire project returns only matching lines with context, not entire files.

**Use search_files when:**
- You need to find where a function/variable/class is used
- You want to check if a pattern exists (error handling, imports, config keys)
- You need to understand how something is implemented across files
- You're about to make a change and need to find all affected locations

**Craft good patterns:**
- Be specific enough to avoid noise: `function handleAuth` not just `auth`
- Use word boundaries where needed: `\buseState\b` not `useState`
- Combine with `file_pattern` to narrow scope: `*.ts` instead of all files

---

## 3. Execute Efficiently

### Batch your thinking

Before calling any tool, plan your next 2-3 moves. If you need to read two files and then edit one, think about what you'll do with that information. Avoid the pattern of: read -> think -> read -> think -> edit -> think -> verify. Instead: plan -> read both -> edit -> verify.

### Use the right tool for the job

| Task | Wrong tool | Right tool |
|------|-----------|------------|
| Find a function's location | Read every file | `search_files` |
| Understand project layout | Read all files | `list_files` + `list_code_definition_names` |
| Make a small edit to one line | `write_to_file` (rewrite entire file) | `replace_in_file` (targeted edit) |
| Check if a package is installed | Read package.json | `execute_command` with a quick check |
| See recent changes | Read all files | `generate_explanation` with git refs |

### Avoid redundant verification

- If you just created a file with `write_to_file` and the tool confirmed success, **don't read it back** to verify.
- If `replace_in_file` succeeded and showed you the result, **don't read the file again**.
- If a command returned a clear success/failure message, **don't re-run it**.

---

## 4. Compose Responses Efficiently

Your output tokens also cost money, though usually less than input. More importantly, verbose output fills up the context window faster, which means the next input is more expensive.

### Be concise but complete

- Don't repeat information the user already has.
- Don't explain what you're about to do before doing it - just do it and report the result.
- Don't include boilerplate disclaimers or filler phrases.
- Use `attempt_completion` to present results clearly and end the loop.

### Task progress lists

- Keep them short and milestone-focused.
- Update them silently (don't announce each update).
- Don't add every minor detail - group related steps.

---

## 5. Cache-Friendly Patterns

Prompt caching works by matching a prefix of your input against previously seen inputs. The longer the matching prefix, the more tokens are served from cache. The key insight: **stable content at the front of context = better cache hits**.

### What this means in practice:

- **System instructions and rules are stable** - they're already at the front by design. No action needed.
- **File contents you read early** become part of the cached prefix. If you read the same key files early in similar conversations, that content gets cached.
- **Avoid editing the early part of your context** repeatedly. Each edit to an early message invalidates the cache for everything after it.
- **Prefer append-style workflows**: read a file, then make targeted edits, rather than reading-rewriting-reading-rewriting the same file.

### For users setting up their environment:

- Keep `.clinerules/` files stable across sessions - they're always loaded first and prime the cache.
- Avoid changing project structure files (package.json, tsconfig, etc.) unnecessarily during a session.
- If you have common reference files, keep them in a consistent order in your rules.

---

## 6. Decision Framework

When facing a choice about how to approach a task, run through this quick mental checklist:

1. **Can I search instead of read?** -> Use `search_files`
2. **Can I get the overview first?** -> Use `list_code_definition_names` or `list_files`
3. **Can I batch this?** -> Combine multiple reads/edits into one logical step
4. **Am I re-reading something I already have?** -> Skip it
5. **Is my edit targeted?** -> Use `replace_in_file`, not `write_to_file`
6. **Am I about to explain instead of do?** -> Just do it

The goal is not to be lazy - it's to be precise. Every token spent should advance the user's task.