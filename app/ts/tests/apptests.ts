///<reference path='../references.d.ts' />
//SigProcessorTests.ts

module AppTsTests {
	'use strict';

	describe('AppTs Tests', () => {

		beforeEach(() => {
    	});

		afterEach(() => {
		});

		it('unit tests are able to be run from typescript file', () => {
	        expect(true).toBe(true);
		});

		it('unit test can access typescript angular service', () => {
			let mockWindow: any = {};
			let windowPinger = new AngularTs.WindowPinger(mockWindow);
			windowPinger.doPing();

			expect(mockWindow.tsPing).toEqual('tsPong');
		});

	});
}
