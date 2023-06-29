
async function chargement_des_ressources(document, tableau, vols, immatriculations, pilotes, pilotes_tr, pilotes_rq, treuils, remorqueurs) {
    let numero_vol_planeur = 0;
    for (var vol of vols) {
        numero_vol_planeur += 1;
        let ligne = tableau.insertRow();
        
        //numero_ogn
        texte_tableau_generique(document, ligne, numero_vol_planeur, "numero_ogn", vol);
        //code de decollage
        select_generique("code_decollage", vol["code_decollage"], CodeDecollage, ligne, vol);
        //selectionne les pilotes et les machines en fonction du moyen de decollage
        let machines_decollage = []; 
        let pilotes_decollage = [];
        if (vol["code_decollage"] == "T") {
            machines_decollage = treuils;
            pilotes_decollage = pilotes_tr;
        } else if (vol["code_decollage"] == "R") {
            machines_decollage = remorqueurs;
            pilotes_decollage = pilotes_rq;
        }
        // machine de decollage
        select_generique("machine_decollage", vol["machine_decollage"], machines_decollage, ligne, vol);
        //pilote qui a fait decoller
        select_generique("decolleur", vol["decolleur"], pilotes_decollage, ligne, vol);
        //immatriculation
        select_generique("aeronef", vol["aeronef"], immatriculations, ligne, vol);
        //code vol
        select_generique("code_vol", vol["code_vol"], CodeVol, ligne, vol);
        // pilote 1 (cdb, instructeur...)
        select_generique("pilote1", vol["pilote1"], pilotes, ligne, vol);
        // pilote 2 (eleve, passager...)
        select_generique("pilote2", vol["pilote2"], pilotes, ligne, vol);

        let decollage = temps_texte_vers_heure_type(vol.decollage);
        let atterissage = temps_texte_vers_heure_type(vol.atterissage);

        //heure de decollage
        heure_tableau_generique(document, ligne, vol, "decollage", structuredClone(vol).decollage, decollage, atterissage);
        //heure d'atterissage
        
        heure_tableau_generique(document, ligne, vol, "atterissage", structuredClone(vol).atterissage, decollage, atterissage);
        //hdv       
        
        let temps_vol = atterissage - decollage;
        let heures = Math.floor(temps_vol / 3600000).toString();
        let minutes = Math.floor((temps_vol-heures*3600000) / 60000);
        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
                
        vol.temps_vol = heures + ":" + minutes;
        texte_tableau_generique(document, ligne, structuredClone(vol).temps_vol, "temps_vol", vol);
    }
}




 
async function premier_chargement_tableau(document, immatriculations, pilotes, pilotes_tr, pilotes_rq, treuils, remorqueurs) {
    let code_pilote = document.getElementById("champ_code_pilote").value;
    let mot_de_passe = document.getElementById("champ_mot_de_passe").value;
    let body = document.getElementById("body");
            
            
        /*requete*/
    let formulaire = document.getElementById("formulaire de connexion");
    formulaire.remove();
    
    
            
    /*ajoute le tableau*/
    let ul = document.createElement("ul");
    ul.className += "menu";
    body.appendChild(ul);
    let li = document.createElement("li");
    li.className.id = "date_menu";
    let a =document.createElement("a");
    let entree_date = document.createElement("input");
    entree_date.type = "date";
    entree_date.value = "2023-04-25";
    entree_date.id = "entree_date";
    a.appendChild(entree_date);
    li.appendChild(a);
    ul.appendChild(li);
    entree_date.addEventListener(
        "change",
        function () { 
            recharger(
                document,
                entree_date.value,
                tableau,
                immatriculations,
                pilotes,
                pilotes_tr,
                pilotes_rq,
                treuils,
                remorqueurs
            );
        }
    );
    
    let tableau_html = document.createElement("table");
    tableau_html.id = "tableau";
    body.appendChild(tableau_html);

    let thead = document.createElement("thead");
    thead.className += "ligne_info";

    let tr = document.createElement("tr");
    thead.appendChild(tr);
    let colonnes = [
        "Ligne", "Code de décollage", "Avec", "Par", "Immatriculation", "Code vol", "Commandant de bord ou Instructeur", "Pilote 2 ou élève", "Heure de décollage", "Heure d'atterissage", "Temps de vol"
    ];
    for (let titre of colonnes) {
        let th = document.createElement("th");
        th.textContent = titre;
        tr.appendChild(th);
    
    }
    tableau.appendChild(thead);
    let tbody = document.createElement("tbody");
    tbody.id = "body_tableau";
    tableau_html.appendChild(tbody);       
}



