function inname() {
   const name = prompt('이름을 입력해 주세요');
   check(name);
}

function check(name) {
    if(name === '' || name === null) {
        inname();
    } else {
        console.log(name);
        alert(name + "님 안녕하세요");
    }
}