$(function () {
  const hero = $("#hero");
  const enemy = $("#enemy");
  const pang = $("#pang");
  const music = new Audio("audios/Spy.mp3");

  let isJumping = false;
  let score = 0;
  let isLaunching = false;
  let isGameOver = false;
  let attackInterval;

  //배경 움직이게
  function backgroundSlide() {
    let posi = 0;

    setInterval(function () {
      $("#container").css("background-position", posi-- + "px");
      if (posi === -880) {
        posi = 0;
      }
    }, 10);
  }

  //배경음악 재생
  function backgroundmusic() {
    music.loop = true;
    music.play();
  }

  // 배경음악 멈추기
  function stopBackgroundMusic() {
    music.pause();
  }

  //시작화면
  backgroundSlide();
  square();
  $("#score").css("display", "none");

  //난이도 선택
  $("#easystart_button").click(function () {
    gameStart("easy");
  });

  $("#hardstart_button").click(function () {
    gameStart("hard");
  });

  //난이도에 따라 게임시작
  function gameStart(difficulty) {
    //배경음악 재생
    backgroundmusic();
    let min = 0,
      max = 0;
    switch (difficulty) {
      case "easy":
        min = 1500;
        max = 3000;
        break;
      case "hard":
        min = 1000;
        max = 2000;
        break;
    }

    setAttackInterval(difficulty); // 공격 가능 간격 설정

    //게임시작 시 시작화면 숨김
    $("#gamestart_screen").hide();
    $(".square").hide();
    $("#score").css("display", "inline-block");
    $("#canAttack").css("display", "block");

    setKeyboardEvent();
    enemyStart(min, max);
    checkGameOver();
  }

  //캐릭터가 적과 충돌했는지
  function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return !(
      rect1.bottom < rect2.top + 10 ||
      rect1.top > rect2.bottom + 10 ||
      rect1.right < rect2.left + 10 ||
      rect1.left > rect2.right + 10
    );
  }

  // 게임오버 효과음 재생
  function playgameOverSound() {
    const gameOverSound = new Audio("audios/gameOver.wav");
    gameOverSound.play();
  }

  //게임오버 체크
  function checkGameOver() {
    setInterval(function () {
      // 충돌을 확인하고 이미 게임 오버 상태가 아닌 경우에만 처리
      if (isColliding(hero[0], enemy[0]) && !isGameOver) {
        // 게임 오버 상태 플래그 업데이트
        isGameOver = true;

        //캐릭터, 적, 펭귄 멈추고
        hero.stop();
        enemy.stop();
        pang.stop();

        //키이벤트 안먹히게 조건 설정
        isJumping = true;
        isLaunching = true;

        // 게임오버 효과음 재생, 배경음악 멈추기
        playgameOverSound();
        stopBackgroundMusic();

        //게임오버 화면 출력
        if (!$("#gameover_screen").is(":visible")) {
          $(".square").show();
          $("#gameover_screen").show();
          $("#score").css("display", "none");
          $("#canAttack").css("display", "none");
        }
      }
    }, 1000 / 60);
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //화면에 랜덤하게 박스들 생성
  function square() {
    let colors = ["#7ac733d8", "#c7339be1", "#c4d01dc5", "#1d29d0da"];

    setInterval(function () {
      $(".square").each(function () {
        let top = getRandomNumber(0, 600) + "px";
        let left = getRandomNumber(-300, 900) + "px";
        let color = colors[Math.floor(Math.random() * colors.length)];

        $(this).css("top", top);
        $(this).css("left", left);
        $(this).css("background-color", color);
      });
    }, 800);
  }

  // 적등장 효과음 재생
  function playEnemySound() {
    const enemySound = new Audio("audios/enemy.wav");
    enemySound.play();
  }

  function enemyStart(min, max) {
    // 속도 조절
    playEnemySound();
    const speed = getRandomNumber(min, max);

    // 적이 오른쪽에서 왼쪽으로 이동
    enemy
      .stop() // 기존의 애니메이션 중지
      .css({ right: "-70px", display: "block" }) // 초기 위치와 표시 설정
      .animate({ right: "850px" }, speed, "linear", function () {
        if (enemy.css("display") !== "none") {
          // 점수 올리자
          score += 100;
          updateScore(score);
        }
        //적이 리셋
        enemyStart(min, max);
      });
  }

  function updateScore(score) {
    $("#score").text("Score : " + score);
    $("#finalScore").text("Score : " + score);
  }

  // 점프 효과음 재생
  function playJumpSound() {
    const jumpSound = new Audio("audios/jump.flac");
    jumpSound.play();
  }

  function jump() {
    isJumping = true;
    $("#canAttack").css("display", "none"); // "공격 가능" 숨김
    hero
      .animate({ bottom: "190px" }, 500)
      .animate({ bottom: "50px" }, 700, function () {
        isJumping = false;
        $("#canAttack").css("display", "block"); // "공격 가능" 표시
      });
    playJumpSound(); // 점프 효과음 재생
  }

  // 공격 가능 간격 설정
  function setAttackInterval(difficulty) {
    switch (difficulty) {
      case "easy":
        attackInterval = 3000; // easy 난이도: 3000ms (3초)
        break;
      case "hard":
        attackInterval = 5000; // hard 난이도: 5000ms (5초)
        break;
    }
  }

  // 펭귄 발사 효과음 재생
  function playPangSound() {
    const pangSound = new Audio("audios/pang.wav");
    pangSound.play();
  }

  // 펭귄발사!!
  function attack() {
    console.log(attackInterval);

    isLaunching = true;
    playPangSound();
    $("#canAttack").css("display", "none"); // "공격 가능" 숨김
    pang.css("display", "block").animate({ left: "900px" }, 100, "linear");
    crushEnemy();
    pang.animate({ left: "100px" }, 0, function () {
      setTimeout(function () {
        isLaunching = false;
        $("#canAttack").css("display", "block"); // "공격 가능" 표시
      }, attackInterval);
      pang.css("display", "none");
    });
  }

  function crushEnemy() {
    if (checkAttack()) {
      enemy.css("display", "none");
      // 점수 올리자
      score += 200;
      updateScore(score);
    }
  }

  //펭귄이 적과 충돌헸는지
  function checkAttack() {
    const rect1 = pang[0].getBoundingClientRect();
    const rect2 = enemy[0].getBoundingClientRect();
    const result = rect1.right <= rect2.left;

    // console.log(rect1);
    // console.log(rect2);

    return result;
  }

  // 키보드 이벤트 정의
  function setKeyboardEvent() {
    $("html").keydown(function (e) {
      switch (e.key) {
        case " ":
          if (!isJumping) {
            jump();
          }
          break;
        case "ArrowRight":
          if (!isJumping && !isLaunching) {
            attack();
          }
      }
    });
  }
});
