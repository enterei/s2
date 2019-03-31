function main() {
    init();
}
/*var lightPosition = vec4(1.0, 1.0, 1.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 0.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4(1.0, 0.8, 0.0, 1.0);
var materialShininess = 100.0;*/

var trans = [0, 0, 0];
var cubes = [];
var fragments1 = [];
var fragments2 = [];
var selected = 10;
var xxxx = true;
var mode = 0.0;
var lightran = mat4.create();
var lightrot= mat4.create();
var shin = 100.0;


var materialDiffuse = [1.0, 0.8, 0.0,1.0];
var materialSpecular = [1.0, 0.8, 0.0,1.0];
var lightPosition = [0.0, 10.0, -0.0, 1.0 ];
var light = new light();


var diffProduct=vec4.create();
var specProduct=vec4.create();

//rotation
var rotas = [0, 0, 0];
// scaling
var scale = [1, 1, 1];
//var cubes = [];

function init() {


    const canvas = document.getElementById("glCanvas");
    const gl = canvas.getContext("webgl");
    gl.viewport(0, 0, canvas.clientWidth, canvas.clientHeight);
    gl.clearColor(1.0, 0.9, 0.9, 1.0);
    gl.enable(gl.DEPTH_TEST);


    let pMatrix = mat4.create();
    let perspectiveMatrix = mat4.create();
    const asp = canvas.clientWidth / canvas.clientHeight;
    const bottom = -1;
    const zNear = - 0.001;
    const zFar = 100;
    mat4.ortho(pMatrix, -asp, asp, bottom, -bottom, zNear, zFar);
    perspectiveMatrix = mat4.perspective(perspectiveMatrix, 45, canvas.width / canvas.height, 0.01, 30);
    console.log(perspectiveMatrix);




    // reason for calling "gauraud vertex/fragment" shader is that i iniatially wanted to make 2 diffrent shaders and initiallize every sphere twice but then i used the mode variable
    var s1_fragment1 = new ShadedSphere(gl, [-0.1, 0.0, -10.5],"gauraud-vertex-shader","gauraud-fragment-shader");  


    var s2_fragment1 = new ShadedSphere(gl, [-0.6, 0.3, -5.0],"gauraud-vertex-shader","gauraud-fragment-shader");  


    var s3_fragment1 = new ShadedSphere(gl, [0.1, -0.3, -6.5],"gauraud-vertex-shader","gauraud-fragment-shader");  
    

    var s4_fragment1 = new ShadedSphere(gl, [0.6, 0.7, -6.5],"gauraud-vertex-shader","gauraud-fragment-shader");  

   
    


    var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
    var lightSpecular = [1.0, 1.0, 1.0, 1.0];





     cubes.push(s1_fragment1);
     cubes.push(s2_fragment1);
     
   console.log(lightDiffuse);

   vec4.multiply(diffProduct,lightDiffuse,materialDiffuse);
   vec4.create();vec4.multiply(specProduct,lightSpecular,materialSpecular);
    console.log(diffProduct);
    
   
    //    cubes.push(l1);
   
   // cubes.push(s1_fragment1);
    for (var i = 0; i < cubes.length; i++)cubes[i].updateTrans(cubes[i].position); // for alls cubes todo
    for (var i = 0; i < cubes.length; i++)cubes[i].updateScale([0.5,0.5,0.5]); // for alls cubes todo
    for (var i = 0; i < fragments1.length; i++)fragments1[i].updateTrans(fragments1[i].position); // for alls cubes todo
    for (var i = 0; i < fragments2.length; i++)fragments2[i].updateTrans(fragments2[i].position); // for alls cubes todo


    var coord = new CoordinateSystem(gl);
    // } catch (E) {
    //   alert(E+"dsfnkjsfdlksfd");
    //  return;
    //   }

    var then = 0;
    function render(now) {
       
        now *= 0.001;
        const delta = now - then;
        then = now;

       

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      


          
        for (var i = 0; i < cubes.length; i++)cubes[i].drawL(gl, perspectiveMatrix, cubes[i].mMatrix);

       




        if (selected != 10) {
            
            if (cubes[selected].name == "sphere") {
                var x = cubes[selected].transM;
                var y = cubes[selected].rotaM;

                mat4.multiply(coord.permMat, x, y);
                mat4.scale(coord.permMat, coord.permMat, [2.0, 2.0, 2.0]);
                coord.draw(gl, perspectiveMatrix, coord.permMat);
                


            }

            else { //coord.draw(gl, perspectiveMatrix, cubes[selected].mMatrix);
                coord.draw(gl, perspectiveMatrix, cubes[selected].mMatrix); 
                
            }


        }

        //  cubes[selected].draw(gl, perspectiveMatrix);


        //cubes[selected].draw(gl, pMatrix);
        //    coord.draw(gl, pMatrix, cubes[selected].mMatrix);

        if (xxxx) requestAnimationFrame(render);
    }

    // Start rendering
      requestAnimationFrame(render);

}



