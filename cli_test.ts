import { assert as ok, assertEquals as equals } from "jsr:@std/assert@^0.224.0";
import { remove, writeTextFile } from "jsr:@gnome/fs@^0.1.0";
import { python, pythonCli } from "./cli.ts";

const EOL = Deno.build.os === "windows" ? "\r\n" : "\n";

Deno.test("python command test", async () => {
    const cmd = pythonCli(["-V"]);
    ok((await cmd.text()).startsWith("Python"));
});

Deno.test("simple inline test", async () => {
    const cmd = await python("print('Hello, World!')");
    equals(cmd.text(), `Hello, World!${EOL}`);
    equals(0, cmd.code);
});

Deno.test("multi-line inline test", async () => {
    const cmd = await python(`
print('1')
print('2')
    `);
    console.log(cmd.text());
    console.log(cmd.errorText());
    equals(cmd.text(), `1${EOL}2${EOL}`);
    equals(0, cmd.code);
});

Deno.test("simple file test", async () => {
    await writeTextFile("test.py", "print('Hello, World!')");
    try {
        // purposely add space after test.ps1
        const cmd = await python("test.py ");
        equals(0, cmd.code);
        equals(cmd.text(), `Hello, World!${EOL}`);
    } finally {
        await remove("test.py");
    }
});
