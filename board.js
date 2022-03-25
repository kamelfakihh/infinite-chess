class Board {

    constructor(context, label, width, height, scale, cornerX, cornerY, hex_color1, hex_color2){

        // game canvas 2D context
        this.cx = context;

        // game info text 
        this.label = label;

        // square colors (string containing hex value)
        this.color1 = hex_color1;
        this.color2 = hex_color2;

        // viewport scale (indicates the number of squares displayed on screen from left to right)
        this.scale = scale

        // viewport dimensions
        this.width = width
        this.height = height

        // square dimensions
        if(height > width){
            this.sqr_height = width/this.scale;
            this.sqr_width = width/this.scale;
        }else{
            this.sqr_height = height/this.scale;
            this.sqr_width = height/this.scale;
        }    

        // top left square coordinates
        this.cornerX = cornerX;
        this.cornerY = cornerY;

        // top left square offset (distance between square edge and viewport edge)
        this.offsetX = 0;
        this.offsetY = 0;
    }

    // draws an empty square
    drawSquare(x, y, color){

        const {sqr_width, sqr_height, offsetX, offsetY} = this;

        this.cx.fillStyle=color;
        this.cx.fillRect(
            x*sqr_width  + offsetX,
            y*sqr_height + offsetY,
            sqr_width,
            sqr_height
        );
    }

    // draw a piece on specified coordinates 
    drawPiece(piece){

        const {cornerX, cornerY, offsetX, offsetY, sqr_width, sqr_height} = this;

        const {
            x,          // x position
            y,          // y position
            img,        // piece icon (drawn on canvas)
            last_move,  // timestamp indicating time of last move for this piece
            delay       // integer indicating the minimum number of seconds between moves 
        } = piece;

        // padding from square edges
        let padding = 5;        

        // image dimensions
        let img_width = img.width;
        let img_height = img.height;      
        
        // viewport coordinates (translates between piece coordinates relative to the board and its coordinates relative to the viewport's corner)
        let vx = x-cornerX
        let vy = y-cornerX
        
        this.cx.drawImage(
            img,                            // source image
            0, 0, img_width, img_height,    // source square
            vx*sqr_width + padding/2 + offsetX, vy*sqr_height + padding/2 + offsetY, sqr_width-padding, sqr_height-padding  // target square
        )   

    }

    // draw an empty board 
    drawBoard(){

        const {width, height, sqr_width, sqr_height, cornerX, cornerY, color1, color2} = this

        // number of square to fill screen in each dimensions
        let nb_squares_x = Math.ceil(width/sqr_width)+1
        let nb_squares_y = Math.ceil(height/sqr_height)+1
        
        // draw board
        for(let y=0; y <= nb_squares_y; y++){
            for(let x=0; x <= nb_squares_x; x++){
                
                // set square colors based on their coordinates
                if((cornerX+cornerY)%2 === 0){

                    if((x+y)%2 === 0){
                        this.drawSquare(x, y, color1)
                    }else{
                        this.drawSquare(x, y, color2)
                    }

                }else{

                    if((x+y)%2 === 0){
                        this.drawSquare(x, y, color2)
                    }else{
                        this.drawSquare(x, y, color1)
                    }
                }
            }
        }
    }

    updateLabel(message){
        this.label.innerHTML = `${this.cornerX}, ${this.cornerY} ${message}`
    }

    // draws a list of pieces
    drawPieces(pieces){
        
        for(let piece of pieces){        
            this.drawPiece(piece)
        }
    }
}