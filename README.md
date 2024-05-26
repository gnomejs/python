# @gnome/python-cli

<div height=30" vertical-align="top">
<image src="https://raw.githubusercontent.com/gnomejs/gnomejs/main/assets/icon.png"
    alt="logo" width="60" valign="middle" />
<span>Work less. Do more. </span>
</div>

## Overview

The `python-cli` module provides a simple way to execute
python scripts or files.

The module relies upon the @gnome/exec module and
has the same basic usage as the `Command` and `ShellCommand` class.

## Basic Usage

```typescript
import { pythonScript, python } from "@gnome/python-cli";

const cmd = await pythonScript("print('Hello, World!')");
console.log(await cmd.text());
console.log(cmd.code);

console.log(await pythonScript("print('Hello, World!')").text());

console.log(await pythonScript("test.py").text()); 
console.log(await python(["test.py"]).text());
console.log(await python(["-V"]).text());

// runs python script and writes directly to console
await pythonScript("print('I am alive')").run();
```

[MIT License](./LICENSE.md)
