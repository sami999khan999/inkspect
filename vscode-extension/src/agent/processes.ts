// The machine's processes, for recognizing agents under a terminal or a tmux pane. Node only (no
// `vscode`): the hub uses it too.
import { execFile } from 'node:child_process';
import { parsePs, parseWindowsProcesses, type ProcessInfo } from './agentDetect';

/** Every process with its parent and command line. */
export function listProcesses(): Promise<ProcessInfo[]> {
  return new Promise((resolve, reject) => {
    if (process.platform === 'win32') {
      execFile(
        'powershell.exe',
        [
          '-NoProfile',
          '-NonInteractive',
          '-Command',
          'Get-CimInstance Win32_Process | Select-Object ProcessId,ParentProcessId,Name,CommandLine | ConvertTo-Json -Compress',
        ],
        { windowsHide: true, maxBuffer: 64 * 1024 * 1024, timeout: 15_000 },
        (error, stdout) => {
          if (error) reject(error);
          else resolve(parseWindowsProcesses(stdout));
        },
      );
      return;
    }
    execFile(
      'ps',
      ['-A', '-o', 'pid=,ppid=,args='],
      { maxBuffer: 64 * 1024 * 1024, timeout: 10_000 },
      (error, stdout) => {
        if (error) reject(error);
        else resolve(parsePs(stdout));
      },
    );
  });
}

/** Whether `pid` is `ancestor` or one of its descendants. */
export function descendsFrom(
  processes: readonly ProcessInfo[],
  pid: number,
  ancestor: number,
): boolean {
  const parent = new Map(processes.map((p) => [p.pid, p.ppid]));
  for (let current: number | undefined = pid, hops = 0; current && hops < 64; hops++) {
    if (current === ancestor) return true;
    const next = parent.get(current);
    if (next === current) return false;
    current = next;
  }
  return false;
}
