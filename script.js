const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100; //Высот полос

const score = document.querySelector('.score'),
	  start = document.querySelector('.start'),
	  gameArea = document.querySelector('.gameArea'),
	  car = document.createElement('div');
	  btns = document.querySelectorAll('.btn');

const music = new Audio('audio.mp3');
music.volume = 0.04;

car.classList.add('car');

/*start.onclick = function() {  // Добавление класса по клику
	start.classList.add('hide');
}; (устаревший метод)*/  

const keys = {
	ArrowUp: false,
	ArrowDown: false,
	ArrowRight: false,
	ArrowLeft: false
};

const setting = {
	start: false,
	score: 0,
	speed: 5, // Скорость машины
	traffic: 3  // Количество машин на дороге
};

let startSpeed = 0;

const changeLevel = (lvl) =>{ // Уровни сложности
	switch(lvl) {
		case '1':
			setting.traffic = 4;
			setting.speed = 3;
			break;
		case '2':
			setting.traffic = 3;
			setting.speed = 6;
			break;
		case '3':
			setting.traffic = 3;
			setting.speed = 9;
			break;
	}

	startSpeed = setting.speed;
}

function getQuantityElements(heightElement) {  /* Рассчет количества элементов 
	                                                      в зависимости от gameArea*/
  return (gameArea.offsetHeight / heightElement) + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

function startGame(event) {
    const target = event.target;

	if(!event.target.classList.contains('btn')) return; // Клик только по кнопкам
	
	const levelGame = target.dataset.levelGame;

	changeLevel(levelGame)

	btns.forEach(btn => btn.disabled = true)

	music.play()
	// Управление высотой в зависимости от размера экрана
	gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;
	
	start.classList.add('hide');
	gameArea.innerHTML = '';
	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++){
		const line = document.createElement('div'); // Полосы по центру экрана
		line.classList.add('line');
		line.style.top = (i * HEIGHT_ELEM) + 'px';
		line.style.height = (HEIGHT_ELEM / 2) + 'px';
		line.y = i * HEIGHT_ELEM;
		gameArea.append(line);
	}

	for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++) {  // Плотность трафика
      const enemy = document.createElement('div');
      enemy.classList.add("enemy");
      enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);  // Расстояние между машинами
      enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 40)) + 'px'; // Рандомное расположение машин
      enemy.style.top = enemy.y +'px';  //Расстояние от верха игрового пространства
      enemy.style.background = `
      url("images/enemy${getRandomEnemy(MAX_ENEMY)}.png") 
      center / contain 
      no-repeat`;
      gameArea.appendChild(enemy);                        // Math.floor округляет число
	}

	setting.score = 0;
	setting.start = true;
	gameArea.appendChild(car);
	car.style.left = gameArea.offsetWidth/2 -car.offsetWidth/2; 
	car.style.top = 'auto';
	car.style.bottom = '10px';
	setting.x = car.offsetLeft;
	setting.y = car.offsetTop;
	requestAnimationFrame(playGame);
}


function playGame() {

	if (setting.start) {
		setting.score += setting.speed;  // Добавление счетчика очков
		score.innerHTML = 'SCORE<br>' + setting.score;

		setting.speed = startSpeed + Math.floor(setting.score / 5000); // Увеличение скорости каждые 5000 очков
        
        moveRoad();
        moveEnemy();

		if(keys.ArrowLeft && setting.x > 0) {   //Управление машинкой влево и вправо
		  setting.x -= setting.speed;
		}
                                           //Ограничение ширины движения машинки
		if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
		  setting.x += setting.speed;
		}

		if (keys.ArrowUp && setting.y > 0) {
		  setting.y -= setting.speed;
		}
                                           //Ограничение высоты движения машинки
		if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
		  setting.y += setting.speed;
		}

		car.style.left = setting.x + 'px';
		car.style.top = setting.y + 'px';

	    requestAnimationFrame(playGame);
	} else {
		music.pause()
		btns.forEach(btn => btn.disabled = false)
	}
}


function startRun(event) { // event.key показывает какая клавиша нажата
 	event.preventDefault();
 	keys[event.key] = true;
}


function stopRun(event) {
 	event.preventDefault();
 	keys[event.key] = false;
}

function moveRoad() {   // Движение линий
	let lines = document.querySelectorAll('.line');
	lines.forEach(function(line){
		line.y += setting.speed;
		line.style.top = line.y + 'px';

		if(line.y > gameArea.offsetHeight){ 
			line.y = -HEIGHT_ELEM;
		}
	});
}

function moveEnemy() {
	let enemy = document.querySelectorAll('.enemy');
	enemy.forEach(function(item){
		let carRect = car.getBoundingClientRect();
		let enemyRect = item.getBoundingClientRect();

		if (carRect.top <= enemyRect.bottom &&
			carRect.right >= enemyRect.left &&
			carRect.left <= enemyRect.right &&
			carRect.bottom >= enemyRect.top) {
			setting.start = false; 
			start.classList.remove('hide');
			// score.style.top = start.offsetHeight + 'px'; // Score под кнопкой
		}
		item.y += setting.speed / 3;  //Скорость машинок
		item.style.top = item.y + 'px';
		if(item.y >= gameArea.offsetHeight){ // Бесконечный цикл машин 
		   item.y = -HEIGHT_ELEM * setting.traffic;
		   item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 38)) + 'px'; 
		   // Рандомный цикл появления машин
		}
	});

}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);