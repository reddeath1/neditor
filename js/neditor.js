/**
 ***************************************************************************************************************************************************
 ***************************************************************************************************************************************************
 *******************************************************              ******************************************************************************
 *******************************************************   @NEDITOR  ******************************************************************************
 *******************************************************              ******************************************************************************
 ***************************************************************************************************************************************************
 ********************************************************                     **********************************************************************
 ********************************************************  @frank galos  **********************************************************************
 ********************************************************                     **********************************************************************
 ***************************************************************************************************************************************************
 ***************************************************************************************************************************************************
 */

var

    internalCopy,
    internalCut,

    // initializing
    neditor = function(selector){

        'use strict';

        var n = {},

            /**
             * SYSTEM CONFIGURATIONS
             * @type {{isEditable: boolean, hasSendButton: boolean, isNevaa: [*],
              * isClosable: boolean,isFull:boolean,
              * editableContents: null,
              * match: string,
              * shadow: string}}
             */
            config = {

                /** make content editable or not
                 * This statement if it's value is true then the textEditor will
                 * be editable else if it false then it's will be disabled
                 */
                isEditable :true,

                /**
                 * neditor current version
                 */
                version:'0.0.1',

                /**
                 * This statement only check if the editor has the send button
                 * If it does then html elements with send button will be visible
                 * else will be invisible.
                 * This can be done by allowing the system by provide the value
                 * Either true/false
                 */
                hasSendButton :true,

                /**
                 * Some features will only be performed on nevaa.
                 */
                isNevaa :[true,2.4,false],

                /**
                 * This feature is for enabling/disabling the close button.
                 */
                isClosable :true,

                /**
                 * This feature allow the editor to display the value on this or
                 * displaying the default ones.
                 */
                editableContents :null,

                /**
                 * This feature will return the regX values.
                 */
                match :/[a-z0-9-*^%#$}\]!~`|[<&>\/{+\\_]/gi,

                /** This statement only accept one value
                 *  That value can be either `on` or `off`
                 *  Turn this on if you included element with a class name of
                 *  `neditor-shadow` in your project, else it will result in
                 *  error.
                 */
                shadow :'on',

                /**
                 * Setting an editor to be full screen mode or minimised mode.
                 * this feature require `hasFullButton` to enabled.
                 */
                isFull:false,

                /**
                 * Enable or disable full screen button indicator.
                 */
                hasFullButton:true,

                /**
                 * Allow color picker on mouse move.
                 */
                pick:true,

                /**
                 * Show title field
                 */
                hasTitle:true,

                /**
                 * extra contents that user may require. eg
                 * files locations for other uses.
                 */
                ExtraContents:'',

                /**
                 * defualt post button text.
                 */
                defaultText:'Post',

                placeholder:'<p>Create new topic ...</p>',

                /**
                 * topic field title
                 */
                topicTitle:''
            },

            /**
             * editor elements that it's existence might be duplicated,
             * so initiating once
             * @type {{elm: [*], innerElements: [*]}}
             */
            elements = {
                elm:['.file-menu','.edit-menu','.insert-menu','.format',
                    '.font-menu','.table-menu-options',
                    '.view-menu-option','.tool-menu-opt'],

                innerElements:['.undo-menu','.redo-menu',
                    '.cut-menu','.paste-menu','.copy-menu',
                    '.select-menu','.redo','.undo','.save-as',
                    '.print','.new-doc','.ft-bold','.ft-italic',
                    '.ft-underline','.ft-strikethrough','.ft-superscript',
                    '.ft-subscript','.bold',
                    '.italic','.linethrough'],
                currentValue:''
            },

            /**
             *  These are values to be checked when click event occurred.
             * @type {{bold: number, italic: number, emoji: number, undo: number, redo:
             * number, strikeThrougn: number, removeFormat: number, numlist: number,
             * orderlist: number, unorderlist: number, alignLeft: number, alignCenter:
             * number, alignRight: number, alignJustfy: number, indent: number, outdent:
             * number, link: number, unlink: number, blockQuote: number}}
             */
            buttonValues = {
                bold:0,
                italic:0,
                emoji:0,
                undo:0,
                redo:0,
                strikeThrougn:0,
                removeFormat:0,
                numlist:0,
                orderlist:0,
                unorderlist:0,
                alignLeft:0,
                alignCenter:0,
                alignRight:0,
                alignJustfy:0,
                indent:0,
                outdent:0,
                link:0,
                unlink:0,
                blockQuote:0
            },

            /**
             * This can be error message or system logs
             * @type {{throw: string, icon: string}}
             */
            message = {
                throw:'For some reason your browser does not support direct ' +
                'access to the clipboard.',
                icon:'<i class="fa fa-times" ' +
                'onclick=\'neditor(".error-log").hide(null,1000);\'></i>'
            },

            /**
             * @type {{contextValue: [*], contextRule: number,
              * contextOption: string}}
             */
            context = {
                contextValue : ['<ul>' +

                '<li class="view-menu">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-eye"></i></section>' +
                '<section class="right-desc"><p>View</p></section>' +
                '</li>' +

                '<li class="download-menu">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-download"></i></section>' +
                '<section class="right-desc"><p>Download</p></section>' +
                '</li>' +

                '<li class="insertFile">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-arrow-down"></i></section>' +
                '<section class="right-desc"><p>Insert</p></section>' +
                '</li>' +

                '<li class="cont-disabled">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-pencil"></i></section>' +
                '<section class="right-desc"><p>Edit</p></section>' +
                '</li>' +

                '<li class="cont-disabled">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-pencil"></i></section>' +
                '<section class="right-desc"><p>Rename</p></section>' +
                '</li>' +

                '<li class="cont-disabled">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-clone"></i></section>' +
                '<section class="right-desc"><p>Copy</p></section>' +
                '</li>' +


                '<li class="cont-disabled">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-scissors"></i></section>' +
                '<section class="right-desc"><p>Cut</p></section>' +
                '</li>' +


                '<li class="cont-disabled">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-clipboard"></i></section>' +
                '<section class="right-dsc"><p>Paste</p></section>' +
                '</li>' +


                '<li class="cont-disabled">' +
                '<section class="left-ico"><i class="fa ' +
                'fa-sitemap"></i></section>' +
                '<section class="right-desc">' +
                '<p>New directory</p></section>' +
                '</li>' +

                '</ul>'],
                contextRule:0,
                contextOption:'',
                uploadedFile:'',
                tableValue: [
                    '<ul>' +

                    '<li>' +
                    '<section class="left-ico"><i class="fa ' +
                    'fa-arrow-down"></i></section>' +
                    '<section class="right-desc"><p>Insert Row</p></section>' +
                    '</li>' +

                    '<li>' +
                    '<section class="left-ico"><i class="fa ' +
                    'fa-th"></i></section>' +
                    '<section class="right-desc"><p>Table Properties</p></section>' +
                    '</li>' +

                    '<li>' +
                    '<section class="left-ico"><i class="fa ' +
                    'fa-times"></i></section>' +
                    '<section class="right-desc"><p>Delete Table</p></section>' +
                    '</li>' +

                    '<li>' +
                    '<section class="left-ico"><i class="fa ' +
                    'fa-times"></i></section>' +
                    '<section class="right-desc"><p>Delete Row</p></section>' +
                    '</li>' +

                    '</ul>'
                ],
                tableRule:0
            },

            /**
             * @type {{selected: {pn: number, cn: number}, clicked: boolean}}
             */
            tableConfig = {
                selected:{pn:0,cn:0},
                clicked:false
            },

            /**
             * This object represent the borrowed plugins and this library plugins.
             * @type {{borrowedPlugins: {viewer: string, closeViewer: string, customAlert:
              * string, naPlayer: string}}}
             */
            plugins = {
                borrowedPlugins:{
                    viewer:'From main file [js]',
                    customAlert:'From main file [js]',
                    naPlayer:'Form main file [js]'
                }
            },

            not_Builted_But_Included_Plugins = {
                dictionaryPlugin:'for neditor pro',
                MediaMenipulator:'for neditor file manager pro',
                easyDirectory:'for neditor file manager directory creator pro',
                easyCutCopMove:'for neditor file manager pro',
                easyDialog:'for neditor replace nevaa custom alert',
                vinaplayer:'for neditor/nevaa video player pro',
                munaplayer:'for neditor/nevaa music player pro, replacing naPlayer',
                dragetor:'for neditor drag and drop file and divs'
            }
        ;

        /**
         * initializer.
         */
        n.init = selector;

        if(typeof selector === 'object'){
            n.element = selector;
        }
        else {
            n.element = document.querySelector(n.init);
        }

        /**
         * output method.
         */
        n.render = function()
        {
            if(this.element !== null){
                this.html(this.app());

                this.keys();

                this.table.builder();

                this.editorCommands();
            }
        };

        /**
         * Builder
         * @returns {string}
         */
        n.app = function ()
        {
            return this.wrapper();
        };

        /**
         * Show or hide the element.
         * @param elem
         * @param elems
         */
        n.toggleElement = function(elem,elems)
        {

            var t = neditor(elem),
                e = t.parent(),
                e = neditor(e);

            if(t.element !== null){
                if(t.element.style.display === 'block'){
                    e.style({'background':'transparent','border-color':'transparent'});
                    t.style({'opacity':0,'display':'none','border-top':'none'});

                    elements.currentValue = '';
                }else{

                    if(elems !== null){
                        this.toggleOffEditorElement(elems);
                    }

                    e.style({'background':'#fff',
                        'border':'1px solid rgba(100,100,100,.2)'});
                    t.style({'display':'block','opacity':1,
                        'border-top':'1px solid rgba(100,100,100,.2)'});
                    elements.currentValue = e;
                }
            }

        };

        /**
         * disables the elements
         * @param elems
         */
        n.toggleOffEditorElement = function (elems)
        {
            n.each(elems,function (v) {
                var e = neditor(v),p;
                if(e.element !== null){
                    e.hide(null,100);

                    p = e.parent();

                    p = neditor(p);

                    p.style({'background':'transparent',
                        'border-color':'transparent'});
                    p.on('mouseover',function(){
                        var e = neditor(this);

                        e.style({'background':'#fff',
                            'border-color':'rgba(100,100,100,.2)'});

                        e.on('mouseout',function(){
                            var e = neditor(this),cv = elements.currentValue;

                            e.style({'background':'transparent',
                                'border-color':'transparent'});
                            if(cv.element !== null && cv !== ''){
                                cv.style({'background':'#fff',
                                    'border-color':'rgba(100,100,100,.2)'});
                            }
                        });
                    });
                }
            });

        };

        /**
         * This make use of some elements.
         */
        n.editorCommands = function ()
        {
            var
                sd,
                fm = neditor('.file-m'),
                ed = neditor('.edit'),
                ins = neditor('.insert'),
                fmt = neditor('.fmt'),
                fnt = neditor('.fonts'),
                tb = neditor('.table'),
                vw = neditor('.view'),
                tl = neditor('.tools'),
                nd = neditor('.new-doc'),
                pe = neditor('.paste-menu'),
                hr = neditor('.ft-horizontal'),
                rf = neditor('.remove-format'),
                io = neditor('.Insert-remove-ol'),
                cd = neditor('.ft-code'),
                iu = neditor('.Insert-remove-ul'),
                cp = neditor('.colorPicker'),
                al = neditor('.align-left'),
                ac = neditor('.align-center'),
                ar = neditor('.align-right'),
                aj = neditor('.align-justify'),
                uk = neditor('.unlink'),
                id = neditor('.indent'),
                od = neditor('.outdent'),
                bq = neditor('.blockquote'),
                ch = neditor('.h-h-cl'),
                isc = neditor('.insert-sepcial-char'),
                r = neditor('.result-body'),
                hp = neditor('.help-ned'),b = neditor('body');

            b.on('contextmenu',function(){
                return false;
            });

            // listen for publish call
            this.publish();

            // webkits
            this.editorInit();

            /** For Firefox
             * By default firefox disables iframe editable mode,
             * Before complete loading first.
             */
            textArea.onload = function () {
                n.editorInit();
            };

            if(config.isClosable){
                this.centerElement();
                // disable scrolling
                b.style({'overflow':'hidden'});
            }

            if(uk !== null){
                uk.on('click',function(){
                    n.unlink();
                });
            }

            /**
             * insert link.
             */
            n.each(['.insert-link','.link'],
                function(ee){
                    var e = neditor(ee);
                    if(e.element !== null){
                        e.on('click',function () {
                            n.hiddenContents('.hidden-contents');
                            n.link.linkConfig();
                        });
                    }
                });

            /**
             * install css
             */
            var hd  = neditor('head'),
                adr = n.addr(),
                rl = adr.url,min,main,
                pth =  adr.path,nt;

            if(rl.match('localhost')){
                main = rl+pth[1]+'/style/neditor.main.css';
                min = rl+pth[1]+'/style/mini.neditor.css';
            }else{
                main = rl+pth[1]+'/style/neditor.main.css';
                min = rl+pth[1]+'/style/mini.neditor.css';
            }

            if(hd.element !== null){
                nt = hd.html();

                hd.html(nt+"<link rel='stylesheet' type='text/css' " +
                    "href='"+main+"'>" +
                    "<link rel='stylesheet' type='text/css' " +
                    "href='"+min+"'>");
            }else{
                hd  = neditor('body');
                if(hd.element !== null){
                    nt = hd.html();
                    neditor(hd).html("<link rel='stylesheet' type='text/css' " +
                        "href='"+main+"'>" +
                        "<link rel='stylesheet' type='text/css' " +
                        "href='"+min+"'>"+nt);
                }
            }

            /**
             * cancel hidden contents.
             */
            if(ch !== null){
                ch.on('click',function () {
                    n.hiddenContents('.hidden-contents');
                    neditor('.hidden-shadow').hide(null,100);
                });
            }

            /**
             * special character instantiation.
             */
            if(isc !== null){
                isc.on('click',function () {
                    n.hiddenContents('.hidden-contents');
                    n.specialCharacters.showChars({
                        element:'.hidden-contents',
                        title:null,
                        content:null});
                });
            }

            /** footer element value*/
            if(r !== null){
                r.html('body');
            }

            /**
             *
             hide shadow
             */

            if(config.shadow === 'off'){
                sd = neditor('.neditor-shadow');

                if (sd !== null){
                    sd.style({'opacity':0,'display':'none'});
                    neditor('.neditor').style({'position':'relative'});
                }
            }

            /**
             * font family.
             */
            this.each('.fnt',function (v) {
                neditor(v).on('click',function(){
                    var cm = this.getAttribute('id');
                    n.fontFamily(cm);
                });
            });

            /**
             * font size
             */
            this.each('.fns',function (v) {
                neditor(v).on('click',function () {
                    var cm = this.getAttribute('id');
                    n.fontSize(cm);
                })
            });

            /**
             * sub menus command
             */
            this.each('.sub-ft-m',function (v) {
                neditor(v).on('click',function () {
                    var cm = this.getAttribute('id');
                    n.format(cm);
                });
            });

            /**
             * sub menus block elements functionality
             */
            this.each('.ft-b-sub',function (v) {
                neditor(v).on('click',function () {
                    var cm = this.getAttribute('id');
                    n.format(cm);
                });
            });

            /**
             * inactive language plugins
             */
            n.each('.inactive',function(i){
                var e = neditor(i);
                if(e.element !== null){
                    e.on('click',function(){
                        cAlert.renderAlertData('Under Construction Service',
                            'Sorry this service is not yet available for nevaa.' +
                            '<br> We will do our best for this to be available.' +
                            '<br> Please enjoy other nevaa services while we taking care' +
                            ' of this.<br><br> Thank you,for being with us.','OK');
                    });
                }
            });

            /* editor close handler*/
            n.each(['.neditor-closeer','.exit-editor'],function(v){
                var e = neditor(v);

                if(e.element !== null){
                    e.on("click",function () {
                        n.closeEditor();
                    });
                }
            });

            /* toggle file menu*/
            fm.on('click',function () {
                var es = ['.edit-menu','.insert-menu','.format',
                    '.font-menu','.table-menu-options',
                    '.view-menu-option','.tool-menu-opt'];
                n.toggleElement('.file-menu',es);
            });

            /* toggle edit menu*/
            ed.on('click',function () {
                var es = ['.file-menu','.insert-menu','.format',
                    '.font-menu','.table-menu-options',
                    '.view-menu-option','.tool-menu-opt'];

                n.toggleElement('.edit-menu',es);
            });

            /* toggle insert menu*/
            ins.on('click',function () {
                var es = ['.file-menu','.edit-menu','.format',
                    '.font-menu','.table-menu-options',
                    '.view-menu-option','.tool-menu-opt'];

                n.toggleElement('.insert-menu',es);
            });

            /* toggle format menu*/
            fmt.on('click',function () {
                var es = ['.file-menu','.edit-menu','.insert-menu',
                    '.font-menu','.table-menu-options',
                    '.view-menu-option','.tool-menu-opt'];

                n.toggleElement('.format',es);
            });

            /* toggle fonts menu */
            fnt.on('click',function () {
                var es = ['.file-menu','.edit-menu','.insert-menu',
                    '.format','.table-menu-options',
                    '.view-menu-option','.tool-menu-opt'];

                n.toggleElement('.font-menu',es);
            });

            /* toggle table menu*/
            tb.on('click',function () {
                var es = ['.file-menu','.edit-menu','.insert-menu',
                    '.format','.font-menu','.view-menu-option',
                    '.tool-menu-opt'];

                n.toggleElement('.table-menu-options',es);
            });

            /* toggle view menu */
            vw.on('click',function () {
                var es = ['.file-menu','.edit-menu','.insert-menu',
                    '.format','.font-menu','.table-menu-options',
                    '.tool-menu-opt'];

                n.toggleElement('.view-menu-option',es);
            });

            /* toggle tools menu */
            tl.on('click',function () {
                var es = ['.file-menu','.edit-menu','.insert-menu',
                    '.format','.font-menu','.table-menu-options',
                    '.view-menu-option'];

                n.toggleElement('.tool-menu-opt',es);
            });

            /* create new document*/
            nd.on('click',function () {
                neditor('.textArea').newDoc();
            });

            /**
             * Toggle expand editor
             */
            this.each(['.full-screen','.v-m-o3'],
                function(v){
                    var e = neditor(v);

                    if(e.element !== null){
                        e.on('click',function(){
                            n.expand();
                        });
                    }
                });

            /* insert horizontal rule*/
            hr.on('click',function () {
                n.horizontalRule();
            });

            /* remove format */
            rf.on('click',function () {
                n.removeFormat();
            });

            /* insert orderlist */
            io.on('click',function () {
                n.orderList();
            });

            /* insert unorderlist */
            iu.on('click',function () {
                n.unOrderList();
            });

            /* color picker */
            cp.on('click',function () {
                n.picker.picker();
            });

            /**
             * align contents left
             */
            al.on('click',function () {
                n.alignLeft();
            });

            /**
             * align contents center
             */
            ac.on('click',function () {
                n.alignCenter();
            });

            /**
             * align contents right
             */
            ar.on('click',function () {
                n.alignRight();
            });

            /**
             * align contents justfy
             */
            aj.on('click',function () {
                n.alignJustfy();
            });

            /**
             * indent
             */
            id.on('click',function () {
                n.indent();
            });

            /**
             * outdent
             */
            od.on('click',function () {
                n.outDent();
            });

            /* insert html code */
            cd.on('click',function () {
                n.code();
            });

            /**
             * insert blockquote
             */
            bq.on('click',function () {
                var
                    t = neditor('.blockquote');
                if(buttonValues.blockQuote > 0
                    && buttonValues.blockQuote < 2){
                    buttonValues.blockQuote = 0;
                    t.style({'background':'transparent','border':'none'});
                }else{
                    buttonValues.blockQuote = 1;
                    t.style({'background':'rgb(255, 255, 255)',
                        'border':'1px solid rgba(100,100,100,.2)'});
                }
                n.format('<blockquote>');
            });

            /**
             * Insert emojies.
             */
            this.each(['.emoji','.insert-emoji'],
                function (em) {
                    var e = neditor(em);

                    if(e.element !== null){
                        e.on('click',function(){
                            n.emojiWrapperToggle(this);
                        });
                    }
                });

            /**
             * paste
             */
            if(pe.element !== null){
                pe.on('click',function () {
                    n.paste();
                });
            }

            /**
             * insert media
             */
            this.each(['.media-image',
                    '.media-video',
                    '.insert-media'],
                function (v) {
                    var e = neditor(v);

                    if(e.element !== null){
                        e.on('click',function(){
                            n.hiddenContents('.hidden-contents');
                            n.media.mShower();
                        });
                    }
                });

            /**
             * code preview
             */
            neditor('.sourceCode').on('click',function(){
                var nn = neditor(this),
                    r = nn.className(),
                    r = r.split(' '),
                    r = r[1];
                eval('n.'+[r]+'(".'+r+'")');
            });

            /**
             * show blocks
             */
            this.each(['.show-blocks',
                '.hide-blocks'],function(e){
                var e = neditor(e);
                if(e.element !== null){
                    e.on('click',function(){
                        neditor(this).showBlocks();
                    });
                }
            });

            /**
             * contents preview
             */
            neditor('.contents-preview').on('click',function(){
                n.preview();
            });

            /**
             * Shortcuts toggle.
             */
            if(hp.element !== null){
                hp.on('click',function(){
                    n.shortCuts.shorts();
                });
            }

        };

        /**
         * @type {{onPaste: neditor.forbiden.onPaste, onCopy: neditor.forbiden.onCopy}}
         */
        n.forbiden = {
            onPaste:function(){
                textArea.document.addEventListener('paste',function(e){
                    e.preventDefault();
                    /* get text representation of clipboard */
                    var text = e.clipboardData.getData("text/plain");

                    if (document.queryCommandSupported('insertText')) {
                        n.execute("insertText",text);
                    } else {
                        document.execCommand('paste', false, text);
                        /* insert text manually */
                        n.execute("paste",text);
                    }

                },false);
            }
        };
        /**
         * Initializing command or command center.
         */
        n.editorInit = function ()
        {
            var t = textArea.document,h;
            t.designMode = 'On';
            t.body.style.color = 'rgba(100,100,100,1)';
            n.isNull();

            // set default fonts
            h = t.head;
            neditor(h).html('<style>body{font-family: \'Courier New\', monospace}</style>');

            t.body.onfocus = function () {
                var
                    tx = this.document.body.innerHTML,
                    mt = config.placeholder,
                    e = neditor('.error-log');

                setTimeout(function(){
                    // remove error message once textfield is focused
                    if(e.element !== null){
                        e.hide(null,1000);
                    }
                },7000);

                // errase the textfield
                if(n.strMatch(tx,mt) ||
                    t.body.innerHTML.slice(0,4) === '<br>'){
                    n.eraser();
                }

                n.activeElement();

                n.createTableProperties.table();
            };

            t.body.onblur = function () {
                var
                    text = this.document.body.innerHTML;

                // insert default vaules

                if(text.slice(0,4) === '<br>' ||
                    text === ''){
                    this.document.body.innerHTML = config.placeholder;
                }

                var box = neditor('#narea'),
                    frame = neditor(textArea.document.body).html();

                if(box.element !== null){
                    box.value(frame);
                }
            };
            n.onWritting();

            n.forbiden.onPaste();
        };

        /**
         * It's executes editor commands.
         * @param command
         * @param arg
         * @param arg2
         */
        n.execute = function (command,arg,arg2)
        {

            var
                iframe = neditor('.textArea'),
                iframe = iframe.element,
                frame = iframe.contentWindow
                    || iframe.contentDocument,
                e = neditor('.error-log');

            if (frame.document) {
                frame = frame.document;
            }

            if(arg === null || arg === ' ' || arg === ''){
                arg = null;
            }

            if(arg2 === null){
                arg2 = '';
            }

            // make execution
            if(!frame.execCommand(command,false,arg)){

                if(command === 'print' &&
                    n.browserInfo.browserName()
                    === 'Firefox'){
                    var title = neditor('title').text(),
                        doc = frame.body.innerHTML,
                        PrintWin = window.open("", "_blank","width=520,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");


                    if(PrintWin !== null){
                        PrintWin.document.open();
                        PrintWin.document.write("<!doctype " +
                            "html><html><head><title>"+title+"</title></head>" +
                            "<body onload=\"print();\">"+doc+"</body></html>");
                        PrintWin.document.close();
                    }else{
                        // show error
                        e.show(null,500);
                        e.html('<p>'+

                            message.throw + 'Please click/tap the print at the top of the editor on the first menu and you wil see a dropdown.' +
                            '.</p>' +

                            message.icon);
                    }
                }
                else{

                    // show error
                    e.show(null,500);
                    e.html('<p>'+

                        message.throw + arg2 +
                        '.</p>' +

                        message.icon);

                }
            }

            e  = neditor('.textArea');
            e.element.focus();

        };

        /**
         * String matcher.
         * @param search
         * @param match
         * @returns {boolean}
         */
        n.strMatch = function (search,match)
        {
            return search.match(match);
        };

        /**
         * style accept only index and value pair.
         * @param style
         */
        n.loader = function (style)
        {
            var css = '';

            if(typeof style !== 'undefined'){
                css = 'style="'+style.css+'"';
            }

            var url = n.addr(),
                lnk = url.url,
                path = url.path[1];

            if(path === 'nevaa'){
                lnk = lnk+path+'/';
            }else{
		lnk = lnk+path+'/';
	     }

            n.html(
                '<img src="'+lnk+'images/logos/loader1.svg"' +
                'alt="Please wait ...."'+css +
                ' title="Please wait ..... ">');
        };

        /**
         * get editor source code.
         */
        n.sourceCode = function(e){
            if(this.element !== null){
                var t = textArea.document,
                    c = neditor(t.body).html(),
                    e = neditor(e),er = neditor('.error-log');

                if(e.element !== null
                    && e.text() === ' Source code'){
                    e.html('<i class="fa fa-code"></i> View Aid');
                    neditor(t.body).text(c);
                    neditor(t.body).style({'background':'rgba(171,115,67,.1)'});
                }
                else if(e.element !== null){
                    e.html('<i class="fa fa-code"></i> Source code');

                    var r = this.htmlDecode(c);
                    neditor(t.body).html(r);

                    neditor(t.body).style({'background':'rgba(255,255,255,1)'});
                }

            }
        };

        /**
         * @description Preview editor contnets.
         */
        n.preview = function(){
            var s = neditor('.neditor-shadow'),
                contents = ['<section class="preview">' +
                '<section class="preview-container">' +
                '<section class="p-header">' +
                '<section class="title-preview">' +
                '<p>Preview</p>' +
                '</section>' +
                '<section class="close-preview">' +
                '<i class="fa fa-times"></i>' +
                '</section>' +
                '</section>' +
                '<section class="p-body"></section>' +
                '</section>' +
                '</section>'];

            if(s.element.style.zIndex === '8000'){
                s.style({'z-index':1000});
                s.html(' ');
            }else{
                s.style({'z-index':8000});
                setTimeout(function(){
                    s.html(contents[0]);
                    var e = neditor('.preview'),
                        e = e.element,
                        dh = n.doc().innerHeight,
                        dw = n.doc().innerWidth,
                        h = neditor(e).doc().height,
                        w = neditor(e).doc().width;

                    h = (dh/2.6) - (h/2);
                    w = (dw/2) - (w/2);

                    e = neditor(e);
                    e.style({'margin-top':h+'px','margin-left':w+'px'});
                    var p = neditor('.preview-container');
                    neditor('.p-body').html(neditor(textArea.document.body).html());
                    p.style({'opacity':.4});
                    setTimeout(function(){
                        p.style({'opacity':1});
                    },100);

                    neditor('.close-preview').on('click',function(){
                        n.preview();
                    });
                },600);
            }
        };

        /**
         * @desc show blocks to  all contents in the editor.
         */
        n.showBlocks = function(){
            var t = neditor(textArea.document),
                t = neditor(t.element.body),
                t = t.children(),e,cn;

            e = this.element,
                e = neditor(e);
            cn = e.className();
            cn = cn.split(' ');
            cn = cn[1];

            if(e.element !== null){
                if(cn === 'show-blocks'){
                    e.attr('class','v-m-o1 hide-blocks');
                    e.html('<i class="fa fa-times"></i> Hide blocks <b>Ctrl+Alt+B</b>');
                    n.for({
                        start:0,
                        data:t,
                        asoc:false,
                        callback:function(i){
                            neditor('.textArea').style({'outline':
                                '1px dashed rgba(100,100,100,.5)'});
                            neditor(t[i]).style({'outline':
                                '1px dashed rgba(100,100,100,.5)'});
                        }
                    });
                    neditor(textArea.document.body).html();
                }else{
                    e.attr('class','v-m-o1 show-blocks');
                    e.html('<i class="fa fa-times"></i> Show blocks <b>Ctrl+Alt+B</b>');
                    n.for({
                        start:0,
                        data:t,
                        asoc:false,
                        callback:function(i){
                            neditor('.textArea').style({'outline':
                                'none'});
                            neditor(t[i]).style({'outline':
                                'none'});
                        }
                    });

                    neditor(textArea.document.body).html();
                }
            }

        };

        /**
         * @returns {{innerHeight: Number, outerHeight: Number, innerWidth: Number,
          * outerWidth: Number, height: *, width: *}}
         */
        n.doc = function(){
            var ih = window.innerHeight,
                oh = window.outerHeight,
                iw = window.innerWidth,
                ow = window.outerHeight,
                h = neditor(this.element).offset().height,
                w = neditor(this.element).offset().width;

            return {
                innerHeight:ih,outerHeight:oh,
                innerWidth:iw,outerWidth:ow,
                height:h,width:w};
        }

        /**
         * @param str
         * @returns {*}
         */
        n.htmlDecode = function(str){

            var entities = [
                ['amp', '&'],
                ['apos', '\''],
                ['#x27', '\''],
                ['#x2F', '/'],
                ['#39', '\''],
                ['#47', '/'],
                ['lt', '<'],
                ['gt', '>'],
                ['nbsp', ' '],
                ['quot', '"']
            ];

            for (var i = 0, max = entities.length; i < max; ++i)
                str = str.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

            return str;
        };

        /**
         * @param str
         * @returns {*}
         */
        n.htmlEncode = function(str){
            var entities = [
                ['&', 'amp'],
                ['\'', 'apos'],
                ['\'', '#x27'],
                ['/', '#x2F'],
                ['\'', '#39'],
                ['/', '#47'],
                ['<', 'lt'],
                ['>', 'gt'],
                [' ', 'nbsp'],
                ['"', 'quot']
            ];

            for (var i = 0, max = entities.length; i < max; ++i)
                str = str.replace(new RegExp(entities[i][0]+';', 'gi'), entities[i][1]);

            return str;
        };

        /**
         * @returns {string}
         */
        n.className = function(){
            if(this.element !== null){
                return this.element.className;
            }
        }

        /**
         * Checking for active elements to be shown to the footer.
         */
        n.activeElement = function () {
            var
                r = neditor('.result-body'),ie;

            r.html('body');
            var i = neditor(textArea.document.body);
            ie = i.children();

            if(ie !== null){
                n.for({
                    start:0,
                    data:ie.length,
                    asoc:null,
                    callback:function(e){
                        if(typeof ie[e] !== 'undefined'){
                            var result = '',
                                child = ie[e],
                                parent,pn,cn,
                                e = neditor(child),
                                nm = e.name();

                            e.on('click',function(){
                                var nm =  neditor(this),
                                    tn = nm.name(),
                                    parent = nm.parent(),c;

                                parent = neditor(parent).name();

                                result = parent+' > '+tn;

                                c = nm.children();

                                r.html(result);
                                n.for({
                                    start:0,
                                    data:c.length,
                                    asoc:false,
                                    callback:function(v){
                                        var e = c[v], result = '',nms;

                                        if(typeof e !== 'undefined'){
                                            e = neditor(e);
                                            nm = e.name();
                                            result += nm;
                                            r.html( parent+' > '+tn+' > '+result);

                                            c = e.children();

                                            n.for({
                                                start:0,
                                                data:c.length,
                                                asoc:false,
                                                callback:function(v){
                                                    var e = c[v], result = '';

                                                    if(typeof e !== 'undefined'){
                                                        e = neditor(e);
                                                        nms = e.name();
                                                        result += nms;
                                                        r.html( parent+' > '+tn+' > ' +
                                                            ''+nm+' > '+result);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            }
        };

        /**
         * Retrieve element tagname.
         * @returns {string}
         */
        n.name = function(){
            return this.element.tagName.toLowerCase();
        };

        /**
         * It's enables some element.
         */
        n.onWritting = function () {

            var
                t = textArea.document.body,

                els = elements.innerElements,

                elems = elements.elm,e,er = neditor('.error-log'),
                tx = t.innerHTML,
                mt = config.placeholder;

            t.onkeyup = function () {

                if(n.isNullEditorArea()){


                    // hide error message once the error is fixed. else,
                    // continue showing the error till it fixed
                    if(er.element !== null){
                        er.hide(null,1000);
                    }

                    // removed elements with id of disable and apply event to,
                    // be fired to them.
                    n.for({
                        start:0,
                        data:els,
                        asoc:true,
                        callback:function(i){
                            e = neditor(i);

                            if (e !== null){
                                e.rAttr('id');

                                switch (i){

                                    case '.ft-strikethrough':
                                        e.on('click',function(){
                                            n.strikeThrough();
                                        });
                                        break;

                                    case '.ft-subscript':
                                        e.on('click',function(){
                                            n.subScript();
                                        });
                                        break;

                                    case '.ft-superscript':
                                        e.on('click',function(){
                                            n.superScript();
                                        });
                                        break;

                                    case '.ft-underline':
                                        e.on('click',function(){
                                            n.underline();
                                        });
                                        break;

                                    case '.linethrough':
                                        e.on('click',function(){
                                            n.strikeThrough();
                                        });
                                        break;

                                    case '.ft-italic':
                                        e.on('click',function () {
                                            n.italic();
                                        });
                                        break;

                                    case '.italic':
                                        e.on('click',function () {
                                            n.italic();
                                        });
                                        break;

                                    case '.ft-bold':
                                        e.on('click',function(){
                                            n.bold();
                                        });
                                        break;

                                    case '.bold':
                                        e.on('click',function(){
                                            n.bold();
                                        });
                                        break;

                                    case '.select-menu':
                                        e.on('click',function () {
                                            n.selectAll();
                                        });
                                        break;

                                    case '.cut-menu':
                                        e.on('click',function () {
                                            n.cut();
                                        });
                                        break;

                                    case '.copy-menu':
                                        e.on('click',function () {
                                            n.copy();
                                        });
                                        break;

                                    case '.redo-menu':
                                        e.on('click',function () {
                                            n.redo();
                                        });
                                        break;

                                    case '.redo':
                                        e.on('click',function () {
                                            n.redo();
                                        });
                                        break;

                                    case '.undo-menu':
                                        e.on('click',function(){
                                            n.undo();
                                        });
                                        break;

                                    case '.undo':
                                        e.on('click',function(){
                                            n.undo();
                                        });
                                        break;

                                    case '.new-doc':

                                        e.on('click',function () {
                                            neditor('.textArea').newDoc();
                                        });

                                        break;

                                    case '.save-as':

                                        e.on('click',function () {
                                            n.saveAs();
                                        });

                                        break;

                                    case '.print':

                                        e.on('click',function () {
                                            n.printDoc();
                                        });

                                        break;
                                }
                            }
                        }
                    });

                    // disabled enabled elements
                    n.disableElements(elems);

                    var box = neditor('#narea'),
                        frame = neditor(textArea.document.body).html();

                    if(box.element !== null){
                        box.value(frame);
                    }
                }
                else if(n.strMatch(tx,mt)){

                    // showing error message when text area,
                    // is null or invalid character
                    if(er.element !== null){
                        er.show(null,1000);
                        er.html("<p>Text field is empty or the first " +
                            "character is not valid. Remove space if presence. </p>"+message.icon);
                    }

                    // some elements by default haven't a disabled id,
                    // so return them to normal
                    n.for({
                        start:0,
                        data:els,
                        asoc:true,
                        callback:function(i){
                            e = neditor(i);

                            if(e !== null){

                                e.on("click",function () {
                                    return false;
                                });

                                e.attr('id','disabled');

                                if(i === '.paste-menu'){
                                    e.rAttr("id");
                                    e.on("click",function () {
                                        n.paste();
                                        return true;
                                    });
                                }

                                if(i === '.new-doc'){
                                    e.rAttr("id");
                                    e.on("click",function () {
                                        neditor('.textArea').newDoc();
                                        return true;
                                    });
                                }

                            }
                        }
                    });

                    // disabled enabled elements
                    n.disableElements(elems);
                }

            };

            t = neditor('.topic-title');

            if(t.element !== null){
                t.on('keyup',function(){
                    t = neditor(this).value();
                    neditor(this).value(n.forbidenCharacters(t));
                });
            }
        };

        n.forbidenCharacters = function(text){
            var t = text;

            t = t.replace('"',"'");
            t = t.replace(')',"");
            t = t.replace('(',"");
            t = t.replace('%',"");
            t = t.replace('&',"");
            t = t.replace('^',"");
            t = t.replace('#',"");
            t = t.replace('!',"");
            t = t.replace('~',"");
            t = t.replace('`',"");
            t = t.replace('=',"");
            t = t.replace('+',"");
            t = t.replace('$',"");
            t = t.replace('-',"");
            t = t.replace('_',"");

            return t;
        };

        /**
         * checking if the editor is null or has invalid character.
         * @returns {boolean}
         */
        n.isNullEditorArea = function () {
            var
                t = textArea.document.body.innerHTML.trim();

            return config.match.test(t.charAt(0));
        };

        /**
         * It disables the elements witch has the value or id of disabled.
         * @param elem
         */
        n.disableElements = function(elem){
            var e,i;
            n.for({
                start:0,
                data:elem,
                asoc:true,
                callback:function(i){
                    e = neditor(i);
                    e.style({"opacity":0,"display":'none'});
                    n.toggleOffEditorElement(elem);
                }
            });
        };

        /**
         * It's install default text in the editor if it null.
         */
        n.isNull = function () {
            if(config.editableContents !== null && config.editableContents !== ''){
                neditor(textArea.document.body).html(config.editableContents);
                setTimeout(function(){
                    var e  = neditor('.textArea');
                    e.element.focus();
                },200);
            }
            else
                textArea.document.body.innerHTML
                    = config.placeholder;
        };

        /**
         * keyboard key listener.
         */
        n.keys = function () {
            window.addEventListener("keypress",function (e) {

                /**
                 * make new document
                 */
                if(e.shiftKey && e.charCode === 78){
                    neditor(".textArea").newDoc();
                }

                /**
                 * close editor
                 */
                if(e.shiftKey && e.charCode === 81){
                    neditor('.neditor').hide('.neditor-shadow',100);
                }

                /**
                 * save document, not supported in all browser
                 */
                if(e.shiftKey && e.charCode === 83){
                    if(n.isNullEditorArea()){
                        n.saveAs();
                    }else{
                        n.error("Empty document: You can't save an empty document.")
                    }
                }

                /**
                 * print document
                 */
                if(e.shiftKey && e.charCode === 80){
                    n.printDoc();
                }

                // toggle expand editor
                if(e.shiftKey && e.charCode === 70){
                    var ee = neditor('.new-thread');
                    if(ee.element === null){
                        neditor('.full-mode').expand();
                    }else{
                        ee.expand();
                    }
                }

                /**
                 * Show contents preview.
                 */
                if(e.ctrlKey && e.altKey && e.charCode === 112){
                    n.preview();
                }

                /**
                 * Show color picker.
                 */
                if(e.altKey && e.charCode === 120){
                    n.picker.picker();
                }

                /**
                 * Show media.
                 */
                if(e.ctrlKey && e.altKey && e.charCode === 109){
                    n.hiddenContents('.hidden-shadow');
                    n.hiddenContents('.hidden-contents');
                    n.media.mShower();
                }

                /**
                 * Show emojies
                 */
                if(e.ctrlKey && e.altKey && e.charCode === 101){
                    n.emojiWrapperToggle('.emoji');
                }

                /**
                 * Show blocks.
                 */
                if(e.ctrlKey && e.altKey && e.charCode === 98){
                    n.each(['.show-blocks',
                        '.hide-blocks'],function(e){
                        var e = neditor(e);
                        if(e.element !== null){
                            neditor(e.element).showBlocks();
                        }
                    });
                }

                /**
                 * Create a link.
                 */
                if(e.altKey && e.charCode === 108){
                    n.hiddenContents('.hidden-contents');
                    n.hiddenContents('.hidden-shadow');
                    n.link.linkConfig();
                }

                /**
                 * insert special characters
                 */
                if(e.altKey && e.charCode === 99){
                    n.hiddenContents('.hidden-contents');
                    n.hiddenContents('.hidden-shadow');
                    n.specialCharacters.showChars({
                        element:'.hidden-contents',
                        title:null,
                        content:null});
                }

                /**
                 * style bold
                 */
                if(e.shiftKey && e.charCode === 66){
                    var sel = textArea.getSelection().toString(),ee;

                    if(sel !== null && sel !== ''){
                        n.bold();
                    }else{
                        ee = neditor('.error-log');
                        ee.show(null,null);
                        ee.html('Please select the contents that you want to bold.'+
                            message.icon)
                    }
                }

                /**
                 * style italic.
                 */
                if(e.shiftKey && e.charCode === 73){
                    var sel = textArea.getSelection().toString(),ee;

                    if(sel !== null && sel !== ''){
                        n.italic();
                    }else{
                        ee = neditor('.error-log');
                        ee.show(null,null);
                        ee.html('Please select the contents that you want to italic.'+
                            message.icon)
                    }
                }

                /**
                 * style underline.
                 */
                if(e.altKey && e.charCode === 85){
                    var sel = textArea.getSelection().toString(),ee;

                    if(sel !== null && sel !== ''){
                        n.underline();
                    }else{
                        ee = neditor('.error-log');
                        ee.show(null,null);
                        ee.html('Please select the contents that you want to underline.'+
                            message.icon)
                    }
                }

                /**
                 * Strikethrough text.
                 */
                if(e.shiftKey && e.charCode === 68){
                    var sel = textArea.getSelection().toString(),ee;

                    if(sel !== null && sel !== ''){
                        n.strikeThrough();
                    }else{
                        ee = neditor('.error-log');
                        ee.show(null,null);
                        ee.html('Please select the contents that you want to' +
                            ' strikethrough.'+
                            message.icon)
                    }
                }

                /**
                 * Toggle source code.
                 */
                if(e.shiftKey && e.charCode === 67){
                    var nn = neditor('.sourceCode'),
                        r = nn.className(),
                        r = r.split(' '),
                        r = r[1];

                    eval('n.'+[r]+'(".'+r+'")');
                }

                /**
                 * insert horizontal rule.
                 */
                if(e.shiftKey && e.charCode === 72){
                    n.horizontalRule();
                }

                /**
                 * Superscript text.
                 */
                if(e.ctrlKey && e.charCode === 49){
                    var sel = textArea.getSelection().toString(),ee;

                    if(sel !== null && sel !== ''){
                        n.superScript();
                    }else{
                        ee = neditor('.error-log');
                        ee.show(null,null);
                        ee.html('Please select the contents that you want to' +
                            ' superscript.'+
                            message.icon)
                    }
                }

                /**
                 * Subscript text.
                 */
                if(e.ctrlKey && e.charCode === 50){
                    var sel = textArea.getSelection().toString(),ee;

                    if(sel !== null && sel !== ''){
                        n.subScript();
                    }else{
                        ee = neditor('.error-log');
                        ee.show(null,null);
                        ee.html('Please select the contents that you want to' +
                            ' subscript.'+
                            message.icon)
                    }
                }

                /**
                 * Insert code.
                 */
                if(e.ctrlKey && e.charCode === 51){
                    n.code();
                }

                /**
                 * Toggle shorcut window.
                 */
                if(e.ctrlKey && e.altKey && e.charCode === 104){
                    n.hiddenContents('.hidden-shadow');
                    n.shortCuts.shorts();
                }

            },false);
        };

        /**
         * @type {{linkConfig: neditor.link.linkConfig,
         * insertLink: neditor.link.insertLink}}
         */
        n.link =  {
            linkConfig:function () {
                var link = {},wrapper,b;

                wrapper = '<section class="link-container">' +
                    '<section class="title"><p>Address</p></section>' +
                    '<section class="contents">' +
                    '<section class="input">' +
                    '<input type="text" ' +
                    'placeholder="Enter a url for your link' +
                    '" autocomplete="off" class="linki">' +
                    '</section>' +
                    '<section class="button">' +
                    '<section class="button-lnk">Insert</section>' +
                    '</section>' +
                    '</section>' +
                    '</section>';

                link = {
                    element:'.hidden-contents',
                    title:'Insert A link',
                    content:wrapper
                };

                n.specialCharacters.showChars(link);

                b = neditor('.button-lnk');
                if(b !== null){
                    b.on('click',function () {
                        n.link.insertLink();
                    });
                }

                neditor('.linki').value(textArea.getSelection());
            },

            insertLink:function () {
                var s = neditor('.link-container >.title > p'),
                    i = neditor('.linki'),
                    b = neditor('.button-lnk'),
                    regx = /[a-z0-9\/-_]/gi,l;

                if(i.value() === '' && !regx.test(i.value().charAt(0))){
                    s.style({'color':'rgba(212,94,127,1)'});
                    neditor(i).style({'border-color':'rgba(212,94,127,1)'});
                    s.html('Please enter a link.');
                }else{
                    neditor(b).on('click',function () {
                        return false;
                    });
                    neditor(b).loader({css:'width:30px;height:30px;'});
                    n.execute('createLink',i.value(),null);

                    b.on('click',function () {
                        n.link.insertLink();
                    });
                    b.html('Insert');
                    n.hiddenContents('.hidden-contents');

                    buttonValues.link = 0;
                    l = neditor('.link');
                    l.style({'background':'transparent','border':'none'});

                    neditor('.hidden-shadow').hide(null,100);
                }

            }
        };

        /**
         * unlink linked content.
         */
        n.unlink = function () {
            n.execute('unlink',textArea.getSelection(),null);
        };

        /**
         * select all contents.
         */
        n.selectAll = function () {
            var text = "",innerDoc = textArea.document;

            if (innerDoc.getSelection) {
                if (innerDoc.activeElement )
                {
                    var text = innerDoc.activeElement.innerText;
                    text = text.substring (innerDoc.activeElement.selectionStart,
                        innerDoc.activeElement.selectionEnd);
                }
                else {
                    var selRange = innerDoc.getSelection ();
                    text = selRange.toString ();
                }
            }


            else if
            (innerDoc.selection.createRange) {
                var range = innerDoc.selection.createRange ();
                text = range.text;
            }

            n.execute('selectAll',null,' Please use Ctrl+A insted');
        };

        /**
         * print document.
         */
        n.printDoc = function () {
            n.execute('print','file.txt',
                null);
        };

        /**
         * save contents.
         */
        n.saveAs = function () {
            n.execute('saveAs','file.txt',null);
        };

        /**
         * paste contents
         */
        n.paste = function () {
            var text = '';


            if(internalCopy!== null && internalCut === ''){
                text= internalCopy;
            }

            if(internalCut!== null && internalCopy === ''){
                text  = internalCut;
            }

            if(!textArea.document.execCommand('paste',false,text)){
                textArea.document.execCommand('insertHTML',false,text)
            }
        };

        /**
         * undo contents
         */
        n.undo = function () {
            n.execute('undo',null,
                'Please use Ctrl+Z instead');
        };

        /**
         * redo contents
         */
        n.redo = function () {
            n.execute('redo',null,
                'Please use Ctrl+Y instead');
        };

        /**
         * cut contents
         */
        n.cut = function () {

            var t =
                    textArea.getSelection().toString(),
                na = neditor('#narea');

            if(!textArea.document.execCommand('cut',false,t)){
                na.value(t);

                internalCut = t;

                na.element.select();

                textArea.document.body.innerText.replace(t,'');
            }

            neditor('.textArea').element.focus();
            internalCopy = '';
            na.value('');

        };

        /**
         * copy contents.
         */
        n.copy = function () {

            var t =
                    textArea.getSelection().toString(),
                na = neditor("#narea");

            if(!textArea.document.execCommand('copy',false,t)){
                na.value(t);
                internalCopy = t;
                na.element.select();
            }

            na.value('');
            internalCut = '';

        };

        /**
         * bold contents
         */
        n.bold = function () {
            var t =
                neditor('.bold');
            if(buttonValues.bold > 0
                && buttonValues.bold < 2){
                buttonValues.bold = 0;
                t.style({'background':'transparent','border':'transparent'});
            }else{
                buttonValues.bold = 1;
                t.style({'background':'rgb(255, 255, 255',
                    'border': '1px solid rgba(100,100,100,.2)'});
            }

            n.execute('bold',null,null)
        };

        /**
         * italic contents
         */
        n.italic = function () {
            var t =
                neditor('.italic');
            if(t.element !== null){
                if(buttonValues.italic > 0
                    && buttonValues.italic < 2){
                    buttonValues.italic = 0;
                    t.style({'background':'transparent','border':'none'});
                }else{
                    buttonValues.italic = 1;
                    t.style({'background':'rgb(255, 255, 255)','border':'1px solid rgba(100,100,100,.2)'});
                }

                n.execute('italic',null,null);
            }
        };

        /**
         * underline ocntents.
         */
        n.underline = function () {
            n.execute('underline',null,null)
        };

        /**
         * Insert horizontal rule.
         */
        n.horizontalRule = function () {
            n.execute('insertHorizontalRule',null,null)
        };

        /**
         * strike through contents
         */
        n.strikeThrough = function () {
            var t =
                neditor('.linethrough');
            if(buttonValues.strikeThrougn > 0
                && buttonValues.strikeThrougn < 2){
                buttonValues.strikeThrougn = 0;
                t.style({'background':'transparent','border':'none'});
            }else{
                buttonValues.strikeThrougn = 1;t.style({'background':'rgb(255, 255, 255)','border':'1px solid rgba(100,100,100,.2)'});
            }

            n.execute('strikeThrough',null,null)
        };

        /**
         * superscript contents
         */
        n.superScript = function () {
            n.execute('superscript',null,null)
        };

        /**
         * subscript contents
         */
        n.subScript = function () {
            n.execute('subscript',null,null)
        };

        /**
         * Remove format.
         */
        n.removeFormat = function () {
            var t =
                neditor('.remove-format');
            if(buttonValues.removeFormat > 0
                && buttonValues.removeFormat < 2){
                buttonValues.removeFormat = 0;
                buttonValues.strikeThrougn = 1;
                t.style({'background':'transparent','border':'none'});
            }else{
                buttonValues.removeFormat = 1;
                buttonValues.strikeThrougn = 1;
                t.style({'background':'rgb(255, 255, 255)','border':'1px solid rgba(100,100,100,.2)'});
            }

            n.execute('removeFormat',null,null)
        };

        /**
         * Insert ordered list.
         */
        n.orderList = function () {
            var t =
                neditor('.Insert-remove-ol');
            if(buttonValues.orderlist > 0
                && buttonValues.orderlist < 2){
                buttonValues.orderlist = 0;
                t.style({'background':'transparent','border':'none'});
            }else{
                buttonValues.orderlist = 1;
                t.style({'background':'rgb(255, 255, 255)','border':'1px solid rgba(100,100,100,.2)'});
            }

            n.execute('insertOrderedList',null,null)
        };

        /**
         * Insert undered list.
         */
        n.unOrderList = function () {
            var t =
                neditor('.Insert-remove-ul');
            if(buttonValues.unorderlist > 0
                && buttonValues.unorderlist < 2)
            {
                buttonValues.unorderlist = 0;
                t.style({'background':'transparent','border':'none'});
            }
            else{
                buttonValues.unorderlist = 1;
                t.style({'background':'rgb(255, 255, 255)',
                    'border':'1px solid rgba(100,100,100,.2)'});
            }

            n.execute('insertUnorderedList',null,null);
        };

        /**
         * Align left contents
         */
        n.alignLeft = function () {
            var
                t = neditor('.align-left'),
                t0 = ['.align-center','.align-right','.align-justify'];

            if(buttonValues.alignLeft > 0
                && buttonValues.alignLeft < 2){
                buttonValues.alignLeft = 0;
                t.style({'background':'transparent',
                    'border':'none'});
            }else{
                buttonValues.alignLeft = 1;
                t.style({'background':'rgb(255, 255, 255)',
                    'border':'1px solid rgba(100,100,100,.2)'});


                buttonValues.alignCenter = 0;
                buttonValues.alignRight = 0;
                buttonValues.alignJustfy = 0;

                n.each(t0,function(v){
                    neditor(v).style({'background':'transparent','border':'none'});
                });
            }

            n.execute('justifyLeft',null,null)
        };

        /**
         * Align center contents
         */
        n.alignCenter = function () {
            var
                t = neditor('.align-center'),
                t0 = ['.align-left','.align-right','.align-justify'];

            if(buttonValues.alignCenter > 0
                && buttonValues.alignCenter < 2){
                buttonValues.alignCenter = 0;
                t.style({'background':'transparent',
                    'border':'none'});
            }else{
                buttonValues.alignCenter = 1;
                t.style({'background':'rgb(255, 255, 255)',
                    'border':'1px solid rgba(100,100,100,.2)'});


                buttonValues.alignLeft = 0;
                buttonValues.alignRight = 0;
                buttonValues.alignJustfy = 0;

                n.each(t0,function(v){
                    neditor(v).style({'background':'transparent','border':'none'});
                });
            }

            n.execute('justifyCenter',null,null)
        };

        /**
         * Align right contents
         */
        n.alignRight = function () {
            var
                t = neditor('.align-right'),
                t0 =  ['.align-center','.align-left','.align-justify'];

            if(buttonValues.alignRight > 0
                && buttonValues.alignRight < 2){
                buttonValues.alignRight = 0;
                t.style({'background':'transparent',
                    'border':'none'});
            }else{
                buttonValues.alignRight = 1;
                t.style({'background':'rgb(255, 255, 255)',
                    'border':'1px solid rgba(100,100,100,.2)'});

                buttonValues.alignLeft = 0;
                buttonValues.alignCenter = 0;
                buttonValues.alignJustfy = 0;

                n.each(t0,function(v){
                    neditor(v).style({'background':'transparent','border':'none'});
                });
            }

            n.execute('justifyRight',null,null)
        };

        /**
         * Align left contents
         */
        n.alignJustfy= function () {
            var
                t = neditor('.align-justify'),
                t0 =  ['.align-center','.align-left','.align-right'];

            if(buttonValues.alignJustfy > 0
                && buttonValues.alignJustfy < 2){
                buttonValues.alignJustfy = 0;
                t.style({'background':'transparent',
                    'border':'none'});
            }else{
                buttonValues.alignJustfy = 1;
                t.style({'background':'rgb(255, 255, 255)',
                    'border':'1px solid rgba(100,100,100,.2)'});


                buttonValues.alignLeft = 0;
                buttonValues.alignCenter = 0;
                buttonValues.alignRight = 0;

                n.each(t0,function(v){
                    neditor(v).style({'background':'transparent','border':'none'});
                });
            }

            n.execute('justifyFull',null,null)
        };

        /**
         * indent an element/Text.
         */
        n.indent = function () {
            var
                t = neditor('.indent'),
                od = neditor('.outdent');

            if(buttonValues.indent > 0
                && buttonValues.indent < 2){
                buttonValues.indent = 0;
                t.style({'background':'transparent',
                    'border':'none'});
            }else{
                buttonValues.indent = 1;
                t.style({'background':'rgb(255, 255, 255)',
                    'border':'1px solid rgba(100,100,100,.2)'});

                buttonValues.outdent = 0;
                od.style({'background':'transparent','border':'none'});
            }

            n.execute('indent',null,null)
        };

        /**
         * outdent the indent element of text.
         */
        n.outDent = function () {
            var t = neditor('.outdent'),
                id = neditor('.indent');

            if(buttonValues.outdent > 0
                && buttonValues.outdent < 2){
                buttonValues.outdent = 0;
                t.style({'background':'transparent',
                    'border':'none'});
            }else{
                buttonValues.outdent = 1;
                buttonValues.indent = 0;
                t.style({'background':'rgb(255, 255, 255)',
                    'border':'1px solid rgba(100,100,100,.2)'});

                id.style({'background':'transparent','border':'none'});

            }

            n.execute('outdent',null,null)
        };

        /**
         * Set code of an element.
         */
        n.code = function () {
            var t = textArea.document.getSelection();

            n.execute('insertHTML','<code>'+t,null);

        };

        /**
         * Install element to the editor area.
         * @param value
         */
        n.format = function (value) {
            n.execute('formatBlock',value,null)
        };

        /**
         * Set font family of an element.
         * @param value
         */
        n.fontFamily = function (value) {
            n.execute('fontName',value,null)
        };

        /**
         * Set font size of an element.
         * @param value
         */
        n.fontSize = function (value) {
            n.execute('fontSize',value,null)
        };

        /**
         * Make new document.
         */
        n.newDoc = function () {
            if(this.element !== null){
                var i,e,
                    els = elements.innerElements;


                this.eraser();
                this.element.focus();
                this.for({
                    start:0,
                    data:els,
                    asoc:true,
                    callback:function(i){
                        e = neditor(i);

                        if(e !== null){
                            e.attr('id','disabled');

                            if(i === '.new-doc') {
                                e.rAttr("id");
                            }

                            if(els[i] === '.paste-menu') {
                                e.rAttr("id");
                            }
                        }
                    }
                });
            }
        };

        /**
         * show editor context.
         * @param ee
         */
        n.emojiWrapperToggle = function (ee) {
            var
                el = neditor('.emoji-wrapper'),
                e = neditor(ee).parent(),
                e = neditor(e);

            if(typeof e === 'undefined'){
                e = neditor(ee);
                e = e.parent();
            }

            if(el.element !== null){

                if(el.element.style.display === 'block'){
                    e.style({'background':'transparent',
                        'border':'none'});
                    el.hide(null,1000);

                }else{
                    e.style({'background':'rgb(255, 255, 255)',
                        'border':'1px solid rgba(100,100,100,.2)'});

                    el.show(null,100);

                    n.each('.icn-h',function (value) {
                        var
                            id = neditor(value).attr('id',null);

                        switch (id){
                            case 'people':
                                /**
                                 * initializing emojies
                                 */
                                n.emoji.showEmojies({
                                    query:'action=getEmojies&f='+id
                                });
                                neditor('#'+id).attr('class','active');
                                break;
                        }

                        neditor(value).on('click',function () {
                            var
                                id = neditor(this).attr('id',null);

                            /**
                             * remove all active elements
                             */
                            n.each('.active',function (val) {
                                neditor(val).attr('class','.icn-h');
                                neditor('#'+id).attr('class','active');
                            });

                            /**
                             * initializing emojies
                             */
                            n.emoji.showEmojies({
                                query:'action=getEmojies&f='+id
                            });
                        });

                    });
                }
            }
        };

        /**
         * Shortcuts window.
         * @type {{template: neditor.shortCuts.template, shorts: neditor.shortCuts.shorts}}
         */
        n.shortCuts = {

            template:function(){
                var shorts = [
                    '<section class="shorts-container">' +
                    '<section class="desc-ned">' +
                    '<p><b>NEDITOR</b> Shortcuts Lists</p>' +
                    '</section>' +

                    '<section class="cmd-list">' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Create new document</b>' +
                    ' <b>Shift+N</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Save document</b> <b>Shift+S</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Print document</b> <b>Shift+P</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Toggle full screen mode</b> ' +
                    '<b>Shift+F</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Toggle color picker</b>' +
                    ' <b>Alt+X</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Exit editor window</b> ' +
                    '<b>Shift+Q</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Redo</b> <b>Ctrl+Y</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Undo</b> <b>Ctrl+Z</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Copy</b> <b>Ctrl+C</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Cut</b> <b>Ctrl+X</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Paste</b> <b>Ctrl+V</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Select all</b> <b>Ctrl+A</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Create a link</b> <b>Alt+L</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Insert emoji</b>' +
                    ' <b>Ctrl+Alt+E</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Insert media/docs/file</b>' +
                    ' <b>Ctrl+Alt+M</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Insert special characters</b>' +
                    ' <b>Alt+C</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Style <b>bold</b> text</b>' +
                    ' <b>Shift+B</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Style <i>italic</i> text</b>' +
                    ' <b>Shift+I</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Style <u>underline</u> text</b>' +
                    ' <b>Alt+U</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Insert horizontal line</b>' +
                    ' <b>Shift+H</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Strike through <del>text</del></b>' +
                    ' <b>Shift+D</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Superscript text</b>' +
                    ' <b>Ctrl+1</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Subscript text</b>' +
                    ' <b>Ctrl+2</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Insert code element</b>' +
                    ' <b>Ctrl+3</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Show block contents</b>' +
                    ' <b>Ctrl+Alt+B</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Preview contents</b>' +
                    ' <b>Ctrl+Alt+P</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Toggle source code</b>' +
                    ' <b>Shift+C</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Toggle shortcuts window</b>' +
                    ' <b>Ctrl+Alt+H</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Remove format</b>' +
                    ' <b>Alt+R</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Insert ordered list</b>' +
                    ' <b>Alt+O</b>' +
                    '</section>' +

                    '<section class="cmd-holder">' +
                    '<i class="fa fa-terminal"></i> <b>Insert unordered list</b>' +
                    ' <b>Shift+U</b>' +
                    '</section>' +

                    '</section>' +
                    '</section>'
                ];

                return shorts[0];
            },

            shorts:function(){
                n.hiddenContents('.hidden-contents');
                n.specialCharacters.showChars({
                    element:'.hidden-contents',
                    content:n.shortCuts.template(),
                    title:'Neditor Shortcuts'
                });
            }
        };

        /**
         * @type {{table: neditor.createTableProperties.table,
         * closeContext: neditor.createTableProperties.closeContext,
         * propertiesHandler: neditor.createTableProperties.propertiesHandler,
         * DeleteTable: neditor.createTableProperties.DeleteTable,
         * InsertRow: neditor.createTableProperties.InsertRow,
         * TableProperties: neditor.createTableProperties.TableProperties,
          * DeleteRow: neditor.createTableProperties.DeleteRow}}
         */
        n.createTableProperties = {
            table:function(){

                var t = neditor(textArea.document.body),
                    te = t.children();

                n.for({
                    start:0,
                    data:te.length,
                    asoc:false,
                    callback:function(v){
                        var e = te[v];

                        if(typeof e !== 'undefined'){
                            var cn = neditor(e),
                                tn = cn.name(),
                                tcn = cn.className();

                            if(tn === 'table'){

                                t.on('scroll',function (ev) {
                                    n.createTableProperties.closeContext();
                                });

                                var tns = cn.firstChild(),
                                    tns = neditor(tns).children();

                                n.for({
                                    start:0,
                                    data:tns.length -1,
                                    asoc:false,
                                    callback:function(i){
                                        var e = tns[i],cr,d,c,h;

                                        neditor(e).on('contextmenu',function(){
                                            cr = this.rowIndex;
                                            dataWrapper({te:te,cn:cn,v:v,cr:cr});
                                        });

                                        function dataWrapper(obj){
                                            e = neditor(cn);

                                            d = document.createElement('section');
                                            c = neditor('.neditor-closeer').after(d);
                                            h = neditor(d);

                                            neditor(d).attr('class','tnv-context');

                                            if(h.element !== null){

                                                if(context.tableRule < 1){
                                                    h.html(context.tableValue);
                                                    context.tableRule++;
                                                    var of = cn.offset(),
                                                        ee = neditor('.tnv-context');

                                                    var top = of.top+ee.offset().height;
                                                    ee.style({'margin-top':top+'px',
                                                        'margin-left':of.left+'px'});

                                                    n.createTableProperties.propertiesHandler(obj);
                                                }else{
                                                    n.createTableProperties.closeContext();
                                                }
                                            }
                                        }
                                    }
                                });

                            }else{
                                // t.on('contextmenu',function () {
                                //     return false;
                                // })
                            }
                        }
                    }
                });
            },

            closeContext:function(){
                var cc = neditor('.neditor').children();

                n.for({
                    start:0,
                    data:cc.length,
                    asoc:false,
                    callback:function(i){
                        var c = cc[i];

                        if(typeof c !== 'undefined'){
                            var c = neditor(c).className();
                            if(c === 'tnv-context'){
                                n.each('.tnv-context',function(e){
                                    neditor('.tnv-context').removeElement(i);
                                });

                                context.tableRule = 0;
                            }
                        }
                    }
                });
            },

            propertiesHandler:function(table){
                var e = neditor('.tnv-context'),
                    ec = e.children(),cn;

                n.for({
                    start:0,
                    data:ec.length,
                    asoc:false,
                    callback:function(i){
                        e = ec[i];

                        if(typeof e !== 'undefined'){
                            e = neditor(e),
                                cn = e.children();

                            n.for({
                                start:0,
                                data:cn.length,
                                asoc:false,
                                callback:function(x){
                                    if(typeof cn[x] !== 'undefined'){
                                        var el = neditor(cn[x]);
                                        el.on('click',function(){
                                            var ch = neditor(this),
                                                c = ch.children(),
                                                c = c[1];

                                            c = neditor(c).firstChild();
                                            c = neditor(c).html();

                                            c = c.replace(' ','');

                                            switch (c){
                                                case 'TableProperties':
                                                    n.createTableProperties.TableProperties(table);
                                                    break;
                                                case 'InsertRow':
                                                    n.createTableProperties.InsertRow(table);
                                                    break;
                                                case 'DeleteTable':
                                                    n.createTableProperties.DeleteTable(table);
                                                    break;

                                                case 'DeleteRow':
                                                    n.createTableProperties.DeleteRow(table);
                                                    break;

                                            }

                                            n.createTableProperties.closeContext();
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            },

            DeleteTable:function(t){
                var p = neditor(t.cn),pe;

                p = t.cn.parent();
                pe = neditor(p).children();

                for(var k = pe.length-1;k >= 0;--k){
                    var tn = neditor(pe[k]).name();
                    if(tn === 'table'){
                        p.removeChild(pe[k]);
                    }
                }
            },

            InsertRow:function (t) {
                var p = neditor(t.cn),pe,td = '',style;

                p = t.cn.parent();
                pe = neditor(p).children();

                for(var k = pe.length-1;k >= 0;--k){
                    var tn = neditor(pe[k]).name();
                    if(tn === 'table'){
                        tn = pe[k];

                        var t = neditor(tn).lastChild();
                        t = neditor(t).lastChild();
                        t = neditor(t).children();

                        var e = tn.insertRow(0);
                        n.for({
                            start:0,
                            data:t.length-1,
                            asoc:false,
                            callback:function(k){
                                var td = e.insertCell(k),
                                    s = t[1].style;

                                neditor(td).style({
                                    'border':s.border,
                                    'width':s.width,
                                    'height':s.height,
                                    'background':s.background,
                                    'margin':s.margin,
                                    'padding':s.padding,
                                    'word-wrap':'break-word'
                                });
                            }
                        });
                    }
                }
            },

            TableProperties:function(t){
                n.table.properties();

                var pe,p,s,bdc;

                p = t.cn.parent();
                pe = neditor(p).children();

                for(var k = pe.length-1;k >= 0;--k){
                    var tn = neditor(pe[k]).name();
                    if(tn === 'table') {
                        tn = pe[k];

                        var t = neditor(tn).lastChild();
                        t = neditor(t).lastChild();
                        t = neditor(t).children();

                        n.for({
                            start: 0,
                            data: t.length - 1,
                            asoc: false,
                            callback: function (k) {
                                s = t[1].style,bdc = s.border.split('px')[0];

                                neditor('.tborder').value(bdc);
                                neditor('.twidth').value(s.width.split('px')[0]);
                                neditor('.theight').value(s.height.split('px')[0]);
                                neditor('.tBcolor').value(s.borderColor);
                                neditor('.tcellsp').value(s.margin.split('px')[0]);
                                neditor('.tcellpad').value(s.padding.split('px')[0]);
                                neditor('.tback').value(s.background);

                            }
                        });

                        n.createTableProperties.saveChanges(tn);

                    }
                }

            },

            saveChanges: function(tn){
                neditor('.ok-save-b').on('click',function(){
                    var
                        w = neditor('.twidth').value(),
                        h = neditor('.theight').value(),
                        sp = neditor('.tcellsp').value(),
                        tc = neditor('.tcellpad').value(),
                        bd = neditor('.tborder').value(),
                        bc = neditor('.tBcolor').value(),
                        tb = neditor('.tback').value(),
                        al = neditor('.tal').html(),
                        cp = neditor('.tcaption').value(),
                        bcc ='',cps,
                        wi ='',hi = '',bod ='',bac = '',marg = '',pad = '',ali;

                    if(cp !== ''){
                        cps = '<caption>'+cp+'</caption>';
                    }

                    if(w !== ''){
                        if(n.isNumber(h)){
                            wi = w+'px';
                        }else{
                            neditor('.twidth').style({
                                'border-color':'rgba(212,90,131,1)'
                            });
                            cAlert.renderAlertData('Error: Invalid Width Value',
                                'Sorry please enter only number in the box','OK');
                            return false;
                        }
                    }

                    if(h !== ''){
                        if(n.isNumber(h)){
                            hi = h+'px';
                        }else{
                            neditor('.theight').style({'border-color':'rgba(212,90,131,1)'});

                            cAlert.renderAlertData('Error: Invalid Height Value',
                                'Sorry please enter only number in the box','OK');
                            return false;
                        }
                    }

                    if(sp !== ''){
                        if(n.isNumber(sp)){
                            marg = sp+'px';
                        }else{
                            neditor('.tcellsp').style({'border-color':'rgba(212,90,131,1)'});
                            cAlert.renderAlertData('Error: Invalid Cell Spacing Value',
                                'Sorry please enter only number in the box','OK');
                            return false;
                        }
                    }

                    if(tc !== ''){
                        if(n.isNumber(tc)){
                            pad = tc+'px';
                        }else{
                            neditor('.tcellpad').style({'border-color':'rgba(212,90,131,1)'});
                            cAlert.renderAlertData('Error: Invalid Cell Padding Value',
                                'Sorry please enter only number in the box','OK');
                            return false;
                        }
                    }

                    if(bc !== ''){
                        bcc = bc;
                    }

                    if(bd !== '' && bc !== ''){
                        if(n.isNumber(bd)){
                            bod = bd+'px solid '+bcc;
                        }else{
                            neditor('.tborder').style({'border-color':'rgba(212,90,131,1)'});
                            cAlert.renderAlertData('Error: Invalid Border Value',
                                'Sorry please enter only number in the box','OK');
                            return false;
                        }
                    }

                    if(tb !== ''){
                        bac = tb;
                    }

                    if(al !== 'select'){
                        ali = al;
                    }

                    var chi = neditor(tn).firstChild(),
                        ch = neditor(chi).children();

                    n.for({
                        start:0,
                        data:ch.length - 1,
                        asoc:false,
                        callback:function(x){
                            if(typeof ch[x] !== 'undefined'){

                                var chs = neditor(ch[x]).children();

                                n.for({
                                    start:0,
                                    data:chs.length -1,
                                    asoc:false,
                                    callback:function(v){
                                        if(typeof chs[v] !== 'undefined'){
                                            var chd = neditor(chs[v]),
                                                nm = chd.name();
                                            if(nm.slice(0,1) !== 'br'){
                                                neditor(tn).style({
                                                    border:bod
                                                });
                                                chd.style({
                                                    background:bac,
                                                    margin:marg,
                                                    padding:pad,
                                                    border:bod,
                                                    align:ali,
                                                    width:wi,
                                                    height:hi
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });

                    setTimeout(function(){
                        n.table.cancelTable();
                    },200);
                });
            },

            DeleteRow:function(t){
                var tn = t.cn;
                var tn = tn.firstChild(),
                    tn = neditor(tn).children(),
                    e = tn[t.cr],
                    e = neditor(e).parent();

                e.removeChild(tn[t.cr]);
            }
        };

        /**
         * This method pass user contents to the editor,
         * if no null contents received.
         * @param contents
         */
        n.configs = function (contents) {
            if(n.isObject(contents)){
                let c = contents;
                if(typeof c.isClosable !== 'undefined' && c.isClosable !== null){
                    config.isClosable = c.isClosable;
                }

                if(typeof c.shadow !== 'undefined' && c.shadow !== null){
                    config.shadow = c.shadow;
                }

                if(typeof c.canExpand !== 'undefined' && c.canExpand !== null){
                    config.hasFullButton = c.canExpand;
                }

                if(typeof c.contents !== 'undefined' && c.contents !== null){
                    config.editableContents = c.contents;
                }

                if(typeof  c.hasTitle !== 'undefined' && c.hasTitle !== null){
                    config.hasTitle = c.hasTitle;
                }

                if(typeof c.defaultText !== 'undefined' && c.defaultText !== null){
                    config.defaultText = c.defaultText;
                }

                if(typeof c.placeholder !== 'undefined' && c.placeholder !== null){
                    config.placeholder = c.placeholder;
                }

                if(typeof c.title !== 'undefined' && c.title !== null){
                    config.topicTitle = c.title;
                }

		if(typeof c.file !== 'undefined' && c.file !== null){
                   config.ExtraContents = c.file;
		}
            }else{
                config.editableContents = contents;
            }
        };

        /**
         * it's center parsed element.
         */
        n.centerElement = function () {
            var e = this.element,
                ww = window.innerWidth,
                wh = window.innerHeight,
                ew = e.offsetWidth,
                eh = e.offsetHeight,
                appChecking = config.isNevaa,
                Wvalue = (ww/2) - (ew/2),
                nWvalue = '',
                nHvalue = (wh/2) - (eh/2);



            if(appChecking[0] === true){
                nWvalue = (ww/appChecking[1]) - (ew/2);
            }

            if(nWvalue == 'Infinity'){
                nWvalue = Wvalue;
            }else if(nWvalue === ''){
                nWvalue = Wvalue;
            }

            var e = neditor(e);
            if(ww > 800){
                e.style({'margin-left':nWvalue+'px'});
            }

            if(appChecking[2] === true){
                e.style({'margin-top':nHvalue+'px'});
            }

        };

        /**
         * @param e
         */
        n.hiddenContents = function (e) {
            n.toggle({
                element:e,
                shadow:null,
                time:100});
        };

        /**
         * This method works only the full button is enabled.
         */
        n.expand = function () {

            if (this.style().width > 910)
            {

                this.rAttr("class");
                this.attr("class",'new-thread n-thread');
                config.isFull = false;
                config.isNevaa[0] = false;
                config.isNevaa[2] = true;

                setTimeout(function ()
                {
                    n.centerElement();
                },400);


                neditor('body').style({'overflow-y':'auto'});
            }
            else{
                this.attr("class",'full-mode');

                config.isNevaa[0] = false;
                config.isNevaa[2] = true;
                config.isFull = true;
                this.centerElement();
                neditor('body').style({'overflow':'hidden'});
            }

        };

        /**
         *
         * @param obj
         * @returns {boolean}
         */
        n.isObject = function (obj) {

            if(Object.prototype.toString.call(obj) === '[object CSS2Properties]'){
                return Object.prototype.toString.call(obj)
                    === '[object CSS2Properties]';
            }

            return Object.prototype.toString.call(obj)
                === '[object Object]';
        };

        /**
         * @type {{mWrapper: neditor.media.mWrapper,
          * mShower: neditor.media.mShower,
         * mSelector: neditor.media.mSelector}}
         */
        n.media =  {
            mWrapper:function () {
                var container = '<section class="m-container">' +
                    '<section class="m-src">' +
                    '<section class="left">Source:</section>' +
                    '<section class="right">' +
                    '<input type="text" class="mselc" autocomplete="off" ' +
                    'placeholder="Enter file location ">' +
                    '<section class="src-selc" title="Browse File">' +
                    '<i class="fa fa-search-plus"></i></section>' +
                    '</section>' +
                    '</section>' +

                    '<section class="m-desc">' +
                    '<section class="left">Caption:</section>' +
                    '<section class="right">' +
                    '<input type="text" class="caption" autocomplete="off" ' +
                    'placeholder="Optional">' +
                    '</section>' +
                    '</section>' +

                    '<section class="m-dems">' +
                    '<section class="left">Dimension:</section>' +
                    '<section class="right">' +

                    //width

                    '<section class="left">' +
                    '<p>Width</p> ' +
                    '<input type="text" class="fWidth" placeholder="150">' +
                    '</section>' +

                    //height

                    '<section class="right">' +
                    '<p>Height</p><input type="text" class="fHeight"' +
                    ' placeholder="150">' +

                    // end of the height

                    '</section>' +
                    '</section>' +
                    '</section>' +

                    '<section class="m-orient">' +

                    '<section class="left">Alignment:</section>' +

                    '<section class="right">' +
                    '<section class="a-select">' +
                    '<section class="a-wrapper">-- <b style="font-weight: normal;">' +
                    'Select</b> ' +
                    '<i class="fa fa-angle-down"></i> --' +
                    '</section>' +

                    //menus

                    '<section class="al-menu">' +
                    '<ul>' +
                    '<li>Left</li>' +
                    '<li>Center</li>' +
                    '<li>Right</li>' +
                    '</ul>' +
                    '</section>' +
                    '</section>' +

                    '</section>' +
                    '</section>' +

                    //insert button

                    '<section class="insert-button">' +
                    '<section class="i-button">Cancel</section>' +
                    '<section class="i-button">Insert</section>' +
                    '</section>' +

                    '</section>';

                return container;
            },

            mShower:function () {
                n.specialCharacters.showChars(
                    {
                        title:'Insert Image/Video/Doc Files',
                        element:'.hidden-contents',
                        content:n.media.mWrapper()
                    }
                );


                var
                    aselect = neditor('.a-select'),
                    fsec = neditor('.src-selc');


                selectionToggle();

                /**
                 * file selection
                 */
                if(fsec.element !== null){
                    fsec.on('click',function(){
                        n.media.mSelector();
                    });
                }

                /**
                 * buttons handler
                 */
                n.each('.insert-button > section',function(v){
                    var e = neditor(v),ve;

                    e.on('click',function(){
                        e = neditor(this).html();
                        e = e.toLowerCase();

                        eval(e+'()');
                    });
                });

                /**
                 * file align selection toggle
                 */
                function selectionToggle(){
                    if(aselect.element !== null){
                        aselect.on('click',function(){
                            n.hiddenContents('.al-menu');

                            /**
                             * get selection list
                             */
                            n.each('.al-menu > ul > li',function(v){
                                var e = neditor(v);
                                if(e.element !== null){
                                    e.on('click',function(){
                                        var t = neditor(this).html(),
                                            vw = neditor('.a-wrapper > b');

                                        vw.html(t);
                                    });
                                }
                            });
                        });
                    }
                }

                /**
                 * cancel the media.
                 */
                function cancel(){
                    // erase input field.
                    n.each('.m-container > section > section > input',function(v){
                        neditor(v).value('');
                        neditor(v).style({'border-color':'rgba(100,100,100,.2)'});
                    });

                    // erase input field.
                    n.each('.m-container > section > section > section > input',
                        function(v) {
                            neditor(v).value('');
                            neditor(v).style({'border-color':'rgba(100,100,100,.2)'});
                        });

                    // reset default selection value.
                    neditor('.a-wrapper > b').html('Select');

                    // close the media insertion.
                    setTimeout(function(){
                        neditor('.hidden-contents').hide('.hidden-shadow',100);
                    },200);
                }

                /**
                 * Insert media file.
                 *
                 */
                function insert(){
                    var sec = neditor('.a-wrapper > b'),
                        s = sec.html(),
                        a = '',
                        d = neditor('.caption'),
                        f = neditor('.mselc'),
                        w = neditor('.fWidth'),
                        h = neditor('.fHeight');


                    // get selection value.
                    if(sec.element !== null
                        && s !== 'Select'){
                        s = s.toLowerCase();
                        a = 'align="'+s+'"';
                    }


                    // get descriptions
                    if(d !== null && d.value() !== ''){
                        d = d.value();
                    }
                    else{
                        d = un;
                    }

                    // get width
                    if(w !== null && w.value() !== '')
                    {
                        if(n.isNumber(w.value())){
                            w.style({'border-color':'rgba(66,153,115,1)'});
                            w = 'width=\''+w.value()+'\'';
                        }
                        else{
                            w.style({'border-color':'rgba(229,102,138,1)'});
                            cAlert.renderAlertData('Error Invalid Character',
                                'Please enter numbers only.',
                                'OK');
                            w = '';
                            return false;
                        }
                    }
                    else{
                        w = '';
                    }

                    // get height
                    if(h !== null && h.value() !== ''){
                        if(n.isNumber(h.value())){
                            h.style({'border-color':'rgba(66,153,115,1)'});
                            h = 'height=\''+h.value()+'\'';
                        }else{
                            h.style({'border-color':'rgba(229,102,138,1)'});
                            cAlert.renderAlertData('Error Invalid Character',
                                'Please enter numbers only.',
                                'OK');
                            h = '';
                            return false;
                        }
                    }
                    else{
                        h = '';
                    }

                    if(f !== null && f.value() !== ''){
                        var  ff = f.value(),ext,cn,lk,lkn,lks,path;
                        f.style({'border-color':'rgba(66,153,115,1)'});

                        // validate the url
                        if(!n.validateUrl(ff)){
                            cAlert.renderAlertData('Error Invalid Media Link',
                                'The link that you provided is not valid.' +
                                '<br> Please insert a valid url.',
                                'OK');
                            f.style({'border-color':'rgba(229,102,138,1)'});
                            return false;
                        }

                        lk = n.addr();

                        lkn = lk.url;

                        path = lk.path;

                        if(lk.domain.match('localhost')){
                            lks = lkn+path[1]+'/';
                        }else{
                            lks = lkn+path[1]+'/';
                        }

                        f = ff.split('.');

                        ext = f[f.length-1];

                        if(ext === 'jpg' || ext === 'JPG'
                            || ext === 'JPEG' || ext === 'jpeg' ||
                            ext === 'PNG' || ext === 'png' ||
                            ext === 'gif'){

                            cn =
                                '<img src=\''+ff+'\' '+a+" "+w+" "+h +" "+
                                'alt=\''+d+'\'/>';

                        }
                        else if(ext === 'mp4' || ext === 'webM' ||
                            ext === 'avi'||
                            ext === 'webm'){
                            cn =
                                '<video controls '+h+" "+w+" "+'><source ' +
                                'src=\''+ff+'\' ' +
                                'type=\'video/'+ext+'\'>' +
                                '</video>';
                        }
                        else if(ext === 'mp3' || ext === "wav"){
                            cn =
                                '<audio controls '+h+" "+w+" "+'><source ' +
                                'src=\''+ff+'\' ' +
                                'type=\'audio/'+ext+'\'>' +
                                '</audio>' ;
                        }
                        else if(ext === 'pdf'){

                            cn =
                                '<a href=\''+ff+'\' ' +
                                'onclick=\'return false\' ' +
                                'download><img ' +
                                'src=\''+lks+'/images/logos/pdf.png\' ' +a+" "+h+" "+w+
                                'alt=\''+d+'\'></a>';

                        }
                        else if(
                            ext === 'docx' || ext === 'doc'
                            || ext === 'dot' || ext === 'wbk'
                            || ext === 'docm'|| ext === 'dotx'
                            || ext === 'dotm'|| ext === 'docb'
                            || ext === 'xls' || ext === 'xlt'
                            || ext === 'xlm' || ext === 'xlsx'
                            || ext === 'xltx' || ext === 'xltm'
                            || ext === 'xlsb' || ext === 'xla'
                            || ext === 'xlam' || ext === 'xll'
                            || ext === 'xlw' || ext === 'ppt'
                            || ext === 'pot' || ext === 'pps'
                            || ext === 'pptx' || ext === 'pptm'
                            || ext === 'potx' || ext === 'potm'
                            || ext === 'ppam' || ext === 'ppsx'
                            || ext === 'ppsm' || ext === 'sldx'
                            || ext === 'sldm'){

                            cn =
                                '<a href=\''+ff+'\' ' +
                                'target=\'_blank\' ' +
                                'download><img ' +
                                'src=\''+lks+'/images/logos/doc.png\' ' +a+" "+h+" "+w+" "+
                                'alt=\''+d+'\'></a>';
                        }
                        else{
                            cAlert.renderAlertData("Error:: File Insertion ",
                                'An error occurred while trying to ' +
                                'insert your file. Please try again ' +
                                'later.',"OK");

                            return false;
                        }

                        var tx = textArea.document.body.innerHTML,
                            mt = config.placeholder;

                            //cn = JSON.stringify(cn);

                        // errase the textfield
                        if(n.strMatch(tx,mt) ||
                            tx.slice(0,4) === '<br>'){
                            n.eraser();

                            // insertion files
                            n.execute('insertHTML',cn,null);
                        }else{

                            // insertion files
                            n.execute('insertHTML',cn,null);
                        }


			config.ExtraContents = ff;

                        // erase fields
                        setTimeout(function(){
                            cancel();
                        },200);


                    }
                    else{
                        cAlert.renderAlertData('Error Invalid Media Link',
                            'Please insert a link or select a file from our file manager',
                            'OK');
                        f.style({'border-color':'rgba(229,102,138,1)'});
                    }
                }
            },

            mSelector:function () {
                n.namanager.showManager();
            }
        };

        /**
         * @type {{nwrapper: neditor.namanager.nwrapper,
          * showManager: neditor.namanager.showManager,
           * insertMedia: neditor.namanager.insertMedia}}
         */
        n.namanager = {

            /**
             * builder
             * @returns {*}
             */
            nwrapper:function () {

                if (typeof un == 'undefined'){
                    var un = '';
                }

                var
                    wr =[
                        '<section class="namanager-top-header">' +
                        '<section class="upper-manager">' +
                        '<section class="left"><p>Fmanager</p></section>' +
                        '<section class="left">' +
                        '<section class="nacancel">' +
                        '<i class="fa fa-times-circle"></i> Close</section>' +
                        '</section>' +
                        '</section>' +
                        '<section class="namanager-middle-top">' +
                        '<section class="na-container">' +
                        '<section class="left">' +
                        // left uploads
                        '<section class="upload-s">' +
                        '<section class="icn">' +
                        '<i class="fa fa-arrow-down"></i></section>' +
                        '<section class="tll">Upload</section>' +
                        '</section>' +

                        '<section class="download-s download-button">' +
                        '<section class="icn">' +
                        '<i class="fa fa-download"></i></section>' +
                        '<section class="tll">Download</section>' +
                        '</section>' +

                        '<section class="view-s view-button">' +
                        '<section class="icn">' +
                        '<i class="fa fa-eye"></i></section>' +
                        '<section class="tll">View</section>' +
                        '</section>' +

                        '</section>' +
                        '<section class="right"></section>' +
                        '</section>' +
                        '<section class="nam-options">' +
                        '<section class="fts">Insert</section>' +
                        '<section class="scs">Cancel</section>' +
                        '</section>' +
                        '</section>' +
                        '</section>' +
                        '<section class="namanager-body">' +
                        '<section class="namanager-side-header">' +
                        '<ul>' +

                        '<li>' +
                        '<section class="uwrapper">' +
                        '<i class="fa fa-user"></i> User' +
                        '<section class="ur">' +
                        '<i class="fa fa-chevron-circle-down"></i></section>' +
                        '</section>' +
                        '<ul>' +
                        '<li>' +
                        '<section class="unm">' +
                        '<i class="fa fa-user"></i> '+un+'</section>' +
                        '</li>' +
                        '</ul>' +
                        '</li>' +

                        '</ul>' +
                        '</section>' +
                        '<section class="namanager-container">' +
                        // files via ajax call
                        '</section>' +
                        '<input type="file" class="nam-file" style="display: none">' +
                        '</section>'];

                return wr[0];
            },

            /**
             * @type function
             */
            showManager:function () {
                var
                    e = neditor('.namanager'),lkn,lk,lks,path,c;

                n.hiddenContents('.namanager');
                e.html(n.namanager.nwrapper());

                lk = n.addr();

                lkn = lk.url;

                path = lk.path;

                if(lk.domain.match('localhost')){
                    lks = lkn+path[1]+'/'+path[2]+'/';
                }else if(path[1] === 'nedito.heroku.com'
                    || typeof path[2] !== 'undefined'
                    && path[2] === 'nexar'){
                    lks = lkn+path[1]+'/';
                }else{
                    lks = lkn;
                }

                c = neditor('.namanager-container');

                /**
                 * file initializations
                 */
                getFiles();

                /**
                 * upload files
                 */
                neditor('.upload-s').on('click',function () {
                    var file = neditor('.nam-file');
                    file.element.click();

                    file.on('change',function(){
                        var f = this.files[0];

                        if(f.size >= 6796966){

                        }

                        var xhr = new XMLHttpRequest(),
                            formdata = new FormData();

                        xhr.open("POST",lks+"includes/neditor.php");

                        xhr.upload.addEventListener('progress',function(e){
                            var s = neditor('.hidden-shadow');
                            s.show(null,100);
                            s.style({'z-index':1000,'width':100+'vw','height':100+'vh'});
                            s.loader();
                        });

                        xhr.addEventListener('load',function(e){
                            var r = JSON.parse(e.target.response),
                                s = neditor('.hidden-shadow'),con,cn,
                                i = neditor('.mselc');
                            s.show(null,100);
                            s.style({'z-index':400,'width':100+'%','height':100+'%'});

                            var st = r.status.split(':'),
                                dir = lks+r.path+st[1];

                            if(st[0] === 'uploaded') {

                                context.uploadedFile = r.path+st[1];

                                con = neditor('.namanager-container').html();
                                cn = '<section class="na-file-holder">' +
                                    '<section class="manager-img-holder actives ' +
                                    'uploaded">' +
                                    '<img src="' + dir +'" ' +
                                    'alt="' + un + '"/>' +
                                    '</section>' +
                                    '</section>';

                                c.html(cn + con);
                                s.hide(null,100);
                                if (i.element !== null) {
                                    setTimeout(function () {
                                        i.element.value = dir;
                                        neditor('.namanager').hide(null, 100);
                                    }, 400);
                                } else{
                                    setTimeout(function () {
                                        neditor('.namanager').hide(null, 100);
                                    }, 300);
                                }

                            }
                            else if(r[0] === 'failed'){
                                cAlert.renderAlertData("Error:: File Uploading Failed",
                                    r[1],"OK");
                            }
                            else{
                                cAlert.renderAlertData("Error:: File Uploading Failed",
                                    "Sorry an error occurred while trying to upload your file.<br>Please try again!","OK");
                            }
                        });

                        formdata.append('action','fileupload');
                        formdata.append('u',un);
                        formdata.append('files[]',f,f.name);

                        xhr.send(formdata);
                    });
                });

                /**
                 * close manager.
                 */
                neditor('.nacancel').on('click',function(){
                    neditor('.namanager').hide(null,100);
                });

                /**
                 * cancel uploaded image and delete.
                 */
                neditor('.scs').on('click',function(){

                    var i = neditor('.mselc'),
                        file = context.uploadedFile;

                    if(i.element !== null){
                        // update values.
                        i.value('');
                    }

                    if(file === ''){
                        /**
                         * if no file uploaded then shutdown the manager.
                         */
                        n.namanager.closeManager();
                        neditor('.user-shadow').style({'z-index':300});
                        return false;
                    }

                    /**
                     *  delete uploaded file from the server.
                     */
                    n.xhr.onMessage({
                        method:'POST',
                        url:lks+'includes/neditor.php',
                        header:null,
                        query:'action=deleteFiles&u='+un+'&file='+file,
                        success:function(){
                            c.loader();
                            if(n.xhr.readyStates(this)) {
                                var r = JSON.parse(this.responseText);
                                r = r.split('|');

                                if(r[0] === 'Deleted'){
                                    context.uploadedFile = '';
                                    getFiles();
                                }else{
                                    cAlert.renderAlertData("Error:: File Deleting Failed",
                                        "Sorry an error occurred while trying to cancel your request.<br>Please try again!","OK");
                                    getFiles();
                                }

                            }
                        }
                    });

                });


                /**
                 * get files
                 */
                function getFiles(){
                    n.xhr.onMessage({
                        method:'POST',
                        url:lks+'includes/neditor.php',
                        header:null,
                        query:'action=getFiles&u='+un,
                        success:function () {
                            c.loader();

                            if(n.xhr.readyStates(this)){
                                var r = JSON.parse(this.responseText),cn = '';

                                n.for(
                                    {
                                        start:0,
                                        data:r,
                                        asoc:true,
                                        callback:function(i){
                                            var id = i.num,src = i.src,ext;

                                            ext = src.split('.');
                                            ext = ext[ext.length-1];

                                            if(ext === 'jpg' || ext === 'JPG'
                                                || ext === 'JPEG' || ext === 'jpeg' ||
                                                ext === 'PNG' || ext === 'png' ||
                                                ext === 'gif'){

                                                cn +=  '<section ' +
                                                    'class="na-file-holder">' +
                                                    '<section ' +
                                                    'class="manager-img-holder">' +
                                                    '<img src="'+lks+src+'" ' +
                                                    'alt="'+un+'"/>' +
                                                    '</section>' +
                                                    '</section>';

                                            }
                                            else if(ext === 'mp4' || ext === 'webM' ||
                                                ext === 'avi' || ext === 'webm'){
                                                cn +=  '<section ' +
                                                    'class="na-file-holder">' +
                                                    '<section ' +
                                                    'class="manager-img-holder">' +

                                                    '<video controls><source ' +
                                                    'src="'+lks+src+'" ' +
                                                    'type="video/'+ext+'">' +
                                                    '</video>' +

                                                    '</section>' +
                                                    '</section>';
                                            }
                                            else if(ext === 'mp3' || ext === "wav"){
                                                cn +=  '<section ' +
                                                    'class="na-file-holder">' +
                                                    '<section ' +
                                                    'class="manager-img-holder">' +

                                                    '<audio controls><source ' +
                                                    'src="'+lks+src+'" ' +
                                                    'type="audio/'+ext+'">' +
                                                    '</audio>' +

                                                    '</section>' +
                                                    '</section>';
                                            }
                                            else if(ext === 'pdf'){

                                                cn +=  '<section ' +
                                                    'class="na-file-holder">' +
                                                    '<section ' +
                                                    'class="manager-img-holder">' +

                                                    '<a href="'+lks+src+'" ' +
                                                    'onclick="return false" ' +
                                                    'download><img ' +
                                                    'src="'+lks+'/images/logos/pdf.png" ' +
                                                    'alt="'+un+'"></a>' +

                                                    '</section>' +
                                                    '</section>';

                                            }
                                            else if(
                                                ext === 'docx' || ext === 'doc'
                                                || ext === 'dot' || ext === 'wbk'
                                                || ext === 'docm'|| ext === 'dotx'
                                                || ext === 'dotm'|| ext === 'docb'
                                                || ext === 'xls' || ext === 'xlt'
                                                || ext === 'xlm' || ext === 'xlsx'
                                                || ext === 'xltx' || ext === 'xltm'
                                                || ext === 'xlsb' || ext === 'xla'
                                                || ext === 'xlam' || ext === 'xll'
                                                || ext === 'xlw' || ext === 'ppt'
                                                || ext === 'pot' || ext === 'pps'
                                                || ext === 'pptx' || ext === 'pptm'
                                                || ext === 'potx' || ext === 'potm'
                                                || ext === 'ppam' || ext === 'ppsx'
                                                || ext === 'ppsm' || ext === 'sldx'
                                                || ext === 'sldm'){

                                                cn +=  '<section ' +
                                                    'class="na-file-holder">' +
                                                    '<section ' +
                                                    'class="manager-img-holder">' +

                                                    '<a href="'+lks+src+'" ' +
                                                    'onclick="return false" ' +
                                                    'download><img ' +
                                                    'src="'+lks+'/images/logos/doc.png" ' +
                                                    'alt="'+un+'"></a>' +

                                                    '</section>' +
                                                    '</section>';
                                            }else{
                                                cAlert.renderAlertData("Error:: Fetching " +
                                                    "file(s)",
                                                    'An error occurred while trying to ' +
                                                    'fetch your files. Please try again ' +
                                                    'later.',"OK");
                                            }
                                        }
                                    }
                                );

                                c.html(cn);

                                n.each('.manager-img-holder',
                                    function (val) {
                                        neditor(val).on('click',function () {
                                            var el = this,p,c;
                                            n.each('.actives',function (vals) {

                                                context.contextOption = '';
                                                context.contextRule = 0;
                                                neditor(vals).attr('class',
                                                    'manager-img-holder');

                                                neditor(vals).removeElement(1);

                                            });

                                            var vd = neditor(el).firstChild(),
                                                tn = vd.tagName.toLowerCase();

                                            if(tn === 'video' || tn === 'audio'){
                                                vd.muted = true;
                                            }

                                            neditor(el).attr('class',
                                                'manager-img-holder actives');


                                            c = document.createElement('section');
                                            p = neditor(this).after(c);
                                            p = neditor(c).attr('class',
                                                'manager-context-menu');

                                            neditor(el).contextmenu(function () {
                                                var e = this,ct = context,e2,em;

                                                if(ct.contextRule < 1
                                                    && ct.contextOption !== e
                                                    || ct.contextOption === ''){
                                                    p = neditor(c).html(ct.contextValue[0]);

                                                }

                                                ct.contextOption = e;
                                                ct.contextRule = 1;


                                                e2 = neditor('.download-menu');
                                                if(e2.element !== null){
                                                    e2.on('click',function(){
                                                        n.download({
                                                            e:el,el:this,m:'menu'
                                                        });
                                                    });
                                                }

                                                /**
                                                 * make viwable
                                                 */
                                                em = neditor('.view-menu');

                                                if(em.element !== null){
                                                    em.on('click',function(){
                                                        n.viwable({
                                                            e:val,el:this,m:null
                                                        });
                                                    });
                                                }

                                                /**
                                                 *  insert file to the editor
                                                 */
                                                var ft = neditor('.insertFile');

                                                if(ft.element !== null){
                                                    ft.on('click',function(){
                                                        n.namanager.insertMedia({
                                                            e:val,el:this
                                                        });
                                                    });
                                                }


                                                /**
                                                 * Forbidden contents
                                                 */
                                                n.each('.cont-disabled',function(f){
                                                    neditor(f).on('click',function(){
                                                        cAlert.renderAlertData("Error:: Unsupported Contents",
                                                            'Sorry this content available ' +
                                                            'only on neditor standalone ' +
                                                            'app.<br> Please navigate to it ' +
                                                            'to get full supported contents. ' +
                                                            'It ' +
                                                            'may not available by time been ' +
                                                            'but eventually it will be so ' +
                                                            'keep looking. ',"OK");
                                                    });
                                                });

                                            });

                                            /**
                                             * make downloadable
                                             */
                                            var e1 = neditor('.download-button'),em;

                                            if(e1.element !== null){
                                                e1.on('click',function(){
                                                    n.download({
                                                        e:el,el:this,m:null
                                                    });
                                                });
                                            }

                                            /**
                                             * make viwable
                                             */
                                            em = neditor('.view-button');

                                            if(em.element !== null){
                                                em.on('click',function(){
                                                    n.viwable({
                                                        e:val,el:this,m:null
                                                    });
                                                });
                                            }


                                            /**
                                             *  insert file to the editor
                                             */
                                            var ei = neditor('.fts');

                                            if(ei.element !== null){
                                                ei.on('click',function(){
                                                    n.namanager.insertMedia({
                                                        e:val,el:this
                                                    });
                                                });
                                            }

                                            /**
                                             * This method needs further development.
                                             *
                                             *
                                             * neditor('.namanager-container').on('click',
                                             function(){
                                            var e = neditor('.actives');

                                            if(e.element !== null && e !== el){
                                                n.each('.actives',function (vals) {
                                                    context.contextOption = '';
                                                    context.contextRule = 0;
                                                    neditor(vals).attr('class',
                                                        'manager-img-holder');

                                                    neditor(vals).removeElement(1);
                                                });
                                            }

                                        });
                                             */

                                        });
                                    });

                                /**
                                 * make downloadable
                                 */
                                var e1 = neditor('.download-button');

                                if(e1.element !== null){
                                    e1.on('click',function(){
                                        n.download();
                                    });
                                }

                                /**
                                 * make viwable
                                 */
                                var e1 = neditor('.view-button');

                                if(e1.element !== null){
                                    e1.on('click',function(){
                                        n.viwable();
                                    });
                                }

                                /**
                                 * insert file to the editor.
                                 */
                                var ei = neditor('.fts');

                                if(ei.element !== null){
                                    ei.on('click',function(){
                                        n.namanager.insertMedia();
                                    });
                                }
                            }
                        }
                    });
                }

            },

            /**
             * @param e
             */
            insertMedia:function(e){
                if(typeof e !== 'undefined'){
                    var el = e.el;
                    if(typeof e !== 'undefined'){
                        var p = neditor(el).parent(),
                            i = neditor('.mselc'),v,src,href,h,w,vids,auds;

                        // get values of an img,audi,doc,video
                        v = neditor(e.e).firstChild();

                        vids = v.tagName.toLowerCase();
                        auds = v.tagName.toLowerCase();

                        if(vids === 'video'){
                            vids = neditor(v).firstChild();
                            w = 150;
                            h = 120;

                            v = vids.src;
                        }

                        if(auds === 'audio'){
                            auds = neditor(v).firstChild();
                            w = '';
                            h = '';

                            v = auds.src;
                        }

                        // get source file.
                        src = v.src;

                        // get href source
                        href = v.href;

                        if(typeof src !== 'undefined')
                        {
                            w = v.width;
                            h = v.height;

                            v = src;
                        }

                        if(typeof href !== 'undefined')
                        {
                            v = href;
                        }

                        if(i.element !== null){
                            i.value(v);
                            neditor('.fWidth').value(w);
                            neditor('.fHeight').value(h);
                            config.ExtraContents = v;
                        }

                        neditor('.namanager').hide(null,100);
                    }


                    context.uploadedFile = '';

                    if(e.m !== null){
                        context.contextOption = '';
                        context.contextRule = 0;
                        var el = neditor(e.e);
                        el.attr('class',
                            'manager-img-holder');

                        var c = el.children();

                        if(c.length > 0){
                            el.removeElement(1);
                        }
                    }
                }else{
                    cAlert.renderAlertData('Error Null File Selected',
                        'Please click the file that you want to insert.',
                        'OK');
                }
            },

            /**
             * @param e
             */
            closeManager:function(e){
                neditor('.namanager').hide(null,100);
                context.uploadedFile = '';
            }
        };

        /**
         * Color picker
         * @type {{template: neditor.picker.template, picker: neditor.picker.picker,
         * installer: neditor.picker.installer}}
         */
        n.picker = {
            template:function(){

                var temp = [
                    '<section class="picker-container">' +
                    '<section class="pickable"></section>' +
                    '<section class="palette-holder">' +
                    '<section class="p-left">' +
                    '<canvas class="color-palette"></canvas>' +
                    '</section>' +
                    '<section class="p-right">' +
                    '<section class="status-container">' +

                    '<section class="input-holder">' +

                    '<section>' +
                    '<section>R</section>' +
                    '<section><input type="text" class="rColor" value=""></section>' +
                    '</section>' +

                    '<section>' +
                    '<section>G</section>' +
                    '<section><input type="text" class="gColor" value=""></section>' +
                    '</section>' +

                    '<section>' +
                    '<section>B</section>' +
                    '<section><input type="text" class="bColor" value=""></section>' +
                    '</section>' +

                    '<section>' +
                    '<section>Hex</section>' +
                    '<section><input type="text" class="hexColor" value=""></section>' +
                    '</section>' +


                    '<section>' +
                    '<section>RGB</section>' +
                    '<section><input type="text" class="rgbColor" value=""></section>' +
                    '</section>' +

                    '</section>' +

                    '<setion class="erase-color">' +
                    '<section class="eb">Reset</section>' +
                    '</setion>'+

                    '</section>' +
                    '</section> ' +
                    '</section>' +
                    '</section>'];

                return temp;
            },

            picker:function(opt){
                var pick = true,
                    temp = n.picker.template(),
                    canvas,lkn,lk,lks,path,x,y,pixels,
                    imgSrc,img,context,color,r,g,b,hx,rgb,cp,
                    pos,hexV,
                    $ = jQuery;

                n.toggle({
                    element:'.picker',
                    shadow:null,
                    time:300});

                neditor('.picker').html(temp);

                r = neditor('.rColor');
                g = neditor('.gColor');
                b = neditor('.bColor');
                hx = neditor('.hexColor');
                rgb = neditor('.rgbColor');
                cp = neditor('.color-picker > section');

                lk = n.addr();

                lkn = lk.url;

                path = lk.path;

                if(lk.domain.match('localhost')){
                    lks = lkn+path[1]+'/';
                }else{
                    lks = lkn+path[1]+'/';
                }
		
                canvas = neditor('.color-palette');
                if(!window.WebGLRenderingContext){
                    canvas.html('Sorry your browser does not support HTML5 canvas');
                    return;
                }
                context = canvas.element.getContext('2d');
                img = new Image();
                neditor(img).on('load',function(){
                    context.drawImage(img,0,0,canvas.element.width,
                        canvas.element.height);
                });

                imgSrc = lks+'images/logos/wheel.png';
                img.src = imgSrc;

                r.value(100);
                g.value(100);
                b.value(100);
                hx.value('#646464');
                rgb.value('100,100,100');

                img.width = canvas.element.width;
                img.height = canvas.element.height;
                img.style.borderRadius = 50+'%';


                canvas.on('mousemove',function(e){
                    if(pick){
                        pos = getMousePos('.color-palette');

                        x = Math.floor(e.pageX - pos.x);
                        y = Math.floor(e.pageY - pos.y);

                        img = context.getImageData(x,y,1,1);
                        pixels = img.data;

                        color = pixels[2] + 256 * pixels[1] + 65536 * pixels[0];

                        //store hex value
                        hexV = '#'+('0000' + color.toString(16)).substr(-6);

                        r.value(pixels[0]);
                        g.value(pixels[1]);
                        b.value(pixels[2]);
                        hx.value(hexV);
                        rgb.value(pixels[0]+','+pixels[1]+','+pixels[2]);


                        cp.style({'background':hexV});

                        canvas.on('click',function () {
                            // disable mouse event.
                            pick = false;

                            // install color
                            n.picker.installer(hx.value(),opt);

                            // close the picker
                            n.picker.picker();
                        });

                        neditor('.eb').on('click',function(){
                            n.picker.eraseColor();
                            cp.style({'background':'rgba(212,90,131,.7)'});
                            pick = true;
                        });
                    }else{
                        cp.style({'background':
                            'linear-gradient(to left, rgba(247,187,151,.8) 15%,rgba(212,90,131,.8) 40%,rgba(207,90,224,1),rgba(244,3,177,1)'});
                    }
                });

                /**
                 * This method use jquery library to ge mouse position;
                 * @param el
                 * @returns {{x: *, top: *}}
                 */
                function getMousePos(el) {
                    var of = $(el).offset();
                    return {x:of.left,y:of.top}
                }

            },

            installer:function(color,opt){
                n.execute('foreColor',color,null);
                neditor('.color-picker > section').style({'background':'rgba(212,90,131,.7)'});
                var e = neditor(opt);

                if(e.element !== null){
                    e.value(color);
                }
            },

            eraseColor:function(){
                n.execute('foreColor','#646464',null);
            }
        };

        /**
         * @param e
         */
        n.download = function (e) {
            if(typeof e !== 'undefined'){
                var el = e.el;
                if(typeof e !== 'undefined'){
                    var p = neditor(el).parent(),a,v,src,href,nm,url,vid,aud;

                    // get values of an img,audi,doc,video
                    v = neditor(e.e).firstChild();

                    vid = v.tagName.toLowerCase();
                    aud = v.tagName.toLowerCase();

                    if(vid === 'video'){
                        vid = neditor(v).firstChild();
                    }

                    if(aud === 'audio'){
                        aud = neditor(v).firstChild();
                    }

                    // get source file.
                    src = v.src;

                    // get href source
                    href = v.href;

                    // get video url
                    vid = vid.src;

                    //get audio url
                    aud = aud.src;

                    if(typeof src !== 'undefined')
                    {
                        v = src;
                    }

                    if(typeof href !== 'undefined')
                    {
                        v = href;
                    }

                    if(typeof vid !== 'undefined')
                    {
                        v = vid;
                    }

                    if(typeof aud !== 'undefined')
                    {
                        v = aud;
                    }

                    nm = v.split('.');

                    url = n.addr();

                    url = url.domain;

                    // create a link.
                    a = document.createElement('a');

                    // add atributies.
                    neditor(a).attr('href',v);

                    a.download = url+'.'+un;
                    document.body.appendChild(a);

                    // make clickable.
                    a.click();
                }

                if(e.m !== null){
                    context.contextOption = '';
                    context.contextRule = 0;
                    neditor(e.e).attr('class',
                        'manager-img-holder');

                    neditor(e.e).removeElement(1);
                }
            }else{
                cAlert.renderAlertData('Error Null File Selected',
                    'Click the file that you want to download.',
                    'OK');
            }
        };

        /**
         * @param e
         */
        n.viwable = function(e){
            if(typeof e !== 'undefined'){
                var el = e.el;
                if(typeof e !== 'undefined'){
                    var p = neditor(el).parent(),v,cn;


                    // get values of an img,audi,doc,video
                    v = e.e;
                    v = v.innerHTML;

                    // this method is from the main file.
                    viewer(v);
                }

                context.contextOption = '';
                context.contextRule = 0;
                neditor(e.e).attr('class',
                    'manager-img-holder');

                neditor(e.e).removeElement(1);
            }else{
                cAlert.renderAlertData('Error Null File Selected',
                    'Click the file that you want to view.',
                    'OK');
            }
        };

        /**
         *
         * @type {{charBuidler: neditor.specialCharacters.charBuidler,
         * showChars: neditor.specialCharacters.showChars,
         * charIsntaller: neditor.specialCharacters.charIsntaller}}
         */
        n.specialCharacters = {

            charBuidler:function () {
                var
                    chars = '';

                n.for({
                    start:9899,
                    data:10100,
                    asoc:null,
                    callback:function(i){
                        chars +=
                            '<section class="s-char-holder">' +
                            '<b style="font-size: 32px;color: rgba(248,87,166,1);' +
                            '">&#'+i+';</b>' +
                            '</section>'
                    }
                });

                return chars;
            },

            showChars:function (placeholder) {
                var
                    chars = n.specialCharacters.charBuidler(),
                    h = placeholder,
                    e,t = h.title,c = h.content,f;

                e = neditor(h.element);
                // header title
                f = e.firstChild();
                f = neditor(f).firstChild();
                // body
                e = e.lastChild();

                if(typeof t === 'undefined' || t === null || t === ''){
                    t = 'Insert Special Characters';
                }

                if(typeof c === 'undefined' || c === null || c === ''){
                    c = chars;
                }

                neditor(f).html('<p>'+t+'</p>');
                neditor(e).html(c);

                n.each('.s-char-holder > b',function (v) {
                    neditor(v).on('click',function () {
                        var v = this.innerHTML;
                        //v = '<b style="color: rgba(248,87,166,1);font-size:17px;
                        // ">'+v+'</b>';

                        n.specialCharacters.charIsntaller(v);
                    });
                });

                neditor('.hidden-shadow').show(null,100);
            },

            charIsntaller:function (v) {
                n.execute('insertHTML',v,null);
                n.hiddenContents('.hidden-contents');
                neditor('.hidden-shadow').hide(null,10);
            }
        };

        /**
         * This is emojies builder and supplier.
         */
        n.emoji = {

            /**
             * emojies context.
             */
            emojiBuilder: function () {
                var emojies,
                    url = n.addr(),l;
                l = url.url;
                if(url.domain.match('localhost')){
                    l = l+url.path[1];
                }else{
                    l = l;
                }

                emojies = ['<section class="emoji-wrapper">' +
                '<section class="e-header">' +
                '<section class="e-h-bubble"></section>' +
                '<section class="heads">' +
                '<section class="icn-h" id="people" title="People">' +
                '<img src="'+l+'/images/emojis/people/faces/4.png" alt="people">' +
                '<section class="ic-bubble"></section>' +
                '</section>' +
                '<section class="icn-h" id="animal" title="Animal & Nature">' +
                '<img src="'+l+'/images/emojis/animal/1.png" alt="animal">' +
                '<section class="ic-bubble"></section>' +
                '</section>' +
                '<section class="icn-h" id="food" title="Food & Drinks">' +
                '<img src="'+l+'/images/emojis/food/1.png" alt="food and drink">' +
                '<section class="ic-bubble"></section>' +
                '</section>' +
                '<section class="icn-h" id="activities" title="Activities">' +
                '<img src="'+l+'/images/emojis/activities/1.png" alt="activities">' +
                '<section class="ic-bubble"></section>' +
                '</section>' +
                '<section class="icn-h" id="travel" title="Travel & Places">' +
                '<img src="'+l+'/images/emojis/travel/5.png" alt="travel">' +
                '<section class="ic-bubble"></section>' +
                '</section>' +
                '<section class="icn-h" id="objects" title="Objects">' +
                '<img src="'+l+'/images/emojis/objects/2.png" alt="objects">' +
                '<section class="ic-bubble"></section>' +
                '</section>' +
                '<section class="icn-h" id="symbo" title="Symbols">' +
                '<img src="'+l+'/images/emojis/symbo/1.png" alt="symbols">' +
                '<section class="ic-bubble"></section>' +
                '</section>' +
                '<section class="icn-h" id="flags" title="Flags">' +
                '<img src="'+l+'/images/emojis/flags/1.png" alt="flags">' +
                '<section class="ic-bubble"></section>' +
                '</section>' +
                '</section>' +
                '</section>' +
                '<section class="e-body"></section>' +
                '</section>'];

                return emojies[0];
            },

            /**
             * insert emoji in the editor.
             */
            insertEmoji:function (val) {

                if(typeof val !== 'undefined' && val !== null){

                    /**
                     * close emoji context.
                     */
                    n.emojiWrapperToggle('.emoji');

                    // /**
                    //  * checking if the editor has no contents and start a new document.
                    //  */
                    // if(n.isNullEditorArea()
                    //     || textArea.document.body.innerText
                    //     === 'Create new topic here ...'){
                    //     neditor('.textArea').newDoc();
                    // }

                    /**
                     * insert emoji in the editor.
                     */
                    n.execute('insertHTML',val,'Please try different browser');
                }
            },

            /**
             * fetch and show all emojies.
             * @param obj
             */
            showEmojies:function(obj){

                var url = n.addr(),
                    lnk = url.url,
                    path = url.path[1],
                    method = 'POST',
                    urls = 'includes/neditor.php',
                    query;

                if(url.domain.match('localhost')){
                    lnk = lnk+path+'';
                }else{
		    lnk = lnk+path;
		}

                if(n.isObject(obj)){
                    query = obj.query;
                }

                n.xhr.onMessage(
                    {
                        method:method,
                        url:lnk+'/'+urls,
                        query: query,
                        header:null,
                        success:function ()
                        {

                            var
                                e =  neditor('.e-body'),
                                response,d = '';

                            e.loader();


                            if(n.xhr.readyStates(this)){
                                response = JSON.parse(this.responseText);

                                n.for({
                                    start:0,
                                    data:response,
                                    asoc:true,
                                    callback:function(r){
                                        if(r.src){
                                            d += '<section class="e-emoji">' +
                                                '<img style="width:24px;height:24px;"' +
                                                ' src="'+lnk+'/'+r.src+'" />' +
                                                '</section>';
                                        }

                                        setTimeout(function(){
                                            e.html(d);


                                            n.each('.e-emoji',function (value) {
                                                neditor(value).on('click',function(){
                                                    n.emoji.insertEmoji('<img src="'+
                                                        this.firstChild.src+'" alt="emoji"' +
                                                        ' width="16px" height="16px" align="justify">');
                                                });
                                            });
                                        },700);
                                    }
                                });
                            }
                        }
                    }
                );
            }
        };

        /**
         * @type {{builder: neditor.table.builder,
         * proTemp: neditor.table.proTemp, properties: neditor.table.properties,
          * cancelTable: neditor.table.cancelTable, creator: neditor.table.creator}}
         */
        n.table = {
            builder:function(){
                n.each('table.select-table > tbody > tr > td',function(t){
                    var e = neditor(t);

                    if(!tableConfig.clicked){
                        e.on('mouseover',function(){
                            var e = neditor(this),
                                p = e.parent(),
                                cn = e.className(),
                                pn = neditor(p).className(),
                                cn = parseInt(cn.replace('td','')),
                                pn = parseInt(pn.replace('tr',''));


                            if(pn === 0){
                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:1,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });


                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){
                                            n.each('table > tbody > .tr'+pn+' > .td'+x,
                                                function(v){
                                                    neditor(v).attr('id','actd');
                                                });
                                        }
                                    });
                                }

                            }
                            else if(pn === 1){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:2,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){
                                            n.for({
                                                start:0,
                                                data:1,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });
                                        }
                                    });
                                }

                            }
                            else if(pn === 2){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:3,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){
                                            n.for({
                                                start:0,
                                                data:2,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });
                                        }
                                    });
                                }

                            }
                            else if(pn === 3){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:4,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){

                                            n.for({
                                                start:0,
                                                data:3,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });

                                        }
                                    });
                                }

                            }
                            else if(pn === 4){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:5,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){

                                            n.for({
                                                start:0,
                                                data:4,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });

                                        }
                                    });
                                }

                            }
                            else if(pn === 5){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:6,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){

                                            n.for({
                                                start:0,
                                                data:5,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });

                                        }
                                    });
                                }

                            }
                            else if(pn === 6){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:7,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){

                                            n.for({
                                                start:0,
                                                data:6,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });

                                        }
                                    });
                                }

                            }
                            else if(pn === 7){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:8,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){

                                            n.for({
                                                start:0,
                                                data:7,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });

                                        }
                                    });
                                }

                            }
                            else if(pn === 8){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.for({
                                            start:9,
                                            data:9,
                                            asoc:false,
                                            callback:function(v){
                                                n.removeTableAttr({cn:np,pn:v});
                                            }
                                        });
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){

                                            n.for({
                                                start:0,
                                                data:8,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });

                                        }
                                    });
                                }

                            }
                            else if(pn === 9){

                                n.for({
                                    start:0,
                                    data:9,
                                    asoc:false,
                                    callback:function(np){
                                        n.removeTableAttr({cn:cn,pn:np});
                                    }
                                });

                                if(cn >= 0){
                                    n.for({
                                        start:0,
                                        data:cn,
                                        asoc:false,
                                        callback:function(x){

                                            n.for({
                                                start:0,
                                                data:9,
                                                asoc:false,
                                                callback:function(v){
                                                    n.each('table > tbody > .tr'+v+' > .td'+x,
                                                        function(v){
                                                            neditor(v).attr('id','actd');
                                                        });
                                                }

                                            });

                                        }
                                    });
                                }
                            }

                            cn = cn+1;
                            pn = pn+1;
                            neditor('.t-countor > p').html(cn+'X'+pn);

                            neditor('table.select-table').on('click',function(){
                                tableConfig.clicked = true;
                                tableConfig.selected.cn = cn;
                                tableConfig.selected.pn = pn;
                                n.table.properties(tableConfig.selected);
                            });
                        });

                    }

                    if(!tableConfig.clicked){
                        neditor('table.select-table').on('mouseleave',function(){
                            n.for({
                                start:0,
                                data:9,
                                asoc:false,
                                callback:function(np){
                                    n.for({
                                        start:0,
                                        data:9,
                                        asoc:false,
                                        callback:function(v){
                                            n.removeTableAttr({cn:np,pn:v});
                                        }
                                    });
                                }
                            });
                            neditor('.t-countor > p').html('0X0');
                        });
                    }

                });
            },

            proTemp:function(){
                var tm = ['<section class="right-t-cont">' +

                '<section class="t-r-c1">' +

                '<section class="tcpn">' +
                '<section class="desc">Caption</section>' +
                '<input type="text" autocomplete="off" placeholder="frank galos" value="" ' +
                'class="tcaption">' +
                '</section>' +

                '<section class="left-rc">' +
                '<section class="desc">Width</section>' +
                '<input type="text" autocomplete="off" placeholder="50" value="50" class="twidth">' +
                '</section>' +

                '<section class="right-rc">' +
                '<section class="desc">Height</section>' +
                '<input type="text" autocomplete="off" placeholder="15" value="15" class="theight">' +
                '</section>' +

                '</section>' +

                '<section class="t-r-c1">' +

                '<section class="left-rc">' +
                '<section class="desc">Cell spacing</section>' +
                '<input type="text" autocomplete="off" placeholder="2" value="2" class="tcellsp">' +

                '</section>' +

                '<section class="right-rc">' +
                '<section class="desc">Cell padding</section>' +
                '<input type="text" autocomplete="off" placeholder="1" value="1" class="tcellpad">' +
                '</section>' +

                '</section>' +

                '<section class="t-r-c1">' +

                '<section class="left-rc">' +
                '<section class="desc">Border</section>' +
                '<input type="text" autocomplete="off" placeholder="1" value="1" class="tborder">' +
                '</section>' +

                '<section class="right-rc">' +
                '<section class="desc">Border color</section>' +
                '<input type="text" autocomplete="off" placeholder="#606060" value="#606060" class="tBcolor">' +
                '</section>' +

                '</section>' +

                '<section class="t-r-c1">' +

                '<section class="left-rc">' +
                '<section class="desc">Background</section>' +
                '<input type="text" autocomplete="off" placeholder="#646464" value="" class="tback">' +
                '</section>' +

                '<section class="right-rc" >' +
                '<section class="desc">Align</section>' +

                '<section class="align-ment talignment">-- <b class="tal" ' +
                'style="font-weight:normal">select</b> ' +
                '-- ' +
                '<b><i class="fa fa-angle-down"></i></b>' +
                '<section class="topt">' +
                '<ul>' +
                '<li>Left</li>' +
                '<li>Center</li>' +
                '<li>Right</li>' +
                '</ul>' +
                '</section>' +
                '</section>' +

                '</section>' +

                '</section>' +

                '<section class="ok-cont">' +

                '<section class="ok-save-b"><i class="fa fa-check"></i> ' +
                'Save</section>' +

                '<section class="t-cancel-button"><i class="fa ' +
                'fa-ban"></i> Cancel</section>' +

                '</section>' +

                '</section>'];

                return tm[0];
            },

            properties:function(obj){
                n.hiddenContents('.hidden-contents');
                n.specialCharacters.showChars({
                    element:'.hidden-contents',
                    content:n.table.proTemp(),
                    title:'Table Properties'
                });

                var el = neditor('.talignment');
                if(el.element !== null){
                    el.on('click',function(){
                        n.toggle({
                            element:'.topt',
                            shadow:null,
                            time:null
                        });
                    });

                    n.each('.topt > ul > li',function(i){
                        neditor(i).on('click',function(){
                            var b = neditor('.tal'),
                                t = neditor(this).html();
                            b.html(t);
                        });
                    });
                }

                neditor('.tBcolor').on('focus',function(){
                    n.picker.picker(this);
                });

                neditor('.tback').on('focus',function(){
                    n.picker.picker(this);
                });

                /**
                 * create table
                 */
                neditor('.ok-save-b').on('click',function(){
                    n.table.creator(obj);
                });

                /**
                 * cancel creation.
                 */
                neditor('.t-cancel-button').on('click',function(){
                    n.table.cancelTable();
                });
            },

            cancelTable:function(){
                neditor('.hidden-shadow').hide(null,null);
                n.hiddenContents('.hidden-contents');
            },

            creator:function(obj){
                var o = obj,
                    cl = o.cn,
                    rw = o.pn,
                    w = neditor('.twidth').value(),
                    h = neditor('.theight').value(),
                    sp = neditor('.tcellsp').value(),
                    tc = neditor('.tcellpad').value(),
                    bd = neditor('.tborder').value(),
                    bc = neditor('.tBcolor').value(),
                    tb = neditor('.tback').value(),
                    al = neditor('.tal').html(),
                    cp = neditor('.tcaption').value(),
                    style = 'style=" ',bcc,cps = '',
                    tableRows = '',tableData = '',table = '',cna = '',ali;

                if(cp !== ''){
                    cps = '<caption>'+cp+'</caption>';
                }

                if(w !== ''){
                    if(n.isNumber(h)){
                        style += 'width:'+w+'px; ';
                    }else{
                        neditor('.twidth').style({'border-color':'rgba(212,90,131,1)'});
                        cAlert.renderAlertData('Error: Invalid Width Value',
                            'Sorry please enter only number in the box','OK');
                        return false;
                    }
                }

                if(h !== ''){
                    if(n.isNumber(h)){
                        style += 'height:'+h+'px; ';
                    }else{
                        neditor('.theight').style({'border-color':'rgba(212,90,131,1)'});
                        cAlert.renderAlertData('Error: Invalid Height Value',
                            'Sorry please enter only number in the box','OK');
                        return false;
                    }
                }

                if(sp !== ''){
                    if(n.isNumber(sp)){
                        style += 'margin:'+sp+'px; ';
                    }else{
                        neditor('.tcellsp').style({'border-color':'rgba(212,90,131,1)'});
                        cAlert.renderAlertData('Error: Invalid Cell Spacing Value',
                            'Sorry please enter only number in the box','OK');
                        return false;
                    }
                }

                if(tc !== ''){
                    if(n.isNumber(tc)){
                        style += 'padding:'+tc+'px; ';
                    }else{
                        neditor('.tcellpad').style({'border-color':'rgba(212,90,131,1)'});
                        cAlert.renderAlertData('Error: Invalid Cell Padding Value',
                            'Sorry please enter only number in the box','OK');
                        return false;
                    }
                }

                if(bc !== ''){
                    bcc = bc;
                }

                if(bd !== '' && bc !== ''){
                    if(n.isNumber(bd)){
                        style += 'border: '+bd+'px solid '+bcc+'; ';
                    }else{
                        neditor('.tborder').style({'border-color':'rgba(212,90,131,1)'});
                        cAlert.renderAlertData('Error: Invalid Border Value',
                            'Sorry please enter only number in the box','OK');
                        return false;
                    }
                }

                if(tb !== ''){
                    style += 'background: '+tb+'; ';
                }

                if(al !== 'select'){
                    ali =al;
                }

                style += '"';


                if(!n.isNullObject(obj)){
                    // table
                    n.for({
                        start:1,
                        data:cl,
                        asoc:null,
                        callback:function(i){
                            tableData += '<td '+style+'></td>';
                        }
                    });

                    // table
                    n.for({
                        start:1,
                        data:rw,
                        asoc:null,
                        callback:function(i){
                            tableRows += '<tr>'+tableData+'</tr>';
                        }
                    });

                    if(cl !== '' && cl !== 0
                        && rw !== '' && rw !== 0){

                        table += '<table style="width:auto;height:auto; border:'+bd+'px solid '+bcc+'; align:'+ali+'">';
                        table += cps;
                        table +=  tableRows;
                        table += '</table>';

                        n.execute('insertHTML',table,null);

                        n.table.cancelTable();
                    }
                }
            }

        };

        /**
         * Pulish contents to the world.
         * @param func
         */
        n.publish = function(func){
            var sb = neditor('.nedi-post-contents');

            if(typeof func !== 'undefined'){
                sb.on('click',func);
            }
        };

        /**
         * @param obj
         * @returns {boolean}
         */
        n.isNullObject = function(obj){
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }

            return JSON.stringify(obj) === JSON.stringify({});
        };

        /**
         * @param obj
         */
        n.removeTableAttr = function(obj){
            var o = obj,
                pn = o.pn,
                cn = o.cn,
                cn = cn;

            if(cn > 0){
                cn  = cn+1;
            }

            n.for({
                start:cn,
                data:9,
                asoc:false,
                callback:function(x){
                    var el = neditor('table > tbody > .tr'+pn+' > .td'+x);
                    el.rAttr('id');
                }
            });
        };

        /**
         * Editor brain info.
         * @returns {string}
         */
        n.wrapper = function () {
            var wysiwygWrapper,
                closable = '',
                header,
                body,
                footer,
                fb = '',
                menu,
                subMenus,
                subMainMenus,
                tableRows = '',
                tableData = '',
                sendB = '',
                hasTitle =  ['<section class="ttitle"> ' +
                '<label> Title:</label>' +
                '<input type="text" value="'+config.topicTitle+'" class="topic-title" placeholder="Your topic title"> ' +
                '</section>'],lk = n.addr(),lkn, path,lks;

            lkn = lk.url;

            path = lk.path;

            if(lkn.match('localhost')){
                lks = lkn+path[1]+'/';
            }else{
                lks = lkn+path[1]+'/';
            }

            if(config.isClosable){
                closable = '<section class="neditor-closeer" title="close editor window"><i class="fa fa-times-circle"></i> Close editor</section>';
            }

            if (config.hasFullButton){
                fb = '<section class="nt full-screen">' +

                    '<section class="full-screen-mode" title="Full Screen">' +
                    '<i class="fa fa-arrows-alt"></i>' +
                    '</section>' +

                    '</section>';
            }

            if(config.hasSendButton){
                sendB = '<section class="nedi-post">' +
                    '<section class="nedi-post-contents">'+config.defaultText+'</section>' +
                    '</section>';
            }

            if(!config.hasTitle){
                hasTitle = '';
            }

            /* table */
            n.for({
                start:0,
                data:9,
                asoc:null,
                callback:function(i){
                    tableData += '<td class="td'+i+'"></td>';
                }
            });

            /* table */
            n.for({
                start:0,
                data:9,
                asoc:null,
                callback:function(i){
                    tableRows += '<tr class="tr'+i+'">'+tableData+'</tr>';
                }
            });

            subMenus = {
                "ft_menu":[
                    '<section class="sub-ft-menu">' +

                    '<section class="sub-ft-m" id="<h1>">' +
                    '<h1>Heading 1</h1>' +
                    '</section>' +

                    '<section class="sub-ft-m" id="<h2>">' +
                    '<h2>Heading 2</h2>' +
                    '</section>' +

                    '<section class="sub-ft-m" id="<h3>">' +
                    '<h3>Heading 3</h3>' +
                    '</section>' +

                    '<section class="sub-ft-m" id="<h4>">' +
                    '<h4>Heading 4</h4>' +
                    '</section>' +

                    '<section class="sub-ft-m" id="<h5>">' +
                    '<h5>Heading 5</h5>' +
                    '</section>' +

                    '<section class="sub-ft-m" id="<h6>">' +
                    '<h6>Heading 6</h6>' +
                    '</section>' +

                    '</section>'
                ],
                'ft_blocks':[
                    '<section class="ft-blocks">' +

                    '<section class="ft-b-sub"  id="<p>">' +
                    '<i class="fa fa-paragraph"></i> Paragraph' +
                    '</section>' +

                    '<section class="ft-b-sub"  id="<div>">' +
                    '<i style="font-style: normal;' +
                    'font-size: 12px;">&lt;div&gt;</i> Div/section' +
                    '</section>' +

                    '<section class="ft-b-sub" id="<blockquote>">' +
                    '<i style="font-style: normal;' +
                    'font-size: 12px;">&lt;blockquote&gt;</i> Blockquote' +
                    '</section>' +

                    '<section class="ft-b-sub" id="<pre>">' +
                    '<pre><i style="font-style: normal;' +
                    'font-size: 12px;">&lt;pre&gt;</i> Pre</pre>' +
                    '</section>' +

                    '</section>'
                ],
                'spell_lang':[
                    '<section class="spell-lang">' +

                    '<section class="sp-lang1 inactive">' +
                    '<i class="fa fa-language"></i> Swahili Tz'+
                    '</section>' +

                    '<section class="sp-lang2">' +
                    '<i class="fa fa-language"></i> English Us' +
                    '<b> <i class="fa fa-check"></i> </b>' +
                    '</section>' +

                    '<section class="sp-lang3 inactive">' +
                    '<i class="fa fa-language"></i> English Uk' +
                    '</section>' +

                    '<section class="sp-lang4 inactive">' +
                    '<i class="fa fa-language"></i> Franch' +
                    '</section>' +

                    '<section class="sp-lang5 inactive">' +
                    '<i class="fa fa-language"></i> German' +
                    '</section>' +

                    '<section class="sp-lang6 inactive">' +
                    '<i class="fa fa-language"></i> China' +
                    '</section>' +

                    '<section class="sp-lang7 inactive">' +
                    '<i class="fa fa-language"></i> Spanish' +
                    '</section>' +

                    '</section>'
                ],
                'table_list':[
                    '<section class="table-list-wrapper">' +
                    '<table class="select-table">' +
                    tableRows +
                    '</table>' +
                    '<section class="t-countor"><p><p></section>' +
                    '</section>'
                ]
            };

            subMainMenus = {
                'headings':[
                    '<section class="sub-main-ft-menu">' +

                    '<section class="sub-main-ft-m-h">' +
                    '<i class="fa fa-header"></i> Headings ' +
                    '<b><i class="fa fa-angle-right"></i></b>' +
                    subMenus.ft_menu[0] +
                    '</section>' +

                    '<section class="sub-main-ft-m-h">' +
                    '<i class="fa fa-paragraph"></i> Blocks ' +
                    '<b><i class="fa fa-angle-right"></i></b>' +

                    subMenus.ft_blocks[0] +

                    '</section>' +

                    '</section>'
                ],
                'font_family':[
                    '<section class="font-menus">' +

                    '<section class="fnt" id="Arial">' +
                    '<i class="fa fa-font"></i> Arial' +
                    '</section>' +

                    '<section class="fnt" id="\'Arial Black\'">' +
                    '<i class="fa fa-font"></i> Arial Black' +
                    '</section>' +

                    //This needs quotations
                    '<section class="fnt" id="\'Comic Sans MS\' Comic Sans, cursive">' +
                    '<i class="fa fa-font"></i> Comic Sans MS' +
                    '</section>' +

                    //This needs quotations
                    '<section class="fnt" id="\'Courier New\', monospace">' +
                    '<i class="fa fa-font"></i> Courier New' +
                    '</section>' +
                    //This needs quotations
                    '<section class="fnt" id="\'fantasy\'">' +
                    '<i class="fa fa-font"></i> fantasy' +
                    '</section>' +

                    '<section class="fnt" id="\'Georgia, serif\'">' +
                    '<i class="fa fa-font"></i> Georgia' +
                    '</section>' +

                    '<section class="fnt" id="\'Impact\'">' +
                    '<i class="fa fa-font"></i> Impact' +
                    '</section>' +

                    //This needs quotations
                    '<section class="fnt" id="\'Lucida Sans Unicode\'">' +
                    '<i class="fa fa-font"></i> Lucida Sans Unicode' +
                    '</section>' +

                    //This needs quotations
                    '<section class="fnt" id="\'Lucida Console\'">' +
                    '<i class="fa fa-font"></i> Lucida Console' +
                    '</section>' +

                    //This needs quotations
                    '<section class="fnt" id="\'Open Sans\', sans-serif">' +
                    '<i class="fa fa-font"></i> Open Sans' +
                    '</section>' +

                    '<section class="fnt" id="\'Palatino\', serif">' +
                    '<i class="fa fa-font"></i> Palatino' +
                    '</section>' +

                    '<section class="fnt" id="\'Stencil Std\', fantasy">' +
                    '<i class="fa fa-font"></i> Stencil Std' +
                    '</section>' +

                    '<section class="fnt" id="\'Tahoma\', Geneva, sans-serif">' +
                    '<i class="fa fa-font"></i> Tahoma' +
                    '</section>' +

                    //This needs quotations
                    '<section class="fnt" id="\'Times New Roman\', Times, serif">' +
                    '<i class="fa fa-font"></i> Times New Roman' +
                    '</section>' +

                    //This needs quotations
                    '<section class="fnt" id="\'Trebuchet MS\', Helvetica, sans-serif">' +
                    '<i class="fa fa-font"></i> Trebuchet MS' +
                    '</section>' +

                    '<section class="fnt" id="\'Verdana\', Geneva, sans-serif">' +
                    '<i class="fa fa-font"></i> Verdana' +
                    '</section>' +

                    '</section>'
                ],
                'font_size':[
                    '<section class="font-size">' +

                    '<section class="fns" id="1">' +
                    '<i class="fa fa-text-height"></i> Very small' +
                    '</section>' +

                    '<section class="fns" id="2">' +
                    '<i class="fa fa-text-height"></i> Bit small' +
                    '</section>' +

                    '<section class="fns" id="3">' +
                    '<i class="fa fa-text-height"></i> Normal '+
                    '</section>' +

                    '<section class="fns" id="4">' +
                    '<i class="fa fa-text-height"></i> Medium large '+
                    '</section>' +

                    '<section class="fns" id="5">' +
                    '<i class="fa fa-text-height"></i> Big '+
                    '</section>' +

                    '<section class="fns" id="6">' +
                    '<i class="fa fa-text-height"></i> Very big '+
                    '</section>' +

                    '<section class="fns" id="7">' +
                    '<i class="fa fa-text-height"></i> Maximum'+
                    '</section>' +

                    '</section>'
                ],
                'spell_check':[
                    '<section class="spell-checking-menu">' +

                    '<section class="s-c-m1">' +
                    '<i class="fa fa-check"></i> True' +
                    '</section>' +

                    '<section class="s-c-m2">' +
                    '<i class="fa fa-globe"></i> Languages' +
                    ' <b> <i class="fa fa-angle-right"></i> </b>' +

                    subMenus.spell_lang[0] +
                    '</section>' +

                    '</section>'
                ],
                'tables':[
                    '<section class="table-menu-opt">' +

                    '<section class="left-t-cont">' +
                    subMenus.table_list[0]+
                    '</section>' +

                    '<section class="right-t-cont">' +

                    '<section ' +
                    'style="text-align: center;background: rgba(248,87,166,.8);color: #fff;">' +
                    '<section style="color: #fff;">Table Properties</section>' +
                    '</section>' +
                    '<section class=""><p>Click in the cell when done.</p></section>' +

                    '</section>' +

                    '</section>'
                ]
            };

            menu = {
                'menu1':['<section class="file-menu" id="file-n-menu"> ' +
                '<section class="new-doc">' +
                '<i class="fa fa-file-o"></i> New document <b>Shift+N</b>' +
                '</section>' +

                '<section class="save-as" id="disabled">' +
                '<i class="fa fa-save"></i> Save as <b>Shift+S</b>' +
                '</section>' +

                '<section class="print" id="disabled">' +
                '<i class="fa fa-print"></i> Print <b>Shift+P</b>' +
                '</section>' +

                '<section class="exit-editor" title="Close editor window">' +
                '<i class="fa fa-times"></i> Exit ' +
                '<b>Shift+Q</b>' +
                '</section>' +

                '</section>'],
                'menu2':['<section class="edit-menu">' +

                '<section class="undo-menu" id="disabled">' +
                '<i class="fa fa-reply"></i> Undo <b>Ctrl+Z</b>' +
                '</section>' +

                '<section class="redo-menu" id="disabled">' +
                '<i class="fa fa-share"></i> Redo <b>Ctrl+Y</b>' +
                '</section>' +

                '<section class="cut-menu" id="disabled">' +
                '<i class="fa fa-cut"></i> Cut <b>Ctrl+X</b>' +
                '</section>' +

                '<section class="copy-menu" id="disabled">' +
                '<i class="fa fa-copy"></i> Copy <b>Ctrl+C</b>' +
                '</section>' +

                '<section class="paste-menu">' +
                '<i class="fa fa-paste"></i> Paste <b>Ctrl+V</b>' +
                '</section>' +

                '<section class="select-menu" id="disabled">' +
                ' Select all <b>Ctrl+A</b>' +
                '</section>' +

                '</section>'],
                'menu3':[
                    '<section class="insert-menu">' +

                    '<section class="media-image">' +
                    '<i class="fa fa-photo"></i> Image' +
                    '</section>' +

                    '<section class="media-video">' +
                    '<i class="fa fa-video-camera"></i> Video' +
                    '</section>' +

                    '<section class="insert-link">' +
                    '<i class="fa fa-link"></i> Link' +
                    '</section>' +

                    '<section class="insert-emoji">' +
                    '<i class="fa fa-smile-o"></i> Emoji' +
                    '</section>' +

                    '<section class="insert-sepcial-char">' +
                    '<i class="fa fa-stumbleupon"></i> Special character' +
                    '</section>' +

                    '</section>'],
                'menu4':[
                    '<section class="format">' +

                    '<section class="ft-bold" id="disabled">' +
                    '<i class="fa fa-bold"></i> Bold <b> Shift+B</b>' +
                    '</section>' +

                    '<section class="ft-italic" id="disabled">' +
                    '<i class="fa fa-italic"></i> Italic <b> Shift+I</b>' +
                    '</section>' +

                    '<section class="ft-underline" id="disabled">' +
                    '<i class="fa fa-underline"></i> Underline <b> Alt+U</b>' +
                    '</section>' +

                    '<section class="ft-horizontal">' +
                    '<i style="text-decoration: underline;' +
                    'font-size:12px;font-style: normal;">HR</i> Horizontal rule ' +
                    '<b> Shift+H</b>' +
                    '</section>' +

                    '<section class="ft-strikethrough" id="disabled">' +
                    '<i class="fa fa-strikethrough"></i> Strikethrough <b> Ctrl+D</b>' +
                    '</section>' +

                    '<section class="ft-superscript" id="disabled">' +
                    '<i class="fa fa-superscript"></i> Superscript <b> Ctrl+1</b>' +
                    '</section>' +

                    '<section class="ft-subscript" id="disabled">' +
                    '<i class="fa fa-subscript"></i> Subscript <b> Ctrl+2</b>' +
                    '</section>' +

                    '<section class="ft-code">' +
                    '<i class="fa fa-code"></i> Code <b> Ctrl+3</b>' +
                    '</section>' +

                    '<section class="ft-formats">' +
                    '<i class="fa fa-facebook"></i> Formats ' +
                    '<b><i class="fa fa-angle-right"></i></b>'+

                    subMainMenus.headings[0] +

                    '</section>' +


                    '</section>'
                ],
                'menu5':[
                    '<section class="font-menu">' +

                    '<section class="fn1">' +
                    '<i class="fa fa-font"></i> Font family ' +
                    '<b> <i class="fa fa-angle-right"></i></b>' +
                    subMainMenus.font_family[0] +
                    '</section>' +

                    '<section class="fn1">' +
                    '<i class="fa fa-text-height"></i> Font size' +
                    '<b> <i class="fa fa-angle-right"></i></b>' +
                    subMainMenus.font_size[0] +
                    '</section>' +

                    '</section>'
                ],
                'menu6':[
                    '<section class="table-menu-options">' +

                    '<section class="t-m-o1">' +
                    '<i class="fa fa-table"></i> Create table ' +
                    '<b> <i class="fa fa-angle-right"></i> </b>' +
                    subMainMenus.tables[0] +
                    '</section>' +

                    '</section>'
                ],
                'menu7':[
                    '<section class="view-menu-option">' +

                    '<section class="v-m-o1 show-blocks">' +
                    '<i class="fa fa-times"></i> Show blocks ' +
                    '<b>Ctrl+Alt+B</b>' +
                    '</section>' +

                    '<section class="v-m-o2 contents-preview" ' +
                    'style="border-top: 1px solid rgba(100,100,100,.1);">' +
                    '<i class="fa fa-eye"></i> Preview ' +
                    '<b>Ctrl+Alt+P</b>' +
                    '</section>' +

                    '<section class="v-m-o3" style="border: none;">' +
                    '<i class="fa fa-times"></i> Full screen ' +
                    ' <b>Shift+F</b>' +
                    '</section>' +

                    '</section>'
                ],
                'menu8':[
                    '<section class="tool-menu-opt">' +

                    '<section class="t-m-o1">' +
                    '<i class="fa fa-book"></i> Spell checking ' +
                    ' <b> <i class="fa fa-angle-right"></i></b>' +
                    subMainMenus.spell_check[0] +
                    '</section>' +

                    '<section class="t-m-o1 sourceCode">' +
                    '<i class="fa fa-code"></i> Source code ' +
                    '</section>' +

                    '<section class="t-m-o1 help-ned">' +
                    '<i class="fa fa-question"></i> Help ' +
                    '</section>' +

                    '</section>'
                ]
            };

            header = {
                topH:['<section class="top-header">' +
                '<section class="t-h-holder">' +

                // file button
                '<section class="file-m">' +

                '<section class="nt">' +
                'File <i class="fa fa-caret-down"></i>' +
                '</section>' +

                menu.menu1[0]+

                '</section>' +

                // edit button
                '<section class="edit">' +

                '<section class="nt">' +
                'Edit <i class="fa fa-caret-down"></i>'+
                '</section>' +

                menu.menu2[0]+

                '</section>' +

                // insert button
                '<section class="insert">' +

                '<section class="nt">' +
                'Insert <i class="fa fa-caret-down"></i>'+
                '</section>' +

                menu.menu3[0]+

                '</section>' +

                // format button
                '<section class="fmt">' +

                '<section class="nt">' +
                'Format <i class="fa fa-caret-down"></i>'+
                '</section>' +

                menu.menu4[0]+

                '</section>' +

                // fonts family button
                '<section class="fonts">' +

                '<section class="nt">' +
                'Fonts <i class="fa fa-caret-down"></i>'+
                '</section>' +

                menu.menu5[0]+

                '</section>' +

                // table button
                '<section class="table">' +

                '<section class="nt">' +
                'Table <i class="fa fa-caret-down"></i>'+
                '</section>' +

                menu.menu6[0]+

                '</section>' +

                // view button
                '<section class="view">' +

                '<section class="nt">' +
                'View <i class="fa fa-caret-down"></i>'+
                '</section>' +

                menu.menu7[0]+

                '</section>' +

                // tools button
                '<section class="tools">' +

                '<section class="nt">' +
                'Tools <i class="fa fa-caret-down"></i>'+
                '</section>' +

                menu.menu8[0]+

                '</section>' +

                '</section>' +

                '</section>'],
                bottomH:['<section class="bottom-header">' +

                '<section class="b-h-holder">' +

                '<section title="Insert an emoji">' +
                n.emoji.emojiBuilder() +
                '<section  class="emoji">' +
                '<i class="fa fa-smile-o"></i>' +
                '</section>' +

                '</section>' +

                '<section class="undo" id="disabled" title="undo">' +

                '<section>' +
                '<i class="fa fa-reply"></i>' +
                '</section>' +

                '</section>' +

                '<section class="redo" id="disabled" title="redo">' +

                '<section>' +
                '<i class="fa fa-share"></i>' +
                '</section>' +

                '</section>' +

                '<section class="bold" id="disabled" title="Bold">' +

                '<section>' +
                '<i class="fa fa-bold"></i>' +
                '</section>' +

                '</section>' +

                '<section class="italic" id="disabled" title="Italic">' +

                '<section>' +
                '<i class="fa fa-italic"></i>' +
                '</section>' +

                '</section>' +

                '<section ' +
                'class="linethrough" id="disabled" title="Strikethrough">' +

                '<section>' +
                '<i class="fa fa-strikethrough"></i>' +
                '</section>' +

                '</section>' +

                '<section class="remove-format" title="Remove format">' +

                '<section>' +
                '<img src="'+lks+'images/logos/format.png">' +
                '</section>' +

                '</section>' +

                '<section ' +
                'class="Insert-remove-ol" title="Insert/Remove Numbered List">' +

                '<section>' +
                '<i class="fa fa-list-ol"></i>' +
                '</section>' +

                '</section>' +

                '<section class="Insert-remove-ul" title="Insert/Remove ' +
                'Bullet List">' +

                '<section>' +
                '<i class="fa fa-list-ul"></i>' +
                '</section>' +

                '</section>' +

                '<section class="color-picker" title="Color picker">' +

                '<section class="colorPicker">' +

                '</section>' +

                '<section class="picker"></section>'+

                '</section>' +

                '<section class="align-left" title="Align left">' +

                '<section>' +
                '<i class="fa fa-align-left"></i>' +
                '</section>' +

                '</section>' +

                '<section class="align-center" title="Align center">' +

                '<section>' +
                '<i class="fa fa-align-center"></i>' +
                '</section>' +

                '</section>' +

                '<section class="align-right" title="Align right">' +

                '<section>' +
                '<i class="fa fa-align-right"></i>' +
                '</section>' +

                '</section>' +

                '<section class="align-justify" title="Align justify">' +

                '<section>' +
                '<i class="fa fa-align-justify"></i>' +
                '</section>' +

                '</section>' +

                '<section class="link" title="Inesert link">' +

                '<section>' +
                '<i class="fa fa-link"></i>' +
                '</section>' +

                '</section>' +

                '<section class="unlink" title="Remove link">' +

                '<section>' +
                '<i class="fa fa-unlink"></i>' +
                '</section>' +

                '</section>' +

                '<section class="indent" title="Indent">' +

                '<section>' +
                '<i class="fa fa-indent"></i>' +
                '</section>' +

                '</section>' +

                '<section class="outdent" title="outdent">' +

                '<section>' +
                '<i class="fa fa-outdent"></i>' +
                '</section>' +

                '</section>' +

                '<section class="insert-media" title="photo/video">' +

                '<section>' +
                '<i class="fa fa-file-photo-o"></i>' +
                '</section>' +

                '</section>' +

                '<section class="blockquote" title="blockquote">' +

                '<section>' +
                '<i class="fa fa-quote-right"></i>' +
                '</section>' +

                '</section>' +

                fb +

                '</section>' +

                '</section>']
            };

            body = {
                body:'<section class="neditor-body">' +
                '<section class="error-log"></section>' +

                '<textarea id="narea" class="textr"></textarea>' +

                '<iframe ' +
                'name="textArea" id="textArea" class="textArea"></iframe>' +

                '</section>'
            };

            footer = {
                ft:'<section class="neditor-footer">' +
                '<section class="nf-left"><p class="result-body"></p></section>' +
                sendB +
                '</section>'
            };

            header = '<section class="neditor-header">'+
                header.topH[0] +
                header.bottomH[0]
                +'</section>';

            body = body.body;

            footer = footer.ft;

            wysiwygWrapper = hasTitle+
                '<section class="neditor" id="neditor">';
            wysiwygWrapper += closable+header+body+footer +
                '<section class="namanager"></section>' +
                '<section class="hidden-shadow"></section>' +
                '<section class="hidden-contents">' +
                '<section class="hidden-header">' +
                '<section class="h-h-content"></section>' +
                '<section class="h-h-cl">' +
                '<i class="fa fa-times-circle"></i> Close</section>' +
                '</section>' +
                '<section class="hidden-body"></section>' +
                '</section>';
            wysiwygWrapper += '</section>'+
                '<section class="neditor-shadow"></section>';

            return wysiwygWrapper;
        };

        /**
         * This method designed specifically for editor field area
         * to keep it clean.
         */
        n.eraser = function () {
            textArea.document.body.innerHTML = "";
            neditor('#narea').value('');

            textArea.document.body.focus();
        };

        /**
         * Page redirector.
         * @param path
         */
        n.href = function (path) {
            window.location.href = (path);
        };

        /**
         * Get client address.
         * @returns {{url: (string|*), path: (Array|*), port: (string|*)}}
         */
        n.addr = function () {
            var
                url = window.location,
                protocols,
                domain,
                paths,
                ports,
                link;

            protocols = url.protocol + "//";
            domain = url.hostname;
            paths = url.pathname;
            ports = url.port;

            paths = paths.split("/");

            link = protocols + domain + "/";

            return {url:link,path:paths,port:ports,domain:domain};
        };

        /**
         * This method returns element values with elements,
         * if no parameter passed or empty parameter passed.,
         * Also gives element values with elements if parameter passed and
         * it's not null.
         * @param val
         * @returns {*}
         */
        n.html = function (val) {
            if(typeof val !== 'undefined' && val !== null && val !== ''){
                this.element.innerHTML = val;
            }else if(n.isNullEditorArea()){
                return this.element.innerHTML;
            }else{
                return this.element.innerHTML;
            }
        };

        /**
         * @param obj
         */
        n.for = function(obj){
            var o = obj,
                start = o.start,
                end = o.data,rule = o.asoc,
                callback = o.callback;


            if(typeof obj === 'undefined' ||
                !this.isObject(obj)){
                this.error('undefined arguments or argument is not an object');
            }

            if(typeof rule !== 'undefined'
                && rule !== null && rule){
                for (var o in end)(callback)(end[o]);
            }
            else{
                if(n.isNumber(end)){
                    for (var i = start; i <= end;i++)(callback)(i);
                }else{
                    for (var i = start; i < end.length;i++)(callback)(i);
                }
            }
        };

        /**
         * Get element position.
         * @type {{left: neditor.offset.left, top: neditor.offset.top, height: neditor.offset.height, width: neditor.offset.width, parentOffset: neditor.offset.parentOffset}}
         */
        n.offset = function(opt) {
            var
                o = opt,
                rect = this.element.getBoundingClientRect(), be = document.body;

            if(typeof o !== 'undefined' && o !== null){
                be = o;
            }

            return {
                top: rect.top + be .scrollTop,
                left: rect.left + be.scrollLeft,
                height:rect.height,
                width:rect.width
            }
        };

        /**
         * @param n
         * @returns {boolean}
         */
        n.isNumber = function(n){
            var nm = /[0-9]/gi;

            if(Number.isInteger(n)){
                return true;
            }else if(nm.test(n)){
                return true;
            }

            return false;
        };

        /**
         * @param value
         */
        n.value = function(value){
            if(typeof value !== 'undefined' && value !== null){
                this.element.value = value;
            }else{
                return this.element.value;
            }
        };

        /**
         * @param url
         * @returns {boolean}
         */
        n.validateUrl = function(url){
            var pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

            return pattern.test(url);
        };

        /**
         * loop each element.
         * @param elem
         * @param callback
         */
        n.each = function (elem,callback) {
            var e = elem;

            if(!n.isObject(elem)){
                e = document.querySelectorAll(elem)
            }
            Array.prototype.slice.call(e).forEach(callback);
        };

        /**
         * This method returns element plain text value if no parameter
         * passed or empty  parameter passed. Also gives element plain
         * text value if parameter passed and it's not null.
         * @param val
         * @returns {*}
         */
        n.text = function (val) {

            if(typeof(val) !== 'undefined' && val !== null && val !== ''){
                this.element.innerText = val;
            }else if(n.isNullEditorArea()){
                return this.element.innerText;
            }else{
                return this.element.innerText;
            }
        };

        /**
         * This method makes html elements easier to design.
         * @param obj
         * @returns {{width: number, height: number}}
         */
        n.style = function(obj){
            var e = this;
            if(n.isObject(obj)){
                var s = obj;

                for(var keys in s){
                    if(e.element !== null){
                        e.element.style[keys] = s[keys];
                    }
                }
            }else{
                return {width:e.element.offsetWidth,
                    height:e.element.offsetHeight};
            }
        };

        /**
         * Closes the editor window.
         * This method only works if close button enabled.
         * @param shadow
         */
        n.closeEditor = function (shadow) {
            var
                url = n.addr(),
                path = url.path,
                domain = url.url;

            if(domain.match('localhost')){
                var cpth = path[5],
                    cp = cpth.charAt(0),
                    addr = domain+path[0]+"/"+path[1]+"/"+path[2]+"/"+path[3]+"/"+path[4]+"/"+cpth;
                if(path[4] !== 'new-thread'){
                    addr = addr+'/'+path[6];
                }else{
                    addr = domain+path[0]+"/"+path[1]+"/"+path[2]+"/"+path[3]+"/"+cp+"/"+cpth;
                }
            }else{
                var cpth = path[5],
                    cp = cpth.charAt(0),
                    addr = domain+path[0]+"/"+path[1]+"/"+path[2]+"/"+path[3]+"/"+path[4]+"/"+cpth;
                if(path[4] !== 'new-thread'){
                    addr = addr+'/'+path[6];
                }else{
                    addr = domain+path[0]+"/"+path[1]+"/"+path[2]+"/"+path[3]+"/"+cp+"/"+cpth;
                }
            }

            if(config.shadow === 'on'){
                //neditor('.neditor').hide('.neditor-shadow',100);
                setTimeout(function () {
                    n.href(addr);
                },101)
            }else{
                setTimeout(function () {
                    n.href(addr);
                },101)
            }
        };

        /**
         * connetion to the server using ajax technology.
         */
        n.xhr = {
            /**
             * checking if client browser supports ajax.
             * @returns {{boolean: boolean, method: null}}
             */
            supported :function () {
                var supported = {
                    boolean:false,
                    method:null
                };

                if(window.XMLHttpRequest){
                    supported = {
                        boolean:true,
                        method:new XMLHttpRequest()
                    };
                }else if(window.ActiveXObject){
                    supported = {
                        boolean:true,
                        method:new ActiveXObject("Microsoft.XMLHTTP")
                    };
                }

                return supported;
            },

            /**
             * opening the connection.
             * @param meth
             * @param url
             */
            onOpen : function (obj) {
                var xhr = this.supported(),
                    meth = obj.meth,
                    url = obj.url,
                    header = 'x-www-form-urlencoded',
                    e = neditor('.error-log'),
                    m = 'Ajax is not supported in your browser. ' +
                        'Please navigate to another browser/or update this one.';

                if(!xhr.boolean){
                    return {el:e,message:m}
                }

                if(typeof obj.header !== 'undefined'
                    && obj.header !== null &&
                    obj.header !== ''){
                    header = obj.header;

                }

                xhr = xhr.method;
                xhr.open(meth,url,true);
                xhr.setRequestHeader('Content-type','application/'+header);

                return xhr;
            },

            /**
             * checking the readystate
             * @param xhr
             * @returns {boolean}
             */
            readyStates : function (xhr) {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200 && xhr.status < 300) {
                        return true;
                    }
                }

                return false;
            },

            /**
             * result method.
             * @param meth
             * @param url
             * @param query
             * @returns {*}
             */
            onMessage : function (obj) {
                var
                    meth = obj.method,
                    url = obj.url,
                    query = obj.query,
                    header = obj.header,
                    callback = obj.success,
                    xhr = this.onOpen({
                        meth:meth,
                        url:url,
                        header:header
                    }),
                    e,m;

                if(n.isObject(xhr)){
                    e = xhr.el;
                    m = xhr.message;
                    e.show(null,500);
                    e.html(m+message.icon);
                    n.error(m);

                    return false;
                }

                xhr.onreadystatechange = callback;
                xhr.send(query);
            }

        };

        /**
         * events handler
         * @param event
         * @param callback
         */
        n.on = function (event,callback) {
            this.element['on' + event] = callback;
        };

        /**
         * Apply custom menu when right click is fired.
         * @param callback
         */
        n.contextmenu = function(callback){
            this.element.oncontextmenu = callback;
        };

        /**
         * Print error to the console.
         * For development purpose only.
         * @param err
         */
        n.error = function (err) {
            if(this.element !== null){
                throw new Error(err);
            }
        };

        /**
         * Print system logs to the console.
         * For development purpose only.
         * @param logs
         */
        n.log = function (msg) {
            if(this.element !== null){
                return console.log(msg);
            }
        };

        /**
         * This method hides parsed element in it.
         * @param shadow
         * @param time
         */
        n.hide = function (shadow,time) {

            if(this.element !== null){
                var
                    s = neditor(shadow),
                    e = this;

                if(time === null || time === ''){
                    time = 100;
                }

                e.style({'transition':'.5s linear 0s','opacity':0});

                if(shadow !== null && shadow !== ''){
                    s.style({"opacity":0});
                }

                setTimeout(function () {
                    e.style({'display':'none'});

                    if(shadow !== null && shadow !== ''){
                        s.style({"display":'none'});
                    }
                },time);
            }
        };

        /**
         * This method shows the element that has been disabled.
         * @param shadow
         * @param time
         */
        n.show = function (shadow,time) {
            if(this.element !== null){
                var
                    s = neditor(shadow),
                    e = this;

                if(typeof time === 'undefined' || time === null || time === ''){
                    time = 100;
                }

                e.style({'transition':'.5s linear 0s','display':'block'});


                setTimeout(function () {
                    e.style({'opacity':1});

                    if(shadow !== null && shadow !== ''){
                        s.style({"opacity":1});
                    }
                },time);
            }

        };

        /**
         * Set attribute to an element.
         * @param name
         * @param value
         * @returns {string}
         */
        n.attr = function (name,value) {
            var
                e = this.element;

            if(name !== null && name !== ''
                && value !== null && value !== ''){
                return e.setAttribute(name,value);
            }else
            if(name !== null || name !== ''
                && value === null || value === ''){
                return e.getAttribute(name);
            }else{
                n.error("undefined attribute name and value");
            }
        };

        /**
         * Remove attribute from an element.
         * @param name
         * @returns {neditor}
         */
        n.rAttr = function (name) {
            var e = this.element;

            if(name !== null && name !== ''){
                e.removeAttribute(name);
                return this;
            }else{
                n.error("undefined attribute name");
            }

        };

        /**
         * @returns {*}
         */
        n.parent = function () {
            return this.element.parentElement;
        };

        /**
         * @returns {HTMLElement[]}
         */
        n.children = function () {
            return this.element.children;
        };

        /**
         * @returns {Node}
         */
        n.firstChild = function () {
            return this.element.firstChild;
        };

        /**
         * @returns {Node}
         */
        n.lastChild = function(){
            return this.element.lastChild;
        }

        /**
         * @param newel
         */
        n.after = function(newel){
            var parent = this.element.parentNode;

            if (parent.lastChild == this.element) {
                parent.appendChild(newel);
            } else {
                parent.insertBefore(newel, this.element.nextSibling);
            }
        };

        /**
         * @param index
         */
        n.removeElement = function (index) {
            var p = this.element.parentNode;
            p.removeChild(p.childNodes[index]);
        };

        /**
         * Hide and show elements
         * @param shadow
         * @param time
         */
        n.toggle = function (obj) {

            if(obj !== null){
                var
                    s = neditor(obj.shadow),
                    e = neditor(obj.element),
                    time = obj.time,t1 = 100;

                if(typeof time === 'undefined' ||
                    time === null ||
                    time === ''){
                    time = 100;
                }


                if(e.element !== null
                    && this.element !== null){

                    if(e.element.style.display === 'block'){
                        e.style({'opacity':0});
                        if(s.element !== null){
                            s.style({'opacity':0});
                        }

                        setTimeout(function () {
                            e.style({'display':'none'});

                            if(s.element !== null){
                                s.style({'display':'none'});
                            }
                        },time);
                    }else{

                        if(s.element !== null){
                            s.style({'display':'block'});
                        }

                        e.style({'display':'block'});

                        setTimeout(function () {
                            e.style({'opacity':1});

                            if(s.element !== null){
                                s.style({'opacity':1});
                            }
                        },t1);
                    }
                }
            }

        };

        /**
         * This method returns browser informations object.
         * @type {{browserName: neditor.browserInfo.browserName, browserVersion: neditor.browserInfo.browserVersion, browserData: neditor.browserInfo.browserData}}
         */
        n.browserInfo = {
            browserName:function(){
                var i = 0,stringData,strings = this.browserData();

                for (; i < strings.length; i++){
                    stringData = strings[i].string;
                    this.versionSearchString = strings[i].subString;

                    if(stringData.indexOf(strings[i].subString) !== -1){
                        return strings[i].identity;
                    }
                }
            },

            browserVersion:function () {
                var
                    ua = navigator.userAgent.indexOf(this.versionSearchString),
                    nv = navigator.appVersion,
                    version = 'Unknown',
                    rv,
                    versionData;

                if(ua !== -1){
                    version = ua;
                }else if(nv !== -1){
                    version = nv;
                }

                versionData = version;

                return versionData;
            },

            browserData:function () {
                var array = [
                    {string: navigator.userAgent,
                        subString: "Edge", identity: "MS Edge"},
                    {string: navigator.userAgent,
                        subString: "MSIE", identity: "Explorer"},
                    {string: navigator.userAgent,
                        subString: "Trident", identity: "Explorer"},
                    {string: navigator.userAgent,
                        subString: "Firefox", identity: "Firefox"},
                    {string: navigator.userAgent,
                        subString: "Opera", identity: "Opera"},
                    {string: navigator.userAgent,
                        subString: "OPR", identity: "Opera"},

                    {string: navigator.userAgent,
                        subString: "Chrome", identity: "Chrome"},
                    {string: navigator.userAgent,
                        subString: "Safari", identity: "Safari"}
                ];

                return array;
            }
        };

        /**
         * return contentArea value
         */
        n.getContents = function(){
            if(typeof this !== 'undefined' &&
                this.element !== null){
                var e = neditor('#narea'),
                    t = neditor('.topic-title');

                if(e.element !== null){

                    var frame = neditor(textArea.document.body).html();

                    if(e.element !== null){
                        e.value(frame);
                    }
                }

                if(t.element !== null){
                    return {
                        c:e.value(),
                        tc:t.value(),
                        te:t,
                        file:config.ExtraContents
                    }
                }
                return e.value();
            }
        };

        /**
         * Show public error message.
         * @param msg
         */
        n.errorLog = function(msg){
            if(typeof this !== 'undefined'
                && this.element !== 'undefined'){

                var e = neditor('.error-log');
                e.show(null,null);
                e.html(msg+message.icon);
                return {e:e};
            }
        };

        /**
         * focus the editor
         */
        n.focus = function(){
            var el  = neditor('.textArea');
            el.element.focus();
        };

	
	/**
         * @param d
         * @returns {string}
         */
        n.date = function (today) {
            var week = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
            var day  = week[today.getDay()];
            var dd   = today.getDate();
            var mm   = today.getMonth()+1; //January is 0!
            var yyyy = today.getFullYear();
            var hour = today.getHours();
            var minu = today.getMinutes();
            var sec = today.getSeconds();

            if(dd<10)  { dd='0'+dd }
            if(mm<10)  { mm='0'+mm }
            if(minu<10){ minu='0'+minu }
            if(sec<10){ minu='0'+minu }
            if(hour<10)  { hour='0'+hour }

            return yyyy+'-'+mm+'-'+dd+' '+hour+':'+minu+":"+sec;
        };


        return n;
    };

$n = function(sel){
    return neditor(sel);
};
