// Finds AI agent CLIs (Claude Code, Codex, Gemini CLI...) running in terminals, from command
// lines. Pure, so it can be unit-tested; the process listing is in agentTerminals.ts.

export interface AgentCli {
  id: string;
  label: string;
}

/** Known agent CLIs: program names, and npm packages whose script a runtime runs. */
const AGENT_CLIS: readonly (AgentCli & { names: string[]; packages?: RegExp })[] = [
  {
    id: 'claude',
    label: 'Claude Code',
    names: ['claude'],
    packages: /@anthropic-ai[\\/]claude-code/i,
  },
  { id: 'codex', label: 'Codex', names: ['codex'], packages: /@openai[\\/]codex/i },
  { id: 'gemini', label: 'Gemini CLI', names: ['gemini'], packages: /@google[\\/]gemini-cli/i },
  { id: 'copilot', label: 'Copilot CLI', names: ['copilot'], packages: /@github[\\/]copilot/i },
  { id: 'cursor', label: 'Cursor Agent', names: ['cursor-agent'] },
  { id: 'aider', label: 'Aider', names: ['aider'] },
  { id: 'opencode', label: 'opencode', names: ['opencode'], packages: /opencode-ai/i },
  { id: 'goose', label: 'Goose', names: ['goose'] },
  { id: 'qwen', label: 'Qwen Code', names: ['qwen'], packages: /@qwen-code[\\/]/i },
  { id: 'amp', label: 'Amp', names: ['amp'], packages: /@sourcegraph[\\/]amp/i },
  { id: 'crush', label: 'Crush', names: ['crush'] },
];

/** Programs that run a script named in their arguments. */
const RUNNERS = new Set([
  'node',
  'bun',
  'deno',
  'npx',
  'pnpx',
  'bunx',
  'python',
  'python3',
  'py',
  'uv',
  'uvx',
  'pipx',
]);

/** Splits a command line into arguments, honoring double and single quotes. */
export function splitCommandLine(commandLine: string): string[] {
  const result: string[] = [];
  const pattern = /"([^"]*)"|'([^']*)'|(\S+)/g;
  for (const match of commandLine.matchAll(pattern)) result.push(match[1] ?? match[2] ?? match[3]!);
  return result;
}

/** A program's name without its folder and extension: `C:\\bin\\claude.exe` → `claude`. */
function programName(path: string): string {
  const base = path.split(/[\\/]/).pop() ?? path;
  return base.toLowerCase().replace(/\.(exe|cmd|bat|ps1|js|mjs|cjs)$/, '');
}

/**
 * The agent CLI a command line runs, if any: the program itself (`claude`, `/usr/bin/claude`,
 * `claude.exe`), or the script a runtime runs (`node .../@anthropic-ai/claude-code/cli.js`,
 * `python -m aider`). Only the program and its script count, not other arguments.
 */
export function matchAgent(commandLine: string | undefined): AgentCli | undefined {
  if (!commandLine) return undefined;
  const args = splitCommandLine(commandLine.trim());
  const candidates = args.slice(0, 1);
  if (args[0] && RUNNERS.has(programName(args[0]))) {
    for (let i = 1; i < args.length; i++) {
      const arg = args[i]!;
      if (arg === '-m' || arg === 'run' || arg === 'x') continue;
      if (arg.startsWith('-')) continue;
      candidates.push(arg);
      break;
    }
  }
  for (const candidate of candidates) {
    const name = programName(candidate);
    const found = AGENT_CLIS.find(
      (cli) => cli.names.includes(name) || cli.packages?.test(candidate),
    );
    if (found) return { id: found.id, label: found.label };
  }
  return undefined;
}

/**
 * The agent a terminal's title shows. Agents set the title while they run (Claude Code shows
 * "✳ Claude Code" or its task), so this only recognizes the product names.
 */
export function agentFromTitle(title: string): AgentCli | undefined {
  if (/\bclaude\b|✳/i.test(title)) return { id: 'claude', label: 'Claude Code' };
  const found = AGENT_CLIS.find((cli) => new RegExp(`\\b${cli.id}\\b`, 'i').test(title));
  return found && { id: found.id, label: found.label };
}

export interface ProcessInfo {
  pid: number;
  ppid: number;
  commandLine: string;
}

/**
 * The agent running under a terminal's shell: the first descendant of `rootPid` whose command
 * line runs an agent CLI (breadth-first, so the outermost one wins).
 */
export function agentUnder(
  processes: readonly ProcessInfo[],
  rootPid: number,
): AgentCli | undefined {
  const children = new Map<number, ProcessInfo[]>();
  for (const p of processes) {
    if (p.pid === p.ppid) continue;
    const list = children.get(p.ppid);
    if (list) list.push(p);
    else children.set(p.ppid, [p]);
  }
  const seen = new Set<number>([rootPid]);
  const queue = [...(children.get(rootPid) ?? [])];
  while (queue.length) {
    const p = queue.shift()!;
    if (seen.has(p.pid)) continue;
    seen.add(p.pid);
    const agent = matchAgent(p.commandLine);
    if (agent) return agent;
    queue.push(...(children.get(p.pid) ?? []));
  }
  return undefined;
}

/** Parses `ps -A -o pid=,ppid=,args=` output. */
export function parsePs(output: string): ProcessInfo[] {
  const result: ProcessInfo[] = [];
  for (const line of output.split('\n')) {
    const match = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(line);
    if (match)
      result.push({ pid: Number(match[1]), ppid: Number(match[2]), commandLine: match[3]! });
  }
  return result;
}

/** Parses the JSON of `Get-CimInstance Win32_Process | Select ProcessId,ParentProcessId,Name,CommandLine`. */
export function parseWindowsProcesses(json: string): ProcessInfo[] {
  const parsed = JSON.parse(json) as unknown;
  const list = Array.isArray(parsed) ? parsed : [parsed];
  const result: ProcessInfo[] = [];
  for (const item of list) {
    if (typeof item !== 'object' || item === null) continue;
    const p = item as Record<string, unknown>;
    if (typeof p.ProcessId !== 'number' || typeof p.ParentProcessId !== 'number') continue;
    const commandLine =
      typeof p.CommandLine === 'string' && p.CommandLine
        ? p.CommandLine
        : typeof p.Name === 'string'
          ? p.Name
          : '';
    result.push({ pid: p.ProcessId, ppid: p.ParentProcessId, commandLine });
  }
  return result;
}
