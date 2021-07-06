/*global google*/
import React, { Component } from 'react';
import '../App.css';
import { GMap } from 'primereact/gmap';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { GeolocalisationService } from './GeolocalisationService';
import { Dropdown } from 'primereact/dropdown';


export default class GMapDemo extends Component {
	constructor() {
		super();
		this.state = {
			googleMapsIsReady: false,
			dialogVisible: true,
			markerTitle: '',
			draggableMarker: false,
			overlays: null,
			selectedPosition: null,
			userId: 0,
			users: [],
			dateDebut: '',
			dateFin: '',
			trajet: [],
			options : {
				center: { lat: 33.481980065299986, lng: -7.5425926526158715 },
				zoom: 6
			}
		};

		this.onMapClick = this.onMapClick.bind(this);
		this.onOverlayClick = this.onOverlayClick.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.onMapReady = this.onMapReady.bind(this);
		this.loadPath = this.loadPath.bind(this);
		this.onHide = this.onHide.bind(this);
		this.addMarker = this.addMarker.bind(this);
	}

	componentWillMount() {
		loadGoogleMaps(() => {
			this.setState({ googleMapsIsReady: true });
			this.loadUsers();
		
		});
	}


	onMapClick(event) {
		this.setState({
			dialogVisible: true,
			selectedPosition: event.latLng
		});
	}

	loadUsers() {
		const userService = new GeolocalisationService();
		userService.getUsers().then(data => {
			var user = [];
			for (let i = 0; i < data.data.length; i++) {
				user.push({ label: data.data[i].nom + " " + data.data[i].prenom, value: data.data[i].id })
			}
			console.log(user);
			this.setState({ users: user });
		});
	}

	onOverlayClick(event) {
		let isMarker = event.overlay.getTitle !== undefined;

		if (isMarker) {
			let title = event.overlay.getTitle();
			this.infoWindow = this.infoWindow || new google.maps.InfoWindow();
			this.infoWindow.setContent('<div>' + title + '</div>');
			this.infoWindow.open(event.map, event.overlay);
			event.map.setCenter(event.overlay.getPosition());

			
		}
		else {
		
		}
	}

	
	handleDragEnd(event) {
		
	}
	loadPath() {
		const positionServiceee = new GeolocalisationService();
		positionServiceee.getPositionsBetweenTwoDates(this.state.userId,this.state.dateDebut,this.dateFin).then(data => {
			console.log(data.data);
			var trajet = [];
			for (let i = 0; i < data.data.length; i++) {
				trajet.push({ lat: data.data[i].latitude, lng: data.data[i].longitude })
			}
			this.setState({
				overlays: [
					new google.maps.Polyline({ path: trajet, geodesic: true, strokeColor: '#FF0000', strokeOpacity: 1, strokeWeight: 10 }),
					new google.maps.Marker({ position: trajet[0], title: "Départ du trajet" }),
					new google.maps.Marker({ position: trajet[trajet.length - 1], title: "Arrivée du trajet" })
				],
				dialogVisible: false,
				options:{center:trajet[0],zoom:4}

			});
	
	});
		return;
	}

	addMarker() {
		let newMarker = new google.maps.Marker({
			position: {
				lat: this.state.selectedPosition.lat(),
				lng: this.state.selectedPosition.lng()
			},
			title: this.state.markerTitle,
			draggable: this.state.draggableMarker
		});

		this.setState({
			overlays: [...this.state.overlays, newMarker],
			dialogVisible: false,
			draggableMarker: false,
			markerTitle: ''
		});
	}

	onMapReady(event) {
	/*const positionServiceee = new GeolocalisationService();
		positionServiceee.getLastPositions(this.state.userId).then(data => {
		this.setState({
			
			overlays: [
				new google.maps.Marker({ position: { lat: data.data.latitude, lng: data.data.longitude}, title: ""}),
				new google.maps.Marker({ position: { lat: 33.3555141, lng:  7.3640909}, title: ""}),
				
				new google.maps.Polygon({
					paths: [
						{ lat: data.data.latitude, lng: data.data.longitude }, { lat: 33.3555141, lng: 7.3640909 }
					], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 1, strokeWeight: 10
				}),
				
				
			]
			
		})
	});*/
	}

	

	scriptIsLoad() {
		setTimeout(() => {
			this.setState({ scriptIsLoad: true });
		}, 2000);
	}
	onHide(event) {
		this.setState({ dialogVisible: false });
	}
	

	render() {
		const options = {
			center: { lat: 33.890257, lng: 8.707417 },
			zoom: 3
		};

	
		if (this.state.googleMapsIsReady === false) {
			return '';
		}
		return (
			<div>
				<div className="total">
					<div className="user">
						
						<div><label for="user">User: </label><Dropdown value={this.state.userId} id="utilisateur" options={this.state.users} onChange={(e) => this.setState({ userId: e.target.value })} placeholder="Choisissez un utilisateur" /></div>
					</div>
					<div className="dateDebut">
						<label for="user">Date Début</label>
						<InputText type="date" value={this.state.dateDebut} onChange={(e) => this.setState({ dateDebut: e.target.value })} />
					</div>
					<div className="dateFin">
						<label for="user">Date Fin</label>
						<InputText type="date" value={this.state.dateFin} onChange={(e) => this.setState({ dateFin: e.target.value })} />
					</div>
					<div className="btn">
						
					<Button label="Chercher"  icon="pi pi-search" onClick={this.loadPath} />
					
			        <Button label="Annuler" onClick={this.onHide} />
					</div>
				</div>
	

				<div className="content-section implementation">
					
					
                    
					<GMap overlays={this.state.overlays} options={options} style={{ width: '100%', minHeight: '700px' }} 
						onMapClick={this.onMapClick} onOverlayClick={this.onOverlayClick} onOverlayDragEnd={this.handleDragEnd} />

					
				</div>
			</div>
		);
	}
}

const loadGoogleMaps = (callback) => {
	const existingScript = document.getElementById('googleMaps');

	if (!existingScript) {
		const script = document.createElement('script');
		script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCTgEvX78Z6mWuuak1tGsHraylubWAodz0&libraries=places';
		script.id = 'googleMaps';
		document.body.appendChild(script);

		script.onload = () => {
			if (callback) callback();
		};
	}

	if (existingScript && callback) callback();
};