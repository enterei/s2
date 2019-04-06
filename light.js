function light(){
    this.lightpos = [0.0, 10.0, -0.0, 1.0 ];
    this.GlMatrix = mat4.create();
    this.glrota = mat4.create();
    this.gltrans = mat4.create();

    this.updateGlTrans = function(t){
        mat4.translate(this.gltrans,this.gltrans,t);        
        this.updateGlAll();
    };
    this.updateGlRota=function(r){
        mat4.rotateX(this.glrota,this.glrota,r[0]);
        mat4.rotateY(this.glrota,this.glrota,r[1]);
        mat4.rotateZ(this.glrota,this.glrota,r[2]);
        this.updateGlAll();
        
         
 
     };
   
    this.updateGlAll= function(){
        mat4.identity(this.GlMatrix);
        
    
    
        mat4.multiply(this.GlMatrix,this.GlMatrix,this.gltrans);
      
        mat4.multiply(this.GlMatrix,this.GlMatrix,this.glrota);
        console.log(this.GlMatrix);
        
      
    
    }



}