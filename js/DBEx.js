var levelData = [];
var mapWidth = 50;
var minTileRange = 0;
var maxTileRange = 9;

//DO STUFF TO PUSH ROW/COL GRID TO LEVELDATA ARRAY HERE

//BEGIN BY RANDOMLY GENERATING TILES aaa
for (var i = 0 ; i < mapWidth; i++) {
    levelData[i] = []; // Initialize inner array
    for (var j = 0; j < mapWidth; j++) { // i++ needs to be j++
	
        levelData[i][j] = Math.floor(Math.random() * (maxTileRange - minTileRange + 1) ) + minTileRange;
	
    }
}

//LEVELDATA CREATED, NOW PUSH TO DB WITH AJAX

$(document).ready(function() {
	
	var levelDataString = JSON.stringify(levelData);
	
	if (levelData === "") {
		console.log('LEVELDATA EMPTY');
	}else{
		$.ajax({
		type: 'POST',
		url: '../includes/update-column.php',
		data: { levelData : levelDataString },
		success: 
			
				function(dataResult){
					var dataResult = JSON.parse(dataResult);
					if(dataResult.statusCode==200){
						console.log('SHOULD BE SUCCESSULL');						
					}
					else if(dataResult.statusCode==201){
					   alert("Error occured !");
					}
				}
	
		});
	}
	
});