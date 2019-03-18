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


var materialDiffuse = [1.0, 0.8, 0.0,1.0];
var materialSpecular = [1.0, 0.8, 0.0,1.0];
var lightPosition = [0.0, 0.5, -0.5, 1.0 ];
var shin = 100.0;


var lightDiffuse = [1.0, 1.0, 1.0, 1.0];
var lightSpecular = [1.0, 1.0, 1.0, 1.0];

var diffProduct;
var specProduct;

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
    var s1_fragment1 = new ShadedSphere(gl, [-0.1, 0.0, -5.5],"gauraud-vertex-shader","gauraud-fragment-shader");  


    var s2_fragment1 = new ShadedSphere(gl, [-0.6, 0.3, -5.0],"gauraud-vertex-shader","gauraud-fragment-shader");  


    var s3_fragment1 = new ShadedSphere(gl, [0.1, -0.3, -6.5],"gauraud-vertex-shader","gauraud-fragment-shader");  
    

    var s4_fragment1 = new ShadedSphere(gl, [0.6, 0.7, -6.5],"gauraud-vertex-shader","gauraud-fragment-shader");  

   
    






     cubes.push(s1_fragment1);
    // cubes.push(s1_fragment2);   
    fragments1.push(s1_fragment1);
    //fragments2.push(s1_fragment2);
 //   fragments1.push(s2_fragment1);
    //fragments2.push(s2_fragment2);
    //fragments1.push(s3_fragment1);
    //fragments2.push(s3_fragment2);
  //  fragments1.push(s4_fragment1);
    //fragments2.push(s4_fragment2);

    diffProduct=mult(lightDiffuse,materialDiffuse);
    specProduct=mult(lightSpecular,materialSpecular);
    console.log(diffProduct);
    
   
    //    cubes.push(l1);
   
   // cubes.push(s1_fragment1);
    for (var i = 0; i < cubes.length; i++)cubes[i].updateTrans(cubes[i].position); // for alls cubes todo
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

      


          
        for (var i = 0; i < fragments1.length; i++)fragments1[i].drawL(gl, perspectiveMatrix, fragments1[i].mMatrix);

       




        if (selected != 10) {
            
            if (fragments1[selected].name == "sphere") {
                var x = fragments1[selected].transM;
                var y = fragments1[selected].rotaM;

                mat4.multiply(coord.permMat, x, y);
                mat4.scale(coord.permMat, coord.permMat, [2.0, 2.0, 2.0]);
                coord.draw(gl, perspectiveMatrix, coord.permMat);
                


            }

            else { //coord.draw(gl, perspectiveMatrix, cubes[selected].mMatrix);
                coord.draw(gl, perspectiveMatrix, fragments1[selected].mMatrix); 
                
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
            trans[0] = -0.2;
            cubes[selected].updateTrans(trans);
            fragments1[selected].updateTrans(trans);
            fragments2[selected].updateTrans(trans);



            break;

        case 39:
            trans[0] = 0.2;
            cubes[selected].updateTrans(trans);
            fragments1[selected].updateTrans(trans);
            fragments2[selected].updateTrans(trans);
            break;

        case 38:
            trans[1] = 0.2;
            cubes[selected].updateTrans(trans);
            fragments1[selected].updateTrans(trans);
            fragments2[selected].updateTrans(trans);
            break;
        case 40:
            trans[1] = -0.2;
            cubes[selected].updateTrans(trans);
            fragments1[selected].updateTrans(trans);
            fragments2[selected].updateTrans(trans);
            break;
        case 190:
            trans[2] = 0.2;
            cubes[selected].updateTrans(trans);
            fragments1[selected].updateTrans(trans);
            fragments2[selected].updateTrans(trans);
            break;


        case 188: trans[2] = -0.2;
            cubes[selected].updateTrans(trans);
            fragments1[selected].updateTrans(trans);
            fragments2[selected].updateTrans(trans);
            break;



        case 83:
            rotas[0] = -0.1;
            cubes[selected].updateRota(rotas);
            fragments1[selected].updateRota(rotas);
            fragments2[selected].updateRota(rotas);


            break;

        case 87: rotas[0] = 0.1;
            cubes[selected].updateRota(rotas);
            fragments1[selected].updateRota(rotas);
            fragments2[selected].updateRota(rotas);
            break;
        case 81: rotas[1] = 0.1;
            cubes[selected].updateRota(rotas);
            fragments1[selected].updateRota(rotas);
            fragments2[selected].updateRota(rotas);
            break;
        case 69: rotas[1] = -0.1;
            cubes[selected].updateRota(rotas);
            fragments1[selected].updateRota(rotas);
            fragments2[selected].updateRota(rotas);
            break;
        case 65: rotas[2] = 0.1;
            cubes[selected].updateRota(rotas);
            fragments1[selected].updateRota(rotas);
            fragments2[selected].updateRota(rotas);

            break;
        case 68: rotas[2] = -0.1;
            cubes[selected].updateRota(rotas);
            fragments1[selected].updateRota(rotas);
            fragments2[selected].updateRota(rotas);
            break;
        case 88:
            scale[0] = 0.9;
            cubes[selected].updateScale(scale);
            fragments1[selected].updateScale(scale);
            fragments2[selected].updateScale(scale);
            break;
        case 86:
            scale[0] = 1.1;
            cubes[selected].updateScale(scale);
            fragments1[selected].updateScale(scale);
            fragments2[selected].updateScale(scale);
            break;
        case 89:
            scale[1] = 0.9;
            cubes[selected].updateScale(scale);
            fragments1[selected].updateScale(scale);
            fragments2[selected].updateScale(scale);
            break;
        case 66:
            scale[1] = 1.1;
            cubes[selected].updateScale(scale);
            fragments1[selected].updateScale(scale);
            fragments2[selected].updateScale(scale);
            break;
        case 90:
            scale[2] = 0.9;
            cubes[selected].updateScale(scale);
            fragments1[selected].updateScale(scale);
            fragments2[selected].updateScale(scale);
            break;
        case 78:
            scale[2] = 1.1;
            cubes[selected].updateScale(scale);
            fragments1[selected].updateScale(scale);
            fragments2[selected].updateScale(scale);
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


