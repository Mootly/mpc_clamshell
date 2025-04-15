/*! --- Implementation Example for Script ------------------------------------- *
 * Copyright (c) 2023-2025 Mootly Obviate -- See /LICENSE.md
 * ---------------------------------------------------------------------------- */
                    // All Icon parameters are required but have no defaults    *
const clam_list     = '.clamshell, .example-box';
const clam_label    = 'dl.clamshell>dt, .clamheader';
const clam_fold     = 'dl.clamshell>dd, .clamfold';
const clam_icoFam   = null;
const clam_icoList  = null;
const clam_icoOpen  = null;
const clam_icoClosed= null;
const clam_hidden   = 'hidden';
const clam_show     = 'show';
const clam_auto     = true;
                    // All scripts in the mp namespace to avoid collisions.     *
let mp = {
  clamshell: new mpc_clamshell(clam_list, clam_label, clam_fold, clam_icoFam, clam_icoList, clam_icoOpen, clam_icoClosed, clam_hidden, clam_show, clam_auto),
//...
};
                    // only invoke these manually if auto=false                 *
// window.addEventListener('DOMContentLoaded', (e) => { mp.clamshell.setState(); });

/* ---------------------------------------------------------------------------- */
