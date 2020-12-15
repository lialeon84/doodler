 document.addEventListener('DOMContentLoaded', () => {
     const grid = document.querySelector('.grid') //calls the div in the html file//
     const doodler = document.createElement('div')
     let doodlerLeftSpace = 50 //it will move to the left
     let startPoint = 150
     let doodlerBottomSpace = startPoint //it will move to the bottom
     let isGameOver = false
     let platformCount = 5
     let platforms = []
     let upTimerId
     let downTimerId
     let isJumping = true
     let isGoingLeft = false
     let isGoingRight = false
     let leftTimerId
     let rightTimerId
     let score = 0


     function createDoodler() {
         grid.appendChild(doodler) //the grid is the parent, doodler is the child
             //we're putting the doodler into our grid aka the yellow box on the page
         doodler.classList.add('doodler') //calls the doodler class in css
         doodlerLeftSpace = platforms[0].left
         doodler.style.left = doodlerLeftSpace + 'px'
         doodler.style.bottom = doodlerBottomSpace + 'px'
     }

     class Platform {
         constructor(newPlatBottom) {
             this.bottom = newPlatBottom
                 //math.random multi the number and returns any num of the equation
             this.left = Math.random() * 315 //subtract 400 off grid css and 85 off platform css width to get 315
             this.visual = document.createElement('div') //creates a div for each platform the doodler will jump to

             const visual = this.visual
             visual.classList.add('platform')
             visual.style.left = this.left + 'px'
             visual.style.bottom = this.bottom + 'px'
             grid.appendChild(visual)
         }
     }

     function createPlatforms() {
         for (let i = 0; i < platformCount; i++) {
             let platGap = 600 / platformCount //divided by the plat grid height in css
             let newPlatBottom = 100 + i * platGap //in order to increment the gap space
             let newPlatform = new Platform(newPlatBottom)
             platforms.push(newPlatform)
             console.log(platforms)
         }
     }

     function movePlatforms() {
         if (doodlerBottomSpace > 200) { //if the doodler is anywhere up in the middle or higher then we want the platform to move
             platforms.forEach(platform => {
                 platform.bottom -= 4
                 let visual = platform.visual
                 visual.style.bottom = platform.bottom + 'px'

                 if (platform.bottom < 10) {
                     let firstPlatform = platforms[0].visual
                     firstPlatform.classList.remove('platform') //will remove the platform
                     platforms.shift() //will remove the first item
                     console.log(platforms)
                     score++
                     let newPlatform = new Platform(600)
                     platforms.push(newPlatform) //creates new platform
                 }
             })
         }

     }

     function jump() {
         clearInterval(downTimerId) //clears Id every time we jump and cancel each other out
         isJumping = true
         upTimerId = setInterval(function() { //timer id is how we can stop this interval, where you don't want it to keep moving
             doodlerBottomSpace += 20
             doodler.style.bottom = doodlerBottomSpace + 'px' //moves the doodler up
             if (doodlerBottomSpace > startPoint + 200) {
                 fall()
             }
         }, 30)
     }

     function fall() {
         clearInterval(upTimerId) //because we don't want the doodler going up anymore this will stop the interval
         isJumping = false
         downTimerId = setInterval(function() {
                 doodlerBottomSpace -= 5
                 doodler.style.bottom = doodlerBottomSpace + 'px'
                 if (doodlerBottomSpace <= 0) {
                     gameOver()
                 }
                 platforms.forEach(platform => {
                     if (
                         (doodlerBottomSpace >= platform.bottom) &&

                         //we are checking the height 15px from css between the platform
                         (doodlerBottomSpace <= platform.bottom + 15) &&
                         //now we also need to check if the doodler left space 
                         ((doodlerLeftSpace + 60) >= platform.left) &&
                         //we need to make sure the doodle is not in an empty space but on a platform 
                         (doodlerLeftSpace <= (platform.left + 85)) &&
                         !isJumping
                     ) {
                         console.log('landed')
                             //will make the start point change
                         startPoint == doodlerBottomSpace
                         jump()
                     }
                 })

             }, 30) //once it goes up to a certain px it falls
     }

     function gameOver() {
         console.log('game over')
         isGameOver = true //because the game is over
         while (grid.firstChild) {
             grid.removeChild(grid.firstChild) //removes the little box
         }
         grid.innerHTML = score
         clearInterval(upTimerId)
         clearInterval(downTimerId)
         clearInterval(leftTimerId)
         clearInterval(rightTimerId)
     }

     //this function will link to the computer keyboard
     function control(e) {
         if (e.key === "ArrowLeft") {
             moveLeft()
         } else if (e.key === "ArrowRight") {
             moveRight()
         } else if (e.key === "ArrowUp") {
             moveStraight()
         }

     }

     function moveLeft() {
         if (isGoingRight) {
             clearInterval(rightTimerId) //this will clear it so it won't flicker like crazy
             isGoingRight = false
         }
         isGoingLeft = true
         leftTimerId = setInterval(function() {
             if (doodlerLeftSpace >= 0) { //the doodler won't go off the grid
                 doodlerLeftSpace -= 5
                 doodler.style.left = doodlerLeftSpace + 'px'
             } else moveRight()

         }, 20)
     }

     function moveRight() {
         if (isGoingLeft) {
             clearInterval(leftTimerId) //same as for moveLeft
             isGoingLeft = false
         }
         isGoingRight = true
         rightTimerId = setInterval(function() {
             //CSS 400 height - 60 width = 340 so it won't go off the grid
             if (doodlerLeftSpace <= 340) {
                 doodlerLeftSpace += 5
                 doodler.style.left = doodlerLeftSpace + 'px'
             } else moveLeft()
         }, 20)
     }

     function moveStraight() { //will stop it from moving when reaching the bottom
         isGoingLeft = false
         isGoingRight = false
         clearInterval(rightTimerId)
         clearInterval(leftTimerId)
     }

     function start() {
         if (!isGameOver) {
             createPlatforms()
             createDoodler()
             setInterval(movePlatforms, 30)
             jump()
                 //if we touch the key or click it will move
             document.addEventListener('keyup', control)
         }
     }
     //attach to button
     start()

 })