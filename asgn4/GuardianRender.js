/*
Valentina Serrano
5-11-2025
1848892 
GuardianRender.js
*/

function guardianSummon() {
    var Sheep_white = [1, 1, 1, 1];
    var face_color = [1, .9, .65, 1.0];

    var body = new Cube();
    body.color = Sheep_white;
    body.matrix.translate(10.125, g_set_Location+0.2 +0.2, 7.15);
    body.matrix.translate(-0.5, -0.5, -0.5);
    body.matrix.scale(.7, .7, .7);
    body.drawCubeFast();

    var head = new Cube();
    head.color =[0.9, 0.9, 0.85, 1]
    head.matrix.translate(10, g_set_Location+0.2, 7);
    head.matrix.rotate(-head_animation, 1, 0, 0);
    head.matrix.scale(0.4, 0.4, 0.4);
    head.matrix.translate(-0.5, 0.65, -1.5);
    head.drawCubeFast();

    var face = new Cube();
    face.color = face_color;
    face.matrix.translate(10, g_set_Location+0.2, 7);
    face.matrix.rotate(-head_animation, 1, 0, 0);
    face.matrix.scale(0.4, 0.4, 0.03);
    face.matrix.translate(-0.5, 0.65, -21);
    face.drawCubeFast();

    var topFur = new Cube();
    topFur.color = Sheep_white;
    topFur.matrix.translate(10, g_set_Location+0.2, 7);
    topFur.matrix.rotate(-head_animation, 1, 0, 0);
    topFur.matrix.scale(0.4, 0.075, 0.04);
    topFur.matrix.translate(-0.5, 7.8, -16.5);
    topFur.drawCubeFast();

    var topLFur = new Cube();
    topLFur.color = Sheep_white;
    topLFur.matrix.translate(10, g_set_Location+0.2, 7);
    topLFur.matrix.rotate(-head_animation, 1, 0, 0);
    topLFur.matrix.scale(0.05, 0.071, 0.04);
    topLFur.matrix.translate(-4, 7.3, -16.5);
    topLFur.drawCubeFast();

    var bottomRFur = new Cube();
    bottomRFur.color = Sheep_white;
    bottomRFur.matrix.translate(10, g_set_Location+0.2, 7);
    bottomRFur.matrix.rotate(-head_animation, 1, 0, 0);
    bottomRFur.matrix.scale(0.05, 0.071, 0.04);
    bottomRFur.matrix.translate(3, 7.3, -16.5);
    bottomRFur.drawCubeFast();

    var eyeL = new Cube();
    eyeL.color = [1, 1, 1, 1];
    eyeL.matrix.translate(10, g_set_Location+0.2, 7);
    eyeL.matrix.rotate(-head_animation, 1, 0, 0);
    eyeL.matrix.scale(0.1, 0.061, 0.04);
    eyeL.matrix.translate(-1.5, 7, -16.2);
    eyeL.drawCubeFast();

    var eyeL_black = new Cube();
    eyeL_black.color = [0, 0, 0, 1];
    eyeL_black.matrix.translate(10, g_set_Location+0.2, 7);
    eyeL_black.matrix.rotate(-head_animation, 1, 0, 0);
    eyeL_black.matrix.scale(0.05, 0.061, 0.04);
    eyeL_black.matrix.translate(-3, 7, -16.5);
    eyeL_black.drawCubeFast();

    var eyeR = new Cube();
    eyeR.color = [1, 1, 1, 1];
    eyeR.matrix.translate(10, g_set_Location+0.2, 7);
    eyeR.matrix.rotate(-head_animation, 1, 0, 0);
    eyeR.matrix.scale(0.1, 0.061, 0.04);
    eyeR.matrix.translate(0.5, 7, -16.2);
    eyeR.drawCubeFast();

    var eyeR_black = new Cube();
    eyeR_black.color = [0, 0, 0, 1];
    eyeR_black.matrix.translate(10, g_set_Location+0.2, 7);
    eyeR_black.matrix.rotate(-head_animation, 1, 0, 0);
    eyeR_black.matrix.scale(0.05, 0.061, 0.04);
    eyeR_black.matrix.translate(2, 7, -16.5);
    eyeR_black.drawCubeFast();

    var mouth1 = new Cube();
    mouth1.color = [1, .8, 0.8, 1];
    mouth1.matrix.translate(10, g_set_Location+0.2, 7);
    mouth1.matrix.rotate(0, 1, 0, 0);
    mouth1.matrix.rotate(-head_animation, 1, 0, 0);
    mouth1.matrix.scale(0.1, 0.071, 0.04);
    mouth1.matrix.translate(-0.47, 4.2, -16.1);
    mouth1.drawCubeFast()

    var mouth2 = new Cube();
    mouth2.color = [0, 0, 0, 1];
    mouth2.matrix.translate(10, g_set_Location+0.2, 7);
    mouth2.matrix.rotate(0, 1, 0, 0);
    mouth2.matrix.rotate(-head_animation, 1, 0, 0);
    mouth2.matrix.scale(0.05, 0.07, 0.04);
    mouth2.matrix.translate(-0.47, 4.5, -16);
    mouth2.drawCubeFast()

    var lower_face = new Cube();
    lower_face.color = [1, 0.3, 0.2, 1];
    lower_face.matrix.translate(10, g_set_Location+0.2, 7);
    lower_face.matrix.rotate(-head_animation, 1, 0, 0);
    lower_face.matrix.scale(0.1, 0.1, 0.04);
    lower_face.matrix.translate(1, 2.6, -16.2);
    lower_face.drawCubeFast()

    var lower_face2 = new Cube();
    lower_face2.color = [1, 0.3, 0.2, 1];
    lower_face2.matrix.translate(10, g_set_Location+0.2, 7);
    lower_face2.matrix.rotate(-head_animation, 1, 0, 0);
    lower_face2.matrix.scale(0.1, 0.1, 0.04);
    lower_face2.matrix.translate(-2.1, 2.6, -16.2);
    lower_face2.drawCubeFast()

    var FrontLleg = new Cube();
    FrontLleg.color = Sheep_white;
    FrontLleg.matrix.translate(10,g_set_Location+0.2,7)
    FrontLleg.matrix.rotate(-g_Angle,1,0,0);
    var FrontLlegCoord = new Matrix4(FrontLleg.matrix);
    FrontLleg.matrix.scale(.15, -0.25, 0.15);
    FrontLleg.matrix.translate(-1.7, 1.2, -2);
    FrontLleg.drawCubeFast();

    var FrontRleg = new Cube();
    FrontRleg.matrix.translate(10,g_set_Location+0.2,7)
    FrontRleg.color = Sheep_white;
    FrontRleg.matrix.rotate(g_Angle,1,0,0);
    var FrontRlegCoord = new Matrix4(FrontRleg.matrix);
    FrontRleg.matrix.scale(.15, -0.25, 0.15);
    FrontRleg.matrix.translate(0.8, 1.2, -2);
    FrontRleg.drawCubeFast();

    var backLleg = new Cube();
    backLleg.color = Sheep_white;
    backLleg.matrix.translate(10,g_set_Location+0.2,7)
    backLleg.matrix.rotate(-g_Angle, 1, 0, 0);
    var backLlegCoord = new Matrix4(backLleg.matrix);
    backLleg.matrix.scale(.15, -0.25, 0.15);
    backLleg.matrix.translate(-1.7, 1.2, 1);
    backLleg.drawCubeFast();

    var backright = new Cube();
    backright.color = Sheep_white;
    backright.matrix.translate(10,g_set_Location+0.2,7)
    backright.matrix.rotate(g_Angle, 1, 0, 0);
    var backrightCoord = new Matrix4(backright.matrix);
    backright.matrix.scale(.15, -0.25, 0.15);
    backright.matrix.translate(.8, 1.2, 1);
    backright.drawCubeFast();

    var FrontLlegHoof = new Cube();
    FrontLlegHoof.color = face_color;
    FrontLlegHoof.matrix.translate(10,g_set_Location+0.2,7)
    FrontLlegHoof.matrix = frontleftlegCoord;
    FrontLlegHoof.matrix.rotate(-g_Angle2, 1, 0, 0);
    FrontLlegHoof.matrix.scale(0.1, 0.1, 0.1);
    FrontLlegHoof.matrix.translate(-2.25, -6.4,-2.6);
    FrontLlegHoof.drawCubeFast();

    var FrontRHoof = new Cube();
    FrontRHoof.color = face_color;
    FrontRHoof.matrix.translate(10,g_set_Location+0.2,7)
    FrontRHoof.matrix = FrontRlegCoord;
    FrontRHoof.matrix.rotate(g_Angle2, 1, 0, 0);
    FrontRHoof.matrix.scale(0.1, 0.1, 0.1);
    FrontRHoof.matrix.translate(1.5, -6.4, -2.6);
    FrontRHoof.drawCubeFast();

    var backLHoof = new Cube();
    backLHoof.color = face_color;
    backLHoof.matrix.translate(10,g_set_Location+0.2,7)
    backLHoof.matrix = backleftlegsCoord;
    backLHoof.matrix.rotate(-g_Angle2, 1, 0, 0);
    backLHoof.matrix.scale(0.1, 0.1, 0.1);
    backLHoof.matrix.translate(-2.25, -6.4, 1.6);
    backLHoof.drawCubeFast();

    var BackRHoof = new Cube();
    BackRHoof.color = face_color;
    BackRHoof.matrix.translate(10,g_set_Location+0.2,7)
    BackRHoof.matrix = backrightCoord;
    BackRHoof.matrix.rotate(g_Angle2, 1, 0, 0);
    BackRHoof.matrix.scale(0.1, 0.1, 0.1);
    BackRHoof.matrix.translate(1.5, -6.4, 1.76);
    BackRHoof.drawCubeFast();

    var tails = new Cube();
    tails.color = [0.85, 0.85, 0.85, 1]
    tails.matrix.translate(10,g_set_Location+0.2,7)
    tails.matrix.setTranslate(0, 0, 0);
    if(Shift_and_Click){
        tails.matrix.rotate(g_tails_animation, 1, 0, 0)
    }else{
        tails.matrix.rotate(g_tails_animation, 0, 1, 0)
    }
    var TailOneCoord = new Matrix4(tails.matrix);
    tails.matrix.scale(0.2, 0.2, 0.2)
    tails.matrix.translate(-0.5, 0.6, 1.1)
    tails.drawCubeFast();

    var second_tails = new Cube();
    second_tails.color = [0.85, 0.85, 0.85, 1]
    second_tails.matrix.translate(10,g_set_Location+0.2,7)
    second_tails.matrix = TailOneCoord;
    if(Shift_and_Click){
        second_tails.matrix.rotate(g_tails_animation, 1, 0, 0)
    }else{
        second_tails.matrix.rotate(g_tails_animation, 0, 1, 0)
    }
    var TailSecondCoord = new Matrix4(second_tails.matrix);
    second_tails.matrix.scale(0.15, 0.15, 0.15)
    second_tails.matrix.translate(-0.5, 1, 2.5)
    second_tails.drawCubeFast();

    var third_tails = new Four_pyramid();
    third_tails.color = [0.2, 0.2, 0.2, 1]
    third_tails.matrix = TailSecondCoord;
    if(Shift_and_Click){
        third_tails.matrix.rotate(g_tails_animation, 1, 0, 0)
    }else {
        third_tails.matrix.rotate(g_tails_animation, 0, 1, 0)
    }

    third_tails.matrix.scale(0.13, 0.13, 0.13)
    third_tails.matrix.translate(-0.5, 1.2, 4)
    third_tails.render();

}