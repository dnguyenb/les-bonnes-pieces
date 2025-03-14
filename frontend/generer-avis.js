// Liste de commentaires prédéfinis pour plus de réalisme
const COMMENTAIRES_POSITIFS = [
	'Excellent produit, je recommande !',
	'Très satisfait de mon achat',
	'Rapport qualité/prix imbattable',
	'Fonctionne parfaitement',
	'Livraison rapide et produit conforme',
	'Super qualité',
	'Exactement ce que je cherchais',
];

const COMMENTAIRES_NEUTRES = [
	'Produit correct',
	'Fait le travail',
	'Qualité moyenne',
	'Rien à signaler de particulier',
	'Conforme à la description',
];

const COMMENTAIRES_NEGATIFS = [
	'Déçu par la qualité',
	"Un peu cher pour ce que c'est",
	'Pourrait être mieux',
	'Pas très durable',
	'Des défauts de finition',
];

const PRENOMS = [
	'Jean',
	'Marie',
	'Pierre',
	'Sophie',
	'Michel',
	'Claire',
	'Thomas',
	'Julie',
	'Nicolas',
	'Emma',
	'Lucas',
	'Léa',
	'Antoine',
	'Camille',
	'David',
	'Sarah',
];

const NOMS = [
	'Martin',
	'Bernard',
	'Dubois',
	'Thomas',
	'Robert',
	'Richard',
	'Petit',
	'Durand',
	'Leroy',
	'Moreau',
];

/**
 * Génère un nombre aléatoire entre min et max inclus
 */
function nombreAleatoire(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sélectionne un élément aléatoire dans un tableau
 */
function selectionnerAleatoire(tableau) {
	return tableau[Math.floor(Math.random() * tableau.length)];
}

/**
 * Génère un nom d'utilisateur aléatoire
 */
function genererNomUtilisateur() {
	return `${selectionnerAleatoire(PRENOMS)} ${selectionnerAleatoire(NOMS)}`;
}

/**
 * Sélectionne un commentaire en fonction du nombre d'étoiles
 */
function selectionnerCommentaire(nbEtoiles) {
	if (nbEtoiles >= 4) {
		return selectionnerAleatoire(COMMENTAIRES_POSITIFS);
	} else if (nbEtoiles <= 2) {
		return selectionnerAleatoire(COMMENTAIRES_NEGATIFS);
	} else {
		return selectionnerAleatoire(COMMENTAIRES_NEUTRES);
	}
}

/**
 * Génère un avis aléatoire pour une pièce donnée
 * @param {number} pieceId - L'identifiant de la pièce
 * @returns {Object} L'avis généré
 */
export function genererAvis(pieceId) {
	const nbEtoiles = nombreAleatoire(1, 5);
	return {
		pieceId: pieceId,
		utilisateur: genererNomUtilisateur(),
		commentaire: selectionnerCommentaire(nbEtoiles),
		nbEtoiles: nbEtoiles,
	};
}

/**
 * Génère plusieurs avis aléatoires pour une pièce
 * @param {number} pieceId - L'identifiant de la pièce
 * @param {number} nombre - Le nombre d'avis à générer
 * @returns {Array} Un tableau d'avis
 */
export function genererMultiplesAvis(pieceId, nombre = 1) {
	const avis = [];
	for (let i = 0; i < nombre; i++) {
		avis.push(genererAvis(pieceId));
	}
	return avis;
}

/**
 * Envoie un avis généré au serveur
 * @param {Object} avis - L'avis à envoyer
 * @returns {Promise} Une promesse qui se résout quand l'avis est envoyé
 */
export async function envoyerAvisGenere(avis) {
	try {
		const response = await fetch('http://localhost:8081/avis', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(avis),
		});

		if (!response.ok) {
			throw new Error(`Erreur HTTP: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Erreur lors de l'envoi de l'avis:", error);
		throw error;
	}
}
