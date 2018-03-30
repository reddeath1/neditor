function _(x){
return document.getElementById(x);
}

var dhead,dbody,dfooter,dshadow,box;

function customAlert() {
	this.renderAlertData = function (hinfo,binfo,finfo)
	{
		var wwidth = window.innerWidth;
		var wheight = window.innerHeight;
		dshadow = _("dialog-shadow");
		dhead = _("dialog-header");
		dbody = _("dialog-body");
		box = _("dialog-container");
		dfooter = _("dialog-footer");
		dshadow.style.display = "block";
		box.style.display = "block";
		
		setTimeout("myCopacityON('dialog-shadow')",100);
		
		dshadow.style.height = wheight+"px";
		
		box.style.left = (wwidth/2) - (box.offsetWidth/2)+"px";
		
		setTimeout("myCopacityON('dialog-container')",120);
		
		if (hinfo != "") {
			dhead.innerHTML = "<p>"+hinfo+"</p>";
		}
		dbody.innerHTML = "<p>"+binfo+"</p>";
		dfooter.innerHTML = "<section onclick='cAlert.ok()'>"+finfo+"</section>";
	}
	
	this.ok = function ()
	{
		
		dshadow.style.opacity = 0;
		box.style.opacity = 0;
		setTimeout("myCopacityOFF('dialog-container')",1000);
		setTimeout("myCopacityOFF('dialog-shadow')",1000);
	}
}

function customConfirm()
{
	this.renderConfirmData = function (hinfo,binfo,finfo,del,pids,stats) {
		var wwidth = window.innerWidth;
		var wheight = window.innerHeight;
		dshadow = _("dialog-shadow");
		box = _("dialog-container");
		dhead = _("dialog-header");
		dbody = _("dialog-body");
		dfooter = _("dialog-footer");
		dshadow.style.display = "block";
		box.style.display = "block";
		
		setTimeout("myCopacityON('dialog-shadow')",100);
		box.style.left = (wwidth/2) - (box.offsetWidth/2)+"px";
		setTimeout("myCopacityON('dialog-container')",120);
		
		dhead.innerHTML = "<p>"+hinfo+"</p>";
		dbody.innerHTML = "<p>"+binfo+"</p>";
		dfooter.innerHTML = "<section onclick=\"cConfirm.yes('"+stats+"','"+pids+"');\">"+del+"</section>";
		dfooter.innerHTML += "<section onclick='cConfirm.cancel();'>"+finfo+"</section>";
	};
	
	this.yes = function (stas,pid) {
		if (stas === "delete") {
			deletePost(pid);
		}
        dshadow = _("dialog-shadow");
        box = _("dialog-container");
		dshadow.style.opacity = 0;
		box.style.opacity = 0;
		setTimeout("myCopacityOFF('dialog-container')",120);
		setTimeout("myCopacityOFF('dialog-shadow')",100);
	};
	
	this.cancel = function () {
        dshadow = _("dialog-shadow");
        box = _("dialog-container");
		dshadow.style.opacity = 0;
		box.style.opacity = 0;
		setTimeout(function () {
            myCopacityOFF('dialog-container');
            myCopacityOFF('dialog-shadow')

        },120);
	};
}

function progressBar()
{
    var s,sd,i,wwidth,wheight,b = document.getElementsByTagName("body");

    this.onTaskies = function (imgUrl,info) {
		wwidth = window.innerWidth;
		wheight = window.innerHeight;
		sd = _("user-shadow");

        sd.innerHTML = "<section id='progressBar'></section>";
        sd.style.display = "block";

        s = document.getElementById("progressBar");
        s.style.width = 200+"px";
        s.style.height = 175+"px";
        s.style.textAlign = "center";
        s.style.background = "rgba(186,83,112,1)";
        s.style.position = "fixed";
        s.style.zIndex = 6000+"px";
        s.style.color = "#fff";
        s.style.borderRadius = 5+"px";
        s.style.cursor = "progress";
        s.boxShadow = "0px 0px 3px 0px rgba(255,255,255,.7)";
        s.style.left = (wwidth/2) - (s.offsetWidth/2)+"px";
        s.style.top = (wheight/2) - (s.offsetHeight/2)+"px";
		s.innerHTML = "<img src='"+imgUrl+"' alt='Please wait...'><p>"+info+"</p>";
        setTimeout(function () {
        	sd.style.opacity = 1;
        },400);
    }
    
    this.onTaskiesFinished = function (elem) {

		b = document.getElementById("progressBar");
		s = document.getElementById("user-shadow");
		b.style.cursor = "default";
		s.style.opacity = 0;
		b.style.transition = ".7s linear 0s";
		s.style.transition = ".7s linear 0s";
		setTimeout(function () {
            b.style.transform = "scale(0.0)";
            setTimeout(function () {
                s.innerHTML = "";
                s.style.display = "none";
                if(elem !== "" && _(elem) !== null){
					_(elem).style.display = "block";
				}
            },1000);
        },1000);
    }
}

var cAlert = new  customAlert(),
	cConfirm = new  customConfirm(),
    progressBar = new progressBar();

function myCopacityOFF(divi) {
	_(divi).style.display = "none";
}

function myCopacityON(divi) {
	_(divi).style.opacity = 1;;
}

