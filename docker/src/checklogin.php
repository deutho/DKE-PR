<?php
header("location: /Applications/XAMPP/xamppfiles/htdocs/itp5/calendar_new/calender.php");
session_start();


$host="localhost"; 
$username="root"; 
$password=""; 
$db_name="Terminpage"; 
$tbl_name="Kunde"; 

// Verbindung zu Server und zu DB
mysql_connect("$host", "$username", "$password")
or die("Kann keine Verbindung zu Server herstellen:("); 
mysql_select_db("$db_name")or die("Kann keine Verbindung zu DB herstellen:(");


$Email = $_POST['Email'];
$Passwort = $_POST['Passwort'];

//SQL befehl
$sql="SELECT * FROM $tbl_name WHERE Email='$Email' and Passwort='$Passwort'";
$result=mysql_query($sql);
$count=mysql_num_rows($result);

//Falls Email und Passwort stimmt, hat die Tabelle genau eine Zeile!
if($count==1)
{


	$_SESSION['Email'] = ("Email");
	$_SESSION['Passwort'] = ("Passwort");
	 
		//header("location:login_success.php");
	
	//session_start();
	if(isset($_SESSION['Email']))
	{
		echo "Erfolgreich eingeloggt! <br>";
		
		print_r("Sie eingeloggt als: " . $Email);
		
		
	}


}
else 
{
	echo "Falsche Benutzername oder Passwort!";
}
?>


<html>

<title></title>

<body>

<a href="index.html">Zurück zur Homepage</a>

</body>

</html>
