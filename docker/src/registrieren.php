<?php

$conn = new mysqli("localhost","root","","Terminpage");

//mysql_connect( 'localhost', 'root', '');
//mysql_select_db("Obstladen");

print_r($_POST);

$Vorname = $_POST['Vorname'];
$Nachname =$_POST['Nachname'];
$Email = $_POST['Email'];
$Passwort = $_POST['Passwort'];


$sql = "INSERT INTO Kunde ( Vorname,Nachname,Email,Passwort) VALUES('".$Vorname."','".$Nachname."','".$Email."','".$Passwort."')";
print($sql);
$result = $conn->query($sql);

if($result){
	//echo("<br>Erfolgreich registriert!"); 
    header("Location: index.html");
} else{
	echo("<br>Es ist ein Fehler aufgetreten:(");
}
?>