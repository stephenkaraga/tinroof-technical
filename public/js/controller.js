angular.module('toDoModule', [])
	.controller('toDoController', ['$scope','$http', function($scope, $http) {

		$scope.formData = {};
		$scope.editing = {};
		$scope.editToDo = {};
		$scope.viewingDetails = null;
		$scope.viewingTodo = null;

		$http.get("todo").then(function(response) {
	        $scope.toDos = response.data || [];
	    }, function(err) {
	        console.log('Failed to fetch existing todos.');
	    	$scope.toDos = [];
	    	console.log(err);
	    });

		$scope.isValidEntry = function(name){
			if(!name){
				return false;
			}
			var len = $scope.toDos.length;
			for(var i = 0; i < len; i++){
				if(name === $scope.toDos[i].name){
					return false;
				}
			}
			return true;
		};

		$scope.edit = function(index) {
			$scope.editToDo = {};
			$scope.editing = {};
	    	$scope.editing[index] = true;
	    };

	    $scope.submitEdit = function(index, toDo, oldToDo) {
	    	if (!$scope.isValidEntry(toDo)) {
	    		return;
	    	};
    		const url = "todo/" + oldToDo.name;
	    	$scope.toDos[index].modified_at = new Date();
	    	$scope.toDos[index].name = toDo;
	    	$scope.editing = {};
	    	$http.put(url, $scope.toDos[index]).then(function(response) {

	    	}, function(err) {
	    		console.log('Error updating ToDo');
	    		console.log(err);
	    	});
	    }

	    $scope.viewDetails = function(index) {
	    	$scope.viewingDetails = true;
	    	$scope.viewingTodo = $scope.toDos[index];
	    };

	    $scope.hideDetails = function() {
	    	$scope.viewingTodo = null
	    	$scope.viewingDetails = false;
	    	$scope.formData = {};
			$scope.editing = {};
			$scope.editToDo = {};
	    };

	    $scope.cancelEdit = function(index, toDo) {
	    	$scope.editing = {};
	    	$scope.editToDo = {};
	    };

	    $scope.add = function() {
	    	if (!$scope.isValidEntry($scope.formData.toDo)) {
	    		return;
	    	};
    		var newObj = {};
    		newObj['name'] = $scope.formData.toDo;
    		newObj['created_at'] = new Date();
    		$scope.formData = {};
	    	const parsed = JSON.stringify(newObj);
	    	$scope.toDos.push(newObj);
	    	$http.post("todo", parsed).then(function(response) {

	    	}, function(err) {
	    		console.log('Error adding ToDo');
	    		console.log(err);
	    	});
	    };

	    $scope.delete = function(index, toDo) {
	    	const url = "todo/" + toDo.name;
	    	$http.delete(url).then(function(response) {
	        	$scope.toDos.splice(index, 1);
	    	}, function(err) {
	    		console.log('Error deleting Todo');
	    	});
	    };

	}]);
