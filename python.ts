import { Command, type CommandArgs, type CommandOptions, ShellCommand, type ShellCommandOptions } from "@gnome/exec";
import { pathFinder } from "@gnome/exec/path-finder";
import { isAbsolute, resolve } from "@std/path";
import { makeTempFileSync, writeTextFileSync } from "@gnome/fs";

pathFinder.set("python", {
    name: "python",
    windows: [
        "${SystemDrive}\\Windows\\py.exe",
        "${USERPROFILE}\\AppData\\Local\\Programs\\Python\\Launcher\\py.exe",
        "${ProgramFiles}\\Python312\\python.exe",
        "${ProgramFiles}\\Python311\\python.exe",
        "${ProgramFiles}\\Python310\\python.exe",
        "${ProgramFiles}\\Python39\\python.exe",
        "${ProgramFiles}\\Python38\\python.exe",
        "${USERPROFILE}\\AppData\\Local\\Programs\\Python\\Python312\\python.exe",
        "${USERPROFILE}\\AppData\\Local\\Programs\\Python\\Python311\\python.exe",
        "${USERPROFILE}\\AppData\\Local\\Programs\\Python\\Python310\\python.exe",
        "${USERPROFILE}\\AppData\\Local\\Programs\\Python\\Python39\\python.exe",
        "${USERPROFILE}\\AppData\\Local\\Programs\\Python\\Python38\\python.exe",
    ],
    linux: [
        "/usr/bin/python3",
        "/usr/bin/python",
    ],
});

/**
 * File extension for bash scripts.
 */
export const PYTHON_EXT = ".py";

export class PythonCommand extends Command {
    constructor(args?: CommandArgs, options?: CommandOptions) {
        super("python", args, options);
    }
}

/**
 * Represents a bash command executed using the `bash` commandline.
 */
export class PythonShellCommand extends ShellCommand {
    /**
     * Creates a new instance of the `bashCommand` class.
     * @param script The bash script to execute.
     * @param options The options for the bashell command.
     */
    constructor(script: string, options?: ShellCommandOptions) {
        super("python", script.trimEnd(), options);
    }

    /**
     * Gets the file extension associated with bash scripts.
     */
    get ext(): string {
        return PYTHON_EXT;
    }

    getScriptFile(): { file: string | undefined; generated: boolean } {
        let script = this.script.trimEnd();

        if (!script.match(/\n/) && script.endsWith(this.ext)) {
            script = script.trimStart();
            if (!isAbsolute(script)) {
                script = resolve(script);
            }
            return { file: script, generated: false };
        }

        const file = makeTempFileSync({
            prefix: "script_",
            suffix: this.ext,
        });

        writeTextFileSync(file, script);

        return { file, generated: false };
    }

    /**
     * Gets the bash arguments for executing the bash script.
     * @param script The bash script to execute.
     * @param isFile Specifies whether the script is a file or a command.
     * @returns The bash arguments for executing the script.
     */
    // deno-lint-ignore no-unused-vars
    getShellArgs(script: string, isFile: boolean): string[] {
        const params = this.shellArgs ?? [];

        params.push(script);

        return params;
    }
}
/**
 * Executes the python command line using the PythonCommand class.
 *
 * @param args The command arguments.
 * @param options The command options.
 * @returns a new instance of the PythonCommand class.
 */
export function python(args?: CommandArgs, options?: CommandOptions): PythonCommand {
    return new PythonCommand(args, options);
}

/**
 * Executes a python inline script or script file using the PythonShellCommand class.
 *
 * @param script - The python script to execute.
 * @param options - Optional options for the python shell command.
 * @returns A new instance of the PythonShellCommand class.
 */
export function pythonScript(script: string, options?: ShellCommandOptions): PythonShellCommand {
    return new PythonShellCommand(script, options);
}
