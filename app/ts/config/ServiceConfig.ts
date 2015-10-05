//ServiceConfig.ts

module AngularTs {
	'use strict';

	export class ServiceConfig {

		public static Config(appModule: ng.IModule) {

			appModule.factory('windowPinger', ['$window', ($window: ng.IWindowService) => {
				return new WindowPinger($window);
			}]);
		}
	}
}
