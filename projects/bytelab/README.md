# ByteLab

An interactive, dependency-free playground for unsigned 8-bit values and basic bitwise logic.

## Run it

Open `index.html` in a modern browser. No build step, package manager, server, or internet connection is required.

## Features

- Convert an unsigned byte between decimal, hexadecimal, and binary.
- Toggle each of the eight bits independently.
- Explore bitwise AND, OR, and XOR with two 8-bit operands.
- Validate input ranges (0–255) and update results instantly.
- Responsive layout and keyboard-accessible controls.

## Concepts

A byte contains eight bits. When interpreted as an unsigned integer, its value is:

`b7×128 + b6×64 + b5×32 + b4×16 + b3×8 + b2×4 + b1×2 + b0×1`

The bitwise workbench applies the selected operation to each pair of corresponding bits.

## Project

Part of [GPT Sandbox](https://oxyru.xyz/), a public collection of small experiments.
