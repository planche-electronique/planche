/*
    Planche-électronique - projet de système d'enregistrement de vols en planeur pour clubs de vol à voile
    
    chargement.js
        toutes les fonctions qui s'occupent du chargement des données sur le DOM html
    
    Licensed under the MIT licence, provided 'as is' without any warranty.
    Soumis à la licence MIT, fourni 'en l'état' sans aucune garantie.
    Voir https://raw.githubusercontent.com/planche-electronique/planche/master/LICENSE pour la licence complète
*/




async function chargement_des_ressources(document, tableau, vols, infos_fixes) {
    let numero_vol_planeur = 0;
    for (var vol of vols) {
        let ligne = tableau.insertRow();
        let numero_ogn = structuredClone(vol).numero_ogn;
        let bouton_supprimer = document.createElement("button");
        let texte_bouton_suppr = document.createTextNode("-");
        bouton_supprimer.appendChild(texte_bouton_suppr);
        ligne.appendChild(bouton_supprimer);
        bouton_supprimer.addEventListener("click", async function() {await supprimer_vol(numero_ogn, vols, infos_fixes)});
        
        //numero si pas affecte i.e. si numero_ogn > 0
        if (numero_ogn > 0) {
            texte_tableau_generique(document, ligne, numero_vol_planeur, "numero_ligne", vol);
            numero_vol_planeur += 1;
        } else {
            texte_tableau_generique(document, ligne, "", "numero_ligne", vol);
        }
        //code de decollage
        select_generique_tableau("code_decollage", vol["code_decollage"], ligne, vol, infos_fixes);
        
        // machine de decollage
        select_generique_tableau("machine_decollage", vol["machine_decollage"], ligne, vol, infos_fixes);
        //pilote qui a fait decoller
        select_generique_tableau("decolleur", vol["decolleur"], ligne, vol, infos_fixes);
        //immatriculation
        select_generique_tableau("aeronef", vol["aeronef"], ligne, vol, infos_fixes);
        //code vol
        select_generique_tableau("code_vol", vol["code_vol"], ligne, vol, infos_fixes);
        // pilote 1 (cdb, instructeur...)
        select_generique_tableau("pilote1", vol["pilote1"], ligne, vol, infos_fixes);
        // pilote 2 (eleve, passager...)
        select_generique_tableau("pilote2", vol["pilote2"], ligne, vol, infos_fixes);

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




 
async function premier_chargement_tableau(document, infos_fixes, vols) {
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
    entree_date.value = date_jour_str(); 
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
                infos_fixes.immatriculations,
                infos_fixes.pilotes,
                infos_fixes.pilotes_tr,
                infos_fixes.pilotes_rq,
                infos_fixes.treuils,
                infos_fixes.remorqueurs
            );
        }
    );
    let li_affectations = document.createElement("li");
    ul.appendChild(li_affectations);
    let div_affectations = document.createElement("div");
    div_affectations.id = "affectations";
    li_affectations.appendChild(div_affectations);
    let tableau_html = document.createElement("table");
    tableau_html.id = "tableau";
    body.appendChild(tableau_html);

    let thead = document.createElement("thead");
    thead.className += "ligne_info";

    let tr = document.createElement("tr");
    thead.appendChild(tr);
    //creation du bouton de creation de vol
    let bouton_plus = document.createElement("button");
    let texte_bouton = document.createTextNode("+");
    bouton_plus.appendChild(texte_bouton);
    tr.appendChild(bouton_plus);
    bouton_plus.addEventListener("click", async function() { await creer_affectation(vols, infos_fixes); });
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




function chargement_affectations(document, affectations, infos_fixes) {
    let div_affectations = document.getElementById("affectations");
    let date = document.getElementById("entree_date").value;
    let select_chef_piste = select_generique(document, infos_fixes["pilotes"], "chef_piste", affectations["chef_piste"]);
    let texte_chef_piste = document.createTextNode("Chef de piste :");
    let select_treuil =  select_generique(document, infos_fixes["treuils"], "treuil", affectations["treuil"]);
    let texte_treuil = document.createTextNode("Treuil :");
    let select_pilote_tr = select_generique(document, infos_fixes["pilotes_tr"], "pilote_tr", affectations["pilote_tr"]);
    let texte_pilote_tr = document.createTextNode("Treuilleur :");
    let select_remorqueur = select_generique(document, infos_fixes["remorqueurs"], "remorqueur", affectations["remorqueurs"]);
    let texte_remorqueur = document.createTextNode("Remorqueur :");
    let select_pilote_rq = select_generique(document, infos_fixes["pilotes_rq"], "pilote_rq", affectations["pilote_rq"]);
    let texte_pilote_rq = document.createTextNode("Pilote Remorqueur");
    for (let element of [texte_chef_piste, select_chef_piste, texte_treuil, select_treuil, texte_pilote_tr, select_pilote_tr, texte_remorqueur, select_remorqueur, texte_pilote_rq, select_pilote_rq]) {
        div_affectations.appendChild(element);
    }

    select_treuil.addEventListener("change", function() { requete_mise_a_jour(0, "treuil", this.value, date)});
    select_pilote_tr.addEventListener("change", function() { requete_mise_a_jour(0, "pilote_tr", this.value, date)});
    select_remorqueur.addEventListener("change", function() { requete_mise_a_jour(0, "remorqueur", this.value, date)});
    select_pilote_rq.addEventListener("change", function() { requete_mise_a_jour(0, "pilote_rq", this.value, date)});
    select_chef_piste.addEventListener("change", function() { requete_mise_a_jour(0, "chef_piste", this.value, date)});
    

    

}



function nettoyage_tableau(tableau) {
    while(tableau.rows.length > 1) {
        tableau.deleteRow(1);
    }
}




function nettoyage_div_affectations(div_affectations) {
    while(div_affectations.firstChild) {
        div_affectations.removeChild(div_affectations.lastChild);
    }
}




function nettoyage(document) {
    let tableau = document.getElementById("tableau");
    nettoyage_tableau(tableau);

    let div_affectations = document.getElementById("affectations");
    nettoyage_div_affectations(div_affectations);
}