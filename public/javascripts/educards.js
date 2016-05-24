var app = angular.module('educards', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})
		.when('/add-card', {
			templateUrl: 'partials/card-add.html',
			controller: 'AddCardCtrl'
		})
		.when('/card/edit/:id', {
			templateUrl: 'partials/card-edit.html',
			controller: 'EditCardCtrl'
		})
		/*
		.when('/card/byname/:name', {
			templateUrl: 'partials/card-view.html',
			controller: 'ViewCardBynameCtrl'
		})
		*/
		.when('/card/:id', {
			templateUrl: 'partials/card-view.html',
			controller: 'ViewCardCtrl'
		})
		.when('/card/delete/:id', {
			templateUrl: 'partials/card-delete.html',
			controller: 'DeleteCardCtrl'
		})
		.otherwise({
			redirectTo: '/',
		});
}]);

app.controller('HomeCtrl', ['$scope', '$resource',
	function($scope, $resource) {
		var Cards = $resource('/api/cards');
		Cards.query(function(cards) {
			$scope.cards = cards;
		});
	}]);

app.controller('AddCardCtrl', ['$scope', '$resource', '$location',
	function($scope, $resource, $location) {
		$scope.save = function() {
			var prior = $scope.card.prior;
			var followup = $scope.card.followup;
			var Cards = $resource('/api/cards');
			console.log('prior: ' + prior);
			if (prior !== null &&
				typeof prior !== "undefined" &&
				typeof prior !== Array) {
				console.log('typeof prior:' + typeof prior);
				$scope.card.prior = prior.split(",");
			}
			if (followup !== null &&
				typeof followup !== "undefined" &&
				typeof followup !== Array ) {
				$scope.card.followup = followup.split(",");
			}
			Cards.save($scope.card, function() {
				$location.path('/');
			});
		};
	}]);

app.controller('ViewCardCtrl', ['$scope', '$sce', '$resource', '$location', '$routeParams',
	function($scope, $sce, $resource, $location, $routeParams) {
		var Cards = $resource('/api/cards/:id');
		Cards.get({ id: $routeParams.id }, function(card) {
			$scope.card = card;
			$scope.trustedLink = $sce.trustAsResourceUrl($scope.card.link.replace("watch?v=", "v/"));
		});

		$scope.cancel = function() {
			$location.path('/');
		};

		$scope.openCard = function(data) {

			console.log('in openCard1 with data ' + data + ' getting cards');
			// if location is a web address, open it as a page
			// if not, try to open it as our card
			if (data.startsWith('http') ||
				data.startsWith('https') ||
				data.startsWith('www')) {
				window.location.href = data;
			} else {
				var CardsByname = $resource('/api/cards/byname/:name');
				CardsByname.get({ name: data }, function(card) {
					console.dir('card: ' + card);
					if (card._id !== undefined) {
						$scope.card = card;
						var url = '/card/' + card._id;
						$location.path(url);
					} else {
						window.alert('Can\'t find card ' + data);
					}
				});
			}
		};
	}]);

/*
app.controller('ViewCardBynameCtrl', ['$scope', '$sce', '$resource', '$location', '$routeParams',
	function($scope, $sce, $resource, $location, $routeParams) {
		var Cards = $resource('/api/cards/byname/:name');
		Cards.get({ title: $routeParams.name }, function(card) {
			$scope.card = card;
			$scope.trustedLink = $sce.trustAsResourceUrl($scope.card.link.replace("watch?v=", "v/"));
		});

		$scope.cancel = function() {
			$location.path('/');
		};

		$scope.openCard = function(data) {
			var Cards = $resource('/api/cards/byname/:name');
			console.log('got cards');
			Cards.get({ name: data }, function(card) {
			//	$scope.card = card;
			});
			//$location.path('/');
		};
	}]);
*/
app.controller('EditCardCtrl', [ '$scope', '$resource', '$location', '$routeParams',
	function($scope, $resource, $location, $routeParams) {
		var Cards = $resource('/api/cards/edit/:id', { id: '@_id' }, {
			update: { method: 'PUT' }
		});
		var priorBefore = null;
		var followupBefore = null;

		Cards.get({ id: $routeParams.id }, function(card) {
			$scope.card = card;
			priorBefore = card.prior;
			followupBefore = card.followup;
		});

		$scope.save = function() {
			var prior = $scope.card.prior;
			var followup = $scope.card.followup;
			if (prior !== null &&
				prior != priorBefore) {
				$scope.card.prior = prior.split(",");
			}
			if (followup !== null &&
				followup != followupBefore) {
				console.log('type: ' + typeof followup);
				$scope.card.followup = followup.split(",");
			}
			
			Cards.update($scope.card, function() {
				$location.path('/');
			});
		}

		$scope.cancel = function() {
			$location.path('/');
		}
		
	}]);

app.controller('DeleteCardCtrl', ['$scope', '$resource', '$location', '$routeParams',
	function($scope, $resource, $location, $routeParams) {
		var Cards = $resource('/api/cards/:id');
		Cards.get({ id: $routeParams.id }, function(card) {
			$scope.card = card;
		})
		$scope.delete = function() {
			Cards.delete({ id: $routeParams.id }, function(card) {
				$location.path('/');
			});
		}
	}]);
