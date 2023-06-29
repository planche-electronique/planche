/*
    Planche-électronique - projet de système d'enregistrement de vols en planeur pour clubs de vol à voile
    
    requetes.js
        fonctions qui s'occupent de faire des requetes GET et POST avec le serveur
    
    Licensed under the MIT licence, provided 'as is' without any warranty.
    Soumis à la licence MIT, fourni 'en l'état' sans aucune garantie.
    Voir https://raw.githubusercontent.com/planche-electronique/planche/master/LICENSE pour la licence complète
*/




async function lire_json(adresse) {
    return await fetch(adresse)
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP error" + response.status);
            }
            return response.json();
        })
}




async function vols_du(date_format_slash) {
    let adresse = adresse_serveur + "/vols/" + date_format_slash;
    let planche = await lire_json(adresse);
    return planche.vols;
}




async function requete_mise_a_jour(numero_ogn, champ, nouvelle_valeur, date) {
        let corps = JSON.stringify({
        "numero_ogn": numero_ogn,
        "champ_mis_a_jour": champ,
        "nouvelle_valeur": nouvelle_valeur,
        "date": date
    });
    let length = corps.length;
    await fetch(adresse_serveur+'/mise_a_jour', {
        method: 'POST',
        headers: {
            'Content-Type': 'charset=utf-8',
            'Content-Length': length,
        },
        body: corps
    })
}




async function recharger(
    document,
    date_format_tirets,
    tableau,
    immatriculations,
    pilotes,
    pilotes_tr,
    pilotes_rq,
    treuils,
    remorqueurs
) {
    
    while(tableau.rows.length > 1) {
        tableau.deleteRow(1);
    }
    let vols = await vols_du(date_format_tirets.replaceAll("-", "/"));
    await chargement_des_ressources(
        document,
        tableau,
        vols,
        immatriculations,
        pilotes,
        pilotes_tr,
        pilotes_rq,
        treuils,
        remorqueurs
    );
}


