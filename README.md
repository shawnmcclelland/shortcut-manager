# Shortcut Manager
##### Hotkey management in Unity

## Description
A Framer prototype showcasing various interaction elements for the Shortcut Manager solution. Actively updated as development continues on the feature.

## Overview
**Modifiers:** Supports clicking on modifier keys (Shift, Cmd, Alt) as well as holding the keys on a physical keyboard. Modifier combinations show available, reserved, and global keys per-modifier sequence.

**Contexts:** Commands are filtered based on context. Selecting a context will show all commands and bindings associated with the selected context.

## Issues
:exclamation: Alt is reserved in Framer to change cursor state. Holding Alt on the keyboard to simulate modifier behaviour will sometimes get stuck due to this.
