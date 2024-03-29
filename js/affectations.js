/*
    Planche-électronique - projet de système d'enregistrement de vols en planeur pour clubs de vol à voile
    
    affectations.js
        toutes les fonctions qui s'occupent de créer et supprimer des affectations
    
    Licensed under the MIT licence, provided 'as is' without any warranty.
    Soumis à la licence MIT, fourni 'en l'état' sans aucune garantie.
    Voir https://raw.githubusercontent.com/planche-electronique/planche/master/LICENSE pour la licence complète
*/




async function creer_affectation(vols, infos_fixes) {
    let plus_petit_numero_ogn = 0; // pour trouver le plus petit et l'ajouter
    for (let vol of vols) {
        if (structuredClone(vol).numero_ogn < plus_petit_numero_ogn) {
            plus_petit_numero_ogn = structuredClone(vol).numero_ogn;
        }
    }
    vols.push({
        "numero_ogn": plus_petit_numero_ogn-1,
        "aeronef": "",
        "code_vol":"",
        "code_decollage":"",
        "machine_decollage": "",
        "decolleur": "",
        "pilote1": "",
        "pilote2": "",
        "decollage": "",
        "atterissage": "",
    });
    let entree_date = document.getElementById("entree_date");
    let date = entree_date.value;
    let tableau= document.getElementById("tableau");
    nettoyage_tableau(tableau);
    await requete_mise_a_jour(plus_petit_numero_ogn-1, "nouveau", "", date.replaceAll("-", "/"));
    await chargement_des_ressources(
        document,
        tableau,
        vols,
        infos_fixes
    );
}




async function supprimer_vol(numero_ogn, vols, infos_fixes) {
    let entree_date = document.getElementById("entree_date");
    let date = entree_date.value;
    await requete_mise_a_jour(numero_ogn, "supprimer", "", date.replaceAll("-", "/"));

    
    vols = vols.filter(x => x["numero_ogn"] != numero_ogn);
    nettoyage_tableau(tableau);
    await chargement_des_ressources(
        document,
        tableau,
        vols,
        infos_fixes
    );
}
