<?php
  if(isset($_GET['uid'])) {
    $userid = $_GET['uid'];
    $db = new SQLite3('prizewheel.sqlite');

    $statement = $db->prepare("SELECT minute, strftime('%s',expire) as expire FROM user WHERE udid=:uid;");
    $statement->bindParam(':uid', $userid);
    $res = $statement->execute();
    $row = $res->fetchArray(SQLITE3_ASSOC);
    if ($row && $res->numColumns() && $res->columnType(0) != SQLITE3_NULL) {
      $resp_arr = array(
        'success' => true, 
        'data' => array(
          'minute' => $row['minute'], 
          'expire' => $row['expire']
        )
      );
      $tmp_min = $row['minute'];
      if ($tmp_min > 0) {
        $query = "UPDATE user SET minute=0, expire=datetime('now','+".$tmp_min." minutes') WHERE udid='".$userid."'";
        $db->exec($query);
      }
    } else {
      $resp_arr = array('success' => false, 'data' => "UID doesn't exist");
    }
    header('Content-Type: application/json');
    echo json_encode($resp_arr);
  } else {
    header('HTTP/1.1 400 Bad Request: missing UID', true, 400);
  }
?>
