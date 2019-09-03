<?php

include 'classes/classes.inc.php';

$data = new \users_class\users();

$link = $data->pageUrl().'/';

if(false !== strpos($link, 'localhost') || preg_match('/192.168.43.1/',$link)){
    $link .= 'neditor/';
}

?>
<!DOCTYPE html>
<html>

<head>
    <title>Neditor</title>
    <link rel="stylesheet" type="text/css" href="style/style.css" />
    <script type="text/javascript" src="js/customs.js"></script>
    <script type="text/javascript" src="js/neditor.js"></script>
    <link rel='stylesheet' type='text/css' href='style/font-awesome-4.7.0/css/font-awesome.css'>
</head>

<header>
    <nav>
        <section class="logo">neditor</section>
    </nav>

</header>
<section id="user-shadow" class="user-shadow"></section>
<section id="dialog-shadow"></section>
<section id="dialog-container">
    <section id="dialog-header"></section>
    <section id="dialog-body"></section>
    <section id="dialog-footer"></section>
</section>

<section class="neditor-shadow"></section>
<section class="new-thread-constructor">
    <section class="full-mode"></section>
</section>

<script>

    (function(){
        var n = $n('.full-mode');

        $n('.logo').on('click',function(){
            location.reload(true);
        });
        
        var dummy = '<p align="left"><font size="6"><font face="\'Trebuchet MS\', Helvetica, sans-serif"><b><font color="#ff9e85"><font size="7">F</font>rank Galos</font></b></font> <b><font color="#2259ff">is</font></b> <b>awesome</b></font></p><p align="left"><font size="6"> L</font> orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.<br><br>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don’t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn’t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p><table style="width:auto;height:auto; border:1px solid #606060; align:Center"><tbody><tr><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; ">Death<br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; ">in<br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; ">Red<br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td></tr><tr><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td></tr><tr><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td></tr><tr><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td></tr><tr><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td></tr><tr><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td></tr><tr><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td></tr><tr><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td><td style=" width:50px; height:15px; margin:2px; padding:1px; border: 1px solid #606060; "><br></td></tr></tbody></table>';



        /**
         * set default rendering data
         */
        n.configs({
            placeholder:dummy,
            defaultText:'create',
            hasTitle:false,
            canExpand:false,
            isClosable:false
        });

        let url = n.addr(),
            links = url.url,
            path = url.path[1];

         if(url.domain.match('localhost')){
            links = links+path[1]+'/'+path[2]+'/';
        }else{
            links = links+path+'/'
        }


        /**
         * render data
         */
        n.render();

        /**
         * send data
         */
        n.publish(function(){
            var e = $n(this),
                va = n.getContents(),
                v = va.c,
                t = va.tc,
                c = $n('.cats').value(),
                u = user.u,
                f = va.file,
                d = n.date(new Date());
                
               
               if(typeof f === 'undefined' && f === ''){
                f = '';
            	}

            e.loader({css:'width:20px;height:15px;'});

            var l = window.location;

            if(f !== ''  && v !== '' && v !== '<p>Type something here like (e.g @frank galos frankslayer1@gmail.com) ...</p>'){
                n.errorLog('You have created something');
            }else{
                e.html('Create');
                if(c === ''){
                    n.errorLog('Category can not be empty');
                }else if(t === ''){
                    n.errorLog('Title can not be empty');
                }else if(u === ''){
                    n.errorLog('Please login to continue');
                }else if(f === ''){
                    n.errorLog('Please insert  file\'s to continue');
                }else{
                    n.errorLog('Please type something before posting');
                }

            }

        });
    })();
</script>
<script type='text/javascript' src='js/jquery.js'></script>
</html>
