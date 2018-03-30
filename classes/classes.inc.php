<?php

namespace users_class;
ini_set("gd.jpeg_ignore_warning", 1);

/**
 * Class users
 * @package users_class
 */
class users{
	private $con;
	private $sql;
	private $info;
	private $infos;
	private $status = array();
	private $usta = array();
	private $udat;
	private $udatas;
	private $uinfos;
	private $uinfo;

    /**
     * @param $con
     * @param $u
     * @return array|bool
     */
	public function getPostCount($con,$u){
		$this->con = $con;
		$status = array();
		$this->sql = $this->con->query("SELECT f.*,COUNT(f.id) as fid FROM feeds as f LEFT JOIN nevaas_users as u ON(f.user_id = u.id) WHERE f.user_id = '$u' ORDER BY f.id DESC");
		
		if($this->sql->num_rows > 0) {
			while($row = $this->sql->fetch_array(MYSQLI_ASSOC)) {
				$status[] = $row;
			}
				
			return $status;
			
		}else {
			return false;
		}
	}

    /**
     * @param $con
     * @param $tb
     * @param $tb1
     * @param $tb2
     * @param $arg
     * @param $alias
     * @param $a1
     * @param $a2
     * @param $arg1
     * @param $arg2
     * @param $arg3
     * @param $align
     * @param $limit
     * @param $state
     * @return array|bool
     */
	public function getAll($con,$tb,$tb1,$tb2,
                           $arg,$alias,$a1,$a2,
                           $arg1,$arg2,$arg3,
                           $align,$limit,$state) {
		$av = "";
		$av1 = "";
		$av2 = "";
		$av3 = "";
		$status = array();
		
		if(!empty($alias)) {
			$alias = " $tb as $alias LEFT JOIN ";
		}else if(!empty($tb)) {
			$av1 = $tb;
		}
		
		if(!empty($a1) && !empty($tb1)) {
			$a1 = " $tb1 as $a1";
		}
		
		
		if(!empty($a2) && !empty($tb2)) {
			$a2 = " LEFT JOIN $tb2 as $a2";
		}
		
		
		if(is_array($arg)) {
			foreach($arg as $values){
				$av .= $values.",";		
			}
			
			$av = chop($av,",");
		}
		
		if(!empty($arg1)) {
			if(is_array($arg1)) {
				foreach($arg1 as $key => $value){
					$av1 .= " ON( ".$key." = ".$value." )";
				}
			
					$av1 = $alias."".$a1." ".$av1;
				}
		}
		
		if(!empty($arg2) && is_array($arg2)) {
			foreach($arg2 as $key => $value){
				$av2 = " ON( ".$key." = ".$value." )";
			}
			 $av2 = $a2."".$av2;
		}
		
		if(!empty($arg3) && is_array($arg3)) {
			foreach($arg3 as $key => $value){
				$av3 .= $key." = '".$value."' AND ";
			}
			
			$av3 = " WHERE ".chop($av3," AND ");
		}


		$sql = $con->query("SELECT $av FROM $av1 $av2  $av3 $align $limit");

		if($sql->num_rows > 0) {
			if(!empty($state)) {
				while($rows = $sql->fetch_array(MYSQLI_ASSOC)) {
					$status[] = $rows;
				}
				return $status;
			}else {
				return true;
			}
		}else {
			return false;
		}
	}

