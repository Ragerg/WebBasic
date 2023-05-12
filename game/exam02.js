$(function () {
  const hero = $("#hero");
  const enemy = $("#enemy");
  const pang = $("#pang");

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

  // 점프 중인지?
  let isJumping = false;
  let score = 0;
  let isLaunching = false;

  $("#easystart_button").click(function () {
    gameStart("easy");
  });

  $("#hardstart_button").click(function () {
    gameStart("hard");
  });

  square();
  function gameStart(difficulty) {
    let min = 0,
      max = 0;
    switch (difficulty) {
      case "easy":
        min = 1000;
        max = 3000;
        break;
      case "hard":
        min = 500;
        max = 2000;
        break;
    }

    $("#gamestart_screen").hide();
    $(".square").hide();
    setKeyboardEvent();
    enemyStart(min, max);

    checkGameOver();
    backgroundSlide();
  }

  //캐릭터가 적과 충돌
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

  function checkGameOver() {
    setInterval(function () {
      if (isColliding(hero[0], enemy[0])) {
        hero.stop();
        enemy.stop();
        pang.stop();
        isJumping = true;
        isLaunching = true;

        if (!$("#gameover_screen").is(":visible")) {
          square();
          $("#gameover_screen").show();
          $("#score").css("display", "none");
        }
      }
    }, 1000 / 60);
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //게임 오버 시 랜덤하게 박스들 생성
  function square() {
    // let colors = ["#ff0000", "#0000ff", "#00ff00"];
    // let colors = ["#c7339b90", "#7ac73390", "#c4d01d1b", "#1d29d01b"];
    let colors = ["#7ac733d8", "#c7339be1", "#c4d01dc5", "#1d29d0da"];

    setInterval(function () {
      $(".square").each(function () {
        let top = getRandomNumber(-200, 400) + "px";
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
        // 점수 올리자
        score += 100;
        updateScore(score);
        //적이 리셋
        enemyStart();
      });
  }

  function updateScore(score) {
    $("#score").text("Score : " + score);
    $("#finalScore").text("Score : " + score);
  }

  function jump() {
    isJumping = true;
    hero
      .animate({ bottom: "190px" }, 500)
      .animate({ bottom: "50px" }, 800, function () {
        isJumping = false;
      });
  }

  // 펭귄발사!!
  function attack() {
    isLaunching = true;
    pang
      .css("display", "block")
      .animate({ left: "900px" }, 700, "linear")
      .animate({ left: "100px" }, 0, function () {
        setTimeout(function () {
          isLaunching = false;
        }, 2000);
        pang.css("display", "none");

        // 점수 올리자
        if (checkAttack()) {
          enemy.hide();
          score += 200;
          updateScore(score);
        }
      });
  }

  //펭귄이 적과 충돌헸는지
  function checkAttack() {
    const rect1 = pang[0].getBoundingClientRect();
    const rect2 = enemy[0].getBoundingClientRect();
    const result = rect1.right < rect2.left;
    console.log(result);
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
      // console.log(e.key);
    });
  }
});
