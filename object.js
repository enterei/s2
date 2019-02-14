function Object(gl) {
    Object.verticesl;
    if (Object.shaderProgram === undefined) {
        console.log("jau vor dem laden");
        Object.shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
        
        if (Object.shaderProgram === null) {
            throw new Error('Creating the shader program failed.');
        }
        Object.locations = {
            attribute: {
                aPosition: gl.getAttribLocation(Object.shaderProgram, "aPosition"),
                aColor: gl.getAttribLocation(Object.shaderProgram, "aColor"),
                aNormal: gl.getAttribLocation(Object.shaderProgram, "aNormal")
            },
            uniform: {
                uMMatrix: gl.getUniformLocation(Object.shaderProgram, "uMMatrix"),
                uMMatrixTInv: gl.getUniformLocation(Object.shaderProgram, "uMMatrixTInv"),
                uPMatrix: gl.getUniformLocation(Object.shaderProgram, "uPMatrix")
            }
        };
        gl.enableVertexAttribArray(Object.locations.attribute.aPosition);
        gl.enableVertexAttribArray(Object.locations.attribute.aColor);
    }

    if (Object.buffers === undefined) {
        // Create a buffer with the vertex positions
        // 3 coordinates per vertex, 3 vertices per triangle
        // 2 triangles make up the ground plane, 4 triangles make up the sides
        const pBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
        var vertices = [-0.5, 0.0, -0.5,    // ground plane
                         0.5, 0.0, -0.5,
                         0.5, 0.0,  0.5,
                        
                        -0.5, 0.0, -0.5,
                         0.5, 0.0,  0.5,
                        -0.5, 0.0,  0.5,
                        
                        -0.5, 0.0, -0.5,    // sides
                         0.5, 0.0, -0.5,
                         0.0, 1.0,  0.0,
                        
                         0.5, 0.0, -0.5,
                         0.5, 0.0,  0.5,
                         0.0, 1.0,  0.0,
                        
                         0.5, 0.0,  0.5,
                        -0.5, 0.0,  0.5,
                         0.0, 1.0,  0.0,
                        
                        -0.5, 0.0,  0.5,
                        -0.5, 0.0, -0.5,
                         0.0, 1.0,  0.0];
       
       
        console.log(vertices);
        Object.verticesl=vertices.length;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        // Create a buffer with the vertex colors
        const cBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        let colors = [1, 0, 0,      // ground plane
                      1, 0, 0,
                      1, 0, 0,
                      
                      1, 0, 0,
                      1, 0, 0,
                      1, 0, 0,
                      
                      0, 1, 0,      // sides
                      0, 1, 0,
                      0, 1, 0,
                      
                      0, 0, 1,
                      0, 0, 1,
                      0, 0, 1,
                      
                      1, 1, 0,
                      1, 1, 0,
                      1, 1, 0,
                      
                      0, 1, 1,
                      0, 1, 1,
                      0, 1, 1];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        
        //Create a buffer with the normals
        const nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        const norm = Math.sqrt(5)/2;    // normalization factor
        let normals = [0, -1, 0,    // ground plane
                       0, -1, 0,
                       0, -1, 0,
                   
                       0, -1, 0,
                       0, -1, 0,
                       0, -1, 0,
                       
                       0, 0.5/norm, -1/norm,
                       0, 0.5/norm, -1/norm,
                       0, 0.5/norm, -1/norm,
                   
                       1/norm, 0.5/norm, 0,
                       1/norm, 0.5/norm, 0,
                       1/norm, 0.5/norm, 0,
                   
                       0, 0.5/norm, 1/norm,
                       0, 0.5/norm, 1/norm,
                       0, 0.5/norm, 1/norm,
                   
                       -1/norm, 0.5/norm, 0,
                       -1/norm, 0.5/norm, 0,
                       -1/norm, 0.5/norm, 0];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        
        Object.buffers = {
            pBuffer: pBuffer,
            cBuffer: cBuffer,
            nBuffer: nBuffer,
            pComponents: 3, // number of components per vertex in pBuffer
            cComponents: 3, // number of components per color in cBuffer
            nComponents: 3 // number of components per normal in nBuffer
        };
    }
    this.position = [-0.0, -0.0, -50];
    this.rotationY = 0;
    this.rotationX = 0.5;
    this.mMatrix = mat4.create();
    this.mMatrixTInv = mat3.create();
    
    this.draw = function(gl, pMatrix) {
        gl.useProgram(Object.shaderProgram);
        gl.uniformMatrix4fv(Object.locations.uniform.uPMatrix, false, pMatrix);
        gl.uniformMatrix4fv(Object.locations.uniform.uMMatrix, false, this.mMatrix);
        gl.uniformMatrix3fv(Object.locations.uniform.uMMatrixTInv, false, this.mMatrixTInv);
        gl.uniform4fv(Object.locations.uniform.uColor, [1.0, 0.0, 0.0, 1.0]);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, Object.buffers.pBuffer);
        gl.vertexAttribPointer(Object.locations.attribute.aPosition,
                               Object.buffers.pComponents,
                               gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, Object.buffers.cBuffer);
        gl.vertexAttribPointer(Object.locations.attribute.aColor,
                               Object.buffers.cComponents,
                               gl.FLOAT, false, 0, 0);
      
       
        gl.drawArrays(gl.TRIANGLES, 0, Object.verticesl/3);
    };
    
    this.update = function(delta) {
        this.rotationY += 0.5*delta;
       // this.rotationX += 0.1*delta;
        
        // set the current model matrix
        mat4.identity(this.mMatrix);
        mat4.translate(this.mMatrix, this.mMatrix, this.position);
        mat4.rotateY(this.mMatrix, this.mMatrix, this.rotationY);
        mat4.rotateX(this.mMatrix, this.mMatrix, this.rotationX);
        
        
        // compute the inverse transpose of the 3x3 submatrix of the model matrix
        mat3.normalFromMat4(this.mMatrixTInv, this.mMatrix);
    };





}