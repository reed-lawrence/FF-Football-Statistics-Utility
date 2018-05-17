<?php
require "../access/Dbconnect.php";
include "../interfaces/IPlayer.php";

$getQuery = $DBcon->query("SELECT * FROM Players");

$output = array();
while ($row = $getQuery->fetch_assoc()) {
    $output[] = new IPlayer($row["Id"], $row["Name"], $row["Position"], $row["Team"]);
}

echo json_encode($output);
?>