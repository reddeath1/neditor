<?php
/**
 * Created by IntelliJ IDEA.
 * User: reddeath
 * Date: 5/19/2017
 * Time: 10:51 PM
 */

namespace neditor;
error_reporting(0);
/**
 * Class neditor
 * @package neditor
 */
class neditor
{

    /**
     * @param $dir
     * @return string
     */
    public function emojies($dir){

        $data = '{';
        $dirHandler = opendir($dir);
        $i = 0;
        while ($file = readdir($dirHandler)) {
            if(!is_dir($file) && strpos($file, '.png')){
                $i++;

                $dir = str_replace('..','',$dir);
                $name = str_replace('.png','',$file);

                $src = "$dir$file";
                $data .= '"emoji'.$i.'":
                { "num":"'.$i.'",
                "src":"'.$src.'", 
                "name":"'.$name.'" 
                },';
            }
        }
        closedir($dirHandler);
        $data = chop($data, ",");
        $data .= '}';

        return $data;
    }

    /**
     * @param $dir
     * @param $filename
     * @param $loc
     * @return string
     */
    public function upload($dir,$filename,$loc){
        $status = '';

        define('dir',explode('/',$dir));

        if(!is_dir(dir[0].'/'.dir[1].'/')) {
            mkdir(dir[0].'/'.dir[1].'/',06444);
        }

        if(!is_dir(dir[0].'/'.dir[1].'/'.dir[2].'/')) {
            mkdir(dir[0].'/'.dir[1].'/'.dir[2].'/',0644);
        }

        if(!is_dir($dir)) {
            mkdir($dir,0644);
        }

        $filename = preg_replace("#[^a-z0-9._]#i","",$filename);

        if(!file_exists($dir."".$filename)) {
            if(move_uploaded_file($loc, $dir."".$filename)) {
                //chmod(dir[0].'/',0777);
               // chmod(dir[1].'/',0777);
//                chmod(dir[0].'/'.dir[1].'/'.dir[2].'/',0777);
//                chmod($dir,0777);
                chmod($dir.$filename,0644);

                $ext = explode('.',$filename);
                $ext = end($ext);
                $ext = $ext[1];

                $this->rotate($dir.$filename,$ext);

                /*$this->water_mark($dir.$filename,'../images/logos/nh.png',$filename);*/

                $status = 'uploaded:'.$filename;

                $dir = str_replace('../','',$dir);
            }else{
                $status = 'failed:File failed to be moved to the specified directory.';
            }

        }else{
            $status = 'failed:File does not exists.';
        }

        return json_encode(array('status'=>$status,'path'=>$dir));
    }

    /**
     * @param $path
     */
    public function rotate($path,$ext){
        $exif = exif_read_data($path);
        if(isset($exif['Orientation']) && $exif['Orientation'] != "1"){
            $position = $exif['Orientation'];
            $degrees = "";
            if($position == "8"){
                $degrees = "90";
            } else if($position == "3"){
                $degrees = "180";
            } else if($position == "6"){
                $degrees = "-90";
            }


            if($degrees == "90" || $degrees == "180" || $degrees == "-90"){

                if($ext === "gif" || $ext === "GIF"){
                    $source = imagecreatefromgif($path);
                }else if($ext === "png" || $ext === "PNG"){
                    $source = imagecreatefrompng($path);
                }else{
                    $source = imagecreatefromstring(file_get_contents($path));
                }

                list($w_org,$h_org) = getimagesize($path);

                $fbk = imagecreatetruecolor($w_org,$h_org);
                imagecopyresampled($fbk,$source,0,0,0,0,$w_org,$h_org,$w_org,$h_org);

                $rotate = imagerotate($source, $degrees, 0);
                imagejpeg($rotate, realpath($path));

                imagedestroy($source);
                imagedestroy($rotate);
            }

        }
    }

    /**
     * @param $target
     * @param $watermak
     * @param $file
     */
    public function water_mark($target,$watermak,$file){
        $watermak = imagecreatefrompng($watermak);
        imagealphablending($watermak,false);
        imagesavealpha($watermak,true);
        $img = imagecreatefromjpeg($target);
        $i_w = imagesx($img);
        $i_h = imagesy($img);
        $w_w = imagesx($watermak);
        $w_h = imagesy($watermak);

        $dsx = ($i_w / 2) - ($w_w / 12);
        $dsy = ($i_h / 2) - ($w_h / 2);

        imagecopy($img,$watermak,$dsx,$dsy,0,0,$w_w,$w_h);
        imagejpeg($img,$file,100);
        imagedestroy($img);
        imagedestroy($watermak);
    }

    /**
     * @param $target
     * @param $new_jpg
     * @param $ext
     */
    public function toJPG($target,$new_jpg,$ext){
        list($w_org,$h_org) = getimagesize($target);
        $img = "";
        if($ext === "png"){
            $img = imagecreatefrompng($target);
        }else if($ext === "gif"){
            $img = imagecreateformgif($target);
        }

        $tc = imagecreatetruecolor($w_org,$h_org);
        imagecopyresampled($tc,$img,0,0,0,0,$w_org,$h_org,$w_org,$h_org);
        imagejpeg($tc,$new_jpg,84);
    }

    /**
     * @return string
     */
    public function pageUrl(){
        $page_url   = 'http';
        if(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'){
            $page_url .= 's';
        }
        return $page_url.'://'.$_SERVER['SERVER_NAME'];
    }

    /**
     * @param $path
     * @return bool
     */
    public function Delete($path){
        if (is_dir($path) === true)
        {
            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::CHILD_FIRST);

            foreach ($files as $file)
            {
                if (in_array($file->getBasename(), array('.', '..')) !== true)
                {
                    if ($file->isDir() === true)
                    {
                        rmdir($file->getPathName());
                    }

                    else if (($file->isFile() === true) || ($file->isLink() === true))
                    {
                        unlink($file->getPathname());
                    }
                }
            }

            return rmdir($path);
        }

        else if ((is_file($path) === true) || (is_link($path) === true))
        {
            return unlink($path);
        }

        return false;
    }
}
