<?php
header("Content-Type: application/json");
include_once ('../classes/neditor.php');
include_once("../../logInfo.php");

$ne =  new \neditor\neditor;

if($state->isLogedIn === true && !empty($state->id)){
    $uid = $state->id;
    $un = $state->username;
}

$url = $ne->pageUrl()."/";

if(preg_match("/localhost/",$url)){
    $url = $url."nexar/";
}

if(isset($_POST['action']) && $_POST['action'] === 'getEmojies'){
    $folder = $_POST["f"];
    $dir = "../images/emojis/";

    switch ($folder){
        case 'people':
           $dir = "$dir$folder/faces/";
           break;

        case 'animal':
            $dir = "$dir$folder/";
            break;

        case 'food':
            $dir = "$dir$folder/";
            break;

        case 'activities':
            $dir = "$dir$folder/";
            break;

        case 'travel':
            $dir = "$dir$folder/";
            break;

        case 'objects':
            $dir = "$dir$folder/";
            break;

        case 'symbo':
            $dir = "$dir$folder/";
            break;

        case 'flags':
            $dir = "$dir$folder/";
            break;

        default :
                $dir = '';
    }

    $data = $ne->emojies($dir);
    echo $data;
}
else if(isset($_POST["action"]) && $_POST["action"] === 'fileupload'){

    $user = preg_replace("#[^a-z0-9_ ]#i","",$un);
    $un= preg_replace("#[^0-9a-z-_ ]#i","",$_POST["u"]);

    if(is_array($_FILES)) {
            $file = preg_replace("#[^a-z0-9,._ ]#i", "", $_FILES['files']["name"]);

            foreach ($file as $key => $value) {
                $fname = $_FILES["files"]["name"][$key];
                $size = $_FILES["files"]["size"][$key];
                $error = $_FILES["files"]["error"][$key];
                $type = $_FILES["files"]["type"][$key];
                $loc = $_FILES["files"]["tmp_name"][$key];

                $dot = explode(".", $fname);
                $ext = end($dot);

                $dir = "../all-files/blogs/";

                if(!preg_match(
                    "/\.(jpg|jpeg|png|gif|mp4|webM|avi|mp3|wav|docx|pdf|doc
|dot|wbk|docm|dotx|dotm|docb|xls|xlt|xlm|xlsx|xltx|xltm|xlsb|xla|xlam
|xll|ppt|pot|pps|pptx|pptm|potx|potm|ppam|ppsx|ppsm|sldx|sldm)$/i",$fname)){
                    $status = "File(s) not allowed try different one.";
                }else if ($size >= 6796966) {
                    $status = "failed:File is larger then 6mbs. Try less than that";
                } else if ($error > 0) {
                    $status = "failed:Sorry an error occurred please try again after sometime";
                } else {
                    $file = $dot[0] = "fr".substr(sha1(microtime()),0,25)
                        .".".$ext.",";

                   $status = $ne->upload($dir,$file,$loc);
                }

            }
        }

    echo $status;
}
else if(isset($_POST["action"]) && $_POST['action'] === 'getFiles'){

    $user = preg_replace("#[^a-z0-9_ ]#i","",$un);
    $un= preg_replace("#[^0-9a-z-_ ]#i","",$_POST["u"]);

    $path ='../all-files/blogs/';
    $data = '{';
    $i = 0;

        $objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
        foreach ($objects as $name => $object) {

            if(!is_dir($name)){
                if(preg_match(
                    "/\.(jpg|png|gif|mp4|webM|wav|avi|mp3|docx|pdf|doc
|dot|wbk|docm|dotx|dotm|docb|xls|xlt|xlm|xlsx|xltx|xltm|xlsb|xla|xlam
|xll|ppt|pot|pps|pptx|pptm|potx|potm|ppam|ppsx|ppsm|sldx|sldm)$/i",$name)){
                    $i++;
                    $name = explode('/',$name);
                    $file = end($name);
                    $name = $name[3];

                    $src = str_replace('..','',$path);

                   // $src = explode('/',$src);
                    $src = $src.$file;
                    $data .= '"file'.$i.'":
                            { "num":"'.$i.'",
                            "src":"'.$src.'"
                            },';
                }
            }
        }

        $data = chop($data, ",");
        $data .= '}';

        echo $data;

}
else if(isset($_POST['action']) && $_POST['action'] === 'deleteFiles'){
    $file = htmlentities(stripslashes($_POST['file']));
    $user = preg_replace("#[^a-z0-9_ ]#i","",$un);
    $un= preg_replace("#[^0-9a-z-_ ]#i","",$_POST["u"]);

    $path ='../all-files/blogs/';
    $status = '';
    if($user === $un){
       if($ne->Delete($path)){
           $status = 'Deleted|';
       }
    }

    echo  json_encode($status);
}
else{
    header("Location:".$url."404");
}


