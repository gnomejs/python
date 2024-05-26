import { assert as ok, assertEquals as equals } from "jsr:@std/assert@^0.224.0";
import { remove, writeTextFile } from "jsr:@gnome/fs@^0.1.0";
import { pip, python, pythonScript } from "./mod.ts";

const EOL = Deno.build.os === "windows" ? "\r\n" : "\n";

Deno.test("python command test", async () => {
    const cmd = python(["-V"]);
    ok((await cmd.text()).startsWith("Python"));
});

Deno.test("pip command test", async () => {
    const cmd = pip(["--version"]);
    ok((await cmd.text()).startsWith("pip"));
});

Deno.test("simple inline test", async () => {
    const cmd = await pythonScript("print('Hello, World!')");
    equals(cmd.text(), `Hello, World!${EOL}`);
    equals(0, cmd.code);
});

Deno.test("multi-line inline test", async () => {
    const cmd = await pythonScript(`
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
        const cmd = await pythonScript("test.py ");
        equals(0, cmd.code);
        equals(cmd.text(), `Hello, World!${EOL}`);
    } finally {
        await remove("test.py");
    }
});
