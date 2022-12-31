import BLOCKS from "./blocks.js";

// DOM
const playground = document.querySelector(".playground > ul");

//saetting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let dowmInterval;
let tempMovingItem;


const movingItem ={
    type: "",
    direction: 3,
    top: 0,
    left: 0,
};

init()
//function

function init(){
    tempMovingItem = {...movingItem}; 
   for(let i = 0; i < GAME_ROWS; i++){
        prependNewLine()  
   }
   generateNewBlock()
}

function prependNewLine(){
    const li = document.createElement("li")
    const ul = document.createElement("ul")
    for(let j=0; j<GAME_COLS; j++){
        const matrix = document.createElement("li")
        ul.prepend(matrix);
    }
    li.prepend(ul)
    playground.prepend(li)

}

function renderBlocks(moveType = ""){
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove(type, "moving");
    })
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left ; 
        const y = block[1] + top ;
        console.log(playground.childNodes[y])
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null; 
        const isAvailable = checkEmpty(target);
        //넘어갈떄 없애는거(재귀함수)
        if(isAvailable){
            target.classList.add(type,"moving")
        }   else{
                tempMovingItem = {...movingItem}  //...무빙 아이템이 다시 랜더 블럭 불러서 다시 처리
                setTimeout(()=>{
                if(moveType === "top"){
                    seizeBlock();
                }
                renderBlocks();
            },0)
            return true;
        }
        movingItem.left = left;
        movingItem.top = top;
        movingItem.direction = direction; 
    })
}
function seizeBlock(){ // 밑에 갔을때 고정
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
        
    })
    checkMatch()
}
function checkMatch(){
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.foreach(li=>{
            if(li.classList.contains("seized")){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine()
        }
    })

    generateNewBlock()
}

function generateNewBlock(){

    clearInterval(dowmInterval);
    dowmInterval = setInterval(()=>{
        moveBlock('top' , 1)
    },duration)
    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)    
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks()
}

// 칸넘어 갔을때 다시 원상태 유지 함수
function checkEmpty(target){ 
    if(!target || target.classList.contains("seized")){
        return false;
    }
    return true;
}

function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType)
}
//방향전환 함수
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks()
}

function dropBlock(){
    clearInterval(dowmInterval);
    dowmInterval = setInterval(() => {
        moveBlock("top",1)
    },10)
}

//event handling
document.addEventListener("keydown", e=> {
    switch(e. keyCode){
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1)
            break;
        case 40: 
            moveBlock("top", 1)
            break;
        case 38: 
            changeDirection();
            break;
        case 32 :
            dropBlock();
            break;
        default:
            break;
    }
    //console.log(e)
})