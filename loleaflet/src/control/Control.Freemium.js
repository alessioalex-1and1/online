/* -*- js-indent-level: 8; fill-column: 100 -*- */
/*
 * Freemium handler
 */

/* global $ vex _ */
L.Map.include({

	Freemium: {
		isFreemiumUser: false,
		freemiumDenyList: [],
		freemiumPurchaseTitle: '',
		freemiumPurchaseLink: '',
		freemiumPurchaseDiscription: '',
		writerHighlights: '',
		calcHighlights: '',
		impressHighlights: '',
		drawHighlights: '',
	},

	_setFreemiumProps: function(freemiumInfo) {
		this.Freemium.isFreemiumUser = !!freemiumInfo['IsFreemiumUser'];
		this.Freemium.freemiumDenyList = freemiumInfo['FreemiumDenyList'];
		this.Freemium.freemiumPurchaseTitle = _(freemiumInfo['FreemiumPurchaseTitle']);
		this.Freemium.freemiumPurchaseLink = _(freemiumInfo['FreemiumPurchaseLink']);
		this.Freemium.freemiumPurchaseDiscription = _(freemiumInfo['FreemiumPurchaseDiscription']);
		this.Freemium.writerHighlights = _(freemiumInfo['WriterHighlights']);
		this.Freemium.calcHighlights = _(freemiumInfo['CalcHighlights']);
		this.Freemium.impressHighlights = _(freemiumInfo['ImpressHighlights']);
		this.Freemium.drawHighlights = _(freemiumInfo['DrawHighlights']);

	},

	// We mark the element disabled for the freemium
	// and add overlay on the element
	disableFreemiumItem: function(item, DOMParentElement, buttonToDisable) {
		if (this.isFreemiumUser() && this.isFreemiumDeniedItem(item)) {
			$(DOMParentElement).data('freemiumDenied', true);
			$(DOMParentElement).addClass('freemium-disabled');
			$(buttonToDisable).off('click');

			var that = this;

			$(DOMParentElement).click(function(event) {
				event.stopPropagation();
				that.openSubscriptionPopup();
			});
		}
	},

	openSubscriptionPopup: function() {
		var freemiumOnMobile = '';

		if (window.mode.isMobile()) {
			freemiumOnMobile = 'mobile';
		}
		var that = this;
		vex.dialog.confirm({
			unsafeMessage: [
				'<div class="container">',
				'<div class="item illustration"></div>',
				'<div class="item">',
				'<h1>' + this.Freemium.freemiumPurchaseTitle + '</h1>',
				'<p>' + this.Freemium.freemiumPurchaseDiscription + '<p>',
				'<ul>',
				'<li>' + this.Freemium.writerHighlights + '</li>',
				'<li>' + this.Freemium.calcHighlights + '</li>',
				'<li>' + this.Freemium.impressHighlights + '</li>',
				'<li>' + this.Freemium.drawHighlights + '</li>',
				'</ul>',
				'</div>',
				'<div>'
			].join(''),
			showCloseButton: false,
			contentClassName: 'vex-content vex-freemium ' + freemiumOnMobile,
			callback: function (value) {
				if (value)
					window.open(that.Freemium.freemiumPurchaseLink, '_blank');
			},
			buttons: [
				$.extend({}, vex.dialog.buttons.YES, { text: _('Unlock') }),
				$.extend({}, vex.dialog.buttons.NO, { text: _('Cancel') })
			]
		});
	},

	isFreemiumDeniedItem: function(item) {

		var command = '';
		if (item.command) // in notebookbar uno commands are stored as command
			command = item.command;
		else if (item.uno) { // in classic mode uno commands are stored as uno in menus
			if (typeof item.uno === 'string')
				command = item.uno;
			else if (this.Freemium.freemiumDenyList.includes(item.uno.textCommand)
			|| this.Freemium.freemiumDenyList.includes(item.uno.objectCommand)) // some unos have multiple commands
				return true;
		}
		else if (item.id)
			command = item.id;
		else if (item.unosheet)
			command = item.unosheet;

		if (this.Freemium.freemiumDenyList.includes(command))
			return true;

		return false;
	},

	isFreemiumUser: function() {
		return this.Freemium.isFreemiumUser;
	},

});