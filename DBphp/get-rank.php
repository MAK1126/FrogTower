<?php
include('sql-config.php');

// POST로 보낸 JSON 데이터 받기
// $json = file_get_contents('php://input');
// $data = json_decode($json, true); // JSON 데이터를 배열로 디코딩

$conn = new mysqli($config["host"], $config["username"], $config["password"], $config["database"]);

if ($conn->connect_error) {
  die("MySQL 연결 실패: " . $conn->connect_error);
}

$sql = "SELECT GAMEDATA_POINT FROM LOG_GAMEDATA_TB ORDER BY GAMEDATA_POINT DESC LIMIT 5";
$result = $conn->query($sql);

$top5 = array();

while ($row = $result->fetch_assoc()) {

  $top5[] = $row['GAMEDATA_POINT'];
}

// 만약 $top5 배열의 길이가 5보다 작다면 나머지 항목을 0으로 채움
for ($i = count($top5); $i < 5; $i++) {
  $top5[] = "0";
}


$conn->close();
echo json_encode($top5);
// echo implode($top5);


// JSON 형식으로 응답을 생성
// header('Content-Type: application/json');
// echo json_encode($top5);

?>