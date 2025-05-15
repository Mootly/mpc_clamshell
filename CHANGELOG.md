# Changelog

For [MoosePlum Clamshell / Accordion Fold Manager](https://github.com/Mootly/mpc_clamshell).

## 1.0.4 — 2025/05/15

### Fixed

* Delayed hash check so auto-generated ids have time to propagate.
* "Show/Hide All" header bars are no longer tabbable.

### Known Bugs

* When linking directly to an ID, the element gets focused and is highlighted. Looks a little odd, but helps with wayfinding, so won't fix at present.
* Tabbing to "Show/Hide All" header bars disabled. Code should be corrected so that hitting enter to open all disables close on tab for all siblings.

## 1.0.3 — 2025/04/17

### Fixed

* Added missing `tabindex` to clamshell collapser.
* Corrected position of `tabindex` from clamshell container to clamshell headers.
* Corrected events to only select direct children of the current collaper block to prevent downward propagation.
* Added while loop walk of anecestor tree for collapser section events to ensure open states propagate upward.

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
