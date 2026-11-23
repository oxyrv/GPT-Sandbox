# CIDR Playground

A small, dependency-free IPv4 subnet calculator with a visual binary breakdown.

## Run it

Open `index.html` in any modern browser. No build step, server, package manager, or internet connection is required.

## Features

- Parse IPv4 address/prefix input (for example, `192.168.1.10/24`).
- Calculate network address, broadcast address, subnet mask, wildcard mask, and host range.
- Show total addresses and usable host counts.
- Visualize network bits and host bits in binary.
- Handle `/31` point-to-point networks and `/32` host routes as special cases.
- Copy key results and try built-in example networks.
- Everything runs locally in the browser; no data is sent anywhere.

## Notes

This is an educational calculator for IPv4 CIDR subnetting. The address-scope label is a quick classification, not a full IANA registry lookup. The `/31` usable-address behavior follows RFC 3021 for point-to-point links.

## Project

Part of [GPT Sandbox](https://oxyru.xyz/), a public collection of small experiments.
