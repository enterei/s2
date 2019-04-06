var shadedsphere_points= [];
var shadeds_color=[];
var shadedsphere_normals = [];
var shadeds_index =0;
var shadednumTimesToSubdivide = 3;



function ShadedSphere(gl,inittrans,vs,fs){
   
        console.log("jau vor dem laden");
      

        this.shaderProgram = initShaders(gl,vs, fs);
        
      
        console.log(vs);
        this.locations = {
            attribute: {
                aPosition: gl.getAttribLocation( this.shaderProgram, "aPosition"),
                aNormal: gl.getAttribLocation(this.shaderProgram,"aNormal"),
               
            },
            uniform: {
                uMMatrix: gl.getUniformLocation( this.shaderProgram, "uMMatrix"),
               
                uPMatrix: gl.getUniformLocation( this.shaderProgram, "uPMatrix"),
                matdiff: gl.getUniformLocation(this.shaderProgram,"diffColor"),
                matspec: gl.getUniformLocation(this.shaderProgram,"specColor"),
                matnormal: gl.getUniformLocation(this.shaderProgram,"normalMatrix"),
                matlightPos: gl.getUniformLocation(this.shaderProgram,"lightPos"),
                smode: gl.getUniformLocation(this.shaderProgram,"mode"),
                shine: gl.getUniformLocation(this.shaderProgram,"shin"), 
                uCMatrix: gl.getUniformLocation(this.shaderProgram,"camera"),
                uMLight: gl.getUniformLocation(this.shaderProgram,"lightModelMatrix"),




            }
        };
        gl.enableVertexAttribArray( this.locations.attribute.aPosition);
        gl.enableVertexAttribArray( this.locations.attribute.aNormal);
   

        if(shadedsphere_points.length==0){
            console.log("ein mal");
            fillshadedSpoints();}
        console.log(shadedsphere_points.length);
        console.log(shadeds_color.length);
        console.log(shadeds_index);
  

        // Create a buffer with the vertex positions
        // 3 coordinates per vertex, 3 vertices per triangle
        // 2 triangles make up the ground plane, 4 triangles make up the sides
        const pBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
         gl.bufferData(gl.ARRAY_BUFFER, flatten (shadedsphere_points), gl.STATIC_DRAW);
        
        // Create a buffer with the vertex colors
        const nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, flatten (shadedsphere_normals), gl.STATIC_DRAW);
        
       
        
        this.buffers = {
            pBuffer: pBuffer,
            nBuffer: nBuffer,


            pComponents: 4, // number of components per vertex in pBuffer
            nComponents: 4,
            
        };
        
    
    
    this.position = inittrans;
    this.transM = mat4.create();
    //this.oldpos=this.position;
    
    this.rotationY = 0.0;
    this.rotationX = 0.0;
    this.rotationZ = 0.0;
    this.rotaM = mat4.create();

    this.GlMatrix= mat4.create();
    this.gltrans = mat4.create();
    this.glrota= mat4.create();
  
    
    this.scaleY = 0.0;
    this.scaleX = 0.0;
    this.scaleZ = 0.0;
    this.scaleM=mat4.create();
    this.ctm = mat4.create();



    this.mMatrix = mat4.create();
    this.mMatrixTInv = mat3.create();
    this.camera = mat4.create();
    mat4.lookAt(this.camera,[0,0,10],[0,0,0],[0,1,0]);


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

    this.drawL=function(gl,pMatrix){
        normalM = mat4.create();
        mat4.transpose(normalM,this.ctm);
        mat4.invert(normalM,normalM);

     
        gl.useProgram( this.shaderProgram);
        gl.uniformMatrix4fv( this.locations.uniform.uPMatrix, false, pMatrix);
        gl.uniformMatrix4fv( this.locations.uniform.uMMatrix, false, this.ctm);
        gl.uniform4fv(this.locations.uniform.matdiff,new Float32Array(diffProduct));
        gl.uniform4fv(this.locations.uniform.matspec,new Float32Array(specProduct));
        gl.uniformMatrix4fv(this.locations.uniform.matnormal,false,flatten(normalM));
        gl.uniform4fv(this.locations.uniform.matlightPos,new Float32Array(light.lightpos));
        gl.uniform1f(this.locations.uniform.smode,mode);
        gl.uniform1f(this.locations.uniform.shine,shin);
        gl.uniformMatrix4fv(this.locations.uniform.uCMatrix,false,this.camera);
     
        gl.uniformMatrix4fv(this.locations.uniform.uMLight,false,light.GlMatrix);

     //   gl.uniform4fv( this.locations.uniform.uColor, [1.0, 0.0, 0.0, 1.0]);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,  this.buffers.pBuffer);
        gl.vertexAttribPointer( this.locations.attribute.aPosition,
            this.buffers.pComponents,
                               gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER,  this.buffers.nBuffer);
        gl.vertexAttribPointer( this.locations.attribute.aNormal,
            this.buffers.nComponents,
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
        
        mat4.rotateX(this.glrota,this.glrota,r[0]);
        mat4.rotateY(this.glrota,this.glrota,r[1]);
        mat4.rotateZ(this.glrota,this.glrota,r[2]);
        this.updateGlAll();
       
        

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
    this.updateGlTrans = function(t){
        mat4.translate(this.gltrans,this.gltrans,t);        
        this.updateGlAll();
    };

    this.updateAll= function(){
        mat4.identity(this.mMatrix);
        


        mat4.multiply(this.mMatrix,this.mMatrix,this.transM);
      
        mat4.multiply(this.mMatrix,this.mMatrix,this.rotaM);
        mat4.multiply(this.mMatrix,this.mMatrix,this.scaleM);
     //  mat4.multiply(this.mMatrix,this.transM,this.rotaM);
     
        this.updateAllALL();
    }
    this.updateGlAll= function(){
        mat4.identity(this.GlMatrix);
        
    
    
        mat4.multiply(this.GlMatrix,this.GlMatrix,this.gltrans);
      
        mat4.multiply(this.GlMatrix,this.GlMatrix,this.glrota);
        this.updateAllALL();
      
    
    }
    this.updateAllALL = function(){
        mat4.identity(this.ctm);
        mat4.multiply(this.ctm,this.GlMatrix,this.mMatrix);
    
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
  //      var ab = normalize(mix(a, b, 0.5), true);
   //     var ac = normalize(mix(a, c, 0.5), true);
    //    var bc = normalize(mix(b, c, 0.5), true);  
        var ab = normalo(gaa(a, b));
        var ac = normalo(gaa(a, c));
          var bc = normalo(gaa(b, c));

    //    var ab = vec4.create();vec4.normalize(ab,mix(a, b, 0.5), true);
      //  var ac = vec4.create();vec4.normalize(ac,mix(a, c, 0.5), true);
       // var bc = vec4.create();vec4.normalize(bc,mix(b, c, 0.5), true);
        console.log(ab);

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

    shadedsphere_normals.push(a[0],a[1], a[2], 0.0);
     shadedsphere_normals.push(b[0],b[1], b[2], 0.0);
     shadedsphere_normals .push(c[0],c[1], c[2], 0.0);


    }
function normalo(u){
    var last = u.pop();
    var len =  Math.sqrt( u[0]*u[0]+u[1]*u[1]+u[2]*u[2] );
    console.log(len);
    for ( var i = 0; i < u.length; ++i ) {
        u[i] /= len;
    }
    u.push( last );
    return u;
}
function gaa(a,b){
    var ret = [];
    for ( var i = 0; i < a.length; ++i ) {
        ret.push( 0.5 * a[i] + 0.5 * b[i] );
    }
    return ret;

}


function flatten( v )
{
    if ( v.matrix === true ) {
        v = transpose( v );
    }

    var n = v.length;
    var elemsAreArrays = false;

    if ( Array.isArray(v[0]) ) {
        elemsAreArrays = true;
        n *= v[0].length;
    }

    var floats = new Float32Array( n );

    if ( elemsAreArrays ) {
        var idx = 0;
        for ( var i = 0; i < v.length; ++i ) {
            for ( var j = 0; j < v[i].length; ++j ) {
                floats[idx++] = v[i][j];
            }
        }
    }
    else {
        for ( var i = 0; i < v.length; ++i ) {
            floats[i] = v[i];
        }
    }

    return floats;
}