window.onkeydown = function (event) {

    var key = String.fromCharCode(event.keyCode);
    switch (key) {
        case '0': selected = 10;

            break;

        case '1':
            selected = 0;
        
                        break;
        case '2':
            selected = 1;
            break;
        case '3':

            selected = 2;
            break;
        case '4':
            selected = 3;
            break;
        case '5':
            selected = 4;
            break;
        case '6':
            selected = 5;
            break;
        case '7':
            selected = 6;
            break;
        case '8':
            selected = 7;
            break;
        case '9':
            selected = 8;
            break;





    }
    var key = event.keyCode;
    switch (key) {


        case 37:
            trans[0] = -0.01;
           // cubes[selected].updateTrans(trans);
            update_trans(trans);

            break;

        case 39:
            trans[0] = 0.01;
          // cubes[selected].updateTrans(trans);
          update_trans(trans);
            break;

        case 38:
            trans[1] = 0.01;
           // cubes[selected].updateTrans(trans);
           update_trans(trans);
            break;
        case 40:
            trans[1] = -0.01;
        // cubes[selected].updateTrans(trans);
        update_trans(trans);
            break;
        case 190:
            trans[2] = 0.01;
            // cubes[selected].updateTrans(trans);
            update_trans(trans);
            break;


        case 188: trans[2] = -0.01;
         // cubes[selected].updateTrans(trans);
         update_trans(trans);
            break;

//rotation

        case 83:
            rotas[0] = -0.1;
           // cubes[selected].updateRota(rotas);
           update_rota();


            break;

        case 87: rotas[0] = 0.1;
            // cubes[selected].updateRota(rotas);
           update_rota();
            break;
        case 81: rotas[1] = 0.1;
            // cubes[selected].updateRota(rotas);
           update_rota();
            break;
        case 69: rotas[1] = -0.1;
            // cubes[selected].updateRota(rotas);
           update_rota();
            break;
        case 65: rotas[2] = 0.1;
            // cubes[selected].updateRota(rotas);
           update_rota();

            break;
        case 68: rotas[2] = -0.1;
            // cubes[selected].updateRota(rotas);
           update_rota();
            break;
        case 88:
            scale[0] = 0.9;
            update_scale();
            break;
        case 86:
            scale[0] = 1.1;
            update_scale();
            break;
        case 89:
            scale[1] = 0.9;
            update_scale();
            break;
        case 66:
            scale[1] = 1.1;
            update_scale();
            break;
        case 90:
            scale[2] = 0.9;
            update_scale();
            break;
        case 78:
            scale[2] = 1.1;
            update_scale();
            break;
        //trst
      
        case 85:
            mode = 0.0;
            break;
        case 73:
            mode = 1.0;
            break;
        case 79:
            mode = 2.0;
            break;
        case 80:
            mode = 3.0;
            break;
            


    }


}


window.onkeyup = function (event) {

    rotas[0] = 0.0;
    rotas[1] = 0.0;
    rotas[2] = 0.0;
    trans[0] = 0.0;
    trans[1] = 0.0;
    trans[2] = 0.0;
    scale[0] = 1.0;
    scale[1] = 1.0;
    scale[2] = 1.0;
}

function setfalse() {
    xxxx = false;
}


function update_trans(){
    if(selected == 10){
      
        for(i = 0;i<cubes.length;i++){
            cubes[i].updateGlTrans(trans);
        }

    }
    else cubes[selected].updateTrans(trans);

}
function update_rota(){
    if(selected == 10){
      
        for(i = 0;i<cubes.length;i++){
            cubes[i].updateGlRota(rotas);
        }

    }
    else cubes[selected].updateRota(rotas);

}

function update_scale(){
    if(selected == 10){
      
        for(i = 0;i<cubes.length;i++){
            cubes[i].updateScale(scale);
        }

    }
    else cubes[selected].updateScale(scale);

}