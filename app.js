window.onload = init()

// initialized game
function init(){

    // viewport width and height
    const width = window.innerWidth;
    const height = window.innerHeight;

    // views
    let pieces_layer = document.querySelector('#pieces_layer');
    let board_layer = document.querySelector('#board_layer');
    let board_image = document.querySelector("#board_image")

    let label = document.querySelector('#label')

    let p1 = new Piece(
        1,
        3,
        0,
        0,
        2,
        "#ffffff",
        "#000000",
        5000,
        Date.now()
    )

    let p2 = new Piece(
        4,
        2,
        0,
        0,
        2,
        "#000000",
        "#ffffff",
        5000,
        Date.now()
    )

    let pieces = [p1, p2]

    let board = new Board(
        board_layer,
        pieces_layer,
        board_image,
        label,
        width,
        height,
        8,
        0,
        0,
        "#b58863",
        "#f0d9b5"
    )

    // board.drawBoard()

    function animate () {
        board.draw(pieces)
        requestAnimationFrame(animate)
    }
    
    requestAnimationFrame(animate)

    // handle mouse clicks
    board_layer.addEventListener('click', (e) => {
       console.log(board.getSquare(e.clientX, e.clientY))
    })

    // handle key clicks
    document.onkeydown = function(e){
        e = e || window.event;

        const s = 15;        

        let x=0
        let y=0

        if (e.keyCode == '38') {
            y+=s;
        }
        else if (e.keyCode == '40') {
            // down arrow
            y-=s;
        }
        else if (e.keyCode == '37') {
            // left arrow
            x+=s;
            // y+=s;
        }
        else if (e.keyCode == '39') {
            // right arrow
            x-=s;
            // y-=s;
        }
        board.updateOffset(x, y);
    }
}