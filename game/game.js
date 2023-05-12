$(function () {
  const hero = $("#hero");
  const enemy = $("#enemy");
  const pang = $("#pang");

  let isJumping = false;
  let score = 0;
  let isLaunching = false;

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

  //게임오버 체크
  function checkGameOver() {
    setInterval(function () {
      //충돌하면
      if (isColliding(hero[0], enemy[0])) {
        //캐릭터, 적, 펭귄 멈추고
        hero.stop();
        enemy.stop();
        pang.stop();
        //키이벤트 안먹히게 조건 설정
        isJumping = true;
        isLaunching = true;

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

  function enemyStart(min, max) {
    // 속도 조절
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

  function jump() {
    isJumping = true;
    $("#canAttack").css("display", "none"); // "공격 가능" 숨김
    hero
      .animate({ bottom: "190px" }, 500)
      .animate({ bottom: "50px" }, 700, function () {
        isJumping = false;
        $("#canAttack").css("display", "block"); // "공격 가능" 표시
      });
  }

  // 펭귄발사!!
  function attack() {
    isLaunching = true;
    $("#canAttack").css("display", "none"); // "공격 가능" 숨김
    pang.css("display", "block").animate({ left: "900px" }, 500, "linear");
    crushEnemy();
    pang.animate({ left: "100px" }, 0, function () {
      setTimeout(function () {
        isLaunching = false;
        $("#canAttack").css("display", "block"); // "공격 가능" 표시
      }, 3000);
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

    console.log(rect1);
    console.log(rect2);

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
