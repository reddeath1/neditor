<?php
/* server informations */

error_reporting(0);

define("db_user","d4d3t9f4_reddeat");

define("db_host","localhost");

define("db_pass","Hiddenroute01");

define("db","d4d3t9f4_nevaa");

define("port",3036);

$con = new mysqli(db_host,db_user,db_pass,db,port);

if($con->connect_errno){
	echo 'Connection Failed '.$con->connect_error;
}
?>