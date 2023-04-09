document.addEventListener('DOMContentLoaded', (event) => {
    let tableau = document.getElementById("tableau");
    var body_tableau = tableau.getElementsByTagName("tbody")[0];

    tr = body_tableau.insertRow(0);
    for (let i=0; i<12;i+=1) {
        actual_th = tr.insertCell(0);
        actual_th.textContent = i.toString();
    }
})

