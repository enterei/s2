function light(){
    this.lightpos = [0.0, 10.0, -0.0, 1.0 ];
    this.mMatrix = mat4.create();
    this.updateGlTrans = function(t){
        mat4.translate(this.transM,this.transM,t);        
        this.updateAll();
    };
    this.updateGlRota=function(r){
        var help = mat4.create();
        var lr = mat4.create();
        mat4.rotateX(lr,lr,r[0]);
        mat4.rotateY(lr,lr,r[1]);
        mat4.rotateZ(lr,lr,r[2]);
        var trinv = mat4.create();
        mat4.invert(trinv,this.transM);
 
        mat4.multiply(help,this.transM,lr);
        mat4.multiply(help,help,trinv);
        mat4.multiply(this.rotaM,this.rotaM,help);
        this.updateAll();
        
         
 
     };
     this.updateAll= function(){
        mat4.identity(this.mMatrix);
        


        mat4.multiply(this.mMatrix,this.mMatrix,this.transM);
      
        mat4.multiply(this.mMatrix,this.mMatrix,this.rotaM);
        mat4.multiply(this.mMatrix,this.mMatrix,this.scaleM);
     //  mat4.multiply(this.mMatrix,this.transM,this.rotaM);
     
  
    }



}