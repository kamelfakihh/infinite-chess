class Board {

    constructor(context, label, width, height, scale, cornerX, cornerY){

        // game canvas 2D context
        this.cx = context;

        // game info text 
        this.label = label;

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

}