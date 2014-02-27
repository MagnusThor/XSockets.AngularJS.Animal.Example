
var Animal = (function () {
    function animal(name, description) {
        this.Id = (new Date()).getTime();
        this.Name = name;
        this.Description = description;
    }
    return animal;
})();

function AnimalsController($scope, xsocket) {
    
  

    // Just add a new Animal 
    $scope.animals = [
        { Id: 0, Name: "Lion", Descriptions: "Can be nice?" }
    ];
    
    // Expose a function that will be used to remove an 'animal'
    $scope.removeAnimal =  function (animalId) {
        xsocket.publish("removeAnimal", { Id: animalId }); // tell others and me that the animal is removed.
    };
    // If someone adds and animal, add it to the list
    xsocket.subscribe("addAnimal").process(function (added) {
        $scope.animals.unshift(added); // add the animal to the "list"
    });
    // Some has removed a animal, lets get rid of it from the list...
    xsocket.subscribe("removeAnimal").process(function (remove) {
        var removedAnimal = $scope.animals.filter(function (a) {
            return a.Id == remove.Id;
        });
        var index = $scope.animals.indexOf(removedAnimal[0]);
        if(index > -1)
            $scope.animals.splice(index, 1);
    });

    // Just a simple model

    $scope.animal = {
        Name: "Gorilla",
        Description:"...."
    };

    $scope.createAnimal = function () {
         xsocket.publish("addAnimal", new Animal($scope.animal.Name, $scope.animal.Description));
    };

};






