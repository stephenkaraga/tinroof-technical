var myApp = angular.module('myApp', []);

myApp.controller('mainController', ['$scope', '$http,' function($scope, $http) {

	$http.get("todos").then(function(response) {
        $scope.toDos = response.data.todos || [];
    }, function(err) {
    	$scope.toDos = [];
    	console.log(err);
    });

	$scope.newTodo = '';

    $scope.add = function(newToDo) {
    	console.log($scope.newTodo);
    	if (newToDo) {
    		$scope.todo = {};
	    	$scope.todo['name'] = newTodo;
	    	$scope.toDos = $scope.toDos || [];
	    	const url = "todo/" + newToDo;
	    	$http.post(url).then(function(response) {
	        	$scope.toDos.push($scope.todo);
	        	$scope.newTodo = '';
	    	}, function(err) {
	    		console.log('Error adding ToDo');
	    		console.log(err);
	    		$scope.newTodo = '';
	    	});
    	}
    };

    $scope.edit = function(index, name) {
    	var newObj = {};
    	newObj[name] = name;
    	if (name) {
    		const url = "todo/" + name;
	    	$http.put(url, newObj).then(function(response) {
	        	$scope.toDos[index].name = name;
	    	},
	    		console.log('Error updating ToDo');
	    		console.log(err);
	    	);
    	};
    };

    $scope.delete = function(index, name) {
    	const url = "todo/" + name;
    	$http.delete(url).then(function(response) {
        	$scope.toDos.splice(index, 1);
    	}, function(err) {
    		console.log('Error deleting Todo');
    	});
    };

}]);