	public function get($con,$tb,$tb1,$tb2,
                            $arg,$alias,$a1,$a2,
                            $arg1,$arg2,$arg3,
                            $align,$limit,$state,$rule){
        $av = "";
        $av1 = "";
        $av2 = "";
        $av3 = "";
        $status = array();

        if(!empty($alias)) {
            $alias = " $tb as $alias LEFT JOIN ";
        }else if(!empty($tb)) {
            $av1 = $tb;
        }

        if(!empty($a1) && !empty($tb1)) {
            $a1 = " $tb1 as $a1";
        }


        if(!empty($a2) && !empty($tb2)) {
            $a2 = " LEFT JOIN $tb2 as $a2";
        }


        if(is_array($arg)) {
            foreach($arg as $values){
                $av .= $values.",";
            }

            $av = chop($av,",");
        }

        if(!empty($arg1)) {
            if(is_array($arg1)) {
                foreach($arg1 as $key => $value){
                    $av1 .= " ON( ".$key." = ".$value." )";
                }

                $av1 = $alias."".$a1." ".$av1;
            }
        }

        if(!empty($arg2) && is_array($arg2)) {
            foreach($arg2 as $key => $value){
                $av2 = " ON( ".$key." = ".$value." )";
            }
            $av2 = $a2."".$av2;
        }

        if(!empty($arg3) && is_array($arg3)) {
            foreach($arg3 as $key => $value){
                $av3 .= $key." $rule '".$value."' AND ";
            }

            $av3 = " WHERE ".chop($av3," AND ");
        }


        $sql = $con->query("SELECT $av FROM $av1 $av2  $av3 $align $limit");

        if($sql->num_rows > 0) {
            if(!empty($state)) {
                while($rows = $sql->fetch_array(MYSQLI_ASSOC)) {
                    $status[] = $rows;
                }
                return $status;
            }else {
                return true;
            }
        }else {
            return false;
        }
    }


    /**
     * @param $con
     * @param $tb
     * @param $tb1
     * @param $tb2
     * @param $arg
     * @param $alias
     * @param $a1
     * @param $a2
     * @param $arg1
     * @param $arg2
     * @param $arg3
     * @param $align
     * @param $limit
     * @param $state
     * @return array|bool
     */
    public function gets($con,$tb,$tb1,$tb2,
                         $arg,$alias,$a1,$a2,
                         $arg1,$arg2,$arg3,
                         $align,$limit,$state,$order){
        $av = "";
        $av1 = "";
        $av2 = "";
        $av3 = "";
        $status = array();

        if(!empty($alias)) {
            $alias = " $tb as $alias LEFT JOIN ";
        }else if(!empty($tb)) {
            $av1 = $tb;
        }

        if(!empty($a1) && !empty($tb1)) {
            $a1 = " $tb1 as $a1";
        }


        if(!empty($a2) && !empty($tb2)) {
            $a2 = " LEFT JOIN $tb2 as $a2";
        }


        if(is_array($arg)) {
            foreach($arg as $values){
                $av .= $values.",";
            }

            $av = chop($av,",");
        }

        if(!empty($arg1)) {
            if(is_array($arg1)) {
                foreach($arg1 as $key => $value){
                    $av1 .= " ON( ".$key." = ".$value." )";
                }

                $av1 = $alias."".$a1." ".$av1;
            }
        }

        if(!empty($arg2) && is_array($arg2)) {
            foreach($arg2 as $key => $value){
                $av2 = " ON( ".$key." = ".$value." )";
            }
            $av2 = $a2."".$av2;
        }

        if(!empty($arg3) && is_array($arg3)) {
            foreach($arg3 as $key => $value){
                $av3 .= $key." = '".$value."' AND ";
            }

            $av3 = " WHERE ".chop($av3," AND ");
        }


        $sql = $con->query("SELECT * FROM (SELECT $av FROM $av1 $av2  $av3 $align $limit) AS reddeath $order");

        if($sql->num_rows > 0) {
            if(!empty($state)) {
                while($rows = $sql->fetch_array(MYSQLI_ASSOC)) {
                    $status[] = $rows;
                }
                return $status;
            }else {
                return true;
            }
        }else {
            return false;
        }
    }

    /**
     * @param $con
     * @param $tb
     * @param $tb1
     * @param $tb2
     * @param $arg
     * @param $alias
     * @param $a1
     * @param $a2
     * @param $arg1
     * @param $arg2
     * @param $arg3
     * @param $align
     * @param $limit
     * @param $state
     * @param $differs
     * @return array|bool
     */
	public function getDistinctData($con,$tb,$tb1,
                                    $tb2,$arg,$alias,
                                    $a1,$a2,$arg1,$arg2,
                                    $arg3,$align,$limit,
                                    $state,$differs){


        $con = $con;
        $av = "";
        $av1 = "";
        $av2 = "";
        $av3 = "";
        $ali1 = "";
        $ali = $alias;
        $status = array();

        if(!empty($alias)) {
            $alias = " $tb as $alias LEFT JOIN ";
        }else if(!empty($tb)) {
            $av1 = $tb;
        }

        if(!empty($a1) && !empty($tb1)) {
            $a1 = " $tb1 as $a1";
        }


        if(!empty($a2) && !empty($tb2)) {
            $a2 = " LEFT JOIN $tb2 as $a2";
        }


        if(is_array($arg)) {
            foreach($arg as $values){
                $av .= $values.",";
            }

            $av = chop($av,",");
        }

        if(!empty($arg1)) {
            if(is_array($arg1)) {
                foreach($arg1 as $key => $value){
                    $av1 .= " ON( ".$key." = ".$value." )";
                }

                $av1 = $alias."".$a1." ".$av1;
            }
        }

        if(!empty($arg2) && is_array($arg2)) {
            foreach($arg2 as $key => $value){
                $av2 = " ON( ".$key." = ".$value." )";
            }
            $av2 = $a2."".$av2;
        }

        if(!empty($arg3) && is_array($arg3)) {
            foreach($arg3 as $key => $value){
                $av3 .= $key." = '".$value."' AND ";
            }

            $av3 = " WHERE ".chop($av3," AND ");
        }
        $ali1 = $ali."reddeath";
        $ali = $ali."reddeath.";

        $sql = $con->query("SELECT ".$ali."* FROM (SELECT $av FROM $av1 $av2  $av3 $align $limit) AS 
$ali1 GROUP BY ($differs)  DESC");

        if($sql->num_rows > 0) {
            if(!empty($state)) {
                while($rows = $sql->fetch_array(MYSQLI_ASSOC)) {
                    $status[] = $rows;
                }
                return $status;
            }else {
                return true;
            }
        }else {
            return false;
        }
    }


    /**
     * get not equal values.
     */
    public function notEqual($con,$tb,$arg1,$arg,$arg2,$state){
       $v1 = '';
       $v2 = '';
       $reponse = '';
        if(is_array($arg)){
            foreach ($arg as $key => $v){
                $v1 .= $key." = '".$v."' AND ";
            }

            $v1 = " WHERE ".chop($v1,' AND ');
        }

        if(is_array($arg2)){
            foreach ($arg2 as $key => $v){
                $v1 .= " AND ".$key." != '".$v."' AND ";
            }

            $v1 = chop($v1,' AND ');
        }

        if(is_array($arg1)){
            foreach ($arg1 as $v){
                $v2 .= $v." , ";
            }

            $v2 = chop($v2,' , ');
        }


        $ne = $con->query("SELECT $v2 FROM $tb $v1");

        if($ne->num_rows){
            if(!empty($state)){
                while($rows = $ne->fetch_array(MYSQLI_ASSOC)){
                    $reponse[] = $rows;
                }

                return $reponse;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    /**
     * @param $con
     * @param $tb
     * @param $arg
     * @param $arg1
     * @return bool
     */
	public function isPosted($con,$tb,$arg,$arg1)
    {
		$values ="";
		$value1 ="";
		$where = '';
		if(is_array($arg)) {
			foreach($arg as $key => $value){
				$values .= $key." = '".$con->real_escape_string($value)."', ";
			}
			
			$values = chop($values,', ');
		}
		
		if(is_array($arg1)) {
			foreach($arg1 as $key => $value){
				$value1 .= $key." = '".$con->real_escape_string($value)."' AND ";
			}
			
			$where = " WHERE ".chop($value1,' AND ');
		}
		
		$sql = $con->query("INSERT INTO $tb SET $values $where");
		if($sql) {
			return true;
		}else {
			return false;
		}
	}

    /**
     * @param $con
     * @param $tb
     * @param $arg
     * @param $arg1
     * @param $limit
     * @return bool
     */
    public function updater($con,$tb,$arg,$arg1,$limit) {
        $upsts = "";
        $upst = "";
        $dbs = $tb;
        $infos = "";
        $extr = "";

        if(is_array($arg1)) {

            foreach($arg1 as $key => $value){
                $upsts .= "$key = '".$con->real_escape_string($value)."'"." AND ";
            }

            $infos = " WHERE ".chop($upsts," AND ");

        }

        if(is_array($arg)) {
            foreach($arg as $key => $value){
                $upst .= "$key = '".$con->real_escape_string($value)."'"." , ";
            }

            $extr = chop($upst," , ");
        }

        $sql = $con->query("UPDATE $dbs SET $extr $infos $limit");
        return ($sql) ? true : false;
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
        $dsy = ($i_h / 1.2) - ($w_h / 2);
        imagecopy($img,$watermak,$dsx,$dsy,0,0,$w_w,$w_h);
        imagejpeg($img,$file,100);
        imagedestroy($img);
        imagedestroy($watermak);
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

    /**
     * @param $con
     * @param $tb
     * @param $args
     * @param $limit
     * @return mixed
     */
    public function deleteSomething($con,$tb,$args,$limit) {
        $this->con = $con;
        $this->dbs = $tb;
        $delete = "";

        if(is_array($args)) {

            foreach($args as $key => $value){
                $delete .= "$key = '".$this->con->real_escape_string($value)."'"." AND ";
            }

            $infos = chop($delete," AND ");

        }

        if(!empty($limit)){
            $limit = "LIMIT ".$limit;
        }else{
            $limit = "";
        }

        $sql = $con->query("DELETE FROM $tb WHERE $infos $limit");

        if($sql) {
            return true;
        }else{
            return false;
        }
    }

    /**
     * @param $text
     * @return string
     */
    public function sanitizer($text){
		$t = htmlentities($text);
		$t = strip_tags($t);
		$t = stripcslashes($t);
		$t = trim($t);

		return $t;
	}

    /**
     * @return string
     */
    public function birthDates(){
        $form ="<select id='day'><option value=''>Day</option>";
        for($i = 1; $i <= 31;$i++){
            if($i < 10){
                $i = "0".$i;
            }
            $form .= "<option value=\"$i\">$i</option>";
        }

        $form .= "</select><select id='month'><option value=''>Month</option>";
        $months = array('01'=>'Jan','02'=>'Feb','03'=>'Mar','04'=>'Feb','05'=>'May','06'=>'Jun','07'=>'Jul','08'=>'Aug','09'=>'Sep','10'=>'Oct','11'=>'Nov','12'=>'Dec');

        foreach( $months as $k=>$v ){
            $form .= "<option value='$k'>$v</option>".PHP_EOL;
        }

        $form .= "</select><select id='year'><option value=''>Year</option>";
        $years = range( date('Y'), '1910');

        foreach( $years as $y ){
            $form .= "<option value='$y'>$y</option>".PHP_EOL;
        }

        $form .="</select>";
        return $form;
    }

    /**
     * @param $con
     * @param $tb
     * @param $arg
     * @param $arg1
     * @param $arg2
     * @param $limit
     * @param $isNum
     * @return array|bool|string
     */
    public function get_multi_statements($con,$tb,$arg,$arg1,$arg2,$limit,$isNum){
		$sets = "";
		$lsets = "";
        $rsets = "";
        $allsets = "";
        $queryies = "";

    	if(is_array($arg)){
    		foreach ($arg as $v){
				$sets .= $con->real_escape_string($v).",";
			}

			$sets = chop($sets,",");
		}

		if(is_array($arg1)){
            foreach ($arg1 as $k => $lv) {
                $lsets .= $k." = ".$con->real_escape_string("'$lv'")." AND ";
    		}
            $lsets = preg_replace("#[^0-9a-z'= ]#i","",$lsets);
			$lsets = chop($lsets," AND ");
		}

        if(is_array($arg2)){
            foreach ($arg2 as $k => $lv) {
                $rsets .= $k." = ".$con->real_escape_string("'$lv'")." AND ";
            }
            $rsets = preg_replace("#[^0-9a-z'= ]#i","",$rsets);
            $rsets = chop($rsets," AND ");
        }

        if(!empty($lsets) && !empty($rsets)){
        	$allsets = $lsets." OR ".$rsets;

        	$allsets = "WHERE ".$allsets;
		}

        $sql = $con->query("SELECT $sets FROM $tb $allsets $limit");
        if($sql->num_rows > 0){
            if(!empty($isNum)){
                while ($rows = $sql->fetch_array(MYSQLI_ASSOC)){
                    $queryies[] = $rows;
                }

                return $queryies;
            }else{
                return true;
            }

        }else{
            return false;
        }
	}

    /**
     * get relations tables
     * @param $con
     * @param $tb
     * @param $tb1
     * @param $tb2
     * @param $a
     * @param $a1
     * @param $a2
     * @param $arg0
     * @param $arg
     * @param $arg1
     * @param $arg2
     * @param $arg3
     * @param $arg4
     * @param $arg5
     * @param $limit
     * @param $isNum
     * @return array|bool|string
     */
    public function get_multi_relation($con,
                                       $tb,$tb1,$tb2,
                                       $a,$a1,$a2,$arg0,
                                       $arg,$arg1,$arg2,
                                       $arg3,$arg4,$arg5,
                                       $limit,$isNum){
        $_a1 = "";
        $_a2 = "";
        $_a3 = "";
        $_arg = "";
        $_args = "";
        $_arg_values = "";
        $tbs_join = "";
        $checker = "";
        $_arg_or = "";
        $_arg_or1 = "";
        $selectors = "";
        $where_to = "";
        $checker1 = "";
        $queries = "";


        if(!empty($tb)){
            $_a1 = $a;
        }

        if(!empty($tb1)){
            $_a2 = $a1;
        }

        if(!empty($tb2)){
            $_a3 = $a2;
        }

        if(!empty($arg0) && is_array($arg0)){
            foreach ($arg0 as $item) {
                $selectors .= $con->real_escape_string("$item")." , ";
            }
            $selectors = preg_replace("#[^0-9a-z'=._,* ]#i","",$selectors);
            $selectors = chop($selectors," , ");
        }

        if(!empty($arg) && is_array($arg)){
            foreach ($arg as $key => $item) {
                $_arg .= "$key = ".$con->real_escape_string("$item")." AND ";
            }
            $_arg = preg_replace("#[^0-9a-z'=._,* ]#i","",$_arg);
            $_arg = chop($_arg," AND ");
        }

        if(!empty($arg4) && is_array($arg4)){
            foreach ($arg4 as $key => $item) {
                $_arg_or .= "$key = ".$con->real_escape_string("$item")." AND ";
            }
            $_arg_or = preg_replace("#[^0-9a-z'=._,* ]#i","",$_arg_or);
            $_arg_or = " OR ".chop($_arg_or," AND ");
        }

        if(!empty($arg5) && is_array($arg5)){
            foreach ($arg5 as $key => $item) {
                $_arg_or1 .= "$key = ".$con->real_escape_string("$item")." AND ";
            }
            $_arg_or1 = preg_replace("#[^0-9a-z'=._,* ]#i","",$_arg_or1);
            $_arg_or1 = " AND ".chop($_arg_or1," AND ");
        }

        if(!empty($arg1) && is_array($arg1)){
            foreach ($arg1 as $key => $item) {
                $_args .= "$key = ".$con->real_escape_string("$item")." AND ";
            }
            $_arg = preg_replace("#[^0-9a-z'=._,* ]#i","",$_args);
            $_arg = chop($_args," AND ");
        }

        if(!empty($_arg) && empty($_args)){
            $_arg_values = " ON ($_arg $_arg_or)";
        }else if(!empty($_arg) && !empty($_args)){
            $_arg_values = " ON ($_arg $_arg_or) LEFT JOIN $tb2 AS $_a3 ON ($_args $_arg_or1)";
        }

        if(!empty($_a1) && !empty($_a2) && empty($_a3)){
            $tbs_join = "$tb AS $_a1 LEFT JOIN $tb1 AS $_a2 $_arg_values";
        }else if(!empty($_a1) && !empty($_a2) && !empty($_a3)){
            $tbs_join = "$tb AS $_a1 LEFT JOIN $tb1 AS $_a2 $_arg_values";
        }else if(!empty($_a1) && empty($_a2) && empty($_a3)){
            $tbs_join = $tb;
        }

        if(!empty($arg2) && is_array($arg2)){
            foreach ($arg2 as $key => $item) {
                $checker .= "$key = ".$con->real_escape_string("'$item'")." AND ";
            }
            $checker = preg_replace("#[^0-9a-z'=_.,* ]#i","",$checker);
            $checker = chop($checker," AND ");
        }

        if(!empty($arg3) && is_array($arg3)){
            foreach ($arg3 as $key => $item) {
                $checker1 .= "$key = ".$con->real_escape_string("'$item'")." AND ";
            }
            $checker1 = preg_replace("#[^0-9a-z'=_.,* ]#i","",$checker1);
            $checker1 = chop($checker1," AND ");
        }

        if(!empty($checker) && !empty($checker1)){
            $where_to = " WHERE $checker OR $checker1";
        }else if(!empty($checker) && empty($checker1)){
            $where_to = " WHERE $checker";
        }else if(empty($checker) && !empty($checker1)){
            $where_to = " WHERE $checker1";
        }

       $sql = $con->query("SELECT $selectors FROM $tbs_join $where_to $limit");

        if($sql->num_rows > 0){
            if(!empty($isNum)){
                while ($rows = $sql->fetch_array(MYSQLI_ASSOC)){
                    $queries[] = $rows;
                }

                return $queries;
            }else{
                return true;
            }
        }else{
            return false;
        }

    }

    /**
     * @param $con
     * @param $user
     * @return array
     */
    public function get_all_friends($con,$user,$limit){
        $max_friends = 17;
        $friends_list = array();
        $all_friends = array();
        $or_friend_logic = "";

        $friends_ = $this->getAll($con,"friends","","",array(" user1 "),"","","","","",array("user2"=>$user,"accepted"=>"1"),"","","all");


        if($friends_){
            foreach ($friends_ as $friend) {
                array_push($friends_list,$friend["user1"]);
            }
        }

        $friends_ = $this->getAll($con,"friends","","",array(" user2 "),"","","","","",array("user1"=>$user,"accepted"=>"1"),"","","all");


        if($friends_){
            foreach ($friends_ as $friend) {
                array_push($friends_list,$friend["user2"]);
            }
        }

        $friend_array_count = count($friends_list);
        if($friend_array_count > $max_friends){
            array_splice($friends_list,$max_friends);
        }


        foreach ($friends_list as $uv) {
            $or_friend_logic .= "id = '$uv' OR ";
        }

        $or_friend_logic = chop($or_friend_logic,"OR ");

        $sql = $con->query("SELECT id as user_id,user_name,
                                    profile_pic,
                                    last_seen FROM 
                                    nevaas_users WHERE 
                                    $or_friend_logic $limit");

        if($sql->num_rows > 0){
            while($rows = $sql->fetch_array(MYSQLI_ASSOC)){
                $all_friends[] = $rows;
            }

            return $all_friends;
        }
    }

    /**
     * @param $con
     * @param $user
     * @return array
     */
    public function get_all_friends_request($con,$user,$limit){
        $max_friends = 17;
        $friends_list = array();
        $all_friends = array();
        $or_friend= "";

        $friends_ = $this->getAll($con,"friends","","",
            array("user1 "),"","","","","",
            array("user2"=>$user,"accepted"=>0),"","","all");


        if($friends_){
            foreach ($friends_ as $friend) {
                array_push($friends_list,$friend["user1"]);
            }
        }

        $friends_ = $this->getAll($con,"friends","","",
            array(" user2 "),"","","","","",
            array("user1"=>$user,"accepted"=>0),"","","all");


        if($friends_){
            foreach ($friends_ as $friend) {
                array_push($friends_list,$friend["user2"]);
            }
        }

        $friend_array_count = count($friends_list);
        if($friend_array_count > $max_friends){
            array_splice($friends_list,$max_friends);
        }


        foreach ($friends_list as $uv) {
            $or_friend .= "id = '$uv' OR ";
        }

        $or_friend = chop($or_friend,"OR ");

        if(!empty($or_friend)){
            $sql = $con->query("SELECT id as user_id,user_name,
                                    profile_pic,
                                    last_seen FROM 
                                    nevaas_users WHERE 
                                    $or_friend $limit");

            if($sql->num_rows > 0){
                while($rows = $sql->fetch_array(MYSQLI_ASSOC)){
                    $all_friends[] = $rows;
                }

                return $all_friends;
            }
        }else{
            return false;
        }
    }

    /**
     * @param $con
     * @param $tb
     * @param $tb1
     * @param $tb2
     * @param $arg
     * @param $arg1
     * @param $arg2
     * @param $arg3
     * @param $a
     * @param $a1
     * @param $a2
     * @param $arg4
     * @param $state
     * @return array|bool
     */
    public function search($con,
                           $tb,$tb1,$tb2,
                           $arg,$arg1,$arg2,
                           $arg3,$a,$a1,$a2,
                           $arg4,$state){
        $con = $con;
        $al1 = "";
        $al2 = "";
        $v = "";
        $v1 = "";
        $v2 = "";
        $v3 = "";
        $v4 = "";
        $status = array();

        if(!empty($tb)) {
            $al = $tb." as ".$a;
        }else {
            $al = $tb;
        }

        if(!empty($tb1) && !empty($a1)) {
            $al1 = " LEFT JOIN $tb1 as $a1";
        }

        if(!empty($tb2) && !empty($a2)) {
            $al2 = " LEFT JOIN $tb2 as $a2";
        }

        if(!empty($arg)) {
            if(is_array($arg)) {
                foreach($arg as $value){
                    $v .= $con->real_escape_string($value).",";
                }

                $v = chop($v,",");

            }else {
                $v = $arg;
            }

        }

        if(!empty($arg1)) {
            if(is_array($arg1)) {
                foreach($arg1 as $key => $value){
                    $v1 .= "(".$con->real_escape_string($key)." = ".$con->real_escape_string($value).")";
                }
                $v1 = $al1." ON $v1";
            }
        }

        if(!empty($arg2)) {
            if(is_array($arg2)) {
                foreach($arg2 as $key => $value){
                    $v2 .= "(".$con->real_escape_string($key)." = ".$con->real_escape_string($value).")";
                }

                $v2 = $al2." ON $v2";
            }
        }


        if(!empty($arg4)) {
            if(is_array($arg4))
                foreach($arg4 as $key => $valu){
                    $v4 .= $key." =  '".$valu."' AND ";
                }

            $v4 = chop($v4," AND ")." AND ";
        }


        if(!empty($arg3)) {
            if(is_array($arg3))
                foreach($arg3 as $key => $valu){
                    $v3 .= $key." LIKE  '%".$valu."%' OR ";
                }

            $v3 = " WHERE $v4 (".chop($v3," OR ").")";
        }

      $sql = $con->query("SELECT $v FROM $al $v1 $v2 $v3");

        if($sql->num_rows > 0) {
            if(!empty($state)) {
                while($row = $sql->fetch_array(MYSQLI_ASSOC)){
                    $status[] = $row;
                }
                return $status;

            }else {
                return true;
            }
        }else {
            return false;
        }
        $con->close;
    }

    /**
     * @param $con
     * @param $tb
     * @param $arg
     * @param $args
     * @param $equal
     * @param $state
     * @return array|bool
     */
    public function single_search($con,$tb,$arg,$args,$equal,$state){
        $sets = "";
        $setss = "";
        $setssi = "";
        $setsis = "";
        $queryies = array();

        if(is_array($arg)){
            foreach ($arg as $v){
                $sets .= $con->real_escape_string($v).",";
            }

            $sets = chop($sets,",");
        }else{
            $sets = $arg;
        }

        if(is_array($args)){
            foreach ($args as $key => $arg) {
                $setss .= " $key LIKE '$arg%' OR ";

            }

            $setss = chop($setss," OR ");
        }

        if(is_array($equal)){
            foreach ($equal as $key => $arg) {
                $setssi .= $key. " != '" .$con->real_escape_string($arg)."' AND ";
            }

            $setsis = " AND ".chop($setssi," AND ");
        }

        $sql = $con->query("SELECT DISTINCT $sets FROM $tb WHERE $setss $setsis");

        if($sql->num_rows > 0 ){
            if(!empty($state)){
                while($rows = $sql->fetch_array(MYSQLI_ASSOC)){
                    $queryies[] = $rows;
                }

                return $queryies;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }

    /**
     * get messages
     * @param $con
     * @param $s
     * @param $r
     * @return array|bool
     */
    public function messages($con,$s,$r,$limit,$order) {
        $tatus = array();
        $sql = $con->query("SELECT m.*,m.id as mid,u.id as ud,u1.user_name as senders,u1.profile_pic as up,u.user_name,u.profile_pic FROM messages as m LEFT JOIN nevaas_users as u ON(m.receiver = u.id) LEFT JOIN nevaas_users as u1 ON(m.sender = u1.id) WHERE m.sender = '$s' AND m.receiver = '$r' OR m.sender = '$r' AND m.receiver = '$s' $order $limit");

        if($sql->num_rows > 0) {
            while($rows = $sql->fetch_array(MYSQLI_ASSOC)) {
                $tatus[] = $rows;
            }
            return $tatus;
        }else {
            return false;
        }
    }

    /**
     * get messages
     * @param $con
     * @param $s
     * @param $r
     * @return array|bool
     */
    public function messagesTrash($con,$s,$r,$limit,$order) {
        $tatus = array();
        $sql = $con->query("SELECT m.*,
u1.user_name as su,u2.user_name as ru,
u1.id as sid,u2.id as rid,u1.profile_pic as sp,
u2.profile_pic as rp FROM messages as m INNER JOIN nevaas_users as u2 ON(m.receiver = u2.id) INNER JOIN nevaas_users as u1 ON(m.sender = u1.id) WHERE m.sender = '$s' AND m.receiver = '$r' AND u2 = '$r' AND type2 = '0' OR m.sender = '$r' AND m.receiver = '$s' AND u1 = '$r' AND type1 = '0' $order $limit");

        if($sql->num_rows > 0) {
            while($rows = $sql->fetch_array(MYSQLI_ASSOC)) {
                $tatus[] = $rows;
            }
            return $tatus;
        }else {
            return false;
        }
    }

    /**
     * failed to excute
     * @param $con
     * @param $tb
     * @param $arg1
     * @param $arg2
     * @param $limit
     * @return bool
     */
    public function delete_multi_args($con,$tb,$arg1,$arg2,$limit)
    {

        $lsets = "";
        $rsets = "";
        $allsets = "";


        if(is_array($arg1)){
            foreach ($arg1 as $k => $lv) {
                $lsets .= $k." = ".$con->real_escape_string("'$lv'")." AND ";
            }
            $lsets = preg_replace("#[^0-9a-z'= ]#i","",$lsets);
            $lsets = chop($lsets," AND ");
            $lsets = "($lsets)";
        }

        if(is_array($arg2)){
            foreach ($arg2 as $k => $lv) {
                $rsets .= $k." = ".$con->real_escape_string("'$lv'")." AND ";
            }
            $rsets = preg_replace("#[^0-9a-z'= ]#i","",$rsets);
            $rsets = chop($rsets," AND ");
            $rsets = "($rsets)";
        }

        if(!empty($lsets) && !empty($rsets)){
            $allsets = $lsets." OR ".$rsets;

            $allsets = "WHERE ".$allsets;
        }


        $sql = $con->query("DELETE FROM $tb $allsets $limit");
        if($sql){
                return true;
        }else{
            return false;
        }
    }

    /**
     * get requested meth and return it
     * @return mixed
     */
    public function _getMethod(){
        $meth = $_SERVER['REQUEST_METHOD'];

        return $meth;
    }

    /**
     * get requested meth and return it
     * @param $pass
     * @return bool|string
     */
    public function password_hash($pass) {
        $salt = "abcdefghijklmnopqrstuvxywz1234567890()-_.$%@!&*\/";
        $sal = substr(sha1(md5("$pass$salt")), 0, 20);
        $hash = hash('sha512',$sal);
        $hash = sha1(substr($hash,0,20));
        $hashs = substr($hash,0,25);
        return $hashs;
    }

    public function high_lighter($search,$match){
        return preg_replace("/\w*?$search\w*/i",
            "<b style='background: rgba(100,100,100,.15);padding:0px 4px;'>$0</b>", $match);
    }
}
?>
