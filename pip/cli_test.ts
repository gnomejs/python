import { pip } from "./cli.ts";
import { assert as ok } from "jsr:@std/assert@0.225.3";

Deno.test("pip command test", async () => {
    const cmd = pip(["--version"]);
    ok((await cmd.text()).startsWith("pip"));
});
