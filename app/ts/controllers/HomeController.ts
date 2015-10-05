//HomeController.ts

module AngularTs {
	'use strict';

	export class HomeController {

		public displayMsg: string = null;

		public static $inject = [ '$scope', '' ];
		constructor(private $scope: ng.IScope, windowPinger: WindowPinger, $window: ng.IWindowService) {
			$scope['viewModel'] = this;

			windowPinger.doPing();
			this.displayMsg = 'Hello from Angular/TypeScript! Ping? ' + $window['tsPing'];
		}
	}
}
