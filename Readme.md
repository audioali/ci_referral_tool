# CI Referral Tool

This is a simple web tool for determining whether a patient is suitable for a cochlear implant referral, based on hearing test results.

The referral decision logic is contained in referral_logic.json (and interpreted by the functions in referral_logic.js). The referral rules are contained in an array, and applied in order. The first rule that is satisfied determines the referral decision.

The interface.js script handles the mapping between the user interface and the referral logic functions.
