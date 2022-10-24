<?php
    include "../connect/connect.php";
    include "../connect/session.php";
    include "../connect/sessionCheck.php";
?>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <?php include "../include/link.php" ?>
</head>
<body>
    <div id="skip">
        <a href="#header">헤더 영역 바로가기</a>
        <a href="#main">컨텐츠 영역 바로가기</a>
        <a href="#footer">푸터 영역 바로가기</a>
    </div>
    <!-- //skip -->

    <?php include "../include/header.php" ?>
    <!-- //header -->

    <main id="main">
        <section id="board" class="container">
            <h2>게시판 보기 영역입니다.</h2>
            <div class="board__inner">
                <div class="board__title">
                    <h3>게시판</h3>
                    <p>웹디자이너, 웹퍼블리셔, 프론트앤드 개발자를 위한 게시판입니다.</p>
                </div>
                <div class="board__view">
                    <table>
                        <colgroup>
                            <col style="width: 20%">
                            <col style="width: 80%">
                        </colgroup>
                        <tbody>
<?php
    $myBoardID = $_GET['myBoardID'];

    // 페이지(보드) 뷰 + 1 // (hint : UPDATE)
    $sql = "UPDATE myBoard SET boardView = boardView + 1 WHERE myBoardID = {$myBoardID}";
    $connect -> query($sql);

    $sql = "SELECT b.boardTitle, m.youName, b.regTime, b.boardView, b.boardContents FROM myBoard b JOIN myMember m ON(m.myMemberID = b.myMemberID) WHERE b.myBoardID = {$myBoardID}";
    $result = $connect -> query($sql);
    // echo $myBoardID;
    
    if($result){
        $info = $result -> fetch_array(MYSQLI_ASSOC);

        // echo "<pre>";
        // var_dump($info);
        // echo "</pre>";

        echo "<tr><th>제목</th><td>".$info['boardTitle']."</td></tr>";
        echo "<tr><th>등록자</th><td>".$info['youName']."</td></tr>";
        echo "<tr><th>등록일</th><td>".date('Y-m-d H:i', $info['regTime'])."</td></tr>";
        echo "<tr><th>조회수</th><td>".$info['boardView']."</td></tr>";
        echo "<tr><th>내용</th><td class='height'>".$info['boardContents']."</td></tr>";
    }
?>
                            <!-- <tr>
                                <th>제목</th>
                                <td>게시판 제목입니다.</td>
                            </tr>
                            <tr>
                                <th>등록자</th>
                                <td>코터틀</td>
                            </tr>
                            <tr>
                                <th>등록일</th>
                                <td>2022.06.04</td>
                            </tr>
                            <tr>
                                <th>조회수</th>
                                <td>452</td>
                            </tr>
                            <tr>
                                <th>내용</th>
                                <td class="height">
                                    1. 삶이 있는 한 희망은 있다 -키케로<br>
                                    2. 산다는것 그것은 치열한 전투이다. -로망로랑<br>
                                    3. 하루에 3시간을 걸으면 7년 후에 지구를 한바퀴 돌 수 있다. -사무엘존슨<br>
                                    4. 언제나 현재에 집중할수 있다면 행복할것이다. -파울로 코엘료<br>
                                    5. 진정으로 웃으려면 고통을 참아야하며 , 나아가 고통을 즐길 줄 알아야 해 -찰리 채플린<br>
                                    6. 직업에서 행복을 찾아라. 아니면 행복이 무엇인지 절대 모를 것이다 -엘버트 허버드<br>
                                    7. 신은 용기있는자를 결코 버리지 않는다 -켄러<br>
                                    8. 피할수 없으면 즐겨라 -로버트 엘리엇
                                </td>
                            </tr> -->
                        </tbody>
                    </table>
                </div>
                <div class="board__btn">
                    <a href="boardModify.php?myBoardID=<?=$myBoardID?>">수정하기</a>
                    <a href="boardRemove.php?myBoardID=<?=$myBoardID?>" onclick="alert('정말 삭제할거니??')">삭제하기</a>
                    <a href="board.php">목록보기</a>
                </div>
            </div>
        </section>
    </main>
    <!-- //board -->

    <?php include "../include/footer.php" ?>
    <!-- //footer -->

</body>
</html>