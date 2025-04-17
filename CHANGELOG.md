# Changelog

For [MoosePlum Clamshell / Accordion Fold Manager](https://github.com/Mootly/mpc_clamshell).

## 1.0.3 — 2025/04/17

### Fixed

* Added missing `tabindex` to clamshell collapser.
* Corrected position of `tabindex` from clamshell container to clamshell headers.
* Corrected events to only select direct children of the current collaper block to prevent downward propagation.
* Added while loop walk of anecestor tree for collapser section events to ensure open states propagate upward.

### Known Bugs

* "Show/Hide All" header bar is tabbable even though it intentionally does nothing when tabbing.

## 1.0.2 — 2025/04/15

### Added
* Added keyboard functionality on focus.
* Set `tabindex` for scripted block elements to allow for keyboard functionality.

### Changed

* Changed default class selectors for better nesting.

## 1.0.1 — 2025/03/10

### Changed

* Switched to DOMContentLoaded handler to avoid some edge cases.

## 1.0.0 — 2025/03/05

* Posted.
