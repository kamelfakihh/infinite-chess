class Board {

    constructor(board_canvas, pieces_canvas, board_img_canvas, label, width, height, scale, cornerX, cornerY, hex_color1, hex_color2){

        this.board_canvas = board_canvas;
        this.board_canvas.width = width;
        this.board_canvas.height = height;        

        this.pieces_canvas = pieces_canvas;
        this.pieces_canvas.width = width;
        this.pieces_canvas.height = height;

        this.board_img_canvas = board_img_canvas;

        // game canvas 2D context
        this.board_context = this.board_canvas.getContext("2d");
        this.pieces_context = this.pieces_canvas.getContext("2d");
        this.board_img_context = this.board_img_canvas.getContext("2d");

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
            this.sqr_height = Math.floor(width/this.scale);
            this.sqr_width = Math.floor(width/this.scale);
        }else{
            this.sqr_height = Math.floor(height/this.scale);
            this.sqr_width = Math.floor(height/this.scale);
        }    

        // top left square coordinates
        this.cornerX = cornerX;
        this.cornerY = cornerY;

        // top left square offset (distance between square edge and viewport edge)
        this.offsetX = 0;
        this.offsetY = 0;

        // generate empty board image
        this.generateBoard();
    }

    draw(pieces){
        // this.board_context.clearRect(0, 0, this.width, this.height)
        this.pieces_context.clearRect(0, 0, this.width, this.height);
        this.drawBoard()
        this.drawPieces(pieces)
        this.updateLabel("")
    }

    // draws an empty square
    drawSquare(x, y, color){

        const {sqr_width, sqr_height, offsetX, offsetY} = this;

        this.board_img_context.fillStyle=color;
        this.board_img_context.fillRect(
            x*sqr_width  + offsetX,
            y*sqr_height + offsetY,
            sqr_width,
            sqr_height
        );
    }

    // similar to drawSquare(), but changes square height depending on the given ratio
    // ratio is the value of remaing_time/max_time (between 0 and 1)
    drawTimer(x, y, ratio){
        let subtracted = Math.floor(this.sqr_height*ratio); // amount of pixels to remove from square
        if( (x+y)%2==0 ){            
            this.pieces_context.fillStyle="#967051";
            this.pieces_context.fillRect((x - this.cornerX)*this.sqr_width + this.offsetX, (y-this.cornerY)*this.sqr_height + this.offsetY + subtracted, this.sqr_width, this.sqr_height - subtracted);
        }else{                        
            this.pieces_context.fillStyle="#bfac8f";
            this.pieces_context.fillRect((x - this.cornerX)*this.sqr_width + this.offsetX, (y-this.cornerY)*this.sqr_height + this.offsetY + subtracted, this.sqr_width, this.sqr_height - subtracted);
        }                                        
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
        let padding = 6;        

        // image dimensions
        let img_width = img.width;
        let img_height = img.height;      
        
        // viewport coordinates (translates between piece coordinates relative to the board and its coordinates relative to the viewport's corner)
        let vx = x-cornerX
        let vy = y-cornerY
        
        this.pieces_context.drawImage(
            img,                            // source image
            0, 0, img_width, img_height,    // source square
            vx*sqr_width + padding/2 + offsetX, vy*sqr_height + padding/2 + offsetY, sqr_width-padding, sqr_height-padding  // target square
        )   
    }

    // draw an empty board 
    drawBoard(){        
        this.board_context.drawImage(
            this.board_img_canvas, 
            this.cornerX %2 === 0 ? this.offsetX - this.sqr_width : this.offsetX, 
            this.cornerY %2 === 0 ? this.offsetY - this.sqr_height : this.offsetY,
            this.board_img_canvas.width, this.board_img_canvas.height,            
        );                
    }

    // draws an empty board to the hidden canvas
    generateBoard(){

        const {width, height, sqr_width, sqr_height, cornerX, cornerY, color1, color2} = this

        // number of square to fill screen in each dimensions
        let nb_squares_x = Math.ceil(width/sqr_width)+2
        let nb_squares_y = Math.ceil(height/sqr_height)+2

        this.board_img_canvas.width = this.sqr_width*nb_squares_x;
        this.board_img_canvas.height = this.sqr_height*nb_squares_y;
        
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

            // calculate time since last move
            const now = Date.now();            
            if(now < piece.last_move + piece.delay){                                                   
                // draw timer behind piece                
                this.drawTimer(piece.x, piece.y, (now-piece.last_move)/piece.delay)
            }
            // draw actual piece
            this.drawPiece(piece)
        }
    }

    // identifies clicked square from click coordinates
    getSquare(clickX, clickY){        

        return {
            x : Math.floor((clickX - this.offsetX)/this.sqr_width) + this.cornerX,
            y : Math.floor((clickY - this.offsetY)/this.sqr_height) + this.cornerY
        }
    }

    // updates board position
    updateOffset(x, y){        

        const {sqr_width, sqr_height} = this;

        this.offsetX += x;        
        this.offsetY += y;

        if(this.offsetX < -1*sqr_width){
            this.cornerX += 1;
            this.offsetX = 0;                      
        } 

        if(this.offsetX > 0){
            this.cornerX -= 1;
            this.offsetX = -1*sqr_width;
        } 

        if(this.offsetY < -1*sqr_height){
            this.cornerY += 1;
            this.offsetY = 0;                      
        } 

        if(this.offsetY > 0){
            this.cornerY -= 1;
            this.offsetY = -1*sqr_height;
        }           
    }
}