# Token Saving Skill

A skill for AI coding assistants (Cline, Claude Code, etc.) that optimizes token usage during every interaction. Reduces input token consumption and improves prompt cache hit rates.

## Why This Skill?

When using AI coding assistants, costs add up fast. A single session can burn through hundreds of thousands of tokens, and most of the waste comes from:

- Reading entire files when only a few lines are needed
- Re-reading files already in context
- Using the wrong tool (reading vs searching)
- Verbose output that bloats the context window

This skill teaches the AI to be precise: read what's needed, search before scanning, batch operations, and keep cache-friendly context ordering.

## Key Strategies

1. **Smart File Reading** ！ Use `search_files` and `list_code_definition_names` before `read_file`
2. **Search Before Scan** ！ Regex search returns only matching lines, not entire files
3. **Efficient Execution** ！ Batch tool calls, use the right tool, avoid redundant verification
4. **Concise Output** ！ No filler, no restating known info, just results
5. **Cache-Friendly Patterns** ！ Stable content first, variable content last

## Installation

### Via Cline / Claude Code

1. Clone this repository or copy the `token-saving` folder to your skills directory:
   - **Cline**: `~/.agents/skills/` or project `.cline/skills/`
   - **Claude Code**: `~/.agents/skills/` or project `.claude/skills/`

2. The skill activates automatically when relevant.

### Manual Install

```bash
git clone https://github.com/zeng111234/token-saving-skill.git
cp -r token-saving-skill/token-saving ~/.agents/skills/
```

## Project Structure

```
token-saving/
??? SKILL.md              # Main skill instructions
??? README.md             # This file
??? evals/
    ??? evals.json         # Test cases for evaluation
    ??? files/
        ??? test-project/  # Sample project for testing
            ??? config.json
            ??? src/
                ??? app.js
                ??? routes/
                ?   ??? api.js
                ??? services/
                ?   ??? cart.js
                ?   ??? order.js
                ??? utils/
                    ??? math.js
```

## How It Works

The skill is a set of guidelines loaded into the AI's context. When active, it influences how the AI:

- **Chooses tools**: search before read, list before scan
- **Reads files**: targeted reads, no re-reads, minimum necessary
- **Edits files**: `replace_in_file` over `write_to_file`
- **Composes output**: concise, no boilerplate, direct results

## License

MIT