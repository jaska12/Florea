import { tr } from './i18n/tr';
import { serverText } from './i18n/serverText';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Messages } from './config';

/** FLOREA LOOK **/

// One drawing style for every message type. Colours and motion are in scss/theme/notifications.scss.
const stroke = (paths: string) =>
	`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const ICONS: Record<SweetAlertIcon, string> = {
	success: stroke('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
	error: stroke('<path d="M7 7l10 10M17 7L7 17"/>'),
	warning: stroke('<path d="M12 6.5v7"/><path d="M12 17.5h.01"/>'),
	info: stroke('<path d="M12 10.5v7"/><path d="M12 6.5h.01"/>'),
	question: stroke('<path d="M9 9.2a3 3 0 1 1 4.6 2.5c-.9.6-1.6 1.2-1.6 2.4"/><path d="M12 17.5h.01"/>'),
};

const withIcon = (icon: SweetAlertIcon) => ({ icon, iconHtml: ICONS[icon] });

/** the buttons of a confirm dialog, in the chosen language **/
const buttons = () => ({
	confirmButtonText: tr('common:alert.ok', 'OK'),
	cancelButtonText: tr('common:alert.cancel', 'Cancel'),
});

const FloreaAlert = Swal.mixin({
	buttonsStyling: false,
	customClass: {
		container: 'florea-alert-container',
		popup: 'florea-alert',
		icon: 'florea-alert-icon',
		title: 'florea-alert-title',
		htmlContainer: 'florea-alert-text',
		actions: 'florea-alert-actions',
		confirmButton: 'florea-alert-btn confirm',
		cancelButton: 'florea-alert-btn cancel',
		closeButton: 'florea-alert-close',
	},
	showClass: { popup: 'florea-alert-in', backdrop: 'swal2-backdrop-show', icon: 'florea-alert-icon-in' },
	hideClass: { popup: 'florea-alert-out', backdrop: 'swal2-backdrop-hide', icon: 'florea-alert-icon-out' },
});

const FloreaToast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timerProgressBar: true,
	customClass: {
		container: 'florea-toast-container',
		popup: 'florea-toast',
		icon: 'florea-alert-icon',
		title: 'florea-toast-title',
		timerProgressBar: 'florea-toast-progress',
	},
	showClass: { popup: 'florea-toast-in', icon: 'florea-alert-icon-in' },
	hideClass: { popup: 'florea-toast-out', icon: 'florea-alert-icon-out' },
});

/** ALERTS **/

export const sweetErrorHandling = async (err: any) => {
	await FloreaAlert.fire({
		...withIcon('error'),
		text: serverText(err.message),
		showConfirmButton: false,
		showCloseButton: true,
	});
};

export const sweetTopSuccessAlert = async (msg: string, duration: number = 2000) => {
	await FloreaAlert.fire({
		position: 'center',
		...withIcon('success'),
		title: serverText(msg.replace('Definer: ', '')),
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetContactAlert = async (msg: string, duration: number = 10000) => {
	await FloreaAlert.fire({
		title: msg,
		showConfirmButton: false,
		timer: duration,
	}).then();
};

export const sweetConfirmAlert = (msg: string) => {
	return new Promise(async (resolve, reject) => {
		await FloreaAlert.fire({
			...withIcon('question'),
			text: serverText(msg),
			showCancelButton: true,
			showConfirmButton: true,
			...buttons(),
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetLoginConfirmAlert = (msg: string) => {
	return new Promise(async (resolve, reject) => {
		await FloreaAlert.fire({
			text: serverText(msg),
			showCancelButton: true,
			showConfirmButton: true,
			...buttons(),
			confirmButtonText: tr('common:alert.login', 'Login'),
		}).then((response) => {
			if (response?.isConfirmed) resolve(true);
			else resolve(false);
		});
	});
};

export const sweetErrorAlert = async (msg: string, duration: number = 3000) => {
	await FloreaAlert.fire({
		...withIcon('error'),
		title: serverText(msg),
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetMixinErrorAlert = async (msg: string, duration: number = 3000) => {
	await FloreaAlert.fire({
		...withIcon('error'),
		title: serverText(msg),
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetMixinSuccessAlert = async (msg: string, duration: number = 2000) => {
	await FloreaAlert.fire({
		...withIcon('success'),
		title: serverText(msg),
		showConfirmButton: false,
		timer: duration,
	});
};

export const sweetBasicAlert = async (text: string) => {
	FloreaAlert.fire(serverText(text));
};

export const sweetErrorHandlingForAdmin = async (err: any) => {
	const errorMessage = serverText(err.message ?? Messages.error1);
	await FloreaAlert.fire({
		...withIcon('error'),
		text: errorMessage,
		showConfirmButton: false,
		showCloseButton: true,
	});
};

export const sweetTopSmallSuccessAlert = async (
	msg: string,
	duration: number = 2000,
	enable_forward: boolean = false,
) => {
	FloreaToast.fire({
		...withIcon('success'),
		title: serverText(msg),
		timer: duration,
	}).then((data) => {
		if (enable_forward) {
			window.location.reload();
		}
	});
};
