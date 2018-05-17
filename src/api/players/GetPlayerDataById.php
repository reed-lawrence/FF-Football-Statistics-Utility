<?php
require "../access/Dbconnect.php";
include "../interfaces/IGameData.php";

$playerId = (int)$_GET["id"];
$getQuery = $DBcon->query("SELECT * FROM GameLogs WHERE PlayerId=$playerId");

$output = array();
while ($row = $getQuery->fetch_assoc()) {
    $output[] = new IGameData($row["Id"], $row["PaAtt"], $row["PaComp"], $row["PaYds"], $row["PaTd"], $row["PaInt"], $row["RuAtt"], $row["RuYds"], $row["RuTd"]);
}

echo json_encode($output);
?>