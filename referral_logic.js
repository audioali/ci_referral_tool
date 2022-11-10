function validate_input(test_results) {
    const limits = {ac: [-10,120], bc: [-10,80]};
    const interval = 5;

    for (const ear of ['left','right']) {
        for (const type of ['ac','bc']) {
            for (const freq in test_results[ear][type]) {
                if ((test_results[ear][type][freq] !== null)) { //null used to represent 'no response' at given frequency
                    try {
                        const point = test_results[ear][type][freq];
                        if ((!Number.isInteger(point)) || (point % interval !== 0) || (point < limits[type][0]) || (point > limits[type][1])) {
                            return {valid: false, problem: [ear,type,freq]};
                        }
                    }
                    catch(err) {
                        return {valid: false, problem: [ear,type,freq]};
                    }
                }
            }
        }
    }
    return {valid: true};
}

function check_threshold_count(test_results, ear, type, freqs, threshold, at_or_above) {
    //For ear ('left' or 'right'), type ('ac' or 'bc'), freqs (list, kHz but as string), and a threshold (int, dB)
    //this function returns how many of those frequencies are at the threshold or worse

    let threshold_count = 0;
    for (const f of freqs) {
        if (test_results[ear][type][f] !== undefined) {
            if (test_results[ear][type][f] !== null) {
                if (test_results[ear][type][f] >= threshold && at_or_above) {
                    threshold_count += 1;
                }
                else if (test_results[ear][type][f] < threshold && (!at_or_above)) {
                    threshold_count += 1;
                }
            }
            else if (at_or_above) {
                threshold_count += 1; //null means 'not reached', counts as worse than threshold
            }
        }
    }
    return threshold_count;
}

function process_results(test_results, logic) {
    const validity = validate_input(test_results);
    if (!validity.valid) {
        return ["Invalid input for " + validity.problem[0] + " " + validity.problem[1] + " " + validity.problem[2]];
    }

    //First need to check we have enough data to run the tool (distinct from input validation above, which checks individual inputs are of correct format)
    for (const ear of ['left','right']) {
        if (logic.requirements[test_results.loss_type][ear] !== undefined) {
            for (const type of ['ac','bc']) {
                if (logic.requirements[test_results.loss_type][ear][type] !== undefined) {
                    for (const freq of logic.requirements[test_results.loss_type][ear][type]) {
                        if (test_results[ear][type][freq] === undefined) {
                            return ["Must provide value for " + ear + " " + type + " at " + freq + "kHz to use this tool"];
                        }
                    }
                }
            }
        }
    }

    for (const rule of logic.referral_rules) {
        if (rule.loss_type === 'any' || rule.loss_type === test_results.loss_type) {
            if (rule.at_or_above === undefined && rule.below === undefined) { //No further threshold conditions to test
                return [rule.result, rule.reason];
            }
            let checks = [];
            for (const ear of ['left','right']) {
                if (rule.at_or_above !== undefined) {
                    checks.push(check_threshold_count(test_results, ear, rule.transducer, rule.frequencies, rule.at_or_above, true));
                }
                else {
                    checks.push(check_threshold_count(test_results, ear, rule.transducer, rule.frequencies, rule.below, false));
                }
            }
            if (rule.condition === 'greater than') {
                for (let i = 0;i < 2;i++) {
                    checks[i] = checks[i] > rule.limit;
                }
            }
            else if (rule.condition === 'less than') {
                for (let i = 0;i < 2;i++) {
                    checks[i] = checks[i] < rule.limit;
                }
            }
            else {
                throw "Unexpected condition in referral logic";
            }
            if (rule.ear === 'either') {
                if (checks[0] || checks[1]) {
                    return [rule.result, rule.reason];
                }
            }
            else if (rule.ear === 'both') {
                if (checks[0] && checks[1]) {
                    return [rule.result, rule.reason];
                }
            }
            else {
                throw "Unexpected condition ear value in referral logic";
            }
        }
    }
    throw "Bad referral logic - no rules satisfied";
}
