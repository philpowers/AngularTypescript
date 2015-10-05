//RouteConfig.ts

module AngularTs {
	'use strict';

	export class RouteConfig {

		private static AppBasePath = '/';

		public static Config(appModule: ng.IModule) {

			appModule.config(['$stateProvider', '$urlRouterProvider',
				($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) => {

					$urlRouterProvider.otherwise(() => '/default');

					$stateProvider
						.state('default', {
							url: '/default',
							templateUrl: RouteConfig.AppUrl('views/home.html'),
							controller: HomeController
						});

				}]);

		}

		private static AppUrl(subPath: string): string {
			return RouteConfig.AppBasePath + subPath;
		}
	}

}