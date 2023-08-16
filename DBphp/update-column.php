<?php
include('sql-config.php');

$pk = $_POST['pk'];
$column = $_POST['column'];
$value = $_POST['value'];

$conn = new mysqli($config["host"], $config["username"], $config["password"], $config["database"]);

if ($conn->connect_error) {
  die("MySQL 연결 실패: " . $conn->connect_error);
}

if ($column == "GAMEDATA_POINT") {
	$sql = "UPDATE LOG_GAMEDATA_TB SET $column = $value WHERE LOG_GAMEDATA_PK = $pk ";
}
else {
	$sql = "UPDATE LOG_GAMEDATA_TB SET $column = '$value' WHERE LOG_GAMEDATA_PK = $pk ";
}

if ($conn->query($sql) === TRUE) {
  echo "레코드가 업데이트되었습니다.";
} else {
  echo "업데이트 실패: " . $conn->error;
}

$conn->close();
?>
