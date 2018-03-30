<?php
/**
 * Created by IntelliJ IDEA.
 * User: reddeath
 * Date: 10/1/17
 * Time: 2:36 PM
 */



function blast(){
    include ('../connection/connection.php');
    include ('../classes/classes.inc.php');

    $data = new \users_class\users();
    $message = '';
    $post = '';
    $news = '';

    $users = $data->getAll($con,"nevaas_users","","",array("user_name,email_addr"),"","","","","",array("activated"=>1),"","ORDER BY id DESC","all");


    $get_post_related = $data->gets($con,'blog_posts','blog_cats','',
        array('b.id as bid,b.post,b.title,b.author,b.bl_medias,c.category'),'b','c','',
        array('b.cat_id'=>'c.id'),'','','ORDER BY b.created DESC','LIMIT 4','all','');

    if($get_post_related){
        foreach ($get_post_related as $related){
            $prtitle = $related['title'];
            $pcat = $related['category'];
            $ppost = $related['post'];
            $pfile = $related['bl_medias'];

            if(preg_match('/http/',$pfile) || preg_match('/www/',$pfile)){
                $pfile = $pfile;
            }else{
                $pfile = "$myAddress/blogs/$pfile";
            }

            if(strlen($ppost) > 283){
                $post = html_entity_decode(substr($ppost,0,283));
            }

            if(!empty($pfile)){
                $ext = explode('.',$pfile);
                $ext = end($ext);
                $ext = $ext[1];

                $char = strtoupper($pfile);
                $char = "str".$char[3];
                $mid = substr($pfile,0,5);

                if(preg_match("/\.(jpg|png|gif|jpeg|webm)$/i",$pfile) && !preg_match('/iframe/',$pfile)){
                    $file = "<img src='$pfile' alt='$prtitle' style=\"width: 100%;height: 100%;display: inline-block;\">";
                }else if(preg_match("/\.(mp4|ogg|flv)$/i",$pfile) && !preg_match('/iframe/',$pfile)){
                    $file = "<video controls style=\"width: 100%;height: 100%;display: inline-block;\">
                                        <source src='$pfile' type='video/$ext'>
                                </video>";
                }else if(preg_match("/\.(mp3|ogg)$/i",$pfile) && !preg_match('/iframe/',$pfile)){
                    $file = "Audio file";
                }else if(preg_match('/iframe/',$pfile)){
                    $file = $pfile;
                }

            }

            $cts = str_replace(" ","-",strtolower($pcat));
            $cts = str_replace("&","_",$cts);

            $pts = str_replace(" ","-",strtolower($prtitle));
            $pts = str_replace("&","_",$pts);

            $news .= "<a href=\"https://nevaa.co/nevaa/blog/$cts/$pts\" style=\"margin: 0px;width: 100%;float: left;text-decoration: none;outline: 0;\">
                        <div style=\"float: left;width: 100%;margin-top:20px;border-bottom: 1px solid rgba(100,100,100,.1);\">
                            <div style=\"width:120px;float: left;border:1px solid rgba(10,10,10,.1);height:120px;margin-left: 10px;margin-bottom: 5px;\">
                                $file
                            </div>

                            <div style=\"width:79%;float: right;margin: 0px;\">
                                <div style=\"width: 100%;height: auto;font-weight: bold;\">
                                    <p style=\"margin: 0px;color:rgba(212,90,131,1);\"> $prtitle</p>
                                </div>
                                <div style=\"width:100%;float:left;margin: 5px 0;color:rgba(100,100,100,.7);font-size:15px;height: 100px;overflow: hidden;\">
                                    <p style=\"margin: 0px;\">$post</p>
                                </div>
                            </div>
                        </div>
                        </a>";


        }
    }

    if($users) {
        foreach($users as $value){
            $name = $value["user_name"];
            $email = $value["email_addr"];

            $message .= '

<!DOCTYPE html>
<html>
<head>
    <meta charset=\'UTF-8\'>
    <title>NEVAA NEWS</title>
</head>
<body style=\'margin:0px; font-family: Tahoma, Helvetica,verdana, arial, sans-serif;background: #ddd;\'>
<div style="width:100%;float: left;background:transparent;">
    <div style="width: 700px;display: block;margin: 0px auto;height: auto;">
        <div style="width: 100%;float: left;margin-top: 80px;border-top-left-radius:5px;border-top-right-radius:5px;">
            <div>
                <a href="https://nevaa.co/" style="outline: 0;text-decoration: none;">
                    <img src="https://nevaa.co/images/logos/nh.png" style="width:60px;height:60px;float: left;margin:15px 0 0 10px;filter:drop-shadow(0px 0px 1px rgba(10,10,10,.3))">
                    <div style="color: #fff;font-size: 75px;text-shadow:0px 0px 1px rgba(10,10,10,.4);margin-left:5px;float: left;">evaa</div></a>
            </div>
        </div>

        <div style="background: #fff;padding:5px 0;width: 100%;float: left;margin: 0px;box-shadow: 0px 0px 3px 1px rgba(100,100,100,.1);">
            <div style="margin:10px auto ;display:block;width:95%;">
                <div style="float: left;width:100%;margin: 0px;">
                    <p><b style="font-size: 22px;font-weight: normal;color:rgba(212,90,131,1);">Hi '.$name.',</b></p>
                    <p style="color:rgba(10,10,10,.7)">Here are the latest news from our <a href="https://nevaa.co/nevaa/blog" style="text-decoration: none;outline: 0;color:rgba(10,10,10,.7);font-weight: bold;">blog</a> that you maybe interested with. </p>
                </div>

                <div style="margin-top: 10px;float: left;border-top-left-radius:5px;border-top-right-radius:5px;border:1px solid rgba(100,100,100,.1);width:100%;">
                    <div style="width:100%;padding: 10px 0;border-top-left-radius:3px;border-top-right-radius:3px;float: left;background: rgba(100,100,100,1);">
                        <p style="width:100%;text-align:center;margin:0px;color:#fff;font-size: 14px;font-weight:bold;">LATEST NEWS</p>
                    </div>

                    <div style="width:100%;float: left;margin: 0px;">

                        '.$news.'

                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>';

            $email = $email;
            $to = 'frankslayer1@gmail.com';
            $from = "Nevaa <noreply@nevaa.co>";
            $subject = "Nevaa Notifications";
            $headers = "From: ".$from."\r\n";
            $headers .= "MIME-Version: 1.0\r\n";
            $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
            mail($to, $subject, $message, $headers);
        }
    }

    //return $message;
}




blast();