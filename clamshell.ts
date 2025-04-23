/** --- Clamshell Creator ----------------------------------------------------- *
* mpc_clamshell 1.0.3
 * @copyright 2023-2025 Mootly Obviate -- See /LICENSE.md
 * @license   MIT
 * @version   1.0.3
 * ---------------------------------------------------------------------------- *
 * Collapse any clamshell/accordion elements after page load.
 * ---------------------------------------------------------------------------- *
 * All clamshells start open so all content is visible unless JS is enabled.
 * Clamshell/accordion fold any:
 *  - DL with a class of 'clamshell-list'
 *  - DIV with a class of 'example-box'
 *  - Headings of type H# in a DIV with a class of 'clamshell' and 'use-h#'
 *  - Folded items: DD and any blockwith class of 'clamfold'
 * Tasks:
 *  - Collapse all targeted elements
 *  - Add controls for each targeted item
 *  - Add open all control to the top of each list
 *  - If URL.has(#target) open that item, scroll to item
 * Assumptions:
 * - Not fully tested for more than two levels of nesting
 * - Collapser immediately follows its heading
 * - Same heading level is used for folds across page
 * - Original uses Font Awesome and assuems a fully CSS solution for icons
 * - Generates the following classes (arrows denote nesting):
 *   .list-header > .right-link > .all-link|.morelink
 *   .hidden
 * ------
 * ### Constructor Arguments
 *
 * name        | default                    | description
 * ----        | -------                    | -----------
 * pClamList   | '.clamshell, .example-box' | CSS selector for containers.
 * pClamLabel  | 'dt, .clamheader'          | CSS selector for accordion headers.
 * pClamFold   | 'dd, .clamfold'            | CSS selectors for accordion bodies.
 * pIconFam    | null                       | Class name for font family call.
 * pIconList   | null                       | Class name for toggle all icon.
 * pIconOpen   | null                       | Class name for open item indicator.
 * pIconClosed | null                       | Class name for closed item indicator.
 * pHidden     | 'hidden'                   | Class name for hidden elements.
 * pShow       | 'show'                     | Class name for visible elements.
 * pAuto       | true                       | Whether to automatically fold sections.
 *
 * *** Initialize - Example --------------------------------------------------- *
 * let mp = {
 *   clamshell: new mpc_clamshell(
 *     clam_list, clam_label, clam_fold, clam_icoFam, clam_icoList,
 *     clam_icoOpen, clam_icoClosed, clam_hidden, clam_show, clam_auto
 *   ),
 *   ...
 * };
 * --- Revision History ------------------------------------------------------- *
 * 2025-04-23 | Corrected cut and paste error in comments..
 * 2025-04-17 | Upward and downward propagation issues.
 * 2025-04-15 | Fixed keyboard operation and issues with nested DL.
 * 2025-03-10 | Switched to DOMContentLoaded handler to avoid some edge cases.
 * 2025-03-05 | Moved to a repo folder and documented
 * 2023-12-27 | Started new typescript / vanilla JS version
 * ---------------------------------------------------------------------------- */
