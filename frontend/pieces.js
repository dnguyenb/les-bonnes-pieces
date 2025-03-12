import { ajoutListenersAvis } from './avis.js';

// Récupération des pièces automobiles depuis le fichier JSON :
const pieces = await fetch('pieces-autos.json').then((response) =>
	response.json()
);

// Fonction qui génère la page web :
const genererPieces = (pieces) => {
	// Pour chaque pièce automobile
	for (let piece of pieces) {
		// Récupération de l'élément du DOM qui accueillera les fiches
		const sectionFiches = document.querySelector('.fiches');
		// Création d’une balise dédiée à une pièce automobile
		const pieceElement = document.createElement('article');

		// Création image
		const imageElement = document.createElement('img');
		imageElement.src = piece.image;

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
		const descriptionElement = document.createElement('p');

		// Création description (opérateur nullish)
		descriptionElement.innerText =
			piece.description ?? 'Pas de description pour le moment.';
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
		pieceElement.appendChild(btnAvisElement);
	}
	ajoutListenersAvis();
};

// Premier affichage de la page
genererPieces(pieces);

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
const inputPrixMax = document.getElementById('prix-max');
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

/*
// Affichage nom des pieces uniquement :
const noms = pieces.map((piece) => piece.nom);
for (let i = noms.length - 1; i >= 0; i--) {
	if (pieces[i].prix > 35) {
		noms.splice(i, 1);
	}
}

// Création de la liste des noms des pièces abordables
const abordablesElements = document.createElement('ul');

for (let i = 0; i < noms.length; i++) {
	const nomElement = document.createElement('li');
	nomElement.innerText = noms[i];
	abordablesElements.appendChild(nomElement);
}

document.querySelector('.abordables').appendChild(abordablesElements);

// Création de la liste des pièces disponibles :
const disponibles = pieces.map((piece) => `${piece.nom} - ${piece.prix} €`);
for (let i = noms.length - 1; i >= 0; i--) {
	if (!pieces[i].disponibilite) {
		disponibles.splice(i, 1);
	}
}
const disponiblesElements = document.createElement('ul');

for (let i = 0; i < disponibles.length; i++) {
	const disponibleElement = document.createElement('li');
	disponibleElement.innerText = disponibles[i];
	disponiblesElements.appendChild(disponibleElement);
}

document.querySelector('.disponibles').appendChild(disponiblesElements); */
