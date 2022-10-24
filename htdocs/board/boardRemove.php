<?php
    include "../connect/connect.php";
    include "../connect/session.php";
    include "../connect/sessionCheck.php";

    $myBoardID = $_GET['myBoardID'];
    $myBoardID = $connect -> real_escape_string($myBoardID);
    // 특수문자 입력 방지

    $sql = "DELETE FROM myBoard WHERE myBoardID = {$myBoardID}";
    $connect -> query($sql);
?>

<script>
    location.href="board.php";
    // 삭제 후 페이지 이동경로
</script>