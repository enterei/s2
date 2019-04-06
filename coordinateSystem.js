function CoordinateSystem(gl){
    this.permMat= mat4.create();

    

    
        CoordinateSystem.shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
        
        if (CoordinateSystem.shaderProgram === null) {
            throw new Error('Creating the shader program failed.');
        }
        CoordinateSystem.locations = {
            attribute: {
                aPosition: gl.getAttribLocation(CoordinateSystem.shaderProgram, "aPosition"),
                aColor: gl.getAttribLocation(CoordinateSystem.shaderProgram, "aColor"),
               
            },
            uniform: {
                uMMatrix: gl.getUniformLocation(CoordinateSystem.shaderProgram, "uMMatrix"),
                uCMatrix: gl.getUniformLocation(CoordinateSystem.shaderProgram,"camera"),
                uPMatrix: gl.getUniformLocation(CoordinateSystem.shaderProgram, "uPMatrix")
            }
        };
        gl.enableVertexAttribArray(CoordinateSystem.locations.attribute.aPosition);
        gl.enableVertexAttribArray(CoordinateSystem.locations.attribute.aColor);
        gl.enableVertexAttribArray(CoordinateSystem.locations.attribute.aNormal);
    

     
        // Create a buffer with the vertex positions
        // 3 coordinates per vertex, 3 vertices per triangle
        // 2 triangles make up the ground plane, 4 triangles make up the sides
        const pBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
        
       
       console.log(syspoints);
        
  
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(syspoints), gl.STATIC_DRAW);
        
        // Create a buffer with the vertex colors
        const cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(syscolors), gl.STATIC_DRAW);
        
       
        
        CoordinateSystem.buffers = {
            pBuffer: pBuffer,
            cBuffer: cBuffer,
          
            pComponents: 3, // number of components per vertex in pBuffer
            cComponents: 3, // number of components per color in cBuffer
            
        };
    

        this.camera = mat4.create();
        mat4.lookAt(this.camera,[0,0,10],[0,0,0],[0,1,0]);


    this.draw = function(gl, pMatrix,ctm) {
        

        gl.useProgram(CoordinateSystem.shaderProgram);
        gl.uniformMatrix4fv(CoordinateSystem.locations.uniform.uPMatrix, false, pMatrix);
        gl.uniformMatrix4fv(CoordinateSystem.locations.uniform.uMMatrix, false, ctm);
        gl.uniformMatrix4fv(CoordinateSystem.locations.uniform.uCMatrix,false,this.camera);     
        
        gl.uniform4fv(CoordinateSystem.locations.uniform.uColor, [1.0, 0.0, 0.0, 1.0]);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, CoordinateSystem.buffers.pBuffer);
        gl.vertexAttribPointer(CoordinateSystem.locations.attribute.aPosition,
                               CoordinateSystem.buffers.pComponents,
                               gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, CoordinateSystem.buffers.cBuffer);
        gl.vertexAttribPointer(CoordinateSystem.locations.attribute.aColor,
                               CoordinateSystem.buffers.cComponents,
                               gl.FLOAT, false, 0, 0);
     
       
        gl.drawArrays(gl.LINES, 0, 6);
    };
    
   


}

var syspoints =[0.0,0.0,0.0,
            1.0,0.0,0.0,
            0.0,0.0,0.0,
            0.0,1.0,0.0,
            0.0,0.0,0.0,
            0.0,0.0,1.0,];

var syscolors =[
1.0,0.0,0.0,
1.0,0.0,0.0,
0.0,1.0,0.0,
0.0,1.0,0.0,
0.0,0.0,1.0,
0.0,0.0,1.0,
];