class mpc_clamshell{
  headerIdx         : number;           // counter to ensure unique header ids  *
  ico_family        : string;
  ico_showall       : string;
  ico_open          : string;
  ico_closed        : string;
  tar_list          : string;
  tar_fold          : string;
  tar_label         : string;
  tar_labelOnly     : string;
  arr_list          : Array<string>;
  arr_fold          : Array<string>;
  arr_label         : Array<string>;
  class_hidden      : string;
  mouseTrigger      : boolean;
  tar_hash          : HTMLElement | null;
  cs_list           : NodeListOf<HTMLElement> | null;
  cs_label          : NodeListOf<HTMLElement> | null;
  cs_block          : NodeListOf<HTMLElement> | null;
  constructor(
    pClamlist       : string  = '.clamshell, dl.example-box',
    pClamlabel      : string  = 'dt, .clamheader',
    pClamfold       : string  = 'dd, .clamfold',
    pIconFam        : string  = null,
    pIconList       : string  = null,
    pIconOpen       : string  = null,
    pIconClosed     : string  = null,
    pHidden         : string  = 'hidden',
    pShow           : string  = 'show',
    pAuto           : boolean = true
  ) {
    this.headerIdx  = 1;
    this.ico_family = pIconFam;
    this.ico_showall= pIconList;
    this.ico_open   = pIconOpen;
    this.ico_closed = pIconClosed;
    this.tar_list   = pClamlist;
    this.tar_labelOnly = pClamlabel;
    this.arr_list   = pClamlist.split(/,\s*/);
    this.arr_fold   = pClamfold.split(/,\s*/);
    this.arr_label  = pClamlabel.split(/,\s*/);
                    // Create selectors for children using cartesian product.   *
                    // Only need to join two, so no fancy abstractions.         *
    this.tar_fold   = (this.arr_list.map((x) => this.arr_fold.map((y) => x+'>'+y))).join(',');
    this.tar_label  = (this.arr_list.map((x) => this.arr_label.map((y) => x+'>'+y))).join(',');
    this.class_hidden = pHidden;
    window.addEventListener('DOMContentLoaded', (ev) => {
      this.cs_list  = document.querySelectorAll(this.tar_list);
      this.cs_list?.forEach ((el) => {
        let tPClass = el.classList.toString();
        let tHeader = tPClass.match(/use-h\d/)?.toString().slice(-2);
        if (tHeader) {
          let tAddClassSet = el.querySelectorAll(tHeader);
          tAddClassSet?.forEach ((el) => {
            el.classList.add('clamheader');
            el.setAttribute('tabindex', '0');
          });
        }
      });
      window.addEventListener('mousedown',  () => { this.mouseTrigger = true; });
      window.addEventListener('mouseup',    () => { this.mouseTrigger = false; });
      this.cs_block = document.querySelectorAll(this.tar_fold);
      this.cs_label = document.querySelectorAll(this.tar_label);
      if (pAuto) { this.setStates(); }
    });
  }
/* --- If not auto, invoke this ----------------------------------------------- */
  setStates() {
    this.setLabelIds();
                    // yep, close everything then reopen what we want           *
    this.closeAll();
    this.addListHeaders();
    this.checkHash();
    window.addEventListener('hashchange', (el) => {this.checkHash();});
    this.cs_label.forEach((el) => {
      el.setAttribute('tabindex', '0');
      el.addEventListener('click', (ev) => { this.checkClick((ev.target as HTMLElement).closest(this.tar_label)); });
      el.addEventListener('focusin', (ev) => {
        if (!(this.mouseTrigger)) {
          this.checkClick((ev.target as HTMLElement).closest(this.tar_label));
        }
      });
      el.addEventListener('focusout', (ev) => {
        if (!(this.mouseTrigger)) {
          this.checkClick((ev.target as HTMLElement).closest(this.tar_label));
        }
      });
    });
    this.cs_block.forEach((el) => {
      el.setAttribute('tabindex', '0');
      el.addEventListener('focusin', (ev) => {
        let tCurr   = ev.target as HTMLElement;
        while ((tCurr.closest(this.tar_fold)).previousElementSibling) {
          let tLabel = (tCurr.closest(this.tar_fold)).previousElementSibling;
          if (!(this.mouseTrigger)) {
            this.checkClick(tLabel, 'Show ');
          }
          tCurr     = tLabel.parentElement;
        }
      });
      el.addEventListener('focusout', (ev) => {
        let tCurr   = ev.target as HTMLElement;
        while ((tCurr.closest(this.tar_fold)).previousElementSibling) {
          let tLabel = (tCurr.closest(this.tar_fold)).previousElementSibling;
          if (!(this.mouseTrigger)) {
            this.checkClick(tLabel, 'Hide ');
          }
          tCurr     = tLabel.parentElement;
        }
      });
    });
  }


/* --- Initialization Methods - Prepping the page ----------------------------- */
                    // Clamshell section labels should have IDs                 *
                    // but if they were omitted, create them.                   *
  setLabelIds() {
    let el_linkText = '';
    if (this.cs_label) {
      this.cs_label.forEach ((el) => {
        if (el.textContent) {
          el_linkText = el.textContent || '';
        } else {
          return false;
        }
        if (!(el.hasAttribute('id'))) {
          el.id = 'clam-'+(this.headerIdx++)+'-'+(el_linkText
                  .replace(/[`~!@#$%^&*()|+=?;'",.<>{}[\]\\/]/gi,'')
                  .trim().replace(/ /g,'-')).substring(0,24);
        }
      });
    }
  }
                    // close any folding elements                               *
  closeAll() {
    this.cs_block?.forEach ((el) => {
      el.classList.add(this.class_hidden);
    });
    this.cs_label?.forEach ((el) => {
      let tSpan         = document.createElement('span')
      tSpan.className   = 'reader-only';
      tSpan.textContent = 'Show ';
      el.prepend(tSpan);
      el.classList.add(this.ico_family);
      el.classList.add(this.ico_closed);
    });
  }
                    // header inserts                                           *
  addListHeaders() {
    this.cs_list?.forEach ((el) => {
      let tHeader   : HTMLElement;
      if (el.nodeName?.toLowerCase() === "dl") {
        tHeader = document.createElement('dt');
      } else {
        tHeader = document.createElement('div');
      }
      tHeader.className = 'list-header '+this.ico_family+' '+this.ico_showall;
                    // Not elegant, but self documenting                        *
      let tHeaderString = el.id + '-header';
      if (tHeaderString == '-header') {
        tHeaderString = 'clam-'+(this.headerIdx++)+tHeaderString;
      }
      tHeader.id = tHeaderString;
      tHeader.textContent = 'Show All';
      tHeader.setAttribute('tabindex', '0');
      el.prepend(tHeader);

      document.getElementById(tHeader.id)?.addEventListener('click', (ev) => { this.checkAll(ev.target as HTMLElement); });
    });
  }
/* --- EVENT Actions - user and synthetic ------------------------------------- */
                    //  Open target fold                                        *
  checkHash() {
    if ((this.cs_list) && (location.hash)) {
      this.tar_hash = document.getElementById((location.hash).substring(1));
      if (this.tar_hash?.matches(this.tar_label)) {
        if (this.tar_hash.nextElementSibling) {
          let next_el  = this.tar_hash.nextElementSibling as HTMLElement;
          next_el.classList.remove(this.class_hidden);
          this.tar_hash.classList.remove(this.ico_closed);
          this.tar_hash.classList.add(this.ico_open);
        }
        if (this.tar_hash.firstElementChild?.className == 'reader-only') {
          this.tar_hash.firstElementChild.textContent = 'Hide ';
        }
      }
      if (this.tar_hash?.closest(this.tar_fold)) {
        let fold_el = this.tar_hash?.closest(this.tar_fold) as HTMLElement;
        let label_el= fold_el?.previousElementSibling as HTMLElement;
        fold_el.classList.remove(this.class_hidden);
        label_el.classList.remove(this.ico_closed);
        label_el.classList.add(this.ico_open);
        if (label_el.firstElementChild?.className == 'reader-only') {
          label_el.firstElementChild.textContent = 'Hide ';
        }
      }
    }
  }
                    // Toggle fold on direct select                             *
  checkClick(el : Element, direction : string = '') {
    if (el.matches(this.tar_label)) {
      if (el.nextElementSibling) {
        let next_el  = el.nextElementSibling as HTMLElement;
        if (direction == 'Hide ') {
          next_el.classList.add(this.class_hidden);
        } else if (direction == 'Show ') {
          next_el.classList.remove(this.class_hidden);
        } else {
          next_el.classList.toggle(this.class_hidden);
        }
        if (next_el.classList.contains(this.class_hidden)) {
          el.classList.remove(this.ico_open);
          el.classList.add(this.ico_closed);
        } else {
          el.classList.remove(this.ico_closed);
          el.classList.add(this.ico_open);
        }
        if (el.firstElementChild?.className == 'reader-only') {
          if (next_el.classList.contains(this.class_hidden)) {
            el.firstElementChild.textContent = 'Show ';
          } else {
            el.firstElementChild.textContent = 'Hide ';
          }
        }
      }
    }
  }
                  // Toggle list of fold on open all                            *
  checkAll(el : Element) {
    let tList       = el.closest(this.tar_list);
    let tLabel      = el.textContent;
    let tDir        = (tLabel == 'Show All') ? 'Show ' : 'Hide ';
    el.textContent  = (tLabel == 'Show All') ? 'Hide All' : 'Show All';
    if (tList) {
      let tItems    = Array.prototype.filter.call(
        tList.children, tChild => tChild.matches(this.tar_labelOnly)
      );
      if (tItems) {
        tItems.forEach ((el) => {
          if (!el.classList.contains('list-header')) {this.checkClick(el, tDir);}
        });
      }
    }
  }
}
/*! -- Copyright (c) 2023-2025 Mootly Obviate -- See /LICENSE.md -------------- */
