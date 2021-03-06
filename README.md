# Fanuc Macro Executor

<img src="./resources/icon.png" alt="drawing" width="100"/>

![release](https://img.shields.io/github/v/release/iSorp/macro-executor)
![maintained](https://img.shields.io/maintenance/yes/2020.svg)
[![open issues](https://img.shields.io/github/issues/iSorp/macro-executor.svg?)](https://github.com/iSorp/macro-executor/issues)
[![license](https://img.shields.io/github/license/iSorp/macro-executor)](https://opensource.org/licenses/MIT)


Fanuc Macro Executor syntax highlighting, validating and project building 

## News
* Supported display languages (English, Deutsch, 中文)
* Lint configuration

## Features
* Compiling and linking
* Compiler problem matcher
* Syntax highlighting
* Syntax validation
* Symbol provider
* Completion provider
* CodeLens
* Lint features
* Sequence number refactoring

**The program parsing is not yet complete implemented. There are cases where mistakes are not appropriate or not detected.** <br>
Report issues to https://github.com/iSorp/macro-executor/issues


### Validation
![Validation](./resources/validation.gif)

### Navigation
![Navigation](./resources/navigation.gif)

### References
![References](./resources/references.gif)

### Implementations
![Implementations](./resources/implementations.gif)


## Required file extensions
* Macro files`.src`
* Include files `.def` 
* Link files `.lnk` 

## Coding conventions
* `$Include` paths must be absolute or relative to the workspace folder
* Uppercase for constants: `@MY_CONSTANT 100`
* Space between statements: `O SUB_PROBGRAM; N9000 G01 X1; DO 1; END 1; GOTO 1` etc.
* A comment of a declaration `@var` <span style="color:green">**/* my comment**</span> is displayed on hover and completion

## Sequence number refactoring for functions
* Consecutive numbering on completion (snippet N-Number)
* Command for renumbering sequences (incl. GOTOs)
* Command for adding missing sequences (for NC statements)

## Lint
The Lint is configurable by changing the following rules in the settings (user or workspace).
Three levels are supported: `error`, `warning` and `ignore`. 

```json
"macro.lint": {
       "rules" : {
            "duplicateInclude":         "error",
            "duplicateDeclaration":     "error",
            "duplicateFunction":        "warning",
            "duplicateAddress":         "ignore",
            "duplicateSequence":        "warning",
            "duplicateLabel":           "warning",
            "duplicateLabelSequence":   "warning",
            "unknownSymbol":            "error",
            "whileLogicOperator":       "error",
            "mixedConditionals":        "error",
            "tooManyConditionals":      "error",
            "incompleteParameter":      "error",
            "includeNotFound":          "error",
            "assignmentConstant":       "warning"
       }
```


## Default Commands

| Command | Key          |
|---------|--------------|
| Build   | Ctrl+Shift+B |
| Link    | Ctrl+Shift+L |
| Clean   | Ctrl+Shift+C |


## Extension Settings

This extension contributes the following settings:

* `macro.lint`: Lint settings and rule configuration
* `macro.sequence.base`: Sequences start number for refactoring
* `macro.sequence.increment`: Sequences increment for refactoring
* `macro.codelens.enable`: Enables or disables the CodeLens function
* `macro.validate.enable`: Enables or disables the validation
* `macro.validate.workspace`: Enables or disables the workspace validation

Build settings:
* `macro.build.compiler`: Selection of the macro compiler [MCOMPI, MCOMP0]
* `macro.build.controlType`: Selection of the control type [0, 30]
* `macro.build.makeFile`: The path to the makefile
* `macro.project.exportPath`: The path to the directory for the memory card file (.mem)
* `macro.project.sourcePath`: The path to the directory for the source files (.src)
* `macro.project.buildPath`: The path to the directory for the build files
* `macro.project.linkPath`: The path to the directory for the link files (.lnk) and the library (.mex)

## Building

### External build system
The building process can be performed by using an external script or the internal system. If an external script is used,
just set the path in `macro.build.makeFile`. If a `Clean.bat` in the same directory exists, it is used for the cleaning process.
The following parameters are passed to the script: 

1. Export directory
2. Option [make, clean].
3. Compiler [MCOMP0, MCOMPI]
4. Control type [0, 30]


### Internal build system
If `macro.build.makeFile` is empty the internal system is used.
>- The compiler must be available over the system path
>- The library (mex) must be located in `macro.project.linkPath` path 

Currently only a flat folder tree is supported e.g.:

```
project 
│
└───src
│      file1.src
│      file2.src
│   
└───def
│      file1.def
│      file2.def
│ 
└───lnk
       file1.lnk
       file2.lnk
       F30iA_01.MEX
```




-----------------------------------------------------------------------------------------------------------



## Credits

Special thanks to Pan and Yu for translating the chinese texts

特别感谢潘先生和于先生翻译了中文文本