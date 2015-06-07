<?php

    function insertEntry($udid, $prizeID, $name, $email, $mobile, $agreed, $promos, $age)
    {
      $db = new SQLite3('prizewheel.sqlite');
      
      $statement = $db->prepare('INSERT INTO user(udid, prizeID, name, email, mobile, agreed, promos, age) VALUES (:udid, :prizeID, :name, :email, :mobile, :agreed, :promos, :age)');
      $statement->bindParam(':udid', $udid);
      $statement->bindParam(':prizeID', $prizeID);
      $statement->bindParam(':name', $name);
      $statement->bindParam(':email', $email);
      $statement->bindParam(':mobile', $mobile);
      $statement->bindParam(':agreed', $agreed);
      $statement->bindParam(':promos', $promos);
      $statement->bindParam(':age', $age);
      
      $res = $statement->execute();
      
      $lastid = $db->lastInsertRowid();
      if ($lastid) {
        echo $lastid;
      }
      exit;
    }
    
    // fetch vars from the post data
    $udid      = $_POST['udid'];
    $prizeID   = $_POST['prizeID'];
    $name      = $_POST['name'];
    $email     = $_POST['email'];
    $mobile    = $_POST['mobile'];
    $agreed    = $_POST['agreed'];
    $promos    = $_POST['promos'];
    $age       = $_POST['age'];

    try {
      $info = insertEntry($udid, $prizeID, $name, $email, $mobile, $agreed, $promos, $age);
    }
    catch (Exception $ex) {
      echo "NO";
    }
?>