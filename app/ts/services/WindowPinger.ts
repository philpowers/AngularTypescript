//WindowPinger.ts

module AngularTs {
	export class WindowPinger {
		constructor(private $window: ng.IWindowService) {
		}

		doPing() {
			this.$window['tsPing'] = 'tsPong';
		}
	}
}