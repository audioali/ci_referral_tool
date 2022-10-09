const freqs = ['0.5','1','2','3','4'];

const referral_logic_query = fetch('referral_logic.json').then((response) => response.json());

let reason = ''; //Used to store reason behind active recommendation

async function compute_recommendation() {
    const output_msg = document.getElementById('output_msg')
    try {
        let test_results = {left: {ac: {}, bc: {}}, right: {ac: {}, bc: {}}};
        for (const ear of ['left','right']) {
            for (const type of ['ac','bc']) {
                for (const freq of freqs) {
                    const result = document.getElementById(ear+'_'+type+'_'+freq);
                    if (result.value !== '') {
                        if (result.value === 'NR') {
                            test_results[ear][type][freq] = null; //Using null to mean 'not reached'
                        }
                        else {
                            test_results[ear][type][freq] = parseInt(result.value);
                        }
                    }
                }
            }
        }
        test_results.loss_type = document.getElementById('loss_type').value;
        const referral_logic = await referral_logic_query;
        const decision = process_results(test_results, referral_logic);
        output_msg.textContent = decision[0];
        reason = ''; //To ensure old reason is wiped as soon as decision changes
        if (decision.length > 1) {
            reason = decision[1];
            document.getElementById('reason').style.display = 'block';
        }
    }
    catch (err) {
        console.log(referral_logic);
        console.log(err);
        output_msg.textContent = "An unexpected error occurred";
    }
    document.getElementById('output').setAttribute('class', 'output')
}

function loss_type_change() {
    //When loss type selection changes, need to re-enable/disable all of the BC inputs

    clear_output();
    const loss_type = document.getElementById('loss_type').value;
    for (const ear of ['left','right']) {
        for (const f of freqs) {
            if (loss_type === 'sensorineural') {
                const db_input = document.getElementById(ear + "_bc_" + f)
                db_input.setAttribute('disabled','');
                db_input.value = '';
            }
            else if (loss_type === 'mixed') {
                document.getElementById(ear+'_bc_'+f).removeAttribute('disabled');
            }
        }
    }
}

function clear_output() {
    //Whenever user input changes, want to wipe old output, to prevent possible confusion

    const output = document.getElementById('output');
    output.setAttribute('class', 'hidden')
    document.getElementById('reason').style.display = 'none';
}

function explain() {
    //Opens popup explaining reason behind decision

    alert(reason);
}

//Need to create the table for inputting data
function generate_table() {
    const loss_type = document.getElementById('loss_type').value;
    const table = document.getElementById('input');
    const table_header = document.getElementById('input_header');
    for (const f of freqs) {
        const col_header = document.createElement("th");
        col_header.textContent = f + " kHz";
        table_header.appendChild(col_header);
    }
    for (const ear of ['left','right']) {
        for (const type of ['ac','bc']) {
            const new_row = document.createElement("tr");
            const row_title = document.createElement("td");
            row_title.textContent = ear + " " + type;
            row_title.setAttribute("nowrap", "nowrap")
            row_title.setAttribute("class", ear)
            new_row.appendChild(row_title);
            for (const f of freqs) {
                const db_input = document.createElement("input");
                db_input.setAttribute("type","text");
                db_input.setAttribute("id", ear+"_"+type+"_"+f);
                db_input.setAttribute("class", ear+" db_input");
                if (loss_type === 'sensorineural' && type == 'bc') {
                    db_input.setAttribute('disabled','');
                }
                db_input.setAttribute("onChange", "clear_output()");
                new_cell = document.createElement("td");
                new_cell.appendChild(db_input);
                new_row.appendChild(new_cell);
            }
            table.appendChild(new_row);
        }
    }
}

// This function for collapsible boxes is taken from here: https://www.w3schools.com/howto/howto_js_collapsible.asp
function add_faq_listeners() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
}
