//HomeController.ts

module AngularTs {
	'use strict';

	export class HomeController {

		public displayMsg: string = null;

		public static $inject = [ '$scope' ];
		constructor(private $scope: ng.IScope) {
			$scope['viewModel'] = this;

			this.displayMsg = 'Hello from Angular/TypeScript!';
		}
	}
}
