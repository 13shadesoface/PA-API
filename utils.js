
const fetch = require('node-fetch');
const url = require('url');
//API gouvernementale utilisée pour vérifier l'adresse --> google
var urlGeoAPI = new URL("https://geo.api.gouv.fr/communes");

function checkEmail(email){
    return !(/\S+@\S+\.\S+/.test(email))
}

/**
 * 
 * @param {string} ville - nom de la ville de résidence
 * @param {string} codePostal - code postal de l'adresse de résidence
 * @returns {boolean} vrai si l'api .gouv trouve le même nom de ville à partir du code postal
 * @requires fetch
 * @requires url
 */
async function checkAddress(ville,codePostal,callback){
    urlGeoAPI.search = '?nom=' + ville;
    const response = await fetch(urlGeoAPI.href)
        .then(res => res.json())
        .then(json => {
            var retour = false;
            json.forEach(commune => {
                commune.codesPostaux.forEach(codeP => {
                    if (codePostal == codeP) {
                        retour = true;
                    }
                });
            });
            callback(retour)
        })
        .catch(err => {
            callback(err);
        });
}

module.exports = {
    checkEmail,
    checkAddress
};