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



        /**
         * set default rendering data
         */
        n.configs({
            placeholder:'<p>Type something here like (e.g @frank galos frankslayer1@gmail.com) ...</p>',
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

            if(f !== '' && t !== '' && c !== '' && v !== '' && v !== '<p>Create a blog post ...</p>'){
                n.xhr.onMessage({
                    method:'POST',
                    url:l+'includes/handler.php',
                    query:'action=postBlog&u='+u+'&c='+c+'&p='+v+'&d='+d+'&t='+t+'&f='+f,
                    header:null,
                    success:function(){
                        if(n.xhr.readyStates(this)){

			let temr = this.response;

			if(temr === ''){
			var er = n.errorLog('Your post was successfully posted');
                                er.e.style({background:'rgba(12,211,127,.3)',color:'rgba(12,211,127,1)',borderColor:'rgba(12,211,127,.2)'});
                                n.eraser();
                                va.te.value('');

                                $n('.cats').value('');
                                n.configs({file:''});
			}else{
			var r = JSON.parse(this.response);
                            e.html('Create');
                            if(r.status === 'created'){
                                var er = n.errorLog('Your post was successfully posted');
                                er.e.style({background:'rgba(12,211,127,.3)',color:'rgba(12,211,127,1)',borderColor:'rgba(12,211,127,.2)'});
                                n.eraser();
                                va.te.value('');

                                $n('.cats').value('');
                                n.configs({file:''});
                            }else{
                                n.errorLog(r.status);
                            }
			}


                        }
                    }
                });
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
