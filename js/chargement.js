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
    let tbody = document.getElementById("body_tableau");
    for (var vol of vols) {
        let ligne = tbody.insertRow();
        let numero_ogn = structuredClone(vol).numero_ogn;
        let cellule_bouton = ligne.insertCell();
        let bouton_supprimer = document.createElement("button");
        bouton_supprimer.classList += " button_td";
        let texte_bouton_suppr = document.createTextNode("-");
        bouton_supprimer.appendChild(texte_bouton_suppr);
        cellule_bouton.appendChild(bouton_supprimer);
        ligne.appendChild(cellule_bouton);
        bouton_supprimer.addEventListener("click", async function() {await supprimer_vol(numero_ogn, vols, infos_fixes)});
        
        //numero si pas affecte i.e. si numero_ogn > 0
        if (numero_ogn > 0) {
            numero_vol_planeur += 1;
            texte_tableau_generique(document, ligne, vol, numero_vol_planeur, "numero_ligne");
        } else {
            texte_tableau_generique(document, ligne, vol, "", "numero_ligne");
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

        //heure de decollage
        if (vol.decollage == "" || vol.decollage == "00:00") {
            //bouton pour décoller
            let cellule_decollage = ligne.insertCell();
            cellule_decollage.id = "decollage" + structuredClone(vol).numero_ogn;
            let bouton_decollage = bouton_mettre_heure(document, structuredClone(vol), "decollage", "Décoller");
            cellule_decollage.appendChild(bouton_decollage);
            bouton_decollage.addEventListener("click", function(){
                this.remove();
                heure_tableau_generique(document, cellule_decollage, vol, "decollage", heure_actuelle_str(), numero_ogn);
                recharger_temps_vol(document, numero_ogn);

                let cellule_atterissage = document.getElementById("atterissage" + structuredClone(vol).numero_ogn);
                while (cellule_atterissage.childNodes.length > 0) {
                    cellule_atterissage.removeChild(cellule_atterissage.lastChild);
                }
                let bouton_atterissage = bouton_mettre_heure(document, vol, "atterissage", "Atterir");
                cellule_atterissage.appendChild(bouton_atterissage);
                bouton_atterissage.addEventListener("click", function() {
                    this.remove();
                    heure_tableau_generique(document, cellule_atterissage, vol, "atterissage", heure_actuelle_str(), numero_ogn);
                    recharger_temps_vol(document, numero_ogn);
                })
            });
            //et rien pour l'atterissage
            texte_tableau_generique(document, ligne, vol, "", "atterissage");
        } else {
            heure_tableau_generique_cellule(document, ligne, vol, "decollage", numero_ogn);
            // heure attero
            if (vol.atterissage == "" || vol.atterissage == "00:00") {

                //bouton pour atterir
                let cellule_atterissage = ligne.insertCell();
                let bouton_atterissage = bouton_mettre_heure(document, vol, "atterissage", "Atterrir");
                cellule_atterissage.appendChild(bouton_atterissage);
                bouton_atterissage.addEventListener("click", function() {
                    this.remove();
                    heure_tableau_generique(document, cellule_atterissage, vol, "atterissage", heure_actuelle_str(), numero_ogn);
                    recharger_temps_vol(document, numero_ogn);
                });
            } else {
                heure_tableau_generique_cellule(document, ligne, vol, "atterissage", numero_ogn);
            }
        }

        
        if (vol.atterissage == "" || vol.decollage ==  "" || vol.decollage == "00:00" || vol.atterissage == "00:00") {
            texte_tableau_generique(document, ligne, vol, "", "temps_vol");
        } else {
            temps_vol(vol);
            texte_tableau_generique(document, ligne, vol, structuredClone(vol).temps_vol, "temps_vol");
        }
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
    let div_menu = document.createElement("div");
    div_menu.className += "menu";
    div_menu.id = "menu";
    body.appendChild(div_menu);
    let a = document.createElement("a");
    a.className.id = "date_menu";
    let entree_date = document.createElement("input");
    entree_date.type = "date";
    entree_date.value = date_jour_str(); 
    entree_date.id = "entree_date";
    entree_date.classList += " input_tr";
    a.appendChild(entree_date);
    div_menu.appendChild(a);
    entree_date.addEventListener(
        "change",
        function () { 
            recharger(
                document,
                entree_date.value,
                tableau,
                infos_fixes,
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
    //creation du bouton de creation de vol
    let th_bouton = document.createElement("th");
    let bouton_plus = document.createElement("button");
    let texte_bouton = document.createTextNode("+");
    bouton_plus.appendChild(texte_bouton);
    th_bouton.appendChild(bouton_plus);
    tr.appendChild(th_bouton);
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
    let menu = document.getElementById("menu");
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
    let texte_pilote_rq = document.createTextNode("Pilote Remorqueur :");
    for (let element of [texte_chef_piste, select_chef_piste, texte_treuil, select_treuil, texte_pilote_tr, select_pilote_tr, texte_remorqueur, select_remorqueur, texte_pilote_rq, select_pilote_rq]) {
        let a = document.createElement("a");
        a.appendChild(element);
        menu.appendChild(a);
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




function nettoyage_menu(menu) {
    while(menu.childNodes.length > 1) {
        menu.removeChild(menu.lastChild);
    }
}




function nettoyage(document) {
    let tableau = document.getElementById("tableau");
    nettoyage_tableau(tableau);

    let menu = document.getElementById("menu");
    nettoyage_menu(menu);
}




function temps_vol(vol) {
    let decollage = temps_texte_vers_heure_type(vol.decollage);
    let atterissage = temps_texte_vers_heure_type(vol.atterissage);
    let temps_vol = atterissage - decollage;

    let heures = Math.floor(temps_vol / 3600000).toString();
    let minutes = Math.floor((temps_vol-heures*3600000) / 60000);
    if (minutes < 10) {
        minutes = "0" + minutes.toString();
    } else {
        minutes = minutes.toString();
    }
    let temps_vol_str = heures + ":" + minutes;

    return temps_vol_str;
}

function recharger_temps_vol(document, numero_ogn) {
    let cellule_temps_vol = document.getElementById("temps_vol" + numero_ogn);

    while (cellule_temps_vol.childNodes.length>0) {
        cellule_temps_vol.removeChild(cellule_temps_vol.lastChild);
    }
    cellule_temps_vol.innerHTML = "caca";
     let entree_decollage = document.getElementById("entreedecollage" + numero_ogn)
    let decollage = entree_decollage.value;
    let decollage_type = temps_texte_vers_heure_type(decollage);

    let entree_atterissage = document.getElementById("entreeatterissage" + numero_ogn)
    if (entree_atterissage != null) {
        let atterissage = entree_atterissage.value;
        let atterissage_type = temps_texte_vers_heure_type(atterissage);

        let temps_vol = atterissage_type - decollage_type;

        let heures = Math.floor(temps_vol / 3600000).toString();
        let minutes = Math.floor((temps_vol-heures*3600000) / 60000);
        if (minutes < 10) {
            minutes = "0" + minutes.toString();
        } else {
            minutes = minutes.toString();
        }
        let temps_vol_str = heures + ":" + minutes;
        while (cellule_temps_vol.childNodes.length>0) {
            cellule_temps_vol.removeChild(cellule_temps_vol.lastChild);
        }
        cellule_temps_vol.innerHTML = temps_vol_str;
   }
}