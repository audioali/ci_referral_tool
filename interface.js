const freqs = ['0.25','0.5','1','2','3','4','8'];

function compute_recommendation() {
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
        const output = document.getElementById('output');
        output.textContent = process_results(test_results);
    }
    catch (err) {
        const output = document.getElementById('output');
        output.textContent = "An unexpected error occurred";
    }
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

    document.getElementById('output').textContent = '';
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
            new_row.appendChild(row_title);
            for (const f of freqs) {
                const db_input = document.createElement("input");
                db_input.setAttribute("type","text");
                db_input.setAttribute("id", ear+"_"+type+"_"+f);
                db_input.setAttribute("class", "db_input");
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