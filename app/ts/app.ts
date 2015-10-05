/// <reference path="./references.d.ts" />
//app.ts

module AngularTs {
	'use strict';

	var angularts = angular.module('angularts', ['ui.router']);

	ControllerConfig.Config(angularts);
	ServiceConfig.Config(angularts);
	RouteConfig.Config(angularts);
	DirectiveConfig.Config(angularts);

}