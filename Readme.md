# CI Referral Tool

This is a simple web tool for determining whether a patient is suitable for a cochlear implant referral, and whether a speech test is needed, based on hearing test results.

## The logic explained

The tool takes the hearing loss in bands and it is the worst 2 points from 500Hz to 4kHz that are relevant here.

![SNHL boundaries shown on audiogram](https://audioali.github.io/ci_referral_tool/images/snhl_boundaries.png)

For those with a sensorineural loss, the first thing is checking if they’re comfortably outside the nice criteria, i.e.  in the pink area on my garish image above. Then we would say ‘not yet’ with a caveat around dead regions and how much a person struggles. 

Next is the yellow, borderline band, where we say ‘not yet’ but suggest keeping under review. 

Then there’s the light green, where we would say they meet the PTA criteria and that the next step would be an AB speech test.

Finally, there’s the dark green area, where it will suggest referral unless it is noted they hear well without visual cues, then we’d suggest AB speech test. 

For conductive losses, it’s obviously a bit different: 

![CHL boundaries shown on audiogram](https://audioali.github.io/ci_referral_tool/images/chl_boundaries.png)

Where they don’t meet the AC PTA criteria (the light green) it will say ‘not yet’ and consider bone anchored if suitable.

Where they meet the AC criteria, but the BC at 3 points or more is in the blue it will suggest ENT/bone anchored device referral.

Where the BC falls out of the blue range it will say they may be suitable and that the next step would be an AB speech test. I have always suggested an AB speech test for mixed losses as patients with conductive/mixed losses tend to score better on speech tests as there is less chance of severe cochlear damage and dead regions. If BC is not completed at 3&4kHz it will suggest completing these too.

## File structure

The referral decision logic is contained in referral_logic.json (and interpreted by the functions in referral_logic.js). The referral rules are contained in an array, and applied in order. The first rule that is satisfied determines the referral decision.

The interface.js script handles the mapping between the user interface and the referral logic functions.
