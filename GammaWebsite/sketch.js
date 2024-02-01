let ball;
let player;
let boxes;
let playerHealth;
let numberKilled = 0;
let zombieSpeed = 1.0;
function setup() {
	new Canvas();
	frameRate(100);

	player = new Sprite();
	floor = new Sprite();
	scoreZombie = new Sprite(40,40,50,'none');


	boxes = new Group();
	boxes.x = 10;
	boxes.y = 10;
	boxes.scale = 0.05;
	boxes.collider = 'd';
	boxes.drag = 5;
	boxes.rotationLock = true;
	boxes.bounciness = 1;
	boxes.img = '/images/zombie-on-transparent-background-3d-render-png.webp';


	floor.collider = 'static'
	floor.y = windowHeight;
	floor.w = windowWidth;



	player.h = 50;
	player.w = 20;
	player.img = '/images/show.png';
	player.debug = true;
	player.rotationLock = true;
    playerHealth = 100000000; 


	flameThrower = new Sprite();
	flameThrower.rotationLock = true;
	flameThrower.w = 100;
	flameThrower.collider = 'none';
	flameThrower.debug = true;
	flameThrower.scale = 0.5;
	flameThrower.rotation = 90;
	flameThrower.img = '/images/fire-flame-png-images--pictures--becuo-18.png';
}

function draw() {
	clear();
	
	scoreZombie.text = "Score: " + numberKilled;
	zombieSpeed = 0.01;
	//+ ((numberKilled / 50) * 0.01);
	boxes.forEach(element => {
		element.moveTowards(player, zombieSpeed);
	});

	if(kb.pressing('shift')){
		flameThrower.rotateTowards(mouse, 0.9);
		flameThrower.visible = true;
		flameThrower.x = player.x;
		flameThrower.y = player.y;
		flameThrower.offset.x = 75;
	}
	else{
		flameThrower.visible = false;
	}

	while(boxes.length < 50){
		let box = new boxes.Sprite();
		box.x = random(10,1000);
		box.y =random(10,1000);
	}

	if(flameThrower.overlaps(boxes, destroy));

	function destroy(flameThrower, box){
		if(playerHealth > 0) numberKilled +=1;
		box.remove();
	}



	if(player.collides(boxes)) {
		playerHealth -=1;
	}


	if(playerHealth < 1){
		player.remove();
	}
	player.rotateTowards(mouse, 0.9, 90);
	if (kb.pressing('left')) player.vel.x = -5;
	else if (kb.pressing('right')) player.vel.x = 5;
	else player.vel.x = 0;	
	if (kb.pressing('up')) player.vel.y = -5;
	else if (kb.pressing('down')) player.vel.y = 5;
	else player.vel.y = 0;
	background('gray');
}
