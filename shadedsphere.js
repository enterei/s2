var shadedsphere_points= [];
var shadeds_color=[];
var shadeds_index =0;
var shadednumTimesToSubdivide = 3;
function ShadedSphere(gl,inittrans,vs,fs){
    this.shaderProgram = undefined;

    
    if (this.shaderProgram === undefined) {
        console.log("jau vor dem laden");
      

        this.shaderProgram = initShaders(gl,vs, fs);
        
        if (this.shaderProgram === null) {
            throw new Error('Creating the shader program failed.');
        }
        console.log(vs);
        this.locations = {
            attribute: {
                aPosition: gl.getAttribLocation( this.shaderProgram, "aPosition"),
                aColor: gl.getAttribLocation( this.shaderProgram, "aColor"),
               
            },
            uniform: {
                uMMatrix: gl.getUniformLocation( this.shaderProgram, "uMMatrix"),
               
                uPMatrix: gl.getUniformLocation( this.shaderProgram, "uPMatrix")
            }
        };
        gl.enableVertexAttribArray( this.locations.attribute.aPosition);
        gl.enableVertexAttribArray( this.locations.attribute.aColor);
        gl.enableVertexAttribArray( this.locations.attribute.aNormal);
    }
    else{
        console.log("pr defined");
    }

    if ( this.buffers === undefined) {
        fillshadedSpoints();
        console.log(shadedsphere_points.length);
        console.log(shadeds_color.length);
        console.log(shadeds_index);
        //console.log(sphere_points);

        // Create a buffer with the vertex positions
        // 3 coordinates per vertex, 3 vertices per triangle
        // 2 triangles make up the ground plane, 4 triangles make up the sides
        const pBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
        
       
        
        
  
        gl.bufferData(gl.ARRAY_BUFFER, flatten (shadedsphere_points), gl.STATIC_DRAW);
        
        // Create a buffer with the vertex colors
        const cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, flatten (shadeds_color), gl.STATIC_DRAW);
        
       
        
        this.buffers = {
            pBuffer: pBuffer,
            cBuffer: cBuffer,
          
            pComponents: 4, // number of components per vertex in pBuffer
            cComponents: 4, // number of components per color in cBuffer
            
        };
        
    }
    
    this.position = inittrans;
    this.transM = mat4.create();
    //this.oldpos=this.position;
    
    this.rotationY = 0.0;
    this.rotationX = 0.0;
    this.rotationZ = 0.0;
    this.rotaM = mat4.create();

   
    
    this.scaleY = 0.0;
    this.scaleX = 0.0;
    this.scaleZ = 0.0;
    this.scaleM=mat4.create();



    this.mMatrix = mat4.create();
    this.mMatrixTInv = mat3.create();


    this.draw = function(gl, pMatrix) {
      
        gl.useProgram( this.shaderProgram);
        gl.uniformMatrix4fv( this.locations.uniform.uPMatrix, false, pMatrix);
        gl.uniformMatrix4fv( this.locations.uniform.uMMatrix, false, this.mMatrix);
        
        gl.uniform4fv( this.locations.uniform.uColor, [1.0, 0.0, 0.0, 1.0]);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,  this.buffers.pBuffer);
        gl.vertexAttribPointer( this.locations.attribute.aPosition,
            this.buffers.pComponents,
                               gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER,  this.buffers.cBuffer);
        gl.vertexAttribPointer( this.locations.attribute.aColor,
            this.buffers.cComponents,
                               gl.FLOAT, false, 0, 0);

                               
        for( var i=0; i<shadeds_index; i+=3){ 
           


            gl.drawArrays( gl.TRIANGLES, i, 3 );


        }
    };
    
    this.name ="sphere";
    this.updateRota=function(r){
        console.log("s");
   
        mat4.rotateX(this.rotaM,this.rotaM,r[0]);
        mat4.rotateY(this.rotaM,this.rotaM,r[1]);
        mat4.rotateZ(this.rotaM,this.rotaM,r[2]);
      //  mat4.translate(this.rotaM,this.rotaM,this.position);
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
    this.updateTrans = function (t) {
        console.log(this.transM);
        console.log(t);
        var lt = mat4.create();
        mat4.translate(lt, lt, t);
      
        var help = mat4.create();
        var rotainv = mat4.create();
        mat4.invert(rotainv, this.rotaM);
        


        //   rechnungen
        mat4.multiply(help, this.rotaM, lt);       
        mat4.multiply(help, help, rotainv);
     
        
        mat4.multiply(this.transM, this.transM, help);
       


        console.log(this.transM);


        // mat4.multiply(this.transM,this.transM,help);



        console.log("habede");
        this.updateAll();
    };

    this.updateScale = function(s){
        mat4.scale(this.scaleM,this.scaleM,s);
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








function fillshadedSpoints(){
    var va = [0.0, 0.0, -1.0,1.0];
    var vb = [0.0, 0.942809, 0.333333,1.0];
    var vc = [-0.816497, -0.471405, 0.333333,1.0];
    var vd = [0.816497, -0.471405, 0.333333,1.0];
    

   
    stetrahedron(va, vb, vc, vd, shadednumTimesToSubdivide);
    for(var i = 0;i < 4096 ;i++) {
        shadeds_color.push(0.0);
        shadeds_color.push(1.0);

        shadeds_color.push(0.0);
        shadeds_color.push(1.0);
        
        
    }

}

function stetrahedron(a, b, c, d, n) {
    sdivideTriangle(a, b, c, n);
    sdivideTriangle(d, c, b, n);
    sdivideTriangle(a, d, b, n);
    sdivideTriangle(a, c, d, n);
    
}

function sdivideTriangle(a, b, c, count) {
    
    if (count > 0) {
        var ab = normalize(mix(a, b, 0.5), true);
        var ac = normalize(mix(a, c, 0.5), true);
        var bc = normalize(mix(b, c, 0.5), true);

        sdivideTriangle(a, ab, ac, count - 1);
        sdivideTriangle(ab, b, bc, count - 1);
        sdivideTriangle(bc, c, ac, count - 1);
        sdivideTriangle(ab, bc, ac, count - 1);
    }
    else {
        striangle(a, b, c);
    }
}

function striangle(a, b, c){
    shadedsphere_points.push(a);
    shadedsphere_points.push(b);
    shadedsphere_points.push(c);
    shadeds_index += 3;

    }


