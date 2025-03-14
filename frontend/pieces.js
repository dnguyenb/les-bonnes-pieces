import {
	afficherAvis,
	afficherGraphiqueAvis,
	ajoutListenerEnvoyerAvis,
	ajoutListenersAvis,
} from './avis.js';

// Fonction qui s'exécute une fois que le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', async () => {
	let pieces = window.localStorage.getItem('pieces');

	if (pieces === null) {
		try {
			// Récupération des pièces automobiles depuis le fichier JSON :
			const reponse = await fetch('http://localhost:8081/pieces');
			if (!reponse.ok) {
				throw new Error(`Erreur HTTP: ${reponse.status}`);
			}
			const piecesData = await reponse.json();
			window.localStorage.setItem('pieces', JSON.stringify(piecesData));
			pieces = piecesData;
		} catch (err) {
			console.error('Erreur lors de la récupération des pièces:', err);
			// Initialiser avec un tableau vide en cas d'erreur
			pieces = [];
		}
	} else {
		pieces = JSON.parse(pieces);
	}

	// Ajout du listener au formulaire avis
	ajoutListenerEnvoyerAvis();

	// Premier affichage de la page
	genererPieces(pieces);

	// Affichage des avis stockés localement
	for (let i = 0; i < pieces.length; i++) {
		const id = pieces[i].id;
		const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);

		if (avisJSON !== null) {
			const avis = JSON.parse(avisJSON);
			const pieceElement = document.querySelector(`article[data-id="${id}"]`);
			if (pieceElement) {
				afficherAvis(pieceElement, avis);
			}
		}
	}

	// Initialisation des graphiques
	try {
		await afficherGraphiqueAvis();
	} catch (error) {
		console.error("Erreur lors de l'affichage des graphiques:", error);
	}

	/* Tri et Filtre des pièces */
	// bouton Trier avec sort() :
	const btnTrier = document.querySelector('.btn-trier');
	btnTrier.addEventListener('click', () => {
		// copie du tableau de pieces :
		const piecesOrdonnees = [...pieces];
		piecesOrdonnees.sort((a, b) => a.prix - b.prix);

		document.querySelector('.fiches').innerHTML = '';
		genererPieces(piecesOrdonnees);
	});

	// bouton Trier par prix décroissant avec sort() :
	const btnDecroissant = document.querySelector('.btn-decroissant');
	btnDecroissant.addEventListener('click', () => {
		const piecesOrdonnees = [...pieces];
		piecesOrdonnees.sort((a, b) => b.prix - a.prix);
		document.querySelector('.fiches').innerHTML = '';
		genererPieces(piecesOrdonnees);
	});

	// bouton Filtrer prix abordables avec filter() :
	const btnFiltrer = document.querySelector('.btn-filtrer');
	btnFiltrer.addEventListener('click', () => {
		const piecesFiltrees = pieces.filter((piece) => piece.prix <= 35);
		document.querySelector('.fiches').innerHTML = '';
		genererPieces(piecesFiltrees);
	});

	// bouton Filter pieces sans decription avec filter() :
	const btnFiltrerNoDesc = document.querySelector('.btn-nodesc');
	btnFiltrerNoDesc.addEventListener('click', () => {
		const piecesFiltrees = pieces.filter((piece) => piece.description);
		document.querySelector('.fiches').innerHTML = '';
		genererPieces(piecesFiltrees);
	});

	// Balise input [range] pour filtrer par prix :
	const inputPrixMax = document.getElementById('range');
	inputPrixMax.addEventListener('input', (event) => {
		const valeur = event.target.value;
		const piecesFiltrees = pieces.filter((piece) => piece.prix <= valeur);
		document.querySelector('.fiches').innerHTML = '';
		genererPieces(piecesFiltrees);
	});

	// bouton reset
	document.querySelector('.btn-reset').addEventListener('click', () => {
		document.querySelector('.fiches').innerHTML = '';
		genererPieces(pieces);
	});

	// Bouton de mise à jour de la liste des pièces dans le Local Storage
	const btnMiseAJour = document.querySelector('.btn-maj');
	btnMiseAJour.addEventListener('click', async () => {
		window.localStorage.removeItem('pieces');
		// Recharger la page pour effectuer une nouvelle requête
		window.location.reload();
	});
});

// Fonction qui génère la page web :
const genererPieces = (pieces) => {
	// Récupération de l'élément du DOM qui accueillera les fiches
	const sectionFiches = document.querySelector('.fiches');

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

// Premier affichage de la page
genererPieces(pieces);

for (let i = 0; i < pieces.length; i++) {
	const id = pieces[i].id;
	const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
	const avis = JSON.parse(avisJSON);

	if (avis !== null) {
		const pieceElement = document.querySelector(`article[data-id="${id}"]`);
		afficherAvis(pieceElement, avis);
	}
}

/* Tri et Filtre des pièces */
// bouton Trier avec sort() :
const btnTrier = document.querySelector('.btn-trier');
btnTrier.addEventListener('click', () => {
	// copie du tableau de pieces :
	const piecesOrdonnees = [...pieces];
	piecesOrdonnees.sort((a, b) => a.prix - b.prix);

	document.querySelector('.fiches').innerHTML = '';
	genererPieces(piecesOrdonnees);
});

// bouton Trier par prix décroissant avec sort() :
const btnDecroissant = document.querySelector('.btn-decroissant');
btnDecroissant.addEventListener('click', () => {
	const piecesOrdonnees = [...pieces];
	piecesOrdonnees.sort((a, b) => b.prix - a.prix);
	document.querySelector('.fiches').innerHTML = '';
	genererPieces(piecesOrdonnees);
});

// bouton Filtrer prix abordables avec filter() :
const btnFiltrer = document.querySelector('.btn-filtrer');
btnFiltrer.addEventListener('click', () => {
	const piecesFiltrees = pieces.filter((piece) => piece.prix <= 35);
	document.querySelector('.fiches').innerHTML = '';
	genererPieces(piecesFiltrees);
});

// bouton Filter pieces sans decription avec filter() :
const btnFiltrerNoDesc = document.querySelector('.btn-nodesc');
btnFiltrerNoDesc.addEventListener('click', () => {
	const piecesFiltrees = pieces.filter((piece) => piece.description);
	document.querySelector('.fiches').innerHTML = '';
	genererPieces(piecesFiltrees);
});

// Balise input [range] pour filtrer par prix :
const inputPrixMax = document.getElementById('range');
inputPrixMax.addEventListener('input', (event) => {
	const valeur = event.target.value;
	const piecesFiltrees = pieces.filter((piece) => piece.prix <= valeur);
	document.querySelector('.fiches').innerHTML = '';
	genererPieces(piecesFiltrees);
});

// bouton reset
document.querySelector('.btn-reset').addEventListener('click', () => {
	document.querySelector('.fiches').innerHTML = '';
	genererPieces(pieces);
});

// Bouton de mise à jour de la liste des pièces dans le Local Storage
const btnMiseAJour = document.querySelector('.btn-maj');

btnMiseAJour.addEventListener('click', () => {
	window.localStorage.removeItem('pieces');
});

await afficherGraphiqueAvis();
