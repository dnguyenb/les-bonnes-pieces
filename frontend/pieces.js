import {
	afficherAvis,
	afficherGraphiqueAvis,
	ajoutListenerEnvoyerAvis,
	ajoutListenersAvis,
} from './avis.js';
import { envoyerAvisGenere, genererMultiplesAvis } from './generer-avis.js';

// Variable globale pour stocker les pièces
let pieces = [];

// Fonction qui génère la page web :
const genererPieces = (pieces) => {
	// Récupération de l'élément du DOM qui accueillera les fiches
	const sectionFiches = document.querySelector('.fiches');
	if (!sectionFiches) return;

	// Vider la section avant de générer les pièces
	sectionFiches.innerHTML = '';

	// Pour chaque pièce automobile
	for (let piece of pieces) {
		// Création d'une balise dédiée à une pièce automobile
		const pieceElement = document.createElement('article');
		pieceElement.dataset.id = piece.id;

		// Création image
		const imageElement = document.createElement('img');
		imageElement.src = piece.image;
		imageElement.alt = `Image de ${piece.nom}`;

		// Création nom
		const nomElement = document.createElement('h2');
		nomElement.innerText = piece.nom;

		// Création prix (opérateur ternaire)
		const prixElement = document.createElement('p');
		prixElement.innerText = `Prix: ${piece.prix} € (${
			piece.prix < 35 ? '€' : '€€€'
		})`;

		// Création catégorie
		const categorieElement = document.createElement('p');
		categorieElement.innerText = piece.categorie ?? '(aucune catégorie)';

		// Création description (opérateur nullish)
		const descriptionElement = document.createElement('p');
		descriptionElement.innerText =
			piece.description ?? 'Pas de description pour le moment.';

		// Création statut de stock
		const stockElement = document.createElement('p');
		stockElement.innerText = piece.disponibilite
			? 'En stock'
			: 'Rupture de stock';

		// Création bouton pour afficher les avis
		const btnAvisElement = document.createElement('button');
		btnAvisElement.dataset.id = piece.id;
		btnAvisElement.textContent = 'Afficher les avis';

		// On rattache les balises
		sectionFiches.appendChild(pieceElement);
		pieceElement.appendChild(imageElement);
		pieceElement.appendChild(nomElement);
		pieceElement.appendChild(prixElement);
		pieceElement.appendChild(categorieElement);
		pieceElement.appendChild(descriptionElement);
		pieceElement.appendChild(stockElement);
		pieceElement.appendChild(btnAvisElement);
	}

	// Ajouter les listeners aux boutons d'avis
	ajoutListenersAvis();
};

// Fonction qui initialise les event listeners
const initializeEventListeners = () => {
	// bouton Trier avec sort() :
	const btnTrier = document.querySelector('.btn-trier');
	if (btnTrier) {
		btnTrier.addEventListener('click', () => {
			const piecesOrdonnees = [...pieces];
			piecesOrdonnees.sort((a, b) => a.prix - b.prix);
			genererPieces(piecesOrdonnees);
		});
	}

	// bouton Trier par prix décroissant avec sort() :
	const btnDecroissant = document.querySelector('.btn-decroissant');
	if (btnDecroissant) {
		btnDecroissant.addEventListener('click', () => {
			const piecesOrdonnees = [...pieces];
			piecesOrdonnees.sort((a, b) => b.prix - a.prix);
			genererPieces(piecesOrdonnees);
		});
	}

	// bouton Filtrer prix abordables avec filter() :
	const btnFiltrer = document.querySelector('.btn-filtrer');
	if (btnFiltrer) {
		btnFiltrer.addEventListener('click', () => {
			const piecesFiltrees = pieces.filter((piece) => piece.prix <= 35);
			genererPieces(piecesFiltrees);
		});
	}

	// bouton Filter pieces sans description avec filter() :
	const btnFiltrerNoDesc = document.querySelector('.btn-nodesc');
	if (btnFiltrerNoDesc) {
		btnFiltrerNoDesc.addEventListener('click', () => {
			const piecesFiltrees = pieces.filter((piece) => piece.description);
			genererPieces(piecesFiltrees);
		});
	}

	// Balise input [range] pour filtrer par prix :
	const inputPrixMax = document.getElementById('range');
	if (inputPrixMax) {
		inputPrixMax.addEventListener('input', (event) => {
			const valeur = event.target.value;
			const piecesFiltrees = pieces.filter((piece) => piece.prix <= valeur);
			genererPieces(piecesFiltrees);
		});
	}

	// bouton reset
	const btnReset = document.querySelector('.btn-reset');
	if (btnReset) {
		btnReset.addEventListener('click', () => {
			genererPieces(pieces);
		});
	}

	// Bouton de mise à jour de la liste des pièces dans le Local Storage
	const btnMiseAJour = document.querySelector('.btn-maj');
	if (btnMiseAJour) {
		btnMiseAJour.addEventListener('click', async () => {
			window.localStorage.removeItem('pieces');
			window.location.reload();
		});
	}

	// Bouton de génération d'avis aléatoires
	const btnGenererAvis = document.querySelector('.btn-generer-avis');
	if (btnGenererAvis) {
		btnGenererAvis.addEventListener('click', async () => {
			try {
				// Désactiver le bouton pendant la génération
				btnGenererAvis.disabled = true;
				btnGenererAvis.textContent = 'Génération en cours...';

				// Générer des avis pour chaque pièce
				for (let piece of pieces) {
					// Générer 1 à 3 avis par pièce
					const nombreAvis = Math.floor(Math.random() * 3) + 1;
					const avisGeneres = genererMultiplesAvis(piece.id, nombreAvis);

					// Envoyer chaque avis au serveur
					for (let avis of avisGeneres) {
						await envoyerAvisGenere(avis);
					}
				}

				// Mettre à jour l'affichage des graphiques
				await afficherGraphiqueAvis();

				// Réactiver le bouton
				btnGenererAvis.disabled = false;
				btnGenererAvis.textContent = 'Générer des avis aléatoires';

				// Afficher un message de confirmation
				alert('Les avis ont été générés avec succès !');
			} catch (error) {
				console.error('Erreur lors de la génération des avis:', error);
				alert('Une erreur est survenue lors de la génération des avis.');

				// Réactiver le bouton en cas d'erreur
				btnGenererAvis.disabled = false;
				btnGenererAvis.textContent = 'Générer des avis aléatoires';
			}
		});
	}
};

// Fonction pour charger les pièces depuis l'API
const chargerPieces = async () => {
	try {
		const reponse = await fetch('http://localhost:8081/pieces');
		if (!reponse.ok) {
			throw new Error(`Erreur HTTP: ${reponse.status}`);
		}
		return await reponse.json();
	} catch (error) {
		console.error('Erreur lors du chargement des pièces:', error);
		return [];
	}
};

// Fonction d'initialisation principale
const initialize = async () => {
	try {
		// Récupération des pièces depuis le localStorage ou l'API
		let piecesFromStorage = window.localStorage.getItem('pieces');

		if (piecesFromStorage === null) {
			// Si pas de données en cache, charger depuis l'API
			pieces = await chargerPieces();
			if (pieces.length > 0) {
				window.localStorage.setItem('pieces', JSON.stringify(pieces));
			}
		} else {
			pieces = JSON.parse(piecesFromStorage);
		}

		// Initialisation de l'interface
		genererPieces(pieces);
		ajoutListenerEnvoyerAvis();
		initializeEventListeners();

		// Affichage des avis existants
		for (let piece of pieces) {
			const avisJSON = window.localStorage.getItem(`avis-piece-${piece.id}`);
			if (avisJSON !== null) {
				const avis = JSON.parse(avisJSON);
				const pieceElement = document.querySelector(
					`article[data-id="${piece.id}"]`
				);
				if (pieceElement) {
					afficherAvis(pieceElement, avis);
				}
			}
		}

		// Initialisation des graphiques
		await afficherGraphiqueAvis();
	} catch (error) {
		console.error("Erreur lors de l'initialisation:", error);
		alert("Une erreur est survenue lors de l'initialisation de l'application.");
	}
};

// Démarrage de l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initialize);
