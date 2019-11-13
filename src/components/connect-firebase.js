import { LitElement, html, css } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the reducers needed by this element.
//import { cartItemsSelector, cartTotalSelector } from '../reducers/shop.js';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles.js';

class ConnectFirebase extends connect(store)(LitElement) {
	static get properties() {
		return {
			_connected: { type: Boolean },
			_firebaseConfig: { type: Array },
			_uiConfig: { type: Array }
		};
	}

	static get styles() {
		return [
			ButtonSharedStyles,
			css`
				:host {
					display: block;
				}
			`
		];
	}

	constructor() {
		super();
		this._connected = false;

		// Your web app's Firebase configuration
		this._firebaseConfig = {
			apiKey: "AIzaSyAVMqnZAqqTVGC2F7QX-npMehOr8UJ6gUY",
			authDomain: "zgame-257315.firebaseapp.com",
			databaseURL: "https://zgame-257315.firebaseio.com",
			projectId: "zgame-257315",
			storageBucket: "zgame-257315.appspot.com",
			messagingSenderId: "586887729429",
			appId: "1:586887729429:web:09c5d34fcc38512ba9d91c",
			measurementId: "G-5X887DSK5G"
		};

		// Initialize Firebase
		firebase.initializeApp(this._firebaseConfig);
		firebase.analytics();

		this._ui = new firebaseui.auth.AuthUI(firebase.auth());
		this._uiConfig = {
			callbacks: {
				signInSuccessWithAuthResult: function(authResult, redirectUrl) {
					// User successfully signed in.
					// Return type determines whether we continue the redirect automatically
					// or whether we leave that to developer to handle.
					return true;
				},
				uiShown: function() {
					// The widget is rendered.
					// Hide the loader.
					//document.getElementById('loader').style.display = 'none';
					console.log("this is uiShown function");
				}
			},
			// Will use popup for IDP Providers sign-in flow instead of the default, redirect.
			signInFlow: 'popup',
			signInSuccessUrl: 'https://zgame.io',
			signInOptions: [
				// Leave the lines as is for the providers you want to offer your users.
				firebase.auth.GoogleAuthProvider.PROVIDER_ID,
				firebase.auth.FacebookAuthProvider.PROVIDER_ID,
				firebase.auth.TwitterAuthProvider.PROVIDER_ID,
				firebase.auth.GithubAuthProvider.PROVIDER_ID,
				firebase.auth.EmailAuthProvider.PROVIDER_ID
			],
			// Terms of service url.
			tosUrl: 'https://zgame.io/tos',
			// Privacy policy url.
			privacyPolicyUrl: '<your-privacy-policy-url>'
		};
	}

	render() {
		return html`
			<head>
				<script src="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.js"></script>
				<link type="text/css" rel="stylesheet" href="https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css" />
			</head>
			<p ?hidden="${this._connected}">
			<div id="firebaseui-auth-container"></div>
			<div id="loader">Loading...</div>
			</p>
			<p ?hidden="${!this._connected}">You are connected</p>
		`;
	}

	firstUpdated() {
		// The start method will wait until the DOM is loaded.
		this._ui.start(this.shadowRoot.getElementById('firebaseui-auth-container'), this._uiConfig);

	}

	// This is called every time something is updated in the store.
	stateChanged(state) {
		console.log("There were changes in connect-firebase element");
	}
}

window.customElements.define('connect-firebase', ConnectFirebase);
