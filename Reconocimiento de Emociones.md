# Actividad: Reconocimiento de rostro.

![Imagen](Emociones.jpg)

En el reconocimiento de rostro se deben de tomar varias fotos de una misma persona completamente enfocada en el rostro no puede aparecer otra cosa, se puede hacer de varias personas, pero en carpetas diferentes y ya una vez que ejecutas el programa si tomas muchas fotos tienes más probabilidades de que te reconozca casi perfectamente.

# Actividad: Reconocimiento de emociones.
Es parecido al reconocimiento facial, pero con la diferencia de que cada emoción debe guardarse en una sola carpeta, es decir, debe de haber una carpeta para caras felices, otra para caras tristes y otra para caras sorprendidas, puede ser de cualquier persona siempre y cuando tengan la misma emoción, al ejecutar el programa si el usuario sonríe detectará que está feliz, si el usuario abre más la boca y los ojos detectará que está sorprendido, y si el usuario no sonríe detectará que está triste.

## Explicación del código para generar varias fotografías de un rostro

Primero hacemos las importaciones de las librerías de OpenCV que serían numpy y cv2, luego utilizamos el método “CascadeClassifier” cargarnos el archivo “haarcascade_frontalface_alt.xml” que se puede descargar en el siguiente enlace:

[Enlace a haarcascade](https://github.com/opencv/opencv/tree/master/data/haarcascades)
~~~
import numpy as np 
import cv2 as cv

rostro = cv.CascadeClassifier('haarcascade_frontalface_alt.xml')
~~~

Luego ya utilizamos la función “VideoCapture” para que haga uso de la cámara de la computadora y con la variable "i" será para contar las fotos que se van a tomar, se inicia un ciclo hilo donde se van a estar guardando las fotos en la ruta especificada y se redimensionaran a 100x100 para que funcione el reconocimiento facial, el hilo y el programa se detendrá hasta que se apriete la tecla ESC que en código ASCII corresponde al número 27:

~~~
cap = cv.VideoCapture(0)
i = 0 
while True:
    ret, frame = cap.read()
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    rostros = rostro.detectMultiScale(gray, 1.3, 5)
    for(x, y, w, h) in rostros:
        #frame = cv.rectangle(frame, (x,y), (x+w, y+h), (0, 255, 0), 2)
        frame2 = frame[y:y+h, x:x+w]
        #cv.imshow('rostros2', frame2)
        frame2 = cv.resize(frame2, (100,100), interpolation = cv.INTER_AREA)
        cv.imwrite('C:\\Users\\Martin\\Caras\\martin'+str(i)+'.png', frame2)
        
    cv.imshow('rostros', frame)
    i=i+1
    k = cv.waitKey(1)
    if k == 27:
        break
cap.release()
cv.destroyAllWindows()
~~~
En el siguiente código usamos el algoritmo de Eigenface para entrenar a la inteligencia artificial para que pueda etiquetar las fotos con el nombre de la carpeta donde están contenidas las fotos, lo hace con cada una de las carpetas que encuentra ya una vez que termina de etiquetar genera el archivo XML para entrenar a la inteligencia artificial para que pueda reconocer rostros.

~~~
import cv2 as cv 
import numpy as np 
import os

dataSet = 'C:\\Users\\Martin\\Caras'
faces  = os.listdir(dataSet)
print(faces)

labels = []
facesData = []
label = 0 
for face in faces:
    facePath = dataSet+'\\'+face
    for faceName in os.listdir(facePath):
        labels.append(label)
        facesData.append(cv.imread(facePath+'/'+faceName,0))
    label = label + 1
print(np.count_nonzero(np.array(labels)==0)) 

faceRecognizer = cv.face.EigenFaceRecognizer_create()
faceRecognizer.train(facesData, np.array(labels))
faceRecognizer.write('martinEigenface.xml')
~~~

El siguiente código es un programa que con el archivo XML que se generó con el código anterior, enciende la cámara para ver que personas y emociones puede reconocer, al reconocer algo lo encerrara en un rectángulo verde y le pondrá la etiqueta de lo que corresponde ese objeto, mostrando que si lo reconoce en caso contrario dirá que es desconocido y el rectángulo será rojo, que en algunos casos por falta de fotos y demás rostros llega a confundir a otras personas poniéndoles la etiqueta que no les corresponde.

Pero en el caso de las emociones solo reconocerá las expresiones que hará la persona que está enfrente de la cámara, no de quién se trata.
~~~
import cv2 as cv
import os 

faceRecognizer = cv.face.EigenFaceRecognizer_create()
faceRecognizer.read('martinEigenface.xml')

cap = cv.VideoCapture(0)
rostro = cv.CascadeClassifier('haarcascade_frontalface_alt.xml')
while True:
    ret, frame = cap.read()
    if ret == False: break
    gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
    cpGray = gray.copy()
    rostros = rostro.detectMultiScale(gray, 1.3, 3)
    for(x, y, w, h) in rostros:
        frame2 = cpGray[y:y+h, x:x+w]
        frame2 = cv.resize(frame2,  (100,100), interpolation=cv.INTER_CUBIC)
        result = faceRecognizer.predict(frame2)
        #cv.putText(frame, '{}'.format(result), (x,y-20), 1,3.3, (255,255,0), 1, cv.LINE_AA)
        if result[1] > 2800:
            cv.putText(frame,'{}'.format(faces[result[0]]),(x,y-25),2,1.1,(0,255,0),1,cv.LINE_AA)
            cv.rectangle(frame, (x,y),(x+w,y+h),(0,255,0),2)
        else:
            cv.putText(frame,'Desconocido',(x,y-20),2,0.8,(0,0,255),1,cv.LINE_AA)
            cv.rectangle(frame, (x,y),(x+w,y+h),(0,0,255),2)
    cv.imshow('frame', frame)
    k = cv.waitKey(1)
    if k == 27:
        break
cap.release()
cv.destroyAllWindows()
~~~