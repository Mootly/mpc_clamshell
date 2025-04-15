# MoosePlum Clamshell / Accordion Fold Manager

This script does the following:

- Collapse designated clamshell/accordion elements after page load.
- Add "open all" headers to set of clamshell elements.
- Manage openign and closing of elements.

All clamshells start open so all content is visible unless JS is enabled.

## Dependencies

This was written in TypeScript and exported to ES2020.

## Assets

The files in this set are as follows:

| path                 | description                                        |
| -------------------- | -------------------------------------------------- |
| LICENSE.md           | License notice ( [MIT](https://mit-license.org) ). |
| README.md            | This document.                                     |
| clamshell.ts         | The class definition in TypeScript.                |
| clamshell.js         | The class definition in ES2020.                    |
| clamshell.min.js     | Minified version.                                  |
| clamshell.min.js.map | Map file.                                          |
| tsconfig.json        | Example TS > ES2020 config setting.                |
| _invoke.js           | Example implementation code.                       |

## Installation

Download this repo, or just the script, and add it to the script library for your site.

This script has no external dependencies.

### Compiling from the TypeScript

To save to ES2020 in the current folder, assuming you have the correct libraries installed, run the following in this folder:

`tsc -p tsconfig.json`

## Configuration

The script collapses elements within a container. This container can be a definition list or a division with headers and ocntent blocks. By default the script looks for:

- DL with a class of 'clamshell-list'
- DL with a class of 'example-box'
- Headings of type H# in a DIV with a class of 'clamshell' and 'use-h#'
- Folded items: DD and any blockwith class of 'clamfold'

Tasks:

- Collapse all targeted elements
- Add controls for each targeted item
- Add open all control to the top of each collapsed set longer than one.
- If URL.has(#target) open that item, scroll to item and open it.

Generates the following classes (arrows denote nesting):

- .list-header > .right-link > .all-link|.morelink
- .hidden

This script not fully tested for more than two levels of nesting. For accessibility and usuability, nested clamshells are contraindicated.

### Assumptions

Collapser immediately follows its heading.

Same heading level is used for folds across page.

For collapsing divisions, assumes the classes `clamshell`, `clamheader`, and `clamfold` for the three components of the clamshell: container, fold header, and fold body. Additional classes can be added but it will look for these and will add the appropriate class to fold headers if the container has a `use-h#` class specified.

Clamshell headings that are to be linked to from external sources should have hard-coded Ids. Auto-generated IDs use tie-breaker strings to prevent duplicate IDs. This means the assigned ID can change if content elsewhere in the page changes.

Original built with Font Awesome icons specified through CSS. Since it is jsut assigning classes you can swap that with anything you can specify through CSS.

### Recommended HTML Code

#### For definition lists

```html
<dl class="clamshell">
  <dt>Some term</dt>
  <dd>
    <p>Some definition.</p>
</dd>
  <dt>Some other term</dt>
  <dd>
  <p>Some other definition.</p>
  </dd>
</dl>
```

#### For divisions

Remember to adjust the font sizes of headings in accordion sections down from the normal heading size if needed so they look right.

```html
<div class="clamshell use-h3">
  <h3 class="clamheader">Some header</h3>
  <div class="clamfold">
    <p>Some content</p>
  </div>
  <h3 class="clamheader">Some other header</h3>
  <div class="clamfold">
    <p>Some more content</p>
  </div>
</div>
```

### Parameters

| name        | type    | default                        | description                             |
| ----------- | ------- | ------------------------------ | --------------------------------------- |
| pClamList   | string  | '.clamshell, .example-box'     | CSS selector for containers.            |
| pClamLabel  | string  | 'dl.clamshell>dt, .clamheader' | CSS selector for accordion headers.     |
| pClamFold   | string  | 'dl.clamshell>dd, .clamfold'   | CSS selectors for accordion bodies.     |
| pIconFam    | string  | null                           | Class name for font family call.        |
| pIconList   | string  | null                           | Class name for toggle all icon.         |
| pIconOpen   | string  | null                           | Class name for open item indicator.     |
| pIconClosed | string  | null                           | Class name for closed item indicator.   |
| pHidden     | string  | 'hidden'                       | Class name for hidden elements.         |
| pShow       | string  | 'show'                         | Class name for visible elements.        |
| pAuto       | boolean | true                           | Whether to automatically fold sections. |

The icon parameters are **required** but don't have a default. Their values depend on third party resources, so we can't just suggest you use a given class for them. Ths script was originally built on a site using Font Awesome 4, so the icon paramaters for that site were:

| name        | type   | FA4 default               |
| ----------- | ------ | ------------------------- |
| pIconFam    | string | 'fa'                      |
| pIconList   | string | 'fa-bars'                 |
| pIconOpen   | string | 'fa-caret-square-o-down'  |
| pIconClosed | string | 'fa-caret-square-o-right' |

### Coding Example

Use the `mp` namespace to help avoid collisions.

Arguments may be omitted if using defaults.

```js
const clam_list     = '.clamshell, .example-box';
const clam_label    = 'dt, .clamheader';
const clam_fold     = 'dd, .clamfold';
const clam_icoFam   = null;
const clam_icoList  = null;
const clam_icoOpen  = null;
const clam_icoClosed= null;
const clam_hidden   = 'hidden';
const clam_show     = 'show';
const clam_auto     = true;

let mp = {
  clamshell: new mpc_clamshell(clam_list, clam_label, clam_fold, clam_icoFam, clam_icoList, clam_icoOpen, clam_icoClosed, clam_hidden, clam_show, clam_auto),
  ⋮
};
```

If auto is set to false, manually invoke the clamshell handler on load.

```js
window.addEventListener('DOMContentLoaded', (e) => { mp.clamshell.setState(); });
```
