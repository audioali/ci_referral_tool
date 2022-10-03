# CI Referral Tool

This is a simple web tool for determining whether a patient is suitable for a cochlear implant referral, based on hearing test results.

The referral decision logic is contained in referral_logic.js. The functions in this script require test results to be provided as an object with 3 properties: 'left','right', and 'loss_type'. The loss_type property can be either 'sensorineural' or 'mixed'. The 'left' and 'right' properties are also objects, each containing two properties: 'ac' and 'bc'. These properties are objects, with a key for each provided frequency, and values equal to the decibel threshold at this frequency (an integer multiple of 5), or null for 'threshold not reached'.

The interface.js script handles the mapping between the user interface and the referral logic